/* eslint-disable no-console */
const { v4: uuid } = require('uuid');
const fetch = require('node-fetch');
const config = require('config');
const { getDate } = require('../../utils/weetrust');
const {
  cities: Cities,
  states: States,
  addresses: Addresses,
  countries: Countries,
  commerces: Commerces,
  commerceType: CommerceType,
  lineBusiness: LineBusiness,
  legalRepresentative: LegalRepresentative,
  maritalStatus: MaritalStatus,
  officialDocument: OfficialDocument,
  occupationASP: OccupationASP,
  contract: Contract
} = require('../../../models');
const generalInfoRepository = require('../../repository/generalInfo');
const response = require('../../utils/response');
const {
  espiralSignature, pdfWriteData, getWeetrusthToken, sendWeetrusthDocument,
  fixedWeetrusthSignatory,
  requestWeetrusthSignature
} = require('./utils');
const sendHeaders = require('../../utils/sendHeaders');
const Logger = require('../../utils/logger/GLogger');

const Glogger = new Logger('contract-controller');


const mposUrl = config.get('mpos.base');
const ecommerceUrl = config.get('ecommerce.base');

async function sendContract(req, res) {
  const { id, email, idSession } = res.locals.user || { id: null, email: null, idSession: null };

  const { idCommerce } = req.params;
  const {
    backgroundCheck,
    idValidateCheck,
    signatureType
  } = req.body;
  const query = {
    where: {
      idCommerce,
    },
    attributes: [
      'id',
      'email',
      'phone',
      'commerceName',
      'rfc',
      'socialReason',
      'webpage',
      'actNumber',
      'actDate',
      'registrationDate',
      'notaryNumber',
      'nameOfTheNotary',
      'contract',
      'numeroCatastro',
    ],
    include: [
      {
        model: Cities,
        as: 'city',
        attributes: ['id', 'name'],
        include: [
          {
            model: States,
            as: 'states',
            attributes: ['id', 'name'],
          },
        ],
      },
      {
        model: Addresses,
        as: 'address',
        attributes: [
          'street',
          'suburb',
          'zipCode',
          'exteriorNumber',
          'interiorNumber',
        ],
        include: [
          {
            model: Countries,
            as: 'countries',
            attributes: ['id', 'name'],
          },
          {
            model: States,
            as: 'states',
            attributes: ['id', 'name'],
          },
          {
            model: Cities,
            as: 'cities',
            attributes: ['id', 'name'],
          },
        ],
      },
      {
        model: Commerces,
        as: 'commerce',
        attributes: ['id'],
        include: [
          {
            model: Contract,
            as: 'contract',
            required: false,
            where: {
              deletedAt: null
            }
          },
          {
            model: LegalRepresentative,
            attributes: [
              'name',
              'lastName',
              'motherLastName',
              'birthday',
              'RFC',
              'CURP',
              'oficialDocumentNumber',
              'validity',
              'publicInstrumentNumber',
              'publicInstrumentDate',
              'publicInstrumentLocation',
              'publicInstrumentNotary',
              'publicInstrumentNotaryNumber',
              'publicInstrumentDateRegistration',
              // 'societyPosition',
            ],
            as: 'legalRepresentative',
            include: [
              {
                model: MaritalStatus,
                attributes: ['id', 'name'],
                as: 'maritalStatus',
              },
              {
                model: OfficialDocument,
                attributes: ['id', 'name', 'institutionName'],
                as: 'officialDocument',
              },
              {
                model: Addresses,
                as: 'address',
                attributes: [
                  'street',
                  'suburb',
                  'zipCode',
                  'exteriorNumber',
                  'interiorNumber',
                ],
                include: [
                  {
                    model: Countries,
                    as: 'countries',
                    attributes: ['id', 'name'],
                  },
                  {
                    model: States,
                    as: 'states',
                    attributes: ['id', 'name'],
                  },
                  {
                    model: Cities,
                    as: 'cities',
                    attributes: ['id', 'name'],
                  },
                ],
              },
              {
                model: OccupationASP,
                as: 'occupation',
                attributes: ['id', 'name'],
              }
            ],
          },
          {
            model: LineBusiness,
            as: 'lineBusiness',
            attributes: ['id', 'name'],
          },
          {
            model: CommerceType,
            as: 'commerceType',
            attributes: ['id', 'name'],
          },
        ],
      },
    ],
  };

  let details;

  try {
    details = await generalInfoRepository.findOne(query);
    if (!details) {
      Glogger.error({
        message: 'Error creating contract, missing data commerce.',
        user: {
          id,
          email,
          idSession
        },
        status: 500
      }, req);

      return res.status(404).json(response.errorMessage(404, 'No se encontraron los datos del comercio'));
    }
    if (details.commerce && details.commerce.contract && details.commerce.contract.contract) {
      Glogger.error({
        message: 'Error creating contract, commerce already has a contract.',
        user: {
          id,
          email,
          idSession
        },
        status: 500
      }, req);
      return res.status(409).json(response.errorMessage(409, 'El comercio ya tiene un contrato generado'));
    }
  } catch (error) {
    console.log(error);
    Glogger.error({
      message: 'Error creating contract.',
      user: {
        id,
        email,
        idSession
      },
      status: 500
    }, req);
    return res.status(500).json(response.errorMessage(500, [error.message, error.stack]));
  }

  let mposData;
  try {
    const mposResponse = await fetch(`${mposUrl}/commerce/${idCommerce}/mposCommerce`, {
      method: 'GET',
      headers: {
        Authorization: req.get('authorization'),
        ...sendHeaders(req)
      }
    });

    if (mposResponse.status !== 200) {
      Glogger.error({
        message: 'Error getting mpos data.',
        user: {
          id,
          email,
          idSession
        },
        status: 500
      }, req);
      return res.status(500).json(response.errorMessage(500, 'Error al obtener los datos de MPOS'));
    }

    mposData = await mposResponse.json();
  } catch (error) {
    console.log(error);
    Glogger.error({
      message: 'Error request mpos data.',
      user: {
        id,
        email,
        idSession
      },
      status: 500
    }, req, error);
    return res.status(500).json(response.errorMessage(500, [error.message, error.stack]));
  }

  console.log('------------------------------------------------------');
  let ecommerceData;
  try {
    const ecommerceResponse = await fetch(`${ecommerceUrl}/commerce/${idCommerce}`, {
      method: 'GET',
      headers: {
        Authorization: req.get('authorization'),
        ...sendHeaders(req)
      }
    });


    console.log(`${ecommerceUrl}/commerce/${idCommerce}`);
    console.log({ ecommerceResponse });

    if (ecommerceResponse.status !== 200) {
      Glogger.error({
        message: 'Error getting ecommerce data.',
        user: {
          id,
          email,
          idSession
        },
        status: 500
      }, req);
      return res.status(500).json(response.errorMessage(500, 'Error al obtener los datos de Ecommerce'));
    }

    ecommerceData = await ecommerceResponse.json();
  } catch (error) {
    console.log(error);
    Glogger.error({
      message: 'Error request ecommerce data.',
      user: {
        id,
        email,
        idSession
      },
      status: 500
    }, req, error);
    return res.status(500).json(response.errorMessage(500, [error.message, error.stack]));
  }

  console.log('------------------------------------------------------2');
  let dataSheet;
  try {
    const today = new Date();
    today.setHours(today.getHours() - 6);
    const legalRepresentative = details.commerce.legalRepresentative[0];
    const isFisica = details.commerce.commerceType.id === 1;
    dataSheet = {
      idCommerce,
      isFisica,
      signature: espiralSignature,
      date: getDate(today),
      typePerson: isFisica ? 'FÍSICA' : 'MORAL',
      styleFisical: isFisica ? 'style="display: initial;"' : 'style="display: none;"',
      styleMoral: isFisica ? 'style="display: none;"' : 'style="display: initial;"',
      legalRepresentativeName: `${legalRepresentative.name} ${legalRepresentative.lastName} ${legalRepresentative.motherLastName}`,
      legalRepresentativeRFC: legalRepresentative.RFC,
      legalRepresentativeCURP: legalRepresentative.CURP,
      legalRepresentativeOfficialDocument: (legalRepresentative
        && legalRepresentative.officialDocument) ? legalRepresentative.officialDocument.name : '',
      legalRepresentativeOfficialDocumentNumber: legalRepresentative.oficialDocumentNumber,
      legalRepresentativeAddress: legalRepresentative.address.interiorNumber ? `${legalRepresentative.address.street} #${legalRepresentative.address.exteriorNumber}, Int. ${legalRepresentative.address.interiorNumber} ${legalRepresentative.address.suburb}, C.P. ${legalRepresentative.address.zipCode}, ${legalRepresentative.address.cities.name}, ${legalRepresentative.address.states.name}, ${legalRepresentative.address.countries.name}` : `${legalRepresentative.address.street} #${legalRepresentative.address.exteriorNumber}, ${legalRepresentative.address.suburb}, C.P. ${legalRepresentative.address.zipCode}, ${legalRepresentative.address.cities.name}, ${legalRepresentative.address.states.name}, ${legalRepresentative.address.countries.name}.`,
      commerceEmail: details.email,
      commercePhone: details.phone,
      mposRate: mposData.payload.plan.rate,
      ecommerceRate: ecommerceData.payload.commerce.plan.rate,
      cashRate: ecommerceData.payload.commerce.plan.bankingSourceRate
        && ecommerceData.payload.commerce.plan.bankingSourceRate[0]
        && ecommerceData.payload.commerce.plan.bankingSourceRate[0].bankRate
        ? Number(ecommerceData.payload.commerce.plan.bankingSourceRate[0].bankRate)
        + Number(ecommerceData.payload.commerce.plan.bankingSourceRate[0].belugaRate) : 0,
    };
    if (!isFisica) {
      dataSheet = {
        commerceSocialReason: details.socialReason,
        commerceName: details.commerceName,
        commerceAddress: details.address.interiorNumber ? `${details.address.street} #${details.address.exteriorNumber} Int. ${details.address.interiorNumber} ${details.address.suburb} ${details.address.zipCode}, ${details.address.cities.name}, ${details.address.states.name}, ${details.address.countries.name}` : `${details.address.street} #${details.address.exteriorNumber} ${details.address.suburb} ${details.address.zipCode}, ${details.address.cities.name}, ${details.address.states.name}, ${details.address.countries.name}`,
        commerceRFC: details.rfc,
        commerceActNumber: details.actNumber,
        commerceActDate: details.actDate.replace(/-/g, '/'),
        commerceNotaryCity: details.city.name,
        commerceNotaryName: details.nameOfTheNotary,
        commerceNotaryNumber: details.notaryNumber,
        commerceFolio: details.numeroCatastro,
        commerceRegistrationDate: details.registrationDate.replace(/-/g, '/'),
        publicInstrumentNumber: legalRepresentative.publicInstrumentNumber,
        publicInstrumentDate: legalRepresentative.publicInstrumentDate.replace(/-/g, '/'),
        publicInstrumentLocation: legalRepresentative.publicInstrumentLocation,
        publicInstrumentNotary: legalRepresentative.publicInstrumentNotary,
        publicInstrumentNotaryNumber: legalRepresentative.publicInstrumentNotaryNumber,
        publicInstrumentDateRegistration: legalRepresentative.publicInstrumentDateRegistration.replace(/-/g, '/'),
        ...dataSheet,
      };
    }
  } catch (error) {
    console.log(error);
    Glogger.error({
      message: 'Error formatting data.',
      user: {
        id,
        email,
        idSession
      },
      status: 500
    }, req, error);
    return res.status(500).json(response.errorMessage(500, [error.message, error.stack]));
  }

  try {
    const uniqueName = `contract-(commerce-${idCommerce})-${uuid()}.pdf`;
    const pdfPath = await pdfWriteData('contract-v2.html', uniqueName, dataSheet);
    const token = await getWeetrusthToken();
    const documentId = await sendWeetrusthDocument(token, pdfPath, uniqueName);
    await fixedWeetrusthSignatory(token, documentId, dataSheet);
    await requestWeetrusthSignature(token, documentId, dataSheet, {
      backgroundCheck,
      idValidateCheck,
      signatureType
    });
    await generalInfoRepository.update({ contract: documentId }, { idCommerce });
    await Contract.create({
      idCommerce,
      contract: documentId,
      status: 6,
      type: 1
    });
  } catch (error) {
    console.log(error);
    Glogger.error({
      message: 'Error sending contract.',
      user: {
        id,
        email,
        idSession
      },
      status: 500
    }, req, error);
    return res.status(500).json(response.errorMessage(500, [error.message, error.stack]));
  }


  Glogger.info({
    message: 'Contract sent successfully.',
    user: {
      id,
      email,
      idSession
    },
    status: 200
  }, req);
  return res.json(
    response.successMessage(
      'Contrato generado correctamente y enviado para firma',
      200
    )
  );
}

module.exports = sendContract;
