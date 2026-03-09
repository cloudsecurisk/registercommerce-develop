/* eslint-disable operator-linebreak */
const regExpEMAIL = '^([\\w\\-\\.]+@(([\\w\\-]+\\.)+([a-zA-Z]{2,4})))$';
const regExpRFC = '^([A-ZÑ&]{3,4}) ?(?:- ?)?(\\d{2}(?:0[1-9]|1[0-2])(?:0[1-9]|[12]\\d|3[01])) ?(?:- ?)?([A-Z\\d]{2})([A\\d])$';
const regExpCURP = '^([A-Z][AEIOUX][A-Z]{2}\\d{2}(?:0[1-9]|1[0-2])(?:0[1-9]|[12]\\d|3[01])[HM](?:AS|B[CS]|C[CLMSH]|D[FG]|G[TR]|HG|JC|M[CNS]|N[ETL]|OC|PL|Q[TR]|S[PLR]|T[CSL]|VZ|YN|ZS)[B-DF-HJ-NP-TV-Z]{3}[A-Z\\d])(\\d)$';
const regExpCardNumber = '^(\\d{16})$';
const regExpMonth = '^(0?[1-9]|1[012])$';
const regExpYear = '^(\\d{2})$';
const regExpNumber = '^-?\\d+$';
// const hyphen = new RegExp('(\\$|-|,|\\*|\\|)', 'g');
const cents = new RegExp('(.0{2})', 'g');

function isRequired(value) {
  return (value);
}

function isNumber(value = '') {
  return (value) ? value.toString().match(regExpNumber) : false;
}

function isRFC(value = '') {
  return (value) ? value.toString().toUpperCase().match(regExpRFC) : false;
}

function isCURP(value) {
  return (value) ? value.toString().toUpperCase().match(regExpCURP) : false;
}

function isEmail(value) {
  return (value) ? value.toString().match(regExpEMAIL) : false;
}

function validateBirthDay(value) {
  if (value) {
    const maxDate = new Date();
    maxDate.setFullYear(maxDate.getFullYear() - 18);
    if (isNumber(value)) {
      return (new Date(Number(value)) <= maxDate);
    }
  }
  return false;
}

function isCardNumber(value) {
  return (value) ? value.toString().match(regExpCardNumber) : false;
}

function isExpirationMonth(value) {
  return (value) ? value.toString().match(regExpMonth) : false;
}

function isExpirationYear(value) {
  return (value) ? value.toString().match(regExpYear) : false;
}

function validMimeType(mimetype) {
  return (
    mimetype === 'image/jpeg' ||
    mimetype === 'image/png' ||
    mimetype === 'image/jpg' ||
    mimetype === 'application/pdf'
  );
}

function validMimeTypeCSV(mimetype) {
  return mimetype === 'text/csv';
}

function validFileSize(string = '', size = 5) {
  return (string) ? (((Buffer.byteLength(string.toString(), 'utf8')) / 1024) / 1024) <= size : false;
}

function removeSpecialCharacters(string = '') {
  return (string) ? string.replace(/[^a-zA-Z0-9@._\-+áéíóúÁÉÍÓÚñÑ\s]/g, '') : '';
}

function removeCents(string) {
  return string.replace(cents, '');
}

module.exports = {
  isRFC,
  isCURP,
  isEmail,
  isRequired,
  validateBirthDay,
  isCardNumber,
  isExpirationMonth,
  isExpirationYear,
  isNumber,
  validMimeType,
  validFileSize,
  validMimeTypeCSV,
  removeSpecialCharacters,
  removeCents
};
