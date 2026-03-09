/* eslint-disable max-len */
/* eslint-disable no-console */
const fetch = require('node-fetch');
const config = require('config');
const {
  addresses: Addresses,
  cities: Cities,
  commerces: Commerces,
  commerceType: CommerceType,
  countries: Countries,
  occupationASP: OccupationASP,
  legalRepresentative: LegalRepresentative,
  states: States,
  regcheqInformation: RegcheqInformation,
} = require('../../../models');
const generalInfoRepository = require('../../repository/generalInfo');
const regcheqRepository = require('../../repository/regcheq');
const response = require('../../utils/response');

const API_KEY_REGCHEQ = config.get('regcheq.apiKey');
const BASE_URL_REGCHEQ = config.get('regcheq.base');

// eslint-disable-next-line no-unused-vars
async function getRegcheqInformation(req, res, next) {
  const { idCommerce } = req.params;
  console.log(idCommerce, '[*]::idCommerce in getRegcheqInformation');

  if (!idCommerce) {
    return res
      .status(400)
      .json(response.errorMessage(400, 'idCommerce es requerido'));
  }

  try {
    const regcheqInfo = await regcheqRepository.findOne({
      attributes: ['id', 'businessActivity', 'sourceOfIncome', 'governmentPosition',
        'contractedProduct', 'channel', 'riskLevel'],
      where: { idCommerce },
    });
    console.log(regcheqInfo, '[*]::regcheqInfo');

    return res.json(response.successData(regcheqInfo));
  } catch (error) {
    console.error('Error fetching regcheqInformation:', error);
    return res
      .status(500)
      .json(
        response.errorMessage(500, 'Error interno del servidor', error.message),
      );
  }
}

// eslint-disable-next-line no-unused-vars
async function sendCustomer(req, res, _next) {
  console.log(req.body, '[*]::req.body in sendCustomer');
  if (!req.body) {
    return res
      .status(400)
      .json(response.errorMessage(400, 'El cuerpo de la solicitud está vacío'));
  }

  const { idCommerce } = req.params;

  const query = {
    raw: true,
    nest: true,
    where: { idCommerce },
    include: [
      {
        model: Commerces,
        as: 'commerce',
        attributes: ['id'],
        include: [
          {
            model: LegalRepresentative,
            as: 'legalRepresentative',
            include: [
              {
                model: OccupationASP,
                as: 'occupation',
              },
              {
                model: Addresses,
                as: 'address',
                include: [
                  {
                    model: Countries,
                    as: 'countries',
                  },
                  {
                    model: States,
                    as: 'states',
                  },
                  {
                    model: Cities,
                    as: 'cities',
                  },
                ],
              },
            ],
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
      return res
        .status(404)
        .json(
          response.errorMessage(404, 'Detalles del comercio no encontrados'),
        );
    }

    const legalRepresentative = details.commerce.legalRepresentative || null;

    if (!legalRepresentative) {
      return res
        .status(404)
        .json(response.errorMessage(404, 'Representante legal no encontrado'));
    }

    let body;
    const isFisical = details.commerce.commerceType.id === 1;

    let regcheqInfoCompleted;
    try {
      // encontrar o crear registro en RegcheqInformation en caso de que exista actualizarlo
      const {
        businessActivity,
        sourceOfIncome,
        governmentPosition,
        contractedProduct,
        channel,
      } = req.body;
      const [regcheqInfo, created] = await RegcheqInformation.findOrCreate({
        where: { idCommerce },
        defaults: {
          idCommerce,
          businessActivity,
          sourceOfIncome,
          governmentPosition,
          contractedProduct,
          channel,
        },
      });
      if (!created) {
        // actualizar registro
        await regcheqInfo.update({
          businessActivity,
          sourceOfIncome,
          governmentPosition,
          contractedProduct,
          channel,
        });
      }

      regcheqInfoCompleted = regcheqInfo;
      console.log(regcheqInfoCompleted, '[*]::regcheqInfoCompleted');
    } catch (error) {
      console.error('Error al crear o actualizar RegcheqInformation:', error);
      return res
        .status(500)
        .json(
          response.errorMessage(
            500,
            'Error al crear o actualizar RegcheqInformation',
          ),
        );
    }

    if (isFisical) {
      body = {
        usr: 'demo_espiral',
        pass: 'EspiralDemo2025*',
        tipo: '1', // 1 = fisica || 2 = moral
        actividad_empresarial: regcheqInfoCompleted.businessActivity, // 1 = si || 0 = no
        sector_economico: '',
        apaterno: legalRepresentative.lastName, // solo para persona fisica
        amaterno: legalRepresentative.motherLastName, // solo para persona fisica
        nombre: legalRepresentative.name, // nombre del cliente o razon social
        vinculado: 0, // 0 = en caso de que el customer no pertenezca a la organización || 1 = si pertenece el customer a la organización
        actua_cuenta_propia: 1, // 1 = si, 0 = no
        genero: legalRepresentative.gender, // M = MASCULINO || F = FEMENINO solo para persona fisica
        rfc: legalRepresentative.RFC, // para persona fisica o moral
        curp: legalRepresentative.CURP, // para persona fisica
        no_cliente: idCommerce, // Numero de identificacion del cliente
        fecha_nacimiento: legalRepresentative.birthday, // fecha de nacimento o constitucion Formato de la fecha YYYY-MM-DD
        pais_nacimiento: legalRepresentative.address.countries.name,
        nacionalidad: legalRepresentative.address.countries.citizenship,
        e_f_nacimiento: legalRepresentative.address.states.name,
        telefono_fijo: details.phone,
        telefono_movil: details.phone,
        correo_electronico: details.email,
        profesion: legalRepresentative.occupation.name || null, // solo persona fisica
        actividad: '3051026',
        // no_empleados: '1', //solo persona moral
        actividad_cnbv: '3051026', // catálogo oficial CNBV, en caso de no tenerlo, pedirlo al personal de TI
        origen_ingresos: regcheqInfoCompleted.sourceOfIncome,
        or_pais: legalRepresentative.address.countries.name,
        or_localidad: legalRepresentative.address.countries.name,
        dr_localidad: legalRepresentative.address.countries.name, // localidad hacia donde van los recursos
        or_actividad: regcheqInfoCompleted.sourceOfIncome, // Actividad origen de los recursos, catálogo el cual se proporcionara
        fines_credito: '', // catálogo el cual se proporcionara
        puesto_gobierno: regcheqInfoCompleted.governmentPosition, // Personas politicamente expuestas(deacuerdo a catalgo)
        periodo_puesto: '', // En caso de que sea pep
        calle: legalRepresentative.address.street, // Calle del domicilio
        no_exterior: legalRepresentative.address.exteriorNumber, // Numero exterior del domicilio
        no_interior: legalRepresentative.address.interiorNumber, // Numero interior del domicilio (en caso de contar)
        cp: legalRepresentative.address.zipCode, // CP del domicio
        colonia: legalRepresentative.address.suburb, // Colonia del domicilio
        municipio: legalRepresentative.address.cities.name, // Municipio del domicilio
        ciudad: legalRepresentative.address.states.name, // Ciudad del domicilio
        ef_domicilio: legalRepresentative.address.states.name, // Entidad federativa  del domicilio
        estado_domicilio: legalRepresentative.address.states.name, // Estado del domicilio
        pais_domicilio: legalRepresentative.address.countries.name, // Pais del domicilio
        fecha_proxima_revision: '', // Fecha tentativa del la proxima revision
        comentarios: '', // Comentarios asosiados al cliente (opcional)

        status: '1', // Estado del cliente
        inicio_operaciones: '2024-01-01', // Fecha de ingreso del cliente
        latitude: '20215.210540', // Latitud del registro (refiere a la geolocalización)
        length: '-97.1036501', // Longitud del registro (refiere a la geolocalización)

        producto_contratado: regcheqInfoCompleted.contractProduct, // Parametro de matriz, se tiene que enviar una clave conforme al catalgo
        canales: '2', // Parametro de matriz, se tiene que enviar una clave conforme al catalgo
      };
    } else {
      body = {
        usr: 'demo_espiral',
        pass: 'EspiralDemo2025*',
        tipo: '2', // 1 = fisica || 2 = moral
        actividad_empresarial: 1, // 1 = si || 0 = no
        sector_economico: '',
        // apaterno: legalRepresentative.lastName.toUpperCase().trim(), // solo para persona fisica
        // amaterno: legalRepresentative.motherLastName.toUpperCase().trim(), //solo para persona fisica
        nombre: details.socialReason, // nombre del cliente o razon social
        vinculado: 0, // 0 = en caso de que el customer no pertenezca a la organización || 1 = si pertenece el customer a la organización
        actua_cuenta_propia: 1, // 1 = si, 0 = no
        genero: legalRepresentative.gender, // M = MASCULINO || F = FEMENINO solo para persona fisica
        rfc: details.rfc, // para persona fisica o moral
        // curp: legalRepresentative.CURP.toUpperCase().trim(), // para persona fisica
        no_cliente: idCommerce, // Numero de identificacion del cliente
        fecha_nacimiento: legalRepresentative.birthday, // fecha de nacimento o constitucion Formato de la fecha YYYY-MM-DD
        pais_nacimiento: legalRepresentative.address.countries.name,
        nacionalidad: legalRepresentative.address.countries.citizenship,
        e_f_nacimiento: legalRepresentative.address.states.name
          .toUpperCase()
          .trim(),
        telefono_fijo: details.phone,
        telefono_movil: details.phone,
        correo_electronico: details.email,
        // profesion: legalRepresentative.occupation.name.toUpperCase().trim(), //solo persona fisica
        actividad: '3051026',
        no_empleados: '1', // solo persona moral
        actividad_cnbv: '3051026', // catálogo oficial CNBV, en caso de no tenerlo, pedirlo al personal de TI
        origen_ingresos: regcheqInfoCompleted.sourceOfIncome,
        or_pais: legalRepresentative.address.countries.name, // País origen de recursos
        or_localidad: legalRepresentative.address.countries.name, // localidad de origen de recursos
        dr_localidad: legalRepresentative.address.countries.name, // localidad hacia donde van los recursos
        or_actividad: regcheqInfoCompleted.sourceOfIncome, // Actividad origen de los recursos, catálogo el cual se proporcionara
        fines_credito: '', // catálogo el cual se proporcionara
        puesto_gobierno: regcheqInfoCompleted.governmentPosition, // Personas politicamente expuestas(deacuerdo a catalgo)
        periodo_puesto: '', // En caso de que sea pep
        calle: legalRepresentative.address.street, // Calle del domicilio
        no_exterior: legalRepresentative.address.exteriorNumber,
        no_interior: legalRepresentative.address.interiorNumber,
        cp: legalRepresentative.address.zipCode, // CP del domicio
        colonia: legalRepresentative.address.suburb, // Colonia del domicilio
        municipio: legalRepresentative.address.cities.name, // Municipio del domicilio
        ciudad: legalRepresentative.address.states.name, // Ciudad del domicilio
        ef_domicilio: legalRepresentative.address.states.name, // Entidad federativa  del domicilio
        estado_domicilio: legalRepresentative.address.states.name, // Estado del domicilio
        pais_domicilio: legalRepresentative.address.countries.name, // Pais del domicilio
        fecha_proxima_revision: '', // Fecha tentativa del la proxima revision
        comentarios: '', // Comentarios asosiados al cliente (opcional)

        status: '1', // Estado del cliente
        inicio_operaciones: '2024-01-01', // Fecha de ingreso del cliente
        latitude: '20215.210540', // Latitud del registro (refiere a la geolocalización)
        length: '-97.1036501', // Longitud del registro (refiere a la geolocalización)

        producto_contratado: regcheqInfoCompleted.contractProduct, // Parametro de matriz, se tiene que enviar una clave conforme al catalgo
        canales: regcheqInfoCompleted.channel, // Parametro de matriz, se tiene que enviar una clave conforme al catalgo
      };
    }
    console.log(body, '[*]::body to send to RegCheq');

    let tokenRegcheq;
    try {
      const tokenResponse = await fetch(
        `${BASE_URL_REGCHEQ}/keys/generateToken`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': API_KEY_REGCHEQ,
          },
          body: JSON.stringify({
            usr: 'demo_espiral',
            pass: 'EspiralDemo2025*',
          }),
        },
      );

      const tokenData = await tokenResponse.json();
      tokenRegcheq = tokenData.token;
      if (!tokenRegcheq) {
        throw new Error('Token no recibido de RegCheq');
      }
    } catch (error) {
      console.error('Error fetching token:', error);
      return res
        .status(500)
        .json(
          response.errorMessage(
            500,
            'Error al obtener el token',
            error.message,
          ),
        );
    }

    try {
      const regcheqResponse = await fetch(
        `${BASE_URL_REGCHEQ}/customersapi/customer`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': API_KEY_REGCHEQ,
            Authorization: tokenRegcheq,
          },
          body: JSON.stringify(body),
        },
      );

      const regcheqData = await regcheqResponse.json();
      const ALREADY_REGISTERED = 'THE no_cliente NUMBER IS ALREADY REGISTERED';
      if (regcheqData.response.message === ALREADY_REGISTERED) {
        const regcheqUpdateResponse = await fetch(
          `${BASE_URL_REGCHEQ}/customersapi/customer`,
          {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
              'x-api-key': API_KEY_REGCHEQ,
              Authorization: tokenRegcheq,
            },
            body: JSON.stringify(body),
          },
        );

        const regcheqUpdateData = await regcheqUpdateResponse.json();
        console.log(regcheqUpdateData, '[*]::regcheqUpdateData');
        await regcheqInfoCompleted.update({
          riskLevel: regcheqUpdateData.response.customer_info.riesgo,
        });

        return res.json(
          response.successMessage(
            'Datos actualizados en RegCheq correctamente',
          ),
        );
      }

      await regcheqInfoCompleted.update({
        riskLevel: regcheqData.response.customer_info.riesgo,
      });

      return res.json(
        response.successMessage('Datos enviados a RegCheq correctamente'),
      );
    } catch (error) {
      console.log(error, '[x]::error');
      return res.json(
        response.errorMessage(
          500,
          'Error al enviar datos a RegCheq',
          error.message,
        ),
      );
    }
  } catch (error) {
    console.error('Error en sendCustomer:', error);
    return res
      .status(500)
      .json(
        response.errorMessage(500, 'Error interno del servidor', error.message),
      );
  }
}

module.exports = {
  getRegcheqInformation,
  sendCustomer,
};
