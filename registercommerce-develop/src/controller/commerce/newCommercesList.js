const {
  Op,
  fn,
  col,
} = require('sequelize');
const { prepareOrders, prepareSearch } = require('../../utils/database/filters');
const response = require('../../utils/response');
const commerceRepository = require('../../repository/commerce');
const {
  generalInfo: GeneralInfo,
  legalRepresentative: LegalRepresentative,
  commerceStatus: CommerceStatus,
  executives: Executives
} = require('../../../models');


async function getNewCommercesList(req, res, next) {
  const {
    limit,
    page,
    from,
    to,
    search,
    orderColumn,
    orderBy,
    commerceStatus
  } = req.query;

  const where = {};

  if (from && to) {
    where.createdAt = {
      [Op.between]: [new Date(Number(from)), new Date(Number(to))]
    };
  }

  const fourtyDaysAgo = new Date();
  fourtyDaysAgo.setDate(fourtyDaysAgo.getDate() - 40);
  if (Number(from) !== 0 && Number(to) !== 0) {
    where.createdAt = {
      [Op.gte]: fourtyDaysAgo
    };
  }

  const orderConfig = {
    default: '`commerces`.`createdAt` DESC',
    columns: [
      {
        table: 'commerces',
        column: 'id'
      }, {
        table: 'generalInfo',
        column: 'email'
      }, {
        table: 'generalInfo',
        column: 'socialReason'
      }, {
        table: 'commerces',
        column: 'idCommerceType'
      }, {
        table: 'commerces',
        column: 'idCommerceStatus'
      }
    ]
  };

  const searchConfig = {
    columns: [
      {
        table: 'commerces',
        column: 'id'
      }, {
        table: 'generalInfo',
        column: 'socialReason'
      }, {
        table: 'legalRepresentative',
        column: 'name'
      }, {
        table: 'commerces',
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

  try {
    const query = {
      order: [orderTable],
      where: {
        ...where,
        ...searchTable,
        idCommerceStatus: commerceStatus || { [Op.in]: [7, 8, 9, 10, 11, 12, 13, 14, 15] }
      },
      attributes: [
        'id', 'idCommerceStatus', 'idCommerceType', 'createdAt', 'daysInProcess',
        [fn('DATEDIFF', fn('NOW'), col('commerces.createdAt')), 'processDays'],
        [fn('DATEDIFF', fn('NOW'), col('stepAt')), 'stepDays']
      ],
      include: [{
        model: GeneralInfo,
        attributes: ['socialReason', 'commerceName', 'email', 'phone', 'rfc'],
        as: 'generalInfo',
        required: false
      }, {
        model: LegalRepresentative,
        attributes: ['name', 'lastName', 'motherLastName', 'RFC', 'CURP'],
        as: 'legalRepresentative',
        required: false
      }, {
        model: CommerceStatus,
        attributes: ['id', 'name'],
        as: 'commerceStatus',
        required: true
      }, {
        model: Executives,
        attributes: ['id', 'name', 'phone'],
        as: 'commerceExecutive',
        required: false
      }, {
        model: Executives,
        attributes: ['id', 'name', 'phone'],
        as: 'commerceSubDistributor',
        required: false
      }]
    };

    const countQuery = {
      where: {
        ...searchTable,
        createdAt: { [Op.gte]: fourtyDaysAgo },
        idCommerceStatus: {
          [Op.in]: [7, 8, 9, 10, 11, 12, 13, 14, 15]
        }
      },
      group: ['idCommerceStatus'],
      attributes: ['idCommerceStatus',
        [fn('COUNT', col('idCommerceStatus')), 'statusCount'],
      ],
    };

    const statusCount = await commerceRepository.findAll(countQuery);
    const totalCount = statusCount.reduce((sum, item) => sum + parseInt(item.get('statusCount'), 10), 0);

    return commerceRepository.findPaginate(query, options)
      .then((result) => {
        // Glogger.info({
        //   message: 'new commerces info found',
        //   user: {
        //     id,
        //     email
        //   },
        //   status: 200
        // }, req);
        res.status(200).json(response.successData({
          statusCount,
          totalCount,
          ...result
        }));
      })
      .catch((err) => {
        console.log(err);
        return next(response.errorMessage(500, 'Internal Server Error'));
      });
  } catch (error) {
    // Glogger.error({
    //   message: 'Error getting Commerce List',
    //   user: {
    //     id,
    //     email,
    //   },
    //   status: 500
    // }, req, error);
    return next(response.errorMessage(500, 'Internal Server Error'));
  }
}

module.exports = {
  getNewCommercesList
};
