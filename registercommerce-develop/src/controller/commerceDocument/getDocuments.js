const { Storage } = require('@google-cloud/storage');
const response = require('../../utils/response');

const commerceDocument = require('../../repository/commerceDocument');
const commerceDocumentV2Repository = require('../../repository/v2/commerceDocument');
const {
  commerces: Commerce,
  commerceDocumentV2: CommerceDocumentV2,
  commerceDocumentType: CommerceDocumentType,
} = require('../../../models');

const storage = new Storage();

const Logger = require('../../utils/logger/GLogger');

const Glogger = new Logger('documents-controller');

function extractFilePathFromUrl(url) {
  const prefix = 'https://storage.googleapis.com/';
  if (!url.startsWith(prefix)) return null;

  const pathWithoutPrefix = url.substring(prefix.length);
  const [actualBucket, ...fileParts] = pathWithoutPrefix.split('/');
  const filePath = fileParts.join('/');
  return { actualBucket, filePath };
}

async function getDocuments(req, res, next) {
  const { id, email, idSession } = res.locals.user || {
    id: null,
    email: null,
    idSession: null,
  };
  const idCommerce = req.params.id;

  const query = {
    where: { idCommerce },
    attributes: [
      'constitutiveAct',
      'proofBC',
      'accountStatement',
      'proofAddress',
      'legalOwnerIdentification',
      'proofFiscalSituation',
      'SATComplianceOpinion',
    ],
    include: [
      {
        model: Commerce,
        as: 'commerce',
        attributes: ['idCommerceType'],
      },
    ],
  };

  try {
    const documentsOld = await commerceDocument.findOne(query);

    if (documentsOld) {
      const documentsOldJson = documentsOld.toJSON();

      console.log('documentsOldJson', documentsOldJson);

      const isFisical = documentsOldJson.commerce.idCommerceType === 1;

      const documentTypes = [
        {
          col: 'accountStatement',
          name: 'ESTADO DE CUENTA',
          documentTypeId: 21,
        },
        {
          col: 'proofAddress',
          name: 'COMPROBANTE DE DOMICILIO',
          documentTypeId: isFisical ? 15 : 3,
        },
        {
          col: 'legalOwnerIdentification',
          name: 'IDENTIFICACIÓN DEL REPRESENTANTE LEGAL',
          documentTypeId: 7,
        },
        {
          col: 'proofFiscalSituation',
          name: 'COMPROBANTE DE SITUACIÓN FISCAL',
          documentTypeId: isFisical ? 16 : 13,
        },
        {
          col: 'constitutiveAct',
          name: 'ACTA CONSTITUTIVA',
          documentTypeId: 1,
        },
      ];

      const allowedColumns = new Set(documentTypes.map(dt => dt.col));
      Object.entries(documentsOldJson)
        .filter(([key, value]) => value != null && allowedColumns.has(key))
        .forEach(([key, url]) => {
          CommerceDocumentV2.upsert({
            idCommerce,
            idDocumentType: documentTypes.find(dt => dt.col === key)
              .documentTypeId,
            name: documentTypes.find(dt => dt.col === key).name,
            url,
          });
        });

      await commerceDocument.deleteFn({ where: { idCommerce } });
    }

    const documents = await commerceDocumentV2Repository.find({
      nest: true,
      raw: true,
      where: { idCommerce, deletedAt: null },
      required: false,
      include: [
        {
          model: CommerceDocumentType,
          as: 'documentType',
          attributes: ['id', 'clave', 'description'],
          required: false,
        }
      ]
    });

    if (!documents || documents.length === 0) {
      return next(response.errorMessage(404, 'Commerce Documents not found'));
    }

    // console.log('documents', documents.toJSON());

    // return res.json(response.successData({ documents }));

    // let rJ;
    // if (documents && typeof documents.toJSON === 'function') {
    //   // V1
    //   rJ = documents.toJSON();
    // } else {
    //   rJ = documents; // V2
    // }
    // if (rJ.length === 0) {
    //   return next(response.errorMessage(404, 'Commerce Document not found'));
    // }
    // const isV2 = Array.isArray(rJ);
    // const docs = isV2
    //   ? rJ.map((doc) => ({ key: doc.name, url: doc.url, extra: doc })) // V2
    //   : Object.entries(rJ).map(([key, url]) => ({ key, url })); // V1

    const signedDocs = await Promise.all(
      documents.map(async (document) => {
        if (!document.url) return null;

        const extracted = extractFilePathFromUrl(document.url);
        if (!extracted) {
          console.warn(
            'URL inválida o no pertenece a Google Cloud Storage:',
            document.url
          );
          return null;
        }

        const { actualBucket, filePath } = extracted;
        const [signedUrl] = await storage
          .bucket(actualBucket)
          .file(filePath)
          .getSignedUrl({
            version: 'v4',
            action: 'read',
            expires: Date.now() + 60 * 60 * 1000,
          });
        return { ...document, url: signedUrl };
      })
    );

    // const resultFormatted = isV2
    //   ? signedDocs.filter(Boolean)
    //   : Object.fromEntries(
    //       signedDocs.filter(Boolean).map(({ key, url }) => [key, url])
    //     );

    Glogger.info(
      {
        message: 'Get documents successfully',
        user: {
          id,
          email,
          idSession,
        },
        status: 200,
      },
      req
    );
    return res.json(response.successData(signedDocs.filter(Boolean)));
  } catch (ex) {
    console.log(ex);
    Glogger.error(
      {
        message: 'Error getting documents.',
        user: {
          id,
          email,
          idSession,
        },
        status: 500,
      },
      req,
      ex
    );
    return next(response.errorMessage(500, 'Internal Server Error'));
  }
}

module.exports = {
  getDocuments,
};
