const response = require('../utils/response');
const organizationRepository = require('../repository/organization');
const Logger = require('../utils/logger/GLogger');

const Glogger = new Logger('organizations-controller');


function createOrganization(req, res, next) {
  const { id, email, idSession } = res.locals.user || { id: null, email: null, idSession: null };
  const {
    idCommerce,
    idUser,
    idRoleMpos,
    idRoleEcommerce,
    idRoleTransfer,
    idRoleCards
  } = req.body;

  if (
    !idCommerce
    || !idUser
    || !idRoleMpos
    || !idRoleEcommerce
    || !idRoleTransfer
    || !idRoleCards
  ) {
    Glogger.error({
      message: 'Error creating organization, missing fields.',
      user: {
        id,
        email,
        idSession
      },
      status: 400
    }, req);
    return next(res.status(400).json(response.errorMessage(400, 'Missing fields')));
  }

  if (
    res.locals.user.crole.value > 100
    && (
      Number(idRoleMpos) === 1
      || Number(idRoleEcommerce) === 1
      || Number(idRoleTransfer) === 1
      || Number(idRoleCards) === 1
    )
  ) {
    Glogger.error({
      message: 'Error creating organization, not authorized.',
      user: {
        id,
        email,
        idSession
      },
      status: 500
    }, req);
    return next(response.errorMessage(403, 'Not authorized'));
  }
  return organizationRepository
    .save({
      idCommerce,
      idUser,
      idRoleMpos,
      idRoleEcommerce,
      idRoleTransfer,
      idRoleCards
    })
    .then((result) => {
      Glogger.info({
        message: 'Organization created successfully.',
        user: {
          id,
          email,
          idSession
        },
        status: 200
      }, req);
      return res.json(response.successData(result));
    })
    .catch((err) => {
      console.log(err);
      Glogger.error({
        message: 'Error creating commerce.',
        user: {
          id,
          email,
          idSession
        },
        status: 500
      }, req, err);
      return next(res.status(409).json(response.errorMessage(409, err.message)));
    });
}

async function removeUserFromOrganization(req, res, next) {
  const { id, email, idSession } = res.locals.user || { id: null, email: null, idSession: null };
  const { idCommerce } = req.params;
  const { idUser } = req.query;

  if (!idCommerce || !idUser) {
    Glogger.error({
      message: 'Error removing user from organization, missing fields.',
      user: {
        id,
        email,
        idSession
      },
      status: 400
    }, req);
    return res.json(response.errorMessage(400, 'Missing fields'));
  }

  const where = {
    idCommerce,
    idUser
  };

  return organizationRepository.destroy({ where })
    .then(() => {
      Glogger.info({
        message: 'User removed from organization successfully.',
        user: {
          id,
          email,
          idSession
        },
        status: 200
      }, req);
      res.json(response.successMessage('User removed'));
    })
    .catch((err) => {
      console.log(err);
      Glogger.error({
        message: 'Error removing user from organization,',
        user: {
          id,
          email,
          idSession
        },
        status: 400
      }, req);
      return next(response.errorMessage(500, 'Internal Server Error'));
    });
}

async function updateOrganizationStatus(req, res) {
  const { idCommerce } = req.params;
  const { idOrganizationStatus } = req.body;

  return organizationRepository
    .update({ idOrganizationStatus }, { where: idCommerce })
    .then((result) => {
      if (result[0] === 0) {
        res.status(400).json(response.errorMessage(400, 'Error updating organization status'));
      }
      res.status(200).json(response.successMessage('Organization status updated'));
    });
}

module.exports = {
  createOrganization,
  removeUserFromOrganization,
  updateOrganizationStatus
};
