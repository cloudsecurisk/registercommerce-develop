const config = require('config');
const fetch = require('node-fetch');
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
  occupationSGS: OccupationSGS,
} = require('../../../models');
const generalInfoRepository = require('../../repository/generalInfo');
const legalRepresentativeRepository = require('../../repository/legalRepresentative');
const response = require('../../utils/response');
const Logger = require('../../utils/logger/GLogger');

const Glogger = new Logger('sgs-controller');


const sgsToken = config.get('sgs.token');
const pfUrl = config.get('sgs.pfUrl');
const pmUrl = config.get('sgs.pmUrl');

async function sendData(req, res) {
  const { id, email, idSession } = res.locals.user || { id: null, email: null, idSession: null };
  const { idCommerce } = req.params;
  const query = {
    where: { idCommerce },
    attributes: [
      'id',
      'idPerson',
      'email',
      'phone',
      'commerceName',
      'rfc',
      'socialReason',
      'webpage',
      'actNumber',
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
        include: [{ model: States, as: 'states', attributes: ['id', 'name'] }],
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
          { model: Countries, as: 'countries', attributes: ['id', 'name', 'sgsCodeNationality'] },
          { model: States, as: 'states', attributes: ['id', 'name', 'sgsCode'] },
          { model: Cities, as: 'cities', attributes: ['id', 'name'] },
        ],
      },
      {
        model: Commerces,
        as: 'commerce',
        attributes: ['id'],
        include: [
          {
            model: LegalRepresentative,
            as: 'legalRepresentative',
            attributes: [
              'name',
              'lastName',
              'gender',
              'motherLastName',
              'birthday',
              'RFC',
              'CURP',
              'oficialDocumentNumber',
              'validity',
              'idPerson',
            ],
            include: [
              {
                model: OccupationSGS,
                as: 'occupationSGS',
              },
              {
                model: MaritalStatus,
                as: 'maritalStatus',
                attributes: ['id', 'name'],
              },
              {
                model: OfficialDocument,
                as: 'officialDocument',
                attributes: ['id', 'name', 'institutionName', 'sgsCode'],
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
                    attributes: ['id', 'name', 'sgsCodeNationality'],
                  },
                  { model: States, as: 'states', attributes: ['id', 'name', 'sgsCode'] },
                  { model: Cities, as: 'cities', attributes: ['id', 'name'] },
                ],
              },
            ],
          },
          {
            model: OccupationSGS,
            as: 'lineBusinessSGS',
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
        message: 'Error missing details commerce.',
        user: {
          id,
          email,
          idSession
        },
        status: 404
      }, req);
      return res
        .status(404)
        .json(response.errorMessage(404, ['Información no encontrada']));
    }
  } catch (error) {
    Glogger.error({
      message: 'Error obtaining details commerce.',
      user: {
        id,
        email,
        idSession
      },
      status: 500
    }, req, error);
    return res
      .status(500)
      .json(
        response.errorMessage(500, [
          'Error al obtener la información',
          error.message,
        ])
      );
  }

  const { commerce } = details;
  if (!commerce) {
    Glogger.error({
      message: 'Error missing commerce.',
      user: {
        id,
        email,
        idSession
      },
      status: 500
    }, req);
    return res
      .status(404)
      .json(response.errorMessage(404, ['Comercio no encontrado']));
  }
  const { legalRepresentative, commerceType } = commerce;
  if (!legalRepresentative) {
    Glogger.error({
      message: 'Error missing legal representative.',
      user: {
        id,
        email,
        idSession
      },
      status: 500
    }, req);
    return res
      .status(404)
      .json(
        response.errorMessage(404, ['Representante legal no encontrado'])
      );
  }

  const representative = legalRepresentative[0];
  const isFisica = commerceType.id === 1;

  let data;
  try {
    data = isFisica
      ? {
        nIdProspecto: commerce.id,
        nIdPersona: details.idPerson || 0,
        nIdRol: 1,
        nIdTipoIdentificacion: representative.officialDocument.sgsCode,
        nIdPaisNacimiento: representative.address.countries.sgsCodeNationality,
        dFechaNacimientoConstitucion: representative.birthday,
        sPrimerNombre: representative.name.split(' ')[0],
        sSegundoNombre: representative.name.split(' ')[1] || '',
        sApellidoPaterno: representative.lastName,
        sApellidoMaterno: representative.motherLastName,
        sRFC: representative.RFC,
        sCURP: representative.CURP,
        sNm_Act_Economica: representative.occupationSGS.code,
        nIdNacionalidad: representative.address.countries.sgsCodeNationality,
        sNroIdentificacion: representative.oficialDocumentNumber,
        sSexo: (representative.gender === 'M') ? 'H' : 'M',
        sTelefono: details.phone,
        nIdLugarNacimiento: representative.address.states.sgsCode,
        sEmail: details.email,
        sClabe: '000000000000000000',
      }
      : {
        nIdProspecto: commerce.id,
        nIdPersona: details.idPerson || 0,
        nIdRol: 1,
        sNombreMoral: details.commerceName,
        sNm_Act_Economica: commerce.lineBusinessSGS.code,
        nIdPaisConstitucion: details.address.countries.sgsCodeNationality,
        nIdNacionalidad: details.address.countries.sgsCodeNationality,
        sRFC: details.rfc,
        sFiel: '123456780',
        sTelefono: details.phone,
        sEmail: details.email,
        dFechaNacimientoConstitucion: details.registrationDate,
        sCLABE: 'XXXXXXXXXXXXXXXXXX',
        lstDatosAL: [
          {
            nIdRol: 8,
            nIdPersona: representative.idPerson,
            sPrimerNombre: representative.name.split(' ')[0],
            sSegundoNombre: representative.name.split(' ')[1] || '',
            sApellidoPaterno: representative.lastName,
            sApellidoMaterno: representative.motherLastName,
          },
        ],
      };
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
    return res
      .status(500)
      .json(
        response.errorMessage(500, [
          'Error al armar la información',
          error.message,
        ])
      );
  }

  try {
    const url = isFisica ? pfUrl : pmUrl;

    console.log(url, JSON.stringify(data));

    const resp = await fetch(url, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: { 'Content-Type': 'application/json', Token: sgsToken },
    });

    // eslint-disable-next-line no-console
    console.log(resp, 'resp');

    const json = await resp.json();
    // eslint-disable-next-line no-console
    console.log(json);
    if (json.nCodigoRespuesta !== 200) {
      Glogger.error({
        message: 'Error response SGS.',
        user: {
          id,
          email,
          idSession
        },
        status: 500
      }, req);
      return res
        .status(500)
        .json(
          response.errorMessage(500, [
            'Error en la respuesta de SGS',
            json.sRespuesta,
          ])
        );
    }

    if (details.idPerson === 0) {
      try {
        await generalInfoRepository.update(
          { idPerson: json.nIdPersona },
          { idCommerce }
        );

        if (!isFisica) {
          await legalRepresentativeRepository.update(
            { idPerson: json.lstPersonasRelacionadas[0].nIdPersona },
            { idCommerce },
          );
        }
      } catch (error) {
        console.log(error);
        Glogger.error({
          message: 'Error updating info.',
          user: {
            id,
            email,
            idSession
          },
          status: 500
        }, req, error);
        return res
          .status(500)
          .json(
            response.errorMessage(500, [
              'Error al actualizar la información',
              error.message,
            ])
          );
      }
      Glogger.info({
        message: 'SGS information sent successfully.',
        user: {
          id,
          email,
          idSession
        },
        status: 200
      }, req);
      return res.json(
        response.successMessage([
          'Información enviada correctamente',
          json.sRespuesta,
        ])
      );
    }
    Glogger.info({
      message: 'SGS information sent successfully',
      user: {
        id,
        email,
        idSession
      },
      status: 200
    }, req);
    return res.json(
      response.successMessage([
        'Información actualizada correctamente',
        json.sRespuesta,
      ])
    );
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error);
    Glogger.error({
      message: 'Error request SGS.',
      user: {
        id,
        email,
        idSession
      },
      status: 500
    }, req, error);
    return res
      .status(500)
      .json(
        response.errorMessage(500, [
          'Error en la petición a SGS',
          error.message,
        ])
      );
  }
}

module.exports = {
  sendData,
};
