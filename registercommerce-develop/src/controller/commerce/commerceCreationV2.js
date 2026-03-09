const config = require('config');
const { v4: uuidv4 } = require('uuid');
const response = require('../../utils/response');
const commerceRepository = require('../../repository/commerce');
const financialInformationRepository = require('../../repository/financialInformation');
const generalInfoRepository = require('../../repository/generalInfo');
const legalRepresentativeRepository = require('../../repository/legalRepresentative');
const executiveRepository = require('../../repository/executive');
const commerceDocumentV2 = require('../../repository/v2/commerceDocument');
const organizationRepository = require('../../repository/organization');
const { uploadCommerceDocumentsSublaiPF, uploadCommerceDocumentsSublaiPM } = require('../../utils/uploadDocuments');
const sendRequest = require('../../utils/rest/request');
const determineAccountType = require('../../utils/determineAccountType');
const moveFile = require('../../utils/gcs/moveFile');
const Logger = require('../../utils/logger/GLogger');

const bucketNameSublai = config.get('bucketSublai.name');
const bucketFolderSublai = config.get('bucketSublai.commerceDocuments');
const bucketUrlSublai = config.get('bucketSublai.url');

const sublaiApiUrl = config.get('sublai.url');
const sublaiApikey = config.get('sublai.apikey');
const ENDPOINT = 'documents/bulk-process';

const Glogger = new Logger('commerce-controller');

async function commerceCreationV2(req, res, next) {
  const {
    id,
    emailSession,
    idSession
  } = res.locals.user || { id: null, emailSession: null, idSession: null };
  const { commerceType } = req.query;
  const { user } = req.query;
  const {
    email,
    idUser,
    actaFileName,
    commerceName,
    socialReason,
    distributorId
  } = req.fields;
  if (!commerceType) {
    return res
      .status(400)
      .json(response.errorMessage(400, 'Commerce type value undefined'));
  }
  const { files } = req;
  const { fields } = req;

  const documentos = [];
  const indices = new Set();

  Object.keys(fields).forEach((key) => {
    const match = key.match(/^documents\[(\d+)]\[key]$/);
    if (match) indices.add(match[1]);
  });

  Object.keys(files).forEach((key) => {
    const match = key.match(/^documents\[(\d+)]\[file]$/);
    if (match) indices.add(match[1]);
  });

  indices.forEach((index) => {
    const file = files[`documents[${index}][file]`] || null;
    const type = fields[`documents[${index}][type]`] || null;
    const sublaiType = fields[`documents[${index}][sublaiType]`] || null;
    const logicalKey = fields[`documents[${index}][key]`] || null;
    const shareholderIndex = fields[`documents[${index}][shareholderIndex]`] || null;

    documentos.push({
      file,
      type,
      sublaiType,
      logicalKey,
      shareholderIndex
    });
  });

  const commerceTypeString = Number(commerceType) === 1 ? 'personaFisica' : 'personaMoral';
  const accountTypeResult = determineAccountType(commerceTypeString, documentos);

  const createFinancialInfo = async (commerceId) => {
    const financialData = {
      idCommerce: commerceId,
      month1: null,
      month2: null,
      month3: null,
      totalCash: null,
      totalPos: null,
      totalEcommerce: null,
      averagePerMonth: null,
      averagePerTransaction: null,
    };
    return financialInformationRepository.save(financialData);
  };

  try {
    let distributorData = {};
    const parsedDistributorId = Number(distributorId);
    if (distributorId && Number.isFinite(parsedDistributorId)) {
      distributorData = await executiveRepository.findOne({
        where: { id: parsedDistributorId }
      });
      if (!distributorData) {
        return res.status(400).json(response.errorMessage(400, 'Distributor not found'));
      }
    }

    const newCommerce = await commerceRepository.save({
      idCommerceType: commerceType,
      idLineBusiness: null,
      idCommerceStatus: 7,
      idDistributor: distributorData ? distributorData.idPartner : null,
      idSubDistributor: distributorData ? distributorData.id : null,
      stepAt: new Date().toISOString(),
      origen: user ? 'Mesa de control' : 'Usuario'
    });
    await organizationRepository.save({
      idCommerce: newCommerce.id,
      idUser,
      idRoleMpos: 1,
      idRoleEcommerce: 1,
      idRoleTransfer: 1,
      idRoleCards: 1
    });

    const generalInfo = {
      idCommerce: newCommerce.id,
      idPerson: 0,
      idAddress: null,
      socialReason,
      commerceName,
      email,
      phone: res.locals.user && res.locals.user.phone ? res.locals.user.phone : 0,
      rfc: null,
      webPage: null,
      electronicSignatureSerialNumber: null,
      beneficiaryName: null,
      actNumber: null,
      actDate: null,
      registrationDate: null,
      notaryNumber: null,
      notaryCity: null,
      nameOfTheNotary: null,
      numeroCatastro: null,
    };
    await generalInfoRepository.save(generalInfo);
    await createFinancialInfo(newCommerce.id);

    const commerceLegalRepresentative = {
      idCommerce: newCommerce.id,
      idMaritalStatus: null,
      idAddress: null,
      idOfificialDocument: null,
      idSocietyPosition: null,
      idOccupation: null,
      idOccupationSGS: null,
      idPerson: 0,
      electronicSignatureSerialNumber: null,
      isValidated: 0,
      gender: null,
      name: null,
      lastName: null,
      motherLastName: null,
      birthday: null,
      RFC: null,
      CURP: null,
      oficialDocumentNumber: null,
      validity: null,
      publicInstrumentNumber: null,
      publicInstrumentDate: null,
      publicInstrumentDateRegistration: null,
      publicInstrumentLocation: null,
      publicInstrumentNotary: null,
    };
    await legalRepresentativeRepository.save(commerceLegalRepresentative);

    let actaConstitutiva = null;
    let destFileName = null;
    if (actaFileName && commerceTypeString === 'personaMoral') {
      destFileName = `${bucketFolderSublai}${newCommerce.id}/${actaFileName}`;
      await moveFile(bucketNameSublai, actaFileName, destFileName);
      actaConstitutiva = await commerceDocumentV2.save({
        idDocumentType: 1,
        url: `${bucketUrlSublai}${bucketNameSublai}/${destFileName}`,
        name: actaFileName,
        idCommerce: newCommerce.id,
        verifiedByIA: true,
        observations: null,
        viewed: false
      });
    }
    const documentsSublai = commerceTypeString === 'personaFisica'
      ? await uploadCommerceDocumentsSublaiPF(newCommerce.id, documentos)
      : await uploadCommerceDocumentsSublaiPM(newCommerce.id, documentos);
    if (commerceTypeString === 'personaMoral' && actaConstitutiva) {
      documentsSublai.files.push({
        field: actaConstitutiva.id,
        idDocumentType: 10,
        url: `${bucketUrlSublai}${bucketNameSublai}/${destFileName}`
          .replace('https://storage.googleapis.com/', 'gs://')
      });
    }

    const settings = {
      method: 'POST',
      url: `${sublaiApiUrl}/${ENDPOINT}`,
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': sublaiApikey
      },
      body: {
        requestId: uuidv4(),
        idCommerce: newCommerce.id,
        ...(commerceTypeString === 'personaFisica' ? { files: documentsSublai } : { ...documentsSublai }),
        executiveName: distributorData.name,
        distributorName: distributorData.name,
        accountType: accountTypeResult.tipoCuenta === 'LIMITESBAJOS' ? 'LIMITES BAJOS' : accountTypeResult.tipoCuenta,
        email,
        personType: Number(commerceType) === 1 ? 'Física' : 'Moral'
      }
    };
    Glogger.info({
      message: 'Commerce docs sent to Sublai',
      user: {
        id,
        emailSession,
        idSession
      },
      request: settings,
      status: 200
    }, req);

    const sublaiReqResult = null;
    sendRequest(settings);
    return res.status(201).json(response.successData({
      idCommerce: newCommerce.id,
      sublaiReqResult,
      accountType: accountTypeResult.tipoCuenta === 'LIMITESBAJOS' ? 'LIMITES BAJOS' : accountTypeResult.tipoCuenta
    }));
  } catch (ex) {
    console.log('Error', ex);
    if (ex.errors && ex.errors[0] && ex.errors[0].path === 'commerceName_UNIQUE') {
      return next(response.errorMessage(500, 'Internal Server Error', {
        fields: [
          {
            field: 'commerceName',
            error: 'UNIQUE'
          }
        ]
      }));
    }
    if (ex.errors && ex.errors[0] && ex.errors[0].path === 'webPage_UNIQUE') {
      return next(response.errorMessage(500, 'Internal Server Error', {
        fields: [
          {
            field: 'webPage',
            error: 'UNIQUE'
          }
        ]
      }));
    }
    return next(response.errorMessage(500, 'Internal Server Error'));
  }
}

module.exports = commerceCreationV2;
