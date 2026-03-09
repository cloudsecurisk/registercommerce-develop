const response = require('../../utils/response');
const {
  commerceType: CommerceTypeModel,
  commerces: Commerces,
  addresses: Addresses,
  countries: Countries,
  states: States,
  cities: Cities,
  financialInformation: FinancialInformation,
  legalRepresentative: LegalRepresentative,
  organization: OrgaizationsModel,
  lineBusiness: LineBusiness,
  lineBusinessASP: LineBusinessASP,
  officialDocument: OfficialDocument,
  occupationASP: OccupationASP,
  maritalStatus: MaritalStatus,
  societyPosition: SocietyPosition,
  commerceStatus: CommerceStatus,
  executives: Executives
} = require('../../../models');
const generalInfoRepository = require('../../repository/generalInfo');

const Logger = require('../../utils/logger/GLogger');

const Glogger = new Logger('commerce-details-controller');

async function getEcommerceDetails(req, res, next) {
  const { user } = res.locals;
  const { id, email, idSession } = res.locals.user || { id: null, email: null, idSession: null };

  try {
    const { idCommerce } = req.params;
    const query = {
      where: {
        // ...(user.crole.value >= 300) ? { idUser: user.id } : {},
        idCommerce,
      },
      attributes: [
        'email',
        'phone',
        'commerceName',
        'idAddress',
        'rfc',
        'socialReason',
        'webpage',
        'actNumber',
        'contract',
        'registrationDate',
        'notaryCity',
        'notaryNumber',
        'nameOfTheNotary',
        'numeroCatastro',
        'electronicSignatureSerialNumber',
        'actDate',
        'latitude',
        'longitude',
      ],
      required: true,
      include: [
        {
          model: Cities,
          as: 'city',
          attributes: ['id', 'name'],
          required: false,
          include: [
            {
              model: States,
              as: 'states',
              attributes: ['id', 'name'],
              required: false,
            },
          ],
        },
        {
          model: Addresses,
          as: 'address',
          attributes: [
            'street',
            'zipCode',
            'exteriorNumber',
            'interiorNumber',
            'suburb',
          ],
          required: true,
          include: [
            {
              model: Countries,
              as: 'countries',
              attributes: ['id', 'name', 'aspCode', 'aspCodeNationality', 'code'],
              required: true,
            },
            {
              model: States,
              as: 'states',
              attributes: ['id', 'name', 'iso', 'aspCode'],
              required: false,
            },
            {
              model: Cities,
              as: 'cities',
              attributes: ['id', 'name'],
              required: false,
            },
          ],
        },
        {
          model: Commerces,
          as: 'commerce',
          attributes: ['id', 'idCommerceStatus', 'idCommerceType',
            'idAmex', 'idLineBusinessSGS'],
          required: true,
          include: [
            {
              model: Executives,
              attributes: ['id', 'name'],
              as: 'commerceExecutive',
              required: false
            },
            {
              model: Executives,
              attributes: ['id', 'name'],
              as: 'commerceDistributor',
              required: false
            },
            {
              model: Executives,
              attributes: ['id', 'name'],
              as: 'commerceSubDistributor',
              required: false
            },
            {
              model: Executives,
              attributes: ['id', 'name'],
              as: 'commerceGroup',
              required: false
            },
            {
              model: LegalRepresentative,
              as: 'legalRepresentative',
              required: false,
              include: [
                {
                  model: MaritalStatus,
                  as: 'maritalStatus',
                  attributes: ['name'],
                  required: false
                },
                {
                  model: OccupationASP,
                  as: 'occupation',
                  attributes: ['id', 'code', 'name'],
                  required: false,
                },
                {
                  model: OfficialDocument,
                  as: 'officialDocument',
                  required: false,
                },
                {
                  model: Addresses,
                  as: 'address',
                  attributes: [
                    'street',
                    'zipCode',
                    'exteriorNumber',
                    'interiorNumber',
                    'suburb',
                  ],
                  required: true,
                  include: [
                    {
                      model: Countries,
                      as: 'countries',
                      attributes: ['id', 'name', 'aspCode', 'aspCodeNationality', 'code'],
                      required: true,
                    },
                    {
                      model: States,
                      as: 'states',
                      attributes: ['id', 'name', 'iso', 'aspCode'],
                      required: false,
                    },
                    {
                      model: Cities,
                      as: 'cities',
                      attributes: ['id', 'name'],
                      required: false,
                    },
                  ],
                },
                {
                  model: Cities,
                  as: 'publicInstrumentCity',
                  attributes: ['id', 'name'],
                  include: [
                    {
                      model: States,
                      as: 'states',
                      attributes: ['id', 'name'],
                      required: false,
                    },
                  ],
                },
                {
                  model: SocietyPosition,
                  as: 'societyPosition',
                  attributes: ['name'],
                  required: false
                },
              ],
            },
            {
              model: OrgaizationsModel,
              attributes: ['idRoleMpos', 'idRoleMpos', 'idRoleTransfer'],
              as: 'organization',
              where: {
                ...(user && user.id && user.id && user.crole.value >= 300
                  ? { idUser: user.id } : {}),
                idCommerce,
              },
              required: true,
            },
            {
              model: CommerceTypeModel,
              as: 'commerceType',
              attributes: ['id', 'name'],
              required: false,
            },
            {
              model: FinancialInformation,
              as: 'financialInformation',
              required: false,
              attributes: [
                'id',
                'month1',
                'month2',
                'month3',
                'totalCash',
                'totalPos',
                'totalEcommerce',
                'averagePerMonth',
                'averagePerTransaction',
              ],
            },
            {
              model: LineBusiness,
              as: 'lineBusiness',
              attributes: ['id', 'name', 'lineBussinessBanorte'],
              required: false,
            },
            {
              model: LineBusinessASP,
              as: 'lineBusinessASP',
              attributes: ['id', 'code', 'name'],
              required: false,
            },
            {
              model: CommerceStatus,
              as: 'commerceStatus',
              attributes: ['id', 'name'],
              required: false
            }
          ],
        },
      ],
    };

    return generalInfoRepository
      .findOne(query)
      .then((details) => {
        Glogger.info({
          message: 'Commerce details successfully',
          user: {
            id,
            email,
            idSession
          },
          status: 200
        }, req);
        return res.json(response.successData(details));
      })
      .catch((err) => {
        console.log(err);
        Glogger.error({
          message: 'Error getting commerce details',
          user: {
            id,
            email,
            idSession
          },
          status: 500
        }, req, err);
        return next(response.errorMessage(500, 'Internal Server Error'));
      });
  } catch (err) {
    console.log(err);
    Glogger.error({
      message: 'Error getting commerce details',
      user: {
        id,
        email,
        idSession
      },
      status: 500
    }, req, err);
    return next(response.errorMessage(500, 'Internal Server Error'));
  }
}

module.exports = {
  getEcommerceDetails,
};
