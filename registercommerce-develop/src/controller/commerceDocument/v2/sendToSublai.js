const config = require('config');
const { v4: uuidv4 } = require('uuid');
const commerceDocumentV2Repository = require('../../../repository/v2/commerceDocument');
const generalInfoRepository = require('../../../repository/generalInfo');
const {
  commerceDocumentType: CommerceDocumentType,
} = require('../../../../models');
const sendRequest = require('../../../utils/rest/request');
const response = require('../../../utils/response');
const determineAccountType = require('../../../utils/determineAccountType');
const Logger = require('../../../utils/logger/GLogger');

const sublaiApiUrl = config.get('sublai.url');
const sublaiApikey = config.get('sublai.apikey');
const ENDPOINT = 'documents/bulk-process';
const Glogger = new Logger('commerceDocument-controller');

async function sendToSublai(req, res) {
  const {
    id,
    emailSession,
    idSession
  } = res.locals.user || { id: null, emailSession: null, idSession: null };
  const { idCommerce } = req.params;
  const { commerceType } = req.query;

  const commerceTypeString = Number(commerceType) === 1 ? 'personaFisica' : 'personaMoral';
  const docs = await commerceDocumentV2Repository.find({
    where: {
      idCommerce
    },
    attributes: ['id', 'idDocumentType', 'url'],
    include: [{
      model: CommerceDocumentType,
      attributes: ['idSublai', 'clave'],
      as: 'documentType'
    }],
    nest: true,
    order: [['id', 'ASC']]
  });

  const generalInfo = await generalInfoRepository.findOne({
    where: { idCommerce },
    attributes: ['email']
  });

  const docsForAccountType = docs.map(doc => ({
    logicalKey: doc.documentType ? doc.documentType.clave.trim() : ''
  }));
  const accountTypeResult = determineAccountType(commerceTypeString, docsForAccountType);
  const responseStructure = {
    files: [],
    legalRepresentative: [],
    shareholders: []
  };

  if (Number(commerceType) === 1) {
    docs.forEach((doc) => {
      const idSublaiType = doc.documentType ? doc.documentType.idSublai : null;

      if (!idSublaiType) return;

      responseStructure.files.push({
        field: doc.id,
        idDocumentType: Number(idSublaiType),
        url: doc.url.replace('https://storage.googleapis.com/', 'gs://')
      });
    });
  } else {
    const shareholdersMap = {};
    const pendingShareholderDocs = [];

    docs.forEach((doc) => {
      const idSublaiType = doc.documentType ? doc.documentType.idSublai : null;

      if (!idSublaiType) return;

      const docResult = {
        field: doc.id,
        idDocumentType: Number(idSublaiType),
        url: doc.url.replace('https://storage.googleapis.com/', 'gs://')
      };

      let classified = false;
      const key = doc.documentType ? doc.documentType.clave : '';

      if (key && (key.includes('_RP') || key === 'ID_OFI')) {
        responseStructure.legalRepresentative.push(docResult);
        classified = true;
      } else if (key && (key.includes('_ACC') || [2, 3].includes(docResult.idDocumentType))) {
        pendingShareholderDocs.push(docResult);
        classified = true;
      }

      if (!classified) {
        responseStructure.files.push(docResult);
      }
    });

    pendingShareholderDocs.forEach((doc, index) => {
      const groupIndex = Math.floor(index / 3);
      if (!shareholdersMap[groupIndex]) {
        shareholdersMap[groupIndex] = [];
      }
      shareholdersMap[groupIndex].push(doc);
    });

    responseStructure.shareholders = Object.keys(shareholdersMap)
      .sort((a, b) => Number(a) - Number(b))
      .map(key => shareholdersMap[key]);
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
      ...(commerceTypeString === 'personaFisica' ? { files: responseStructure.files } : { ...responseStructure }),
      executiveName: 'Ivan',
      distributorName: 'Ivan',
      accountType: accountTypeResult.tipoCuenta === 'LIMITESBAJOS' ? 'LIMITES BAJOS' : accountTypeResult.tipoCuenta,
      email: generalInfo ? generalInfo.email : '',
      personType: Number(commerceType) === 1 ? 'Física' : 'Moral'
    }
  };

  Glogger.info({
    message: 'Commerce docs sent to Sublai (admin)',
    user: {
      id,
      emailSession,
      idSession
    },
    status: 200
  }, req);

  sendRequest(settings);

  res.json(response.successData('Documentos enviados a Sublai', 200));
}


module.exports = sendToSublai;
