const config = require('config');
const { v4: uuidv4 } = require('uuid');
const upload = require('./gcs/upload');
const {
  save,
  update,
  find,
  findOne
} = require('../repository/v2/commerceDocument');
const { commerceDocumentType: CommerceDocumentType } = require('../../models');

const bucketNameSublai = config.get('bucketSublai.name');
const bucketUrlSublai = config.get('bucketSublai.url');
const bucketFolderSublai = config.get('bucketSublai.commerceDocuments');

async function uploadCommerceDocumentsSublaiPM(idCommerce, ecommerceDocuments) {
  try {
    const filesToUpload = ecommerceDocuments
      .filter(doc => doc.logicalKey !== 'ACT_CON' && doc.file)
      .map((doc) => {
        const originalExtension = doc.file.name.split('.').pop();
        const newFileName = `${doc.logicalKey || 'doc'}-${uuidv4()}.${originalExtension}`;
        return {
          bucket: bucketNameSublai,
          path: doc.file.path,
          bucketPath: `${bucketFolderSublai}${idCommerce}/`,
          name: newFileName,
          key: doc.logicalKey,
          shareholderIndex: doc.shareholderIndex,
          originalName: doc.file.name,
          idDocumentType: doc.type,
          idSublaiDocumentType: doc.sublaiType
        };
      });

    const uploadedFiles = await upload.uploadFiles(filesToUpload);
    const createdocs = await Promise.all(
      uploadedFiles.map((uploaded, i) => {
        const fileToUpload = filesToUpload[i];
        return save({
          idCommerce,
          idDocumentType: Number(fileToUpload.idDocumentType),
          url: `${bucketUrlSublai}${bucketNameSublai}/${bucketFolderSublai}${idCommerce}/${uploaded.filename}`,
          name: filesToUpload[i].originalName,
          verifiedByIA: false,
          viewed: false,
          observations: null
        });
      })
    );

    const responseStructure = {
      files: [],
      legalRepresentative: [],
      shareholders: []
    };

    const shareholdersMap = {};

    uploadedFiles.forEach((uploaded, i) => {
      const fileInfo = filesToUpload[i];
      const docId = createdocs[i].id;

      const docResult = {
        field: docId,
        idDocumentType: Number(fileInfo.idSublaiDocumentType),
        url: createdocs[i].url.replace('https://storage.googleapis.com/', 'gs://')
      };

      if (fileInfo.shareholderIndex !== null && fileInfo.shareholderIndex !== undefined) {
        if (!shareholdersMap[fileInfo.shareholderIndex]) {
          shareholdersMap[fileInfo.shareholderIndex] = [];
        }
        shareholdersMap[fileInfo.shareholderIndex].push(docResult);
      } else if (fileInfo.key && (fileInfo.key.includes('_RP') || fileInfo.key === 'ID_OFI')) {
        responseStructure.legalRepresentative.push(docResult);
      } else {
        responseStructure.files.push(docResult);
      }
    });

    responseStructure.shareholders = Object.keys(shareholdersMap)
      .sort((a, b) => Number(a) - Number(b))
      .map(key => shareholdersMap[key]);

    return responseStructure;
  } catch (ex) {
    console.log(ex);
    throw new Error('Error');
  }
}

async function uploadCommerceDocumentsSublaiPF(idCommerce, documents) {
  try {
    const filesToUpload = documents
      .filter(doc => doc.logicalKey !== 'ACT_CON' && doc.file)
      .map((doc) => {
        const originalExtension = doc.file.name.split('.').pop();
        const newFileName = `${doc.logicalKey || 'doc'}-${uuidv4()}.${originalExtension}`;
        return {
          bucket: bucketNameSublai,
          path: doc.file.path,
          bucketPath: `${bucketFolderSublai}${idCommerce}/`,
          name: newFileName,
          key: doc.logicalKey,
          originalName: doc.file.name,
          idDocumentType: doc.type,
          idSublaiDocumentType: doc.sublaiType
        };
      });

    const uploadedFiles = await upload.uploadFiles(filesToUpload);
    const createdocs = await Promise.all(
      uploadedFiles.map((uploaded, i) => {
        const fileToUpload = filesToUpload[i];
        return save({
          idCommerce,
          idDocumentType: Number(fileToUpload.idDocumentType),
          url: `${bucketUrlSublai}${bucketNameSublai}/${bucketFolderSublai}${idCommerce}/${uploaded.filename}`,
          name: filesToUpload[i].originalName,
          verifiedByIA: false,
          viewed: false,
          observations: null
        });
      })
    );

    const resultado = Object.values(createdocs).map((doc, i) => ({
      field: doc.id,
      idDocumentType: Number(filesToUpload[i].idSublaiDocumentType),
      url: doc.url.replace('https://storage.googleapis.com/', 'gs://')
    }));

    return resultado;
  } catch (ex) {
    console.log(ex);
    throw new Error('Error');
  }
}

async function updateCommerceDocumentsSublai(idCommerce, documents, commerceType) {
  try {
    const filesToUpload = documents.map((doc) => {
      const originalExtension = doc.file.name.split('.').pop();
      const newFileName = `${doc.logicalKey || 'doc'}-${uuidv4()}.${originalExtension}`;
      return {
        idFile: doc.idFile,
        bucket: bucketNameSublai,
        path: doc.file.path,
        bucketPath: `${bucketFolderSublai}${idCommerce}/`,
        name: newFileName,
        key: doc.logicalKey,
        shareholderIndex: doc.shareholderIndex,
        originalName: doc.file.name,
        idDocumentType: doc.type,
        idSublaiDocumentType: doc.sublaiType
      };
    });

    const uploadedFiles = await upload.uploadFiles(filesToUpload);
    await Promise.all(
      uploadedFiles.map(async (uploaded, i) => {
        const fileToUpload = filesToUpload[i];

        const docData = {
          url: `${bucketUrlSublai}${bucketNameSublai}/${bucketFolderSublai}${idCommerce}/${uploaded.filename}`,
          name: fileToUpload.originalName,
          verifiedByIA: false,
          viewed: false,
          observations: null
        };

        let existingDoc = null;
        if (fileToUpload.idFile) {
          existingDoc = await findOne({
            where: {
              id: fileToUpload.idFile,
              idCommerce
            }
          });
        }

        if (existingDoc) {
          await update(docData, { id: fileToUpload.idFile });
        } else {
          await save({
            ...docData,
            idCommerce,
            idDocumentType: Number(fileToUpload.idDocumentType)
          });
        }

        return true;
      })
    );

    const newDocs = await find({
      attributes: ['id', 'idDocumentType', 'url'],
      include: [{
        model: CommerceDocumentType,
        attributes: ['idSublai', 'clave'],
        as: 'documentType'
      }],
      where: {
        idCommerce
      },
      nest: true
    });

    const isPersonaFisica = commerceType === 1;
    if (isPersonaFisica) {
      const resultado = newDocs.map((doc) => {
        const uploadedInfo = filesToUpload.find(f => Number(f.idFile) === Number(doc.id));
        let idSublai = null;

        if (uploadedInfo.idSublaiDocumentType) {
          idSublai = uploadedInfo.idSublaiDocumentType;
        } else if (doc.documentType && doc.documentType.idSublai) {
          // eslint-disable-next-line prefer-destructuring
          idSublai = doc.documentType.idSublai;
        }

        if (!idSublai) return null;

        return {
          field: doc.id,
          idDocumentType: Number(idSublai),
          url: doc.url.replace('https://storage.googleapis.com/', 'gs://')
        };
      }).filter(doc => doc !== null);

      return resultado;
    }

    const responseStructure = {
      files: [],
      legalRepresentative: [],
      shareholders: []
    };

    const shareholdersMap = {};
    const pendingShareholderDocs = [];
    newDocs.forEach((doc) => {
      const uploadedInfo = filesToUpload.find(f => Number(f.idFile) === Number(doc.id));

      let idSublai = null;

      if (uploadedInfo && uploadedInfo.idSublaiDocumentType) {
        idSublai = uploadedInfo.idSublaiDocumentType;
      } else if (doc.documentType && doc.documentType.idSublai) {
        // eslint-disable-next-line prefer-destructuring
        idSublai = doc.documentType.idSublai;
      }

      if (!idSublai) return;

      const docResult = {
        field: doc.id,
        idDocumentType: Number(idSublai),
        url: doc.url.replace('https://storage.googleapis.com/', 'gs://')
      };

      let classified = false;
      if (uploadedInfo) {
        if (uploadedInfo.shareholderIndex !== null && uploadedInfo.shareholderIndex !== undefined) {
          if (!shareholdersMap[uploadedInfo.shareholderIndex]) {
            shareholdersMap[uploadedInfo.shareholderIndex] = [];
          }
          shareholdersMap[uploadedInfo.shareholderIndex].push(docResult);
          classified = true;
        } else if (uploadedInfo.key && (uploadedInfo.key.includes('_RP') || uploadedInfo.key === 'ID_OFI')) {
          responseStructure.legalRepresentative.push(docResult);
          classified = true;
        }
      }

      if (!classified && doc.documentType && doc.documentType.clave) {
        if (doc.documentType.clave.includes('_RP') || doc.documentType.clave === 'ID_OFI') {
          responseStructure.legalRepresentative.push(docResult);
        } else if (doc.documentType.clave.includes('_ACC') || [2, 3].includes(docResult.idDocumentType)) {
          pendingShareholderDocs.push(docResult);
        } else {
          responseStructure.files.push(docResult);
        }
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

    return responseStructure;
  } catch (ex) {
    console.log(ex);
    throw new Error('Error');
  }
}

module.exports = {
  uploadCommerceDocumentsSublaiPM,
  uploadCommerceDocumentsSublaiPF,
  updateCommerceDocumentsSublai
};
