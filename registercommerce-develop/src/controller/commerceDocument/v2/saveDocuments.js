const config = require('config');
const { v4: uuidv4 } = require('uuid');
const response = require('../../../utils/response');
const { findOne, save } = require('../../../repository/v2/commerceDocument');
const { uploadFiles } = require('../../../utils/gcs/upload');
const generateV4UploadSignedUrl = require('../../../utils/gcs/generateV4UploadSignedUrl');

const bucketName = config.get('bucket.name');
const bucketUrl = config.get('bucket.url');
const bucketFolder = config.get('bucket.commerceDocuments');

const bucketNameSublai = config.get('bucketSublai.name');

async function createCommerceDocumentV2(req, res, next) {
  // const { id, email } = res.locals.user || { id: null, email: null };
  const { idCommerce } = req.params;
  const { idDocumentType } = req.fields;
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
    let savedFiles = await uploadFiles(files);
    savedFiles = savedFiles
      .reduce((acc, file) => ({
        ...acc,
        [file.key]: `${bucketUrl}${bucketName}/${bucketFolder}${idCommerce}/${file.filename}`
      }), {});

    const commerceDocument = await findOne({
      raw: true,
      nest: true,
      where: {
        idDocumentType,
        idCommerce,
        deletedAt: null
      }
    });
    if (commerceDocument) {
      return next(response.errorMessage(400, 'Ya existe un documento de este tipo'));
    }

    const document = await save({
      idCommerce,
      idDocumentType,
      url: savedFiles.file,
      name: req.files.file.name,
      verifiedByIA: true,
      viewed: false,
      observations: null,
    });

    return res.status(201).json(response.successData(document));
  } catch (error) {
    console.log(error);
    return next(response.errorMessage(500, 'Internal Server Error'));
  }
}

async function getSignedUrl(req, res) {
  try {
    const { fileName } = req.body;
    const signedUrl = await generateV4UploadSignedUrl(bucketNameSublai, fileName, 5);

    res.status(201).json({ signedUrl });
  } catch (error) {
    console.error('Error generando URL:', error);
    res.status(500).json(response.errorMessage(500, 'Error al generar URL firmada'));
  }
}


module.exports = {
  createCommerceDocumentV2,
  getSignedUrl
};
