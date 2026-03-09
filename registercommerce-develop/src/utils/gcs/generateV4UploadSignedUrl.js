const { Storage } = require('@google-cloud/storage');

async function generateV4UploadSignedUrl(bucketName, fileName, expirationMinutes, contentType = 'application/octet-stream') {
  const storage = new Storage();
  const options = {
    version: 'v4',
    action: 'write',
    expires: Date.now() + expirationMinutes * 60 * 1000,
    contentType
  };

  const [url] = await storage
    .bucket(bucketName)
    .file(fileName)
    .getSignedUrl(options);

  return url;
}

module.exports = generateV4UploadSignedUrl;
