const response = require('../../utils/response');
const commerceRepository = require('../../repository/commerce');
const addressesRepository = require('../../repository/addresses');
const generalInfoRepository = require('../../repository/generalInfo');
// const financialInformationRepository = require('../../repository/financialInformation');
const legalRepresentativeRepository = require('../../repository/legalRepresentative');
const commerceDocumentV2Repository = require('../../repository/v2/commerceDocument');
const Logger = require('../../utils/logger/GLogger');
const sendRegistrationNotification = require('../../utils/email/registerNotification');

const Glogger = new Logger('commerce-controller');

async function sublaiCommerceDocsWebhook(req, res, next) {
  const {
    id,
    emailSession,
    idSession
  } = res.locals.user || { id: null, emailSession: null, idSession: null };
  const { commerceType, idCommerce } = req.query; // commerceType 1: Fisica | commerceType 2: Moral
  const {
    commerceInformation,
    legalRepresentative,
    constitutiveAct,
  } = req.body;

  Glogger.info({
    message: 'Commerce docs webhook received',
    user: {
      id,
      emailSession,
      idSession
    },
    status: 200
  }, req);

  if (!commerceType || !idCommerce) {
    return res
      .status(400)
      .json(response.errorMessage(400, 'Commerce type or idCommerce value undefined'));
  }

  const commerceTypeFormatted = Number(commerceType);
  const where = {
    idCommerce: Number(idCommerce),
  };

  const updateCommerceDocuments = async () => {
    const documentData = {
      verifiedByIA: true
    };
    return commerceDocumentV2Repository.update(documentData, where);
  };

  const createAddress = async (addressInfo) => {
    const address = {
      idCountry: addressInfo.idCountry,
      idState: addressInfo.idState,
      idCity: addressInfo.idCity,
      street: addressInfo.street,
      suburb: addressInfo.suburb,
      zipCode: addressInfo.zipCode,
      exteriorNumber: addressInfo.exteriorNumber,
      interirorNumber: addressInfo.interiorNumber || null,
    };
    return addressesRepository.save(address);
  };

  // const createFinancialInfo = async (financialInfo) => {
  //   const financialData = {
  //     month1: financialInfo.month1,
  //     month2: financialInfo.month2,
  //     month3: financialInfo.month3,
  //     totalCash: financialInfo.totalCash,
  //     totalPos: financialInfo.totalPos,
  //     totalEcommerce: financialInfo.totalEcommerce,
  //     averagePerMonth: financialInfo.averagePerMonth,
  //     averagePerTransaction: financialInfo.averagePerTransaction,
  //   };
  //   return financialInformationRepository.update(financialData, where);
  // };

  try {
    const commerce = {
      idLineBusiness: commerceInformation.idLineBusiness,
      idCommerceStatus: 15
    };
    const whereCommerce = {
      id: Number(idCommerce)
    };
    const sublaiCommerce = await commerceRepository.update(commerce, whereCommerce);
    const sublaiCommerceAddress = await createAddress(commerceInformation.address);

    const generalInfo = {
      idPerson: 0,
      idAddress: sublaiCommerceAddress.id,
      socialReason: commerceInformation.socialReason,
      commerceName: commerceInformation.commerceName,
      phone: commerceInformation.phone,
      rfc: commerceInformation.rfc,
      webPage: commerceInformation.webPage,
      electronicSignatureSerialNumber:
        commerceInformation.electronicSignatureSerialNumber,
      beneficiaryName:
        commerceTypeFormatted === 1 ? null : commerceInformation.beneficiaryName,
      actNumber: commerceTypeFormatted === 2 ? constitutiveAct.actNumber : null,
      actDate: commerceTypeFormatted === 2 ? constitutiveAct.actDate : null,
      registrationDate:
        commerceTypeFormatted === 2 ? constitutiveAct.registrationDate : null,
      notaryNumber: commerceTypeFormatted === 2 ? constitutiveAct.notaryNumber : null,
      notaryCity: commerceTypeFormatted === 2 ? constitutiveAct.notaryCity : null,
      nameOfTheNotary:
        commerceTypeFormatted === 2 ? constitutiveAct.nameOfTheNotary : null,
      numeroCatastro:
        commerceTypeFormatted === 2 ? constitutiveAct.numeroCatastro : null,
    };
    await generalInfoRepository.update(generalInfo, where);

    await updateCommerceDocuments();

    // await createFinancialInfo(commerceInformation.financialInformation);
    const sublaiLegalRepresentativeAddress = await createAddress(legalRepresentative.address);

    const commerceLegalRepresentative = {
      idMaritalStatus: legalRepresentative.idMaritalStatus,
      idAddress: sublaiLegalRepresentativeAddress.id,
      idOccupation: legalRepresentative.idOccupation,
      idOfificialDocument: legalRepresentative.idOfficialDocument,
      electronicSignatureSerialNumber:
        legalRepresentative.electronicSignatureSerialNumber,
      isValidated: 0,
      gender: legalRepresentative.gender,
      name: legalRepresentative.name,
      lastName: legalRepresentative.lastName,
      motherLastName: legalRepresentative.motherLastName,
      birthday: legalRepresentative.birthday,
      RFC: legalRepresentative.rfc,
      CURP: legalRepresentative.curp,
      oficialDocumentNumber: legalRepresentative.oficialDocumentNumber,
      validity: legalRepresentative.validity,
      publicInstrumentNumber:
        commerceTypeFormatted === 2 ? constitutiveAct.publicInstrumentNumber : null,
      publicInstrumentDate:
        commerceTypeFormatted === 2 ? constitutiveAct.publicInstrumentDate : null,
      publicInstrumentDateRegistration:
        commerceTypeFormatted === 2
          ? constitutiveAct.publicInstrumentDateRegistration
          : null,
      publicInstrumentLocation:
        commerceTypeFormatted === 2 ? constitutiveAct.publicInstrumentLocation : null,
      publicInstrumentNotary:
        commerceTypeFormatted === 2 ? constitutiveAct.publicInstrumentNotary : null,
      publicInstrumentNotaryNumber:
        commerceTypeFormatted === 2
          ? constitutiveAct.publicInstrumentNotaryNumber
          : null,
    };
    await legalRepresentativeRepository.update(commerceLegalRepresentative, where);

    sendRegistrationNotification(commerceInformation.commerceName, idCommerce);
    return res.json(response.successData({ idCommerce: sublaiCommerce.id }));
  } catch (ex) {
    console.log('Error:', ex);
    const errorPath = ex.errors[0].path;
    if (errorPath === 'commerceName_UNIQUE' || errorPath === 'webPage_UNIQUE') {
      return next(
        response.errorMessage(500, 'Internal Server Error', {
          fields: [
            { field: errorPath.replace('_UNIQUE', ''), error: 'UNIQUE' },
          ],
        })
      );
    }
    return next(response.errorMessage(500, 'Internal Server Error'));
  }
}

async function sublaiDocsObservation(req, res) {
  let { error } = req.body;
  const { fileId } = req.body;
  console.log('sublaiDocsObservation', req.body);

  if (error && error.length >= 255) {
    error = String(error).slice(0, 254);
  }

  try {
    const attributes = {
      observations: error
    };
    const where = { id: Number(fileId) };

    const [rowsUpdated] = await commerceDocumentV2Repository.update(attributes, where);

    if (rowsUpdated === 0) {
      return res.status(404).json(response.errorMessage(404, 'Documento no encontrado o sin cambios'));
    }

    return res.json(response.successData({ id: Number(fileId), updated: true }));
  } catch (err) {
    console.error('Error actualizando documento:', err);
    return res.status(500).json(response.errorMessage(500, 'Internal Server Error'));
  }
}

module.exports = {
  sublaiCommerceDocsWebhook,
  sublaiDocsObservation
};
