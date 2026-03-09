function getPayloadToken(bearerToken) {
  try {
    const token = bearerToken.split('.');
    const payloadBase64 = token[1];
    const payloadJson = Buffer.from(payloadBase64, 'base64url').toString('utf-8');
    return JSON.parse(payloadJson);
  } catch (error) {
    return null;
  }
}

module.exports = {
  getPayloadToken
};
