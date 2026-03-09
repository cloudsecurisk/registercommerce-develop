const { Op } = require('sequelize');
const generalInfoRepository = require('../../repository/generalInfo');
const addressRepository = require('../../repository/addresses');
const legalRepresentativeRepository = require('../../repository/legalRepresentative');
const financialInformationRepository = require('../../repository/financialInformation');
const commerceRepository = require('../../repository/commerce');
const response = require('../../utils/response');

const Logger = require('../../utils/logger/GLogger');

const Glogger = new Logger('commerce-controller');

async function updateCommerceDatails(req, res, next) {
  const { idCommerce } = req.params;
  const { details } = req.body;
  const { id, email, idSession } = res.locals.user || { id: null, email: null, idSession: null };


  let where = {};

  if (details.idLineBusiness || details.idLineBusinessASP || details.idLineBusinessSGS) {
    const { idLineBusiness, idLineBusinessASP, idLineBusinessSGS } = details;
    where = {
      id: idCommerce
    };

    await commerceRepository
      .update({ idLineBusiness, idLineBusinessASP, idLineBusinessSGS }, where);
  }

  where = {
    idCommerce
  };

  return generalInfoRepository.update({
    ...details,
    ...details.notaryCity ? { notaryCity: details.notaryCity } : { notaryCity: null }
  }, where)
    .then((result) => {
      Glogger.info({
        message: 'Commerce details updated successfully.',
        user: {
          id,
          email,
          idSession,
        },
        status: 200
      }, req);
      return res.json(response.successData({ updated: result[0] === 1 }));
    }).catch((err) => {
      console.log(err);
      Glogger.error({
        message: 'Error updating commerce details.',
        user: {
          id,
          email,
          idSession
        },
        status: 500
      }, req, err);
      return next(response.errorMessage(500, 'Internal Server Error'));
    });
}

async function updateCommerceAddress(req, res, next) {
  const { idAddress } = req.query;
  const { addressDetails } = req.body;
  const { id, email, idSession } = res.locals.user || { id: null, email: null, idSession: null };

  const where = {
    id: idAddress
  };

  return addressRepository.update(addressDetails, where)
    .then((result) => {
      Glogger.info({
        message: 'Commerce address updated successfully.',
        user: {
          id,
          email,
          idSession
        },
        status: 200
      }, req);
      return res.json(response.successData({ updated: result[0] === 1 }));
    }).catch((err) => {
      console.log(err);
      Glogger.error({
        message: 'Error updating commerce address.',
        user: {
          id,
          email,
          idSession
        },
        status: 500
      }, req, err);
      return next(response.errorMessage(500, 'Internal Server Error'));
    });
}

async function updateLegalRepresentative(req, res, next) {
  const { id, email, idSession } = res.locals.user || { id: null, email: null, idSession: null };
  const { idLegalRepre } = req.params;
  const { infoDetails } = req.body;
  const where = {
    id: idLegalRepre
  };

  return legalRepresentativeRepository.update(infoDetails, where)
    .then((result) => {
      Glogger.info({
        message: 'Legal representative updated successfully.',
        user: {
          id,
          email,
          idSession
        },
        status: 200
      }, req);
      return res.json(response.successData({ updated: result[0] === 1 }));
    })
    .catch((err) => {
      console.log(err);
      Glogger.error({
        message: 'Error updating legal representative.',
        user: {
          id,
          email,
          idSession
        },
        status: 500
      }, req, err);
      return next(response.errorMessage(500, 'Internal Server Error'));
    });
}

async function updateFinancialInformation(req, res, next) {
  const { id, email, idSession } = res.locals.user || { id: null, email: null, idSession: null };
  const { idCommerce } = req.params;
  const { financialInfo } = req.body;

  const where = {
    idCommerce
  };

  return financialInformationRepository.update(financialInfo, where)
    .then((result) => {
      Glogger.info({
        message: 'Financial information updated successfully.',
        user: {
          id,
          email,
          idSession
        },
        status: 200
      }, req);
      res.json(response.successData({ updated: result[0] === 1 }));
    })
    .catch((err) => {
      console.log(err);
      Glogger.error({
        message: 'Error updating financial information.',
        user: {
          id,
          email,
          idSession
        },
        status: 500
      }, req, err);
      next(response.errorMessage(500, 'Internal Server. Error'));
    });
}

async function updateExecutives(req, res) {
  const { id, email, idSession } = res.locals.user || { id: null, email: null, idSession: null };
  const { idExecutive, executiveType } = req.body;
  const { idCommerce } = req.params;

  const where = {
    id: idCommerce
  };

  const attributes = {
    [executiveType]: idExecutive
  };

  try {
    return commerceRepository.update(attributes, where)
      .then((updated) => {
        if (updated[0] !== 1) {
          Glogger.error({
            message: 'Error updating executive.',
            user: {
              id,
              email,
              idSession
            },
            status: 400
          }, req);
          return res.status(400).json(response.errorMessage(400, 'Error updating executive'));
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
        return res.status(200).json(response.successData(updated));
      });
  } catch (error) {
    console.error('Internal Server Error:', error);
    Glogger.error({
      message: 'Error updating executive',
      user: {
        id,
        email,
        idSession
      },
      status: 500
    }, req, error);
    return res.status(500).json(response.errorMessage(500, 'Internal Server Error'));
  }
}

async function updateCommerceStatus(req, res) {
  const { daysInProcess } = req.query;
  const {
    id,
    email,
    idSession,
    idRole
  } = res.locals.user || { id: null, email: null, idSession: null };
  const { idCommerceStatus } = req.body;

  const idCommerce = req.params.idCommerce === 'null' ? req.body.idCommerces : req.params.idCommerce;
  const where = {
    ...(Array.isArray(idCommerce)
      ? {
        id: {
          [Op.in]: idCommerce
        }
      } : {
        id: idCommerce
      })
  };
  const attributes = {
    idCommerceStatus,
    stepAt: new Date().toISOString(),
    ...(idCommerceStatus === 12
      || idCommerceStatus === 13
      || idCommerceStatus === 14 ? { daysInProcess } : {})
  };

  if (idRole === 2 && idCommerceStatus !== 9) {
    return res.status(403).json(
      response.errorMessage(403, 'No tienes permiso para actualizar este estado del comercio')
    );
  }

  try {
    return await commerceRepository.update(attributes, where)
      .then((updated) => {
        if (updated[0] === 0) {
          Glogger.error({
            message: 'Error updating commerce status.',
            user: {
              id,
              email,
              idSession
            },
            status: 500
          }, req);
          return res.status(400).json(response.errorMessage(400, 'Error updating commerce status'));
        }

        Glogger.info({
          message: 'Commerce status updated successfully.',
          user: {
            id,
            email,
            idSession
          },
          status: 200
        }, req);
        return res.status(200).json(response.successMessage(`${updated[0]} solicitud(es) actualizada(s).`));
      });
  } catch (error) {
    console.error('Internal Server Error:', error);
    Glogger.error({
      message: 'Error updating commerce status.',
      user: {
        id,
        email,
        idSession
      },
      status: 500
    }, req, error);

    return res.status(500).json(response.errorMessage(500, 'Internal Server Error'));
  }
}

module.exports = {
  updateCommerceDatails,
  updateCommerceAddress,
  updateLegalRepresentative,
  updateFinancialInformation,
  updateExecutives,
  updateCommerceStatus
};
