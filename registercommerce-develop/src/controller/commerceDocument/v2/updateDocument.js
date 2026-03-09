
const config = require('config');
const { v4: uuidv4 } = require('uuid');
const response = require('../../../utils/response');
const upload = require('../../../utils/gcs/upload');
const { update, findByPk, findOne } = require('../../../repository/v2/commerceDocument');
const { updateCommerceDocumentsSublai } = require('../../../utils/uploadDocuments');
const sendRequest = require('../../../utils/rest/request');
const moveFile = require('../../../utils/gcs/moveFile');
const onboardingRepository = require('../../../repository/onboarding');
const Logger = require('../../../utils/logger/GLogger');

const bucketName = config.get('bucket.name');
const bucketUrl = config.get('bucket.url');
const bucketFolder = config.get('bucket.commerceDocuments');

const bucketNameSublai = config.get('bucketSublai.name');
const bucketUrlSublai = config.get('bucketSublai.url');
const bucketFolderSublai = config.get('bucketSublai.commerceDocuments');

const sublaiApiUrl = config.get('sublai.url');
const sublaiApikey = config.get('sublai.apikey');
const ENDPOINT = 'documents/bulk-process';
const Glogger = new Logger('commerceDocument-controller');

async function updateDoc(req, res, next) {
  const { idDocument } = req.params;
  const updateFields = req.body;

  try {
    const documentResult = await findByPk(idDocument);
    if (!documentResult) {
      return next(response.errorMessage(404, 'Documento no encontrado'));
    }

    if (updateFields.deletedAt) {
      updateFields.deletedAt = new Date().toISOString();
      delete updateFields.deleted;
    }

    const allowedFields = ['viewed', 'deletedAt'];
    const attributes = Object.fromEntries(
      Object.entries(updateFields).filter(([key]) => allowedFields.includes(key))
    );
    const where = {
      id: documentResult.id
    };
    const updatedDoc = await update(attributes, where);
    return res.json(response.successData(updatedDoc[0]));
  } catch (error) {
    return next(response.errorMessage(500, 'Internal Server Error'));
  }
}

async function updateCommerceDocument(req, res, next) {
  // const { id, email } = res.locals.user;
  const { idDocument } = req.params;
  const { idCommerce } = req.fields;
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
    const commerceDocument = await findByPk(idDocument);
    if (commerceDocument) {
      const document = await update(
        {
          name: req.files.file.name,
          url: savedFiles.file,
          viewed: false,
          observations: null
        },
        { id: Number(idDocument) }
      );
      return res.json(response.successData(document));
    }

    return res.json(404).json(response.errorMessage(404, 'El documento no puede ser reemplazado'));
  } catch (error) {
    console.log(error);
    return next(response.errorMessage(500, 'Internal Server Error'));
  }
}


async function replaceSublaiDocs(req, res, next) {
  const {
    id,
    emailSession,
    idSession
  } = res.locals.user || { id: null, emailSession: null, idSession: null };
  const { commerceType } = req.query;
  const { idCommerce } = req.fields;

  try {
    const { files } = req;
    const { fields } = req;

    const documentos = [];
    const keys = Object.keys(files).filter(key => key.startsWith('documents[') && key.endsWith('][file]'));
    keys.forEach((fileKey) => {
      const match = fileKey.match(/^documents\[(\d+)]\[file]$/);
      if (!match) return;
      const index = match[1];
      const file = files[fileKey];
      const idFile = fields[`documents[${index}][idFile]`];
      const type = fields[`documents[${index}][type]`];
      const sublaiType = fields[`documents[${index}][sublaiType]`];
      const logicalKey = fields[`documents[${index}][key]`] || null;

      documentos.push({
        idFile,
        file,
        type,
        sublaiType,
        logicalKey
      });
    });

    const commerceTypeString = Number(commerceType) === 1 ? 'personaFisica' : 'personaMoral';
    const accountTypeResult = await onboardingRepository.findOne({
      attributes: ['accountType'],
      where: {
        idCommerce
      }
    });
    let destFileName = null;
    let actaConstitutiva = null;
    if (fields.actaFileName !== 'undefined' && commerceTypeString === 'personaMoral') {
      destFileName = `${bucketFolderSublai}${idCommerce}/${fields.actaFileName}`;
      await moveFile(bucketNameSublai, fields.actaFileName, destFileName);
      await update(
        {
          name: fields.actaFileName,
          url: `${bucketUrlSublai}${bucketNameSublai}/${destFileName}`,
          observations: null
        },
        {
          idCommerce,
          idDocumentType: 1,
        }
      );
      actaConstitutiva = await findOne({
        raw: true,
        nest: true,
        where: { idCommerce, idDocumentType: 1 }
      });
    }

    const sublaiDocs = await updateCommerceDocumentsSublai(
      idCommerce, documentos, Number(commerceType)
    );
    console.log(JSON.stringify(sublaiDocs, null, 2));
    if (commerceTypeString === 'personaMoral' && actaConstitutiva) {
      sublaiDocs.files.push({
        field: actaConstitutiva.id,
        idDocumentType: 10,
        url: `${bucketUrlSublai}${bucketNameSublai}/${destFileName}`
          .replace('https://storage.googleapis.com/', 'gs://')
      });
    }
    const settings = {
      method: 'POST',
      url: `${sublaiApiUrl}/${ENDPOINT}`,
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': sublaiApikey
      },
      body: {
        requestId: uuidv4(),
        idCommerce,
        ...(commerceTypeString === 'personaFisica' ? { files: sublaiDocs } : { ...sublaiDocs }),
        executiveName: 'Ivan',
        distributorName: 'Ivan',
        accountType: accountTypeResult.accountType,
        personType: Number(commerceType) === 1 ? 'Física' : 'Moral'
      }
    };

    Glogger.info({
      message: 'updated commerce docs sent to Sublai',
      user: {
        id,
        emailSession,
        idSession
      },
      status: 200
    }, req);

    let sublaiReqResult = null;
    if (Number(commerceType) === 1) {
      sublaiReqResult = await sendRequest(settings);
    } else {
      sendRequest(settings);
    }

    return res.status(200).json(response.successData(sublaiReqResult));
  } catch (error) {
    console.log(error);
    return next(response.errorMessage(500, 'Internal Server Error'));
  }
}

module.exports = {
  updateDoc,
  updateCommerceDocument,
  replaceSublaiDocs
};
