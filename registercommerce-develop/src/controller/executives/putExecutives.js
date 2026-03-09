const response = require('../../utils/response');
const executiveRepository = require('../../repository/executive');
const Logger = require('../../utils/logger/GLogger');

const Glogger = new Logger('executives-controller');

function updateExecutive(req, res) {
  const { id, email, idSession } = res.locals.user || { id: null, email: null, idSession: null };
  const { idExecutive } = req.params;
  const { updateData } = req.body;

  const where = {
    id: idExecutive,
  };

  return executiveRepository
    .update({
      idPartner: updateData.idPartner ? updateData.idPartner : null,
      phone: updateData.phone
    }, where)
    .then((update) => {
      if (!update) {
        Glogger.error({
          message: 'Error updating executive.',
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
        message: 'Executive updated successfully.',
        user: {
          id,
          email,
          idSession
        },
        status: 200
      }, req);
      return res.json(response.successData(update));
    })
    .catch((err) => {
      console.log(err);
      Glogger.error({
        message: 'Error updating executive.',
        user: {
          id,
          email,
          idSession
        },
        status: 500
      }, req);
      return res.status(500).json(response.errorMessage(500, 'Internal Server Error'));
    });
}

module.exports = {
  updateExecutive
};
