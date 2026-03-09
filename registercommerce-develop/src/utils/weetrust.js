const fs = require('fs');
const path = require('path');
const config = require('config');
const fetch = require('node-fetch');
const FormData = require('form-data');

const url = config.get('weetrust.base');
const userId = config.get('weetrust.userId');
const apiKey = config.get('weetrust.apiKey');

async function getFileContent(file) {
  const data = await fs.promises.readFile(
    `${path.resolve(__dirname)}/../../contracts/${file}`,
    'utf8'
  );

  return data;
}

async function getAccessToken() {
  try {
    const res = await fetch(`${url}/access/token`, {
      method: 'POST',
      headers: {
        'user-id': userId,
        'api-key': apiKey,
      },
    });

    if (!res.ok) {
      const {
        message: [{ msg }],
      } = await res.json();
      throw msg;
    }

    const {
      responseData: { accessToken: token },
    } = await res.json();

    return token;
  } catch (err) {
    throw new Error(err.toString());
  }
}

async function sendDocument(token, pdfPath, uniqueName) {
  const pdf = fs.readFileSync(pdfPath);
  const formData = new FormData();
  formData.append('document', pdf, uniqueName);
  try {
    const documentResponse = await fetch(`${url}/documents`, {
      method: 'POST',
      headers: {
        'Content-Type': `multipart/form-data; boundary=${formData.getBoundary()}`,
        'user-id': userId,
        token,
      },
      body: formData,
    });

    fs.unlinkSync(pdfPath);
    const {
      responseData: { documentID },
    } = await documentResponse.json();

    return documentID;
  } catch (e) {
    throw Error(e.toString());
  }
}

async function fixedSignatory(token, documentId, email, typePerson) {
  return fetch(`${url}/documents/fixed-signatory`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'user-id': userId,
      token,
    },
    body: JSON.stringify({
      documentID: documentId,
      staticSignPositions: typePerson === 'FÍSICA' ? [
        {
          user: {
            email
          },
          coordinates: {
            x: 382,
            y: 640
          },
          page: 6,
          pageY: 640,
          pageYv2: 640,
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
        },
        {
          user: {
            email
          },
          coordinates: {
            x: 385,
            y: 672
          },
          page: 7,
          pageY: 672,
          pageYv2: 672,
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
        },
      ] : [
        {
          user: {
            email
          },
          coordinates: {
            x: 383,
            y: 640
          },
          page: 6,
          pageY: 640,
          pageYv2: 640,
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
        },
        {
          user: {
            email,
          },
          coordinates: {
            x: 384,
            y: 109
          },
          page: 8,
          pageY: 109,
          pageYv2: 109,
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
        }
      ],
    }),
  });
}

async function requestSignature(
  token,
  documentId,
  dataSheet,
  check
) {
  return fetch(`${url}/documents/signatory`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'user-id': userId,
      token,
    },
    body: JSON.stringify({
      documentID: documentId,
      nickname: dataSheet.typePerson === 'FÍSICA' ? 'Persona Física' : 'Persona Moral',
      title: dataSheet.typePerson === 'FÍSICA'
        ? 'Contrato Persona Física'
        : 'Contrato Persona Moral',
      message:
        'Favor de firmar el contrato, para continuar con el proceso de registro',
      hasOrder: false,
      disableMailing: false,
      signatory: [
        {
          emailID: dataSheet.email,
          name: dataSheet.legalRepresentativeName,
          identification: 'face',
          check,
        },
      ],
      sharedWith: [
        {
          emailID: 'contratos@espiralapp.com',
        },
      ],
    }),
  });
}

function getShortDate(date) {
  let day = date.getDate();
  let month = date.getMonth() + 1;
  const year = date.getFullYear();

  day = day < 10 ? `0${day}` : day;
  month = month < 10 ? `0${month}` : month;

  return `${day}/${month}/${year}`;
}

function getDate(date) {
  const day = date.getDate();
  const month = date.getMonth();
  const year = date.getFullYear();

  const months = [
    'Enero',
    'Febrero',
    'Marzo',
    'Abril',
    'Mayo',
    'Junio',
    'Julio',
    'Agosto',
    'Septiembre',
    'Octubre',
    'Noviembre',
    'Diciembre',
  ];

  return `${day} de ${months[month]} del ${year}`;
}

module.exports = {
  getAccessToken,
  getFileContent,
  sendDocument,
  fixedSignatory,
  requestSignature,
  getDate,
  getShortDate,
};
