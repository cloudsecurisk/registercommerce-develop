const response = require('../../utils/response');
const executiveRepository = require('../../repository/executive');
const { Roles } = require('../../constants/index');
const Logger = require('../../utils/logger/GLogger');

const Glogger = new Logger('executives-controller');


function createExecutive(req, res, next) {
  const { id, email, idSession } = res.locals.user || { id: null, email: null, idSession: null };
  try {
    const { executiveData } = req.body;

    const executiveDataToSave = {
      name: executiveData.name,
      idPartner: executiveData && Number(executiveData.partner)
        ? executiveData.partner : null,
      phone: executiveData.phone,
      roleExecutive: executiveData.roleExecutive,
      roleDistributor: executiveData.roleDistributor,
      roleGroup: executiveData.roleGroup
    };
    return executiveRepository.saveExecutive(executiveDataToSave)
      .then((save) => {
        if (!save) {
          Glogger.error({
            message: 'Error creating executive.',
            user: {
              id,
              email,
              idSession
            },
            status: 500
          }, req);
          return res.json(response.errorMessage(500, 'Internal Server Error'));
        }
        Glogger.info({
          message: 'Executive created successfully.',
          user: {
            id,
            email,
            idSession
          },
          status: 200
        }, req);
        return res.json(response.successData(save));
      });
  } catch (error) {
    Glogger.error({
      message: 'Error creating executive.',
      user: {
        id,
        email,
        idSession
      },
      status: 500
    }, req, error);
    return next(res.json(response.errorMessage(500, 'Internal Server Error')));
  }
}

function assignRoleExecutive(req, res) {
  const { id, email, idSession } = res.locals.user || { id: null, email: null, idSession: null };
  const { idExecutive } = req.params;
  const { data } = req.body;

  if (!data) {
    Glogger.error({
      message: 'Error updating role executive, missing fields.',
      user: {
        id,
        email,
        idSession
      },
      status: 500
    }, req);
    return res.status(400).json(response.errorMessage(400, 'Missing fields'));
  }

  const where = {
    id: idExecutive
  };
  const roleToUpdate = {};
  Object.entries(data).forEach(([key, value]) => {
    if (Roles[key.toUpperCase()] !== undefined) {
      roleToUpdate[Roles[key.toUpperCase()]] = value;
    }
  });

  if (Object.keys(roleToUpdate).length === 0) {
    Glogger.error({
      message: 'Error updating role executive, invalid role.',
      user: {
        id,
        email,
        idSession
      },
      status: 500
    }, req);
    return res.status(400).json(response.errorMessage(400, 'Invalid role value'));
  }

  return executiveRepository
    .update(roleToUpdate, where)
    .then((save) => {
      if (!save) {
        Glogger.error({
          message: 'Error updating role executive.',
          user: {
            id,
            email,
            idSession
          },
          status: 500
        }, req);
        return res.status(500).json(response.errorMessage(500, 'Internal Server Error'));
      }
      Glogger.info({
        message: 'Role executive updated successfully.',
        user: {
          id,
          email,
          idSession
        },
        status: 200
      }, req);

      return res.status(200).json(response.successData(save));
    })
    .catch((error) => {
      console.log(error);
      Glogger.error({
        message: 'Error updating role executive.',
        user: {
          id,
          email,
          idSession
        },
        status: 500
      }, req, error);
      return res.status(500).json(response.errorMessage(500, 'Error updating role'));
    });
}

module.exports = {
  assignRoleExecutive,
  createExecutive,
};
