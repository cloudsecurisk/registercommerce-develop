const response = require('../../utils/response');
const { findOne, update } = require('../../repository/amexRecords');
const commerceSettingsRepository = require('../../repository/commerceSettings');

async function getAmexRecords(req, res, next) {
  try {
    return res.status(200).json(response.successData(await findOne({
      where: {
        id: 1
      }
    })));
  } catch (error) {
    console.log(error);
    return next(response.errorMessage(500, 'Internal Server Error'));
  }
}

async function getRecordFiles(req, res, next) {
  try {
    return res.status(200).json(response.successData(await commerceSettingsRepository.findOne({
      where: {
        idCommerce: req.params.idEcommerce
      }
    })));
  } catch (error) {
    console.log(error);
    return next(response.errorMessage(500, 'Internal Server Error'));
  }
}

async function updateAmexRecords(req, res, next) {
  try {
    const { amexRecord, submmisionFileRecord } = req.body;
    const where = {
      id: 1
    };
    return res.status(200).json(response.successData(await update({
      amexRecord, submmisionFileRecord
    }, where)));
  } catch (error) {
    console.log(error);
    return next(response.errorMessage(500, 'Internal Server Error'));
  }
}

async function updateRecordFile(req, res, next) {
  try {
    const { idCommerce } = req.params;
    console.log(idCommerce);
    const where = {
      idCommerce
    };
    return res.status(200).json(response.successData(
      await commerceSettingsRepository.increment(where)
    ));
  } catch (error) {
    console.log(error);
    return next(response.errorMessage(500, 'Internal Server Error'));
  }
}


module.exports = {
  getAmexRecords,
  updateAmexRecords,
  getRecordFiles,
  updateRecordFile
};
