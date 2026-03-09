const response = require('../../utils/response');
const contractRepository = require('../../repository/contract');

const Logger = require('../../utils/logger/GLogger');

const Glogger = new Logger('addendum-controller');

async function deleteContract(req, res) {
  const {
    id,
    email
  } = res.locals.user || { id: null, email: null };
  const { idCommerce } = req.params;

  try {
    await contractRepository.destroy({
      idCommerce,
      deletedAt: null
    });
    return res.status(200).json(response.successMessage(true));
  } catch (error) {
    console.log(error);
    Glogger.error({
      message: 'Error sending addendum.',
      user: {
        id,
        email,
      },
      status: 500
    }, req, error);
  }
}

module.exports = {
  deleteContract,
};
