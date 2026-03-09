const { Storage } = require('@google-cloud/storage');

let storage = null;

function getStorage() {
  if (storage) {
    return storage;
  }
  storage = new Storage();
  return storage;
}

module.exports = getStorage;
