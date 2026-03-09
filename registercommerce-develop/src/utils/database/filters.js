const sequelize = require('sequelize');
const { Op } = require('sequelize');
const { removeSpecialCharacters } = require('../../utils/validations/generalValidation');

/**
 * prepareOrders
 * Create mysql structure to sort a query
 * @param {Object} orderConfig Columns that can be sorted, example: {
 *  default: '`transactions`.`createdAt` DESC',
 *  columns: [
 *    {
 *      table: 'transactions',
 *      column: 'id'
 *    }
 *  ]
 * }
 * @param {Object} order Column that will be sorted, example: {
 *    column: orderColumn,
 *    order: orderBy
 * }
 * @return {Object} An sequelize object to sort a query
 */
function prepareOrders(orderConfig = {}, order) {
  const validDirections = ['ASC', 'DESC'];

  if (order && orderConfig && orderConfig.columns) {
    const columntToOrder = orderConfig.columns
      .find(orderList => orderList.column === order.column);

    if (columntToOrder && validDirections.includes(order.order.toUpperCase())) {
      return [
        [sequelize.col(`${columntToOrder.table}.${columntToOrder.column}`), order.order.toUpperCase()]
      ];
    }
  }

  // Si hay valor por default (ya es un literal), valida que sea seguro también
  if (orderConfig.default) {
    return sequelize.literal(orderConfig.default);
  }

  return null;
}

/**
 * prepareSearch
 * Create mysql structure to search in a query
 * @param {Object} searchConfig Columns where information is sought, example: [
 *    {
 *      table: 'transactions',
 *      column: 'id'
 *    }
 * ]
 * @param {Object} search Word to search
 * @return {Object} An sequelize object to search in a query
 */
function prepareSearch(searchConfig = {}, search) {
  const response = [];
  if (search) {
    let wordsToSearch = removeSpecialCharacters(search);
    wordsToSearch = wordsToSearch.trim();
    if (wordsToSearch && searchConfig && searchConfig.columns) {
      searchConfig.columns.forEach((column) => {
        response.push({
          [`$${column.table}.${column.column}$`]: {
            [Op.like]: `%${wordsToSearch}%`
          }
        });
      });
    }
    return {
      [Op.or]: response
    };
  }

  return {};
}

module.exports = {
  prepareOrders,
  prepareSearch
};
