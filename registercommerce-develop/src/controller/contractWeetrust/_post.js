/* eslint-disable no-console */
const fs = require('fs');
const path = require('path');
const { v4: uuid } = require('uuid');
const fetch = require('node-fetch');
const config = require('config');
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
} = require('../../../models');
const generalInfoRepository = require('../../repository/generalInfo');
const response = require('../../utils/response');
const generatePage = require('../../utils/generatePage');
const {
  getAccessToken,
  getFileContent,
  sendDocument,
  fixedSignatory,
  requestSignature,
  getDate,
  getShortDate,
} = require('../../utils/weetrust');
const sendHeaders = require('../../utils/sendHeaders');

const mposUrl = config.get('mpos.base');
const ecommerceUrl = config.get('ecommerce.base');

async function sendContractWeetrust(req, res) {
  try {
    const { check } = req.body;

    if (!check) {
      return res.json(
        response.errorMessage(
          400,
          'Falta información necesaria para generar el contrato'
        )
      );
    }

    const query = {
      where: {
        idCommerce: req.params.idCommerce,
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

    const details = await generalInfoRepository.findOne(query);
    console.log(JSON.stringify(details), '[*]details');

    if (details.contract) {
      return res.json(
        response.errorMessage(409, 'El contrato ya fue generado')
      );
    }

    const mposResponse = await fetch(`${mposUrl}/commerce/${req.params.idCommerce}/mposCommerce`, {
      method: 'GET',
      headers: {
        Authorization: req.get('authorization'),
        ...sendHeaders(req)
      },
    });

    if (mposResponse.status !== 200) {
      return res.json(
        response.errorMessage(500, 'Error al obtener los datos del mpos')
      );
    }

    const mposData = await mposResponse.json();

    const commerceResponse = await fetch(`${ecommerceUrl}/commerce/${req.params.idCommerce}`, {
      method: 'GET',
      headers: {
        Authorization: req.get('authorization'),
        ...sendHeaders(req)
      },
    });

    if (commerceResponse.status !== 200) {
      return res.json(
        response.errorMessage(500, 'Error al obtener los datos del ecommerce')
      );
    }

    const ecommerceData = await commerceResponse.json();

    const today = new Date();
    today.setHours(today.getHours() - 6);

    let dataSheet = {
      ecommerceClabe: ecommerceData.payload.clabe,
      mposRate: mposData.payload.plan.rate,
      ecommerceRate: ecommerceData.payload.commerce.plan.rate,
      cashRate: ecommerceData.payload.commerce.plan.bankingSourceRate
        && ecommerceData.payload.commerce.plan.bankingSourceRate[0]
        && ecommerceData.payload.commerce.plan.bankingSourceRate[0].bankRate
        ? Number(ecommerceData.payload.commerce.plan.bankingSourceRate[0].bankRate)
        + Number(ecommerceData.payload.commerce.plan.bankingSourceRate[0].belugaRate) : 0,
      shortDate: getShortDate(today),
      date: getDate(today),
      rfc: details.commerce.legalRepresentative[0].RFC,
      curp: details.commerce.legalRepresentative[0].CURP,
      address: details.commerce.legalRepresentative[0].address.interiorNumber ? `${details.commerce.legalRepresentative[0].address.street} #${details.commerce.legalRepresentative[0].address.exteriorNumber} Int. ${details.commerce.legalRepresentative[0].address.interiorNumber} ${details.commerce.legalRepresentative[0].address.suburb} ${details.commerce.legalRepresentative[0].address.zipCode}, ${details.commerce.legalRepresentative[0].address.cities.name}, ${details.commerce.legalRepresentative[0].address.states.name}, ${details.commerce.legalRepresentative[0].address.countries.name}` : `${details.commerce.legalRepresentative[0].address.street} #${details.commerce.legalRepresentative[0].address.exteriorNumber} ${details.commerce.legalRepresentative[0].address.suburb} ${details.commerce.legalRepresentative[0].address.zipCode}, ${details.commerce.legalRepresentative[0].address.cities.name}, ${details.commerce.legalRepresentative[0].address.states.name}, ${details.commerce.legalRepresentative[0].address.countries.name}`,
      email: details.email,
      phone: details.phone,
    };

    if (details.commerce.commerceType.id === 1) {
      dataSheet = {
        legalRepresentativeName: `${details.commerce.legalRepresentative[0].name} ${details.commerce.legalRepresentative[0].lastName} ${details.commerce.legalRepresentative[0].motherLastName}`,
        oficialDocumentNumber: details.commerce.legalRepresentative[0].oficialDocumentNumber,
        officialDocument: details.commerce.legalRepresentative[0].officialDocument.name,
        styleFisical: 'style="display: block;"',
        styleMoral: 'style="display: none;"',
        typePerson: 'FÍSICA',
        fiscalAddress: details.address.interiorNumber ? `${details.address.street} #${details.address.exteriorNumber} Int. ${details.address.interiorNumber} ${details.address.suburb} ${details.address.zipCode}, ${details.address.cities.name}, ${details.address.states.name}, ${details.address.countries.name}` : `${details.address.street} #${details.address.exteriorNumber} ${details.address.suburb} ${details.address.zipCode}, ${details.address.cities.name}, ${details.address.states.name}, ${details.address.countries.name}`,
        ...dataSheet,
      };
    } else {
      dataSheet = {
        styleMoral: 'style="display: block;"',
        styleFisical: 'style="display: none;"',
        typePerson: 'MORAL',
        socialReason: details.socialReason,
        rfc: details.rfc,
        fiscalAddress: details.address.interiorNumber ? `${details.address.street} #${details.address.exteriorNumber} Int. ${details.address.interiorNumber} ${details.address.suburb} ${details.address.zipCode}, ${details.address.cities.name}, ${details.address.states.name}, ${details.address.countries.name}` : `${details.address.street} #${details.address.exteriorNumber} ${details.address.suburb} ${details.address.zipCode}, ${details.address.cities.name}, ${details.address.states.name}, ${details.address.countries.name}`,
        actNumber: details.actNumber,
        actDate: details.actDate.replace(/-/g, '/'),
        numeroCatastro: details.numeroCatastro,
        registrationDate: details.registrationDate.replace(/-/g, '/'),
        notaryNumber: details.notaryNumber,
        nameOfTheNotary: details.nameOfTheNotary,
        legalRepresentativeName: `${details.commerce.legalRepresentative[0].name} ${details.commerce.legalRepresentative[0].lastName} ${details.commerce.legalRepresentative[0].motherLastName}`,
        notaryCity: details.city.name,
        occupation: details.commerce.legalRepresentative[0].occupation.name,
        ...dataSheet,
        publicInstrumentNumber: details.commerce.legalRepresentative[0].publicInstrumentNumber,
        publicInstrumentDate: details.commerce.legalRepresentative[0].publicInstrumentDate,
        publicInstrumentLocation: details.commerce.legalRepresentative[0].publicInstrumentLocation,
        publicInstrumentNotary: details.commerce.legalRepresentative[0].publicInstrumentNotary,
        publicInstrumentNotaryNumber:
          details.commerce.legalRepresentative[0].publicInstrumentNotaryNumber,
        publicInstrumentDateRegistration:
          details.commerce.legalRepresentative[0].publicInstrumentDateRegistration,
      };
    }

    const file = 'contract.html';
    const fileContent = await getFileContent(file);

    const html = fileContent.replace(/{%((\w|\d|\s)*)%}/g, (_, key) => (Object.prototype.hasOwnProperty.call(dataSheet, key) ? dataSheet[key] : ''));

    const uniqueName = `Contract-${uuid()}.pdf`;
    const page = await generatePage(html, uniqueName);
    const pdfPath = path.resolve(__dirname, '../../../pdf', uniqueName);
    fs.writeFileSync(pdfPath, page);

    // @todo: descomentar solamente para generar el pdf
    // return res.json(response.successData(dataSheet));

    const token = await getAccessToken();
    const documentId = await sendDocument(token, pdfPath, uniqueName);

    const fixedSigatoryResponse = await fixedSignatory(
      token,
      documentId,
      dataSheet.email,
      dataSheet.typePerson,
    );

    console.log(await fixedSigatoryResponse.json(), '[*]fixedSignatory');

    const requestSignatureResponse = await requestSignature(
      token,
      documentId,
      dataSheet,
      check
    );
    console.log(await requestSignatureResponse.json(), '[*]requestSignature');

    if (requestSignatureResponse.status !== 200) {
      return res.json(
        response.errorMessage(500, 'Error al enviar el contrato para firma')
      );
    }

    await generalInfoRepository.update(
      {
        contract: documentId,
      },
      {
        idCommerce: details.commerce.id,
      }
    );

    return res.json(
      response.successMessage(
        'Contrato generado correctamente y enviado para firma',
        200
      )
    );
  } catch (err) {
    console.log(err, '[*]err');
    return res.json(response.errorMessage(500, err.toString()));
  }
}

module.exports = {
  sendContractWeetrust,
};
