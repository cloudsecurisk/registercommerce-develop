const { Op } = require('sequelize');
const response = require('../../utils/response');
const organizationRepository = require('../../repository/organization');

const {
  roles: Roles,
  generalInfo: GeneralInfo,
  commerces: Commerces
} = require('../../../models');

const Logger = require('../../utils/logger/GLogger');

const Glogger = new Logger('commerce-controller');

function getCommercePermits(req, res, next) {
  const { user } = res.locals;
  const { id, email, idSession } = user || { id: null, email: null, idSession: null };

  try {
    const { idCommerce } = req.params;
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
      required: false
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
        ...(user.id && user.crole.value >= 300 && user.crole.value !== 440)
          ? { idUser: user.id } : {},
        idCommerce
      },
      attributes: [
        ...(user.id && user.crole.value >= 300 && user.crole.value !== 440) ? ['idUser'] : [],
        'idCommerce'
      ],
      required: true,
      include: [{
        model: Commerces,
        as: 'commerce',
        attributes: ['id'],
        required: true,
        include: [{
          model: GeneralInfo,
          as: 'generalInfo',
          attributes: ['socialReason'],
          required: true,
        }]
      },
      ...include]
    };

    return organizationRepository.findOne(query)
      .then((commerceInfoPermits) => {
        if (!commerceInfoPermits) {
          Glogger.error({
            message: 'Error getting commerce permits',
            user: {
              id,
              email,
              idSession
            },
            status: 501
          }, req);
          return next(response.errorMessage(404, 'Not Found'));
        }
        const commerceInfo = commerceInfoPermits.get({ plain: true });
        Glogger.info({
          message: 'Success getting commerce permits',
          user: {
            id,
            email,
            idSession
          },
          status: 200
        }, req);
        return res.json(response.successData({
          user,
          commerce: commerceInfo
        }));
      })
      .catch((err) => {
        console.log(err);
        Glogger.error({
          message: 'Error getting commerce permits',
          user: {
            id,
            email,
            idSession
          },
          status: 501
        }, req, err);
        return next(response.errorMessage(501, 'Internal Server Error'));
      });
  } catch (error) {
    console.log(error);
    Glogger.error({
      message: 'Error getting commerce permits',
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
  getCommercePermits
};
