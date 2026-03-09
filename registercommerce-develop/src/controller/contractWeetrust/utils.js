/* eslint-disable no-console */
const espiralSignature = 'data:image/jpeg;base64,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';
const fs = require('fs');
const path = require('path');
const config = require('config');
const fetch = require('node-fetch');
const FormData = require('form-data');
const sendRequest = require('../../utils/rest/request');
const generatePage = require('../../utils/generatePage');
const { getFileContent } = require('../../utils/weetrust');
const sendHeaders = require('../../utils/sendHeaders');

const url = config.get('weetrust.base');
const userId = config.get('weetrust.userId');
const apiKey = config.get('weetrust.apiKey');
const transferUrl = config.get('transfer.stpBase');
const cardsUrl = config.get('cards.base');

function getStaticSignPositions(isFisica, email) {
  if (isFisica) {
    return [{
      user: {
        email
      },
      coordinates: {
        x: 388,
        y: 513
      },
      page: 8,
      pageY: 513,
      pageYv2: 513,
      color: '#FFD247',
      imageSize: {
        width: 101,
        height: 51
      },
      parentImageSize: {
        width: 612,
        height: 792
      },
      viewport: {
        width: 612,
        height: 792
      }
    }, {
      user: {
        email
      },
      coordinates: {
        x: 388,
        y: 187
      },
      page: 10,
      pageY: 187,
      pageYv2: 187,
      color: '#FFD247',
      imageSize: {
        width: 101,
        height: 51
      },
      parentImageSize: {
        width: 612,
        height: 792
      },
      viewport: {
        width: 612,
        height: 792
      }
    }];
  }
  return [{
    user: {
      email
    },
    coordinates: {
      x: 387,
      y: 515
    },
    page: 8,
    pageY: 515,
    pageYv2: 515,
    color: '#FFD247',
    imageSize: {
      width: 101,
      height: 51
    },
    parentImageSize: {
      width: 612,
      height: 792
    },
    viewport: {
      width: 612,
      height: 792
    }
  }, {
    user: {
      email
    },
    coordinates: {
      x: 389,
      y: 451
    },
    page: 10,
    pageY: 451,
    pageYv2: 451,
    color: '#FFD247',
    imageSize: {
      width: 101,
      height: 51
    },
    parentImageSize: {
      width: 612,
      height: 792
    },
    viewport: {
      width: 612,
      height: 792
    }
  }];
}

async function pdfWriteData(file, uniqueName, dataSheet) {
  const fileContent = await getFileContent(file);

  const html = fileContent.replace(/{%((\w|\d|\s)*)%}/g, (_, key) => (Object.prototype.hasOwnProperty.call(dataSheet, key) ? dataSheet[key] : ''));

  const page = await generatePage(html, uniqueName);
  const pdfPath = path.join('/tmp', uniqueName);

  fs.writeFileSync(pdfPath, page);
  return pdfPath;
}

async function getWeetrusthToken() {
  const res = await fetch(`${url}/access/token`, {
    method: 'POST',
    headers: {
      'user-id': userId,
      'api-key': apiKey,
    },
  });

  const json = await res.json();
  if (!res.ok) {
    console.log(json);
    const {
      message: [{ msg }],
    } = json;
    throw Error(msg);
  }

  const {
    responseData: { accessToken: token },
  } = json;

  return token;
}

async function sendWeetrusthDocument(token, pdfPath, uniqueName) {
  const pdf = fs.readFileSync(pdfPath);
  const formData = new FormData();
  formData.append('document', pdf, uniqueName);

  const response = await fetch(`${url}/documents`, {
    method: 'POST',
    headers: {
      'Content-Type': `multipart/form-data; boundary=${formData.getBoundary()}`,
      'user-id': userId,
      token,
    },
    body: formData,
  });
  fs.unlinkSync(pdfPath);
  const json = await response.json();
  if (!response.ok) {
    console.log(json);
    const {
      message: [{ msg }],
    } = json;
    throw Error(msg);
  }
  // eslint-disable-next-line no-console
  const {
    responseData: { documentID },
  } = json;
  return documentID;
}

async function fixedWeetrusthSignatory(token, documentId, dataSheet) {
  const response = await fetch(`${url}/documents/fixed-signatory`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'user-id': userId,
      token,
    },
    body: JSON.stringify({
      documentID: documentId,
      staticSignPositions: getStaticSignPositions(dataSheet.isFisica, dataSheet.commerceEmail),
    }),
  });

  const json = await response.json();
  // eslint-disable-next-line no-console
  if (!response.ok) {
    console.log(json);
    const {
      message: [{ msg }],
    } = json;
    throw Error(msg);
  }
}

async function requestWeetrusthSignature(
  token,
  documentId,
  dataSheet,
  configWeetrusth = {}
) {
  const response = await fetch(`${url}/documents/signatory`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'user-id': userId,
      token,
    },
    body: JSON.stringify({
      documentID: documentId,
      nickname: dataSheet.isFisica ? 'Persona Física' : 'Persona Moral',
      title: dataSheet.isFisica
        ? 'Contrato Persona Física'
        : 'Contrato Persona Moral',
      message:
        'Favor de firmar el contrato, para continuar con el proceso de registro.',
      hasOrder: false,
      disableMailing: false,
      signatory: [
        {
          emailID: dataSheet.commerceEmail,
          name: dataSheet.legalRepresentativeName,
          ...(!configWeetrusth.idValidateCheck) ? {} : { identification: 'face' },
          check: configWeetrusth.backgroundCheck || false,
          signatureType: configWeetrusth.signatureType || 'ELECTRONIC_SIGNATURE',
        },
      ],
      sharedWith: [
        {
          emailID: 'contratos@espiralapp.com'
        },
      ],
    }),
  });

  const json = await response.json();
  if (!response.ok) {
    console.log(json);
    const {
      message
    } = json;
    throw Error(message);
  }
}

async function microserviceRequest(
  microservice,
  idCommerce,
  addendumDate,
  authorization,
  options,
  req
) {
  const endpoint = microservice === 'stee' ? `${transferUrl}/v2/commerce/${idCommerce}/addendum?addendumTimestamp=${addendumDate}`
    : `${cardsUrl}/account/commerce/${idCommerce}/addendum?addendumTimestamp=${addendumDate}`;
  const response = await sendRequest({
    method: 'POST',
    url: endpoint,
    headers: {
      authorization,
      'Content-Type': 'application/json',
      ...sendHeaders(req)
    },
    body: {
      ...((options && options.bank) ? { bank: options.bank } : {})
    }
  });

  return response.payload;
}

module.exports = {
  espiralSignature,
  pdfWriteData,
  getWeetrusthToken,
  sendWeetrusthDocument,
  fixedWeetrusthSignatory,
  requestWeetrusthSignature,
  microserviceRequest,
};
