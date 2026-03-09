const { Op } = require('sequelize');
const response = require('../../utils/response');
const executiveRepository = require('../../repository/executive');
const commerceRepository = require('../../repository/commerce');
const { prepareSearch, prepareOrders } = require('../../utils/database/filters');
const { executives: Executives } = require('../../../models');

const Logger = require('../../utils/logger/GLogger');

const Glogger = new Logger('executives-controller');

function getExecutives(req, res, next) {
  const { id, email, idSession } = res.locals.user || { id: null, email: null, idSession: null };
  executiveRepository
    .findAll({
      attributes: ['id', 'name', 'roleExecutive', 'roleDistributor', 'roleSubDistributor', 'roleGroup', 'roleWholesaler'],
    })
    .then((data) => {
      const groupedExecutives = {
        allRoles: data,
        roleExecutive: data.filter(exec => exec.roleExecutive),
        roleDistributor: data.filter(exec => exec.roleDistributor),
        roleSubDistributor: data.filter(exec => exec.roleSubDistributor),
        roleGroup: data.filter(exec => exec.roleGroup),
        roleWholesaler: data.filter(exec => exec.roleWholesaler),
      };

      Glogger.info({
        message: 'Get executives successfully.',
        user: {
          id,
          email,
          idSession
        },
        status: 200
      }, req);
      res.json(response.successData(groupedExecutives));
    })
    .catch((err) => {
      console.log(err);
      Glogger.error({
        message: 'Error getting executives.',
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

async function getRoleExecutives(req, res, next) {
  const {
    limit,
    page,
    from,
    to,
    search,
    orderColumn,
    orderBy,
    roleExecutive,
    roleDistributor,
    roleGroup,
    roleWholesaler
  } = req.query;
  const { id, email, idSession } = res.locals.user || { id: null, email: null, idSession: null };

  let where = {};
  if (from && to) {
    where = {
      createdAt: {
        [Op.between]: [new Date(Number(from)), new Date(Number(to))],
      }
    };
  }

  const orderConfig = {
    default: '`executives`.`id` DESC',
    columns: [
      {
        table: 'executives',
        column: 'name',
      },
      {
        table: 'executives',
        column: 'id',
      },
      {
        table: 'roles',
        column: 'name',
      },
      {
        table: 'roles',
        column: 'id',
      },
    ],
  };

  const searchConfig = {
    columns: [
      {
        table: 'executives',
        column: 'name',
      },
      {
        table: 'roles',
        column: 'name',
      },
    ],
  };

  const searchTable = prepareSearch(searchConfig, search);
  const orderTable = prepareOrders(orderConfig, {
    column: orderColumn,
    order: orderBy,
  });
  const options = {
    limit: Number(limit) || 20,
    page: Number(page) || 1,
  };

  const query = {
    order: [orderTable],
    where: {
      ...(roleExecutive && { roleExecutive: true }),
      ...(roleDistributor && { roleDistributor: true }),
      ...(roleGroup && { roleGroup: true }),
      ...(roleWholesaler && { roleWholesaler: true }),
      ...where,
      ...searchTable,
    },
    include: [
      {
        model: Executives,
        as: 'partner',
        attributes: ['id', 'name'],
      },
    ],
  };

  return executiveRepository
    .findPagination(options, query)
    .then((data) => {
      Glogger.info({
        message: 'Get role executives successfully.',
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
        message: 'Error getting role executives.',
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

async function getDistributor(req, res, next) {
  const { idCommerce } = req.params;
  if (!idCommerce) {
    return res.json(response.errorMessage(400, 'Missing fields'));
  }

  const { type } = req.body;
  const { id, email } = res.locals.user || { id: null, email: null };

  // const field = types[type] || 'pisoMpos';

  return commerceRepository.findOne({
    include: [
      {
        model: Executives,
        as: 'commerceDistributor',
        attributes: ['id', 'name', [type, 'piso']],
      },
      {
        model: Executives,
        attributes: ['id', 'name', [type, 'piso']],
        as: 'commerceSubDistributor',
        required: false
      },
    ],
    attributes: [
      'id',
    ],
    where: {
      id: idCommerce
    }
  })
    .then((data) => {
      Glogger.info({
        message: 'Get commerce executives successfully.',
        user: {
          id,
          email
        },
        status: 200
      }, req);
      return res.json(response.successData(data));
    })
    .catch((err) => {
      console.log(err);
      Glogger.error({
        message: 'Error getting commerce executives.',
        user: {
          id,
          email,
        },
        status: 500
      }, req, err);
      next(response.errorMessage(500, 'Internal Server Error'));
    });
}

module.exports = {
  getExecutives,
  getRoleExecutives,
  getDistributor
};
