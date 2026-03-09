const { Storage } = require('@google-cloud/storage');

async function moveFile(bucketName, srcFileName, destFileName) {
  const storage = new Storage();
  const bucket = storage.bucket(bucketName);
  const file = bucket.file(srcFileName);

  try {
    const [newFile] = await file.rename(destFileName);

    return newFile;
  } catch (error) {
    throw error;
  }
}

module.exports = moveFile;
