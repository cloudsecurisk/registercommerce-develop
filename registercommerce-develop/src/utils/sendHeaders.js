

module.exports = function headers(req) {
  const device = req.headers['espiral-device'];
  const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress || req.ip;
  const userAgent = req.headers['user-agent'];

  const originUrl = req.headers['X-Origin-URL'] || req.originalUrl;

  return {
    'espiral-device': device,
    'x-forwarded-for': ip,
    'user-agent': userAgent,
    'X-Caller-URL': req.originalUrl,
    'X-Origin-URL': originUrl,
  };
};
