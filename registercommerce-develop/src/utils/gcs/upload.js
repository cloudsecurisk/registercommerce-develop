const fs = require('fs');
const storage = require('./storage');

const defaultOptions = {
  gzip: 'auto',
  resumable: false
};

// TODO: test for memory leaks
/**
 * upload
 * Upload a file to google cloud storage (buckets)
 * @param {string} path - temporal file path
 * @param {string} key - required file key
 * @param {object} options - options to save file
 * @returns {object} result - { filename, key }
 */
function upload(bucket, path, bucketPath, name, key, options = defaultOptions) {
  return new Promise((resolve, reject) => {
    const file = storage().bucket(bucket).file(`${bucketPath}${name}`);
    fs.createReadStream(path)
      .pipe(file.createWriteStream(options))
      .on('error', reject)
      .on('finish', () => {
        resolve({ filename: name, key: key || '' });
      });
  });
}

function uploadStream(bucket, fileStream, bucketPath, name, key, options = defaultOptions) {
  return new Promise((resolve, reject) => {
    const file = storage().bucket(bucket).file(`${bucketPath}${name}`);
    fileStream
      .pipe(file.createWriteStream(options))
      .on('error', reject)
      .on('finish', () => {
        resolve({ filename: name, key: key || '' });
      });
  });
}

/**
 * uploadFiles
 * Upload a list of files to google cloud storage (buckets)
 * @param {object} files - files object from request
 * @param {Object} options - options to save files
 * @returns {Array<Promise>} { filename, key }
 */
function uploadFiles(files) {
  return Promise.all(
    files.map(({
      bucket, path, bucketPath, name, key
    }) => upload(bucket, path, bucketPath, name, key))
  );
}

module.exports = {
  upload,
  uploadFiles,
  uploadStream,
};
