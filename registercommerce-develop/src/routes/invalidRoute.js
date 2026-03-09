
const { getPayloadToken } = require('../controller/tokens');
const Logger = require('../utils/logger/GLogger');

const Glogger = new Logger('endpoint-doesnt-exist');

function invalidReoute(req, res) {
  const payload = req.headers.authorization ? getPayloadToken(req.headers.authorization) : null;
  const apikey = req.get('x-api-key');

  let email = null;
  let id = null;

  if (payload && payload.email) {
    ({ email } = payload);
  } else if (req.body && req.body.email) {
    ({ email } = req.body);
  }

  if (payload && payload.id) {
    ({ id } = payload);
  } else if (req.body && req.body.id) {
    ({ id } = req.body);
  }

  Glogger.warning({
    message: `The ${req.originalUrl} endpoint doesn't exist`,
    user: {
      email,
      id,
      apikey
    },
    status: 404,
  }, req);
  return res.status(404).json({
    code: 404,
    msg: `The ${req.originalUrl} endpoint doesn't exist`,
    errorCode: 0
  });
}

module.exports = invalidReoute;
