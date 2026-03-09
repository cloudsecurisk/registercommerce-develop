const docsRequirements = {
  personaFisica: {
    LIMITESBAJOS: ['ID_OFI'],
    ASP: ['ID_OFI', 'CONST_FIS_RP', 'COMP_DOC_RP'],
    STP: ['ID_OFI', 'CONST_FIS_RP', 'COMP_DOC_RP', 'FOTOS_DOM', 'FIRM_ELE'],
  },
  personaMoral: {
    TRANSFER: [
      'ID_OFI',
      'CONST_FIS_RP',
      'CONST_PUB_EM',
      'COMP_DOC_RP',
      'COMP_DOM',
      'FOTOS_DOM',
      'ACT_CON',
      'CUM_EMP',
    ],
    ASP: [
      'ID_OFI',
      'CONST_FIS_RP',
      'CONST_PUB_EM',
      'COMP_DOC_RP',
      'COMP_DOM',
      'FOTOS_DOM',
      'FOTO_ACT',
      'ACT_CON',
      'CUM_EMP',
      'ORG',
    ],
    STP: [
      'ID_OFI',
      'CONST_FIS_RP',
      'CONST_PUB_EM',
      'COMP_DOC_RP',
      'COMP_DOM',
      'FOTOS_DOM',
      'FOTO_ACT',
      'ACT_CON',
      'CUM_EMP',
      'ORG',
      'FIRM_ELE_ACUSE',
      'FIRM_ELE_CAD'
    ]
  }
};

function getUploadedKeys(documentos) {
  return new Set(documentos.map(d => d.logicalKey));
}

function meetsRequirements(required, uploaded) {
  return required.every(req => uploaded.has(req));
}

function determineAccountType(commerceType, documentos) {
  const docsUploaded = getUploadedKeys(documentos);
  const rules = docsRequirements[commerceType];

  const accountLevel = Object.entries(rules).reverse();
  const match = accountLevel.find(([, requeridos]) => meetsRequirements(requeridos, docsUploaded));

  if (match) {
    return { tipoCuenta: match[0], faltantes: [] };
  }

  const posibles = accountLevel.map(([tipoCuenta, requeridos]) => {
    const faltantes = requeridos.filter(r => !docsUploaded.has(r));
    return { tipoCuenta, faltantes };
  });

  return { tipoCuenta: null, faltantes: posibles };
}

module.exports = determineAccountType;
