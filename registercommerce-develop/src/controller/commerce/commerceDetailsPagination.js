const { Op } = require('sequelize');
const fetch = require('node-fetch');
const config = require('config');
const generalInfoRepository = require('../../repository/generalInfo');
const {
  organization: Organization,
  roles: Roles,
  commerceType: CommerceType,
  executives: Executives,
  commerces: Commerces,
  contract: Contract
} = require('../../../models');
const { response } = require('../../utils');
const buildReport = require('../../utils/report/report');
const { prepareOrders, prepareSearch } = require('../../utils/database/filters');
const organizationRepository = require('../../repository/organization');
const sendHeaders = require('../../utils/sendHeaders');

const oauthURL = config.get('belugaOauth.base');

const Logger = require('../../utils/logger/GLogger');

const Glogger = new Logger('commerce-details-controller');

function getCommers(req, res, next) {
  const { id, email, idSession } = res.locals.user || { id: null, email: null, idSession: null };
  const idUser = res.locals.user.crole.value <= 250 ? req.params.idUser : res.locals.user.id;
  const {
    limit, page, from, to, search, orderColumn, orderBy
  } = req.query;

  const where = {};

  if (from && to) {
    where.createdAt = {
      [Op.between]: [new Date(Number(from)), new Date(Number(to))]
    };
  }

  const orderConfig = {
    default: '`generalInfo`.`createdAt` DESC',
    columns: [
      {
        table: 'generalInfo',
        column: 'idCommerce'
      }, {
        table: 'generalInfo',
        column: 'email'
      }, {
        table: 'generalInfo',
        column: 'commerceName'
      }, {
        table: 'generalInfo',
        column: 'socialReason'
      }, {
        table: 'generalInfo',
        column: 'nameOfTheNotary'
      }, {
        table: 'generalInfo',
        column: 'createdAt'
      }
    ]
  };

  const searchConfig = {
    columns: [
      {
        table: 'generalInfo',
        column: 'idCommerce'
      }, {
        table: 'generalInfo',
        column: 'email'
      }, {
        table: 'generalInfo',
        column: 'commerceName'
      }, {
        table: 'generalInfo',
        column: 'socialReason'
      }, {
        table: 'generalInfo',
        column: 'nameOfTheNotary'
      }, {
        table: 'generalInfo',
        column: 'createdAt'
      }
    ]
  };

  const searchTable = prepareSearch(searchConfig, search);
  const orderTable = prepareOrders(orderConfig, {
    column: orderColumn,
    order: orderBy
  });

  const options = {
    limit: Number(limit) || 20,
    page: Number(page) || 1,
  };

  const query = {
    order: [orderTable],
    where: {
      ...where,
      ...searchTable,
    },
    include: [
      {
        attributes: ['id', 'idCommerceStatus'],
        model: Commerces,
        as: 'commerce',
      },
      {
        model: Organization,
        as: 'organization',
        where: {
          idUser
        },
      }]
  };

  return generalInfoRepository
    .find(options, query)
    .then((data) => {
      Glogger.info({
        message: 'Get commers successfully.',
        user: {
          id,
          email,
          idSession
        },
        status: 200
      }, req);
      return res.json(response.successData(data));
    })
    .catch((err) => {
      console.log(err);
      Glogger.error({
        message: 'Error getting commers.',
        user: {
          id,
          email,
          idSession
        },
        status: 500
      }, req, err);
      next(response.errorMessage(500, 'Internal Server Error'));
    });
}

function getAllCommerces(req, res, next) {
  let { headers } = req.query;
  const {
    limit,
    page,
    from,
    to,
    search,
    orderColumn,
    orderBy,
    commerceStatus,
    idExecutive,
    idDistributor,
    idGroup,
    idWholesaler,
    idSubDistributor,
    report
  } = req.query;
  const { id, email, idSession } = res.locals.user || { id: null, email: null, idSession: null };

  const where = {};

  if (from && to) {
    where.createdAt = {
      [Op.between]: [new Date(Number(from)), new Date(Number(to))]
    };
  }

  const orderConfig = {
    default: '`generalInfo`.`createdAt` DESC',
    columns: [
      {
        table: 'generalInfo',
        column: 'idCommerce'
      }, {
        table: 'generalInfo',
        column: 'email'
      }, {
        table: 'generalInfo',
        column: 'commerceName'
      }, {
        table: 'generalInfo',
        column: 'socialReason'
      }, {
        table: 'generalInfo',
        column: 'nameOfTheNotary'
      }, {
        table: 'generalInfo',
        column: 'createdAt'
      }
    ]
  };

  const searchConfig = {
    columns: [
      {
        table: 'generalInfo',
        column: 'idCommerce'
      }, {
        table: 'generalInfo',
        column: 'email'
      }, {
        table: 'generalInfo',
        column: 'commerceName'
      }, {
        table: 'generalInfo',
        column: 'socialReason'
      }, {
        table: 'generalInfo',
        column: 'nameOfTheNotary'
      }, {
        table: 'generalInfo',
        column: 'createdAt'
      }
    ]
  };

  const searchTable = prepareSearch(searchConfig, search);
  const orderTable = prepareOrders(orderConfig, {
    column: orderColumn,
    order: orderBy
  });

  const options = {
    limit: Number(limit) || 20,
    page: Number(page) || 1,
  };

  const query = {
    order: [orderTable],
    raw: (report),
    where: {
      ...where,
      ...searchTable,
    },
    include: [{
      model: Commerces,
      attributes: ['id', 'idCommerceStatus', 'origen'],
      as: 'commerce',
      where: {
        idCommerceStatus: commerceStatus || { [Op.in]: [1, 2, 14, 3, 4, 5, 6, 11] },
        ...(idExecutive ? { idExecutive } : ''),
        ...(idDistributor ? { idDistributor } : ''),
        ...(idWholesaler ? { idWholesaler } : ''),
        ...(idSubDistributor ? { idSubDistributor } : ''),
        ...(idGroup ? { idGroup } : ''),
      },
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
          as: 'commerceGroup',
          required: false
        },
        {
          model: Executives,
          attributes: ['id', 'name'],
          as: 'commerceWholesaler',
          required: false
        },
        {
          model: Executives,
          attributes: ['id', 'name'],
          as: 'commerceSubDistributor',
          required: false
        },
        {
          model: CommerceType,
          attributes: ['id', 'name'],
          as: 'commerceType',
          required: false
        },
      ]
    }]
  };

  if (!report) {
    return generalInfoRepository
      .find(options, query)
      .then((data) => {
        Glogger.info({
          message: 'Fcm token found',
          user: {
            id,
            email,
            idSession
          },
          status: 200
        }, req);
        return res.json(response.successData(data));
      })
      .catch((err) => {
        console.log(err);
        Glogger.error({
          message: 'Error getting all commerces.',
          user: {
            id,
            email,
            idSession
          },
          status: 400
        }, req, err);
        next(response.errorMessage(500, 'Internal Server Error'));
      });
  }

  return generalInfoRepository.findRow(query)
    .then((dataQuery) => {
      try {
        headers = JSON.parse(headers);
        return buildReport(dataQuery, headers, ['transactionLogs'])
          .then((resultReport) => {
            Glogger.info({
              message: 'Fcm token found',
              user: {
                id,
                email,
                idSession
              },
              status: 200
            }, req);
            return res.json(response.successData(resultReport.payload));
          })
          .catch((ex) => {
            console.log(ex);
            Glogger.error({
              message: 'Error getting the report of all commerces.',
              user: {
                id,
                email,
                idSession
              },
              status: 500
            }, req, ex);
            return next(response.errorMessage(500, 'Internal Server Error'));
          });
      } catch (err) {
        return next(response.errorMessage(500, 'Internal Server Error'));
      }
    });
}

async function getUsersCommerce(req, res, next) {
  const { id, email, idSession } = res.locals.user || { id: null, email: null, idSession: null };

  try {
    const { idCommerce } = req.params;
    const { limit, page } = req.query;
    const where = {
      idCommerce
    };

    const options = {
      limit: Number(limit) || 20,
      page: Number(page) || 1
    };

    const query = {
      order: [
        ['idUser', 'DESC']
      ],
      where: {
        ...where,
      },
      include: [{
        model: Roles,
        as: 'roleMpos',
        attributes: ['id', 'name'],
        required: true
      }, {
        model: Roles,
        as: 'roleEcommerce',
        attributes: ['id', 'name'],
        required: true
      }, {
        model: Roles,
        as: 'roleTransfer',
        attributes: ['id', 'name'],
        required: true
      }, {
        model: Roles,
        as: 'roleCards',
        attributes: ['id', 'name'],
        required: true
      }]
    };

    const responseOrganization = await organizationRepository.findPaginate(options, query);
    const dataOrganization = responseOrganization.data.map(item => item.dataValues);
    if (dataOrganization.length < 1) {
      const body = {
        payload: {
          pagination: {
            total: 0,
            pages: 1,
            page: 1,
            count: 0
          },
          data: []
        }
      };
      return res.json(response.successData(body.payload));
    }

    const ids = dataOrganization.map(item => item.idUser);
    const resFet = await fetch(
      `${oauthURL}/oauth/admin/users?ids=${JSON.stringify(ids)}&orderColumn=id&orderBy=desc`,
      {
        headers: {
          authorization: req.get('authorization'),
          ...sendHeaders(req)
        }
      }
    );
    const body = await resFet.json();

    const usersPermits = body.payload.data.map((user) => {
      const permits = dataOrganization
        .find(userOrganization => userOrganization.idUser === user.id);
      return {
        ...user,
        permits: {
          Mpos: {
            roleMpos: permits.idRoleMpos,
            nameRole: permits.roleMpos.name
          },
          Ecommerce: {
            roleEcommerce: permits.idRoleEcommerce,
            nameRole: permits.roleEcommerce.name
          },
          Transfer: {
            roleStee: permits.idRoleTransfer,
            nameRole: permits.roleTransfer.name
          },
          Cards: {
            roleStee: permits.idRoleCards,
            nameRole: permits.roleCards.name
          }
        }
      };
    });

    Glogger.info({
      message: 'Get users by commerce',
      user: {
        id,
        email,
        idSession
      },
      status: 200
    }, req);

    return res.json(response.successData({
      ...body.payload,
      data: usersPermits
    }));
  } catch (err) {
    console.log(err);
    Glogger.error({
      message: 'Error getting the report of all commerces.',
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
  getCommers,
  getAllCommerces,
  getUsersCommerce,
};
