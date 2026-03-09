const { Op } = require('sequelize');
const response = require('../../utils/response');
const organizationRepository = require('../../repository/organization');

const {
  roles: Roles
} = require('../../../models');

const Logger = require('../../utils/logger/GLogger');

const Glogger = new Logger('commerce-controller');

function getCommerceList(req, res, next) {
  const { user } = res.locals;
  const { id, email, idSession } = res.locals.user || { id: null, email: null, idSession: null };

  try {
    const {
      module
    } = req.query;

    let include = [{
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
    }];
    if (module === 'mpos' && user.id && user.crole.value >= 300) {
      include = [{
        model: Roles,
        as: 'roleMpos',
        attributes: ['id', 'name'],
        required: true,
        where: {
          id: {
            [Op.ne]: 0
          }
        }
      }];
    } else if (module === 'ecommerce' && user.id && user.crole.value >= 300) {
      include = [{
        model: Roles,
        as: 'roleEcommerce',
        attributes: ['id', 'name'],
        required: true,
        where: {
          id: {
            [Op.ne]: 0
          }
        }
      }];
    } else if (module === 'transfer' && user.id && user.crole.value >= 300) {
      include = [{
        model: Roles,
        as: 'roleTransfer',
        attributes: ['id', 'name'],
        required: true,
        where: {
          id: {
            [Op.ne]: 0
          }
        }
      }];
    } else if (module === 'cardManager' && user.id && user.crole.value >= 300) {
      include = [{
        model: Roles,
        as: 'roleCards',
        attributes: ['id', 'name'],
        required: true,
        where: {
          id: {
            [Op.ne]: 0
          }
        }
      }];
    }
    const query = {
      where: {
        ...(user.id && user.crole.value >= 300) ? { idUser: user.id } : {}
      },
      attributes: [
        ...(user.id && user.crole.value >= 300) ? ['idUser'] : [],
        'idCommerce'
      ],
      required: true,
      include
    };
    return organizationRepository.findAll(query)
      .then((commerceList) => {
        Glogger.info({
          message: 'Get Commerce List',
          user: {
            id,
            email,
            idSession
          },
          status: 200
        }, req);
        return res.json(response.successData(commerceList));
      })
      .catch((err) => {
        Glogger.error({
          message: 'Error getting Commerce List',
          user: {
            id,
            email,
            idSession
          },
          status: 500
        }, req, err);
        next(response.errorMessage(501, 'Internal Server Error'));
      });
  } catch (error) {
    console.log(error);
    Glogger.error({
      message: 'Error getting Commerce List',
      user: {
        id,
        email,
        idSession
      },
      status: 500
    }, req, error);
    return next(response.errorMessage(500, 'Internal Server Error'));
  }
}

module.exports = {
  getCommerceList
};
