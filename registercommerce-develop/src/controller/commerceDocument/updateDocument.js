const config = require('config');
const { v4: uuidv4 } = require('uuid');
const response = require('../../utils/response');
const upload = require('../../utils/gcs/upload');
const CommerceDocument = require('../../repository/commerceDocument');

const bucketName = config.get('bucket.name');
const bucketUrl = config.get('bucket.url');
const bucketFolder = config.get('bucket.commerceDocuments');


const Logger = require('../../utils/logger/GLogger');

const Glogger = new Logger('documents-controller');

async function updateCommerceDocument(req, res, next) {
  const { id, email, idSession } = res.locals.user || { id: null, email: null, idSession: null };

  const idCommerce = req.params.id;
  try {
    const files = Object
      .keys(req.files)
      .map(key => ({
        bucket: bucketName,
        path: req.files[key].path,
        bucketPath: `${bucketFolder}${idCommerce}/`,
        name:
          `${key}-${uuidv4()}.${req.files[key].name.split('.')[req.files[key].name.split('.').length - 1]}`,
        key
      }));
    let savedFiles = await upload.uploadFiles(files);
    savedFiles = savedFiles
      .reduce((acc, file) => ({
        ...acc,
        [file.key]: `${bucketUrl}${bucketName}/${bucketFolder}${idCommerce}/${file.filename}`
      }), {});

    const commerceDocuments = await CommerceDocument.find({
      where: {
        idCommerce
      }
    });
    if (commerceDocuments.length > 0) {
      const documents = await CommerceDocument
        .update(savedFiles, {
          where: {
            idCommerce
          }
        });
      Glogger.info({
        message: 'Commerce documents updated successfully.',
        user: {
          id,
          email,
          idSession
        },
        status: 200
      }, req);
      return res.json(response.successData(documents));
    }
    const documents = await CommerceDocument.save({
      idCommerce,
      ...savedFiles
    });
    Glogger.info({
      message: 'Commerce documents created successfully.',
      user: {
        id,
        email,
        idSession
      },
      status: 200
    }, req);
    return res.json(response.successData(documents));
  } catch (ex) {
    console.log(ex);
    Glogger.error({
      message: 'Error updating commerce documents.',
      user: {
        id,
        email,
        idSession
      },
      status: 500
    }, req, ex);
    return next(response.errorMessage(500, 'Internal Server Error'));
  }
}

module.exports = {
  updateCommerceDocument
};
