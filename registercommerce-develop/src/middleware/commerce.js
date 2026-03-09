const validator = require('validator');
const response = require('../utils/response');
const { CommerceType } = require('../constants');

function isValidCommerce(req, res, next) {
  const {
    legalRepresentative,
    commerceInformation,
    financialInformation,
    constitutiveAct
  } = req.body;
  if (!('name' in legalRepresentative)) {
    return next(response.errorMessage(400, 'El nombre del representante es requerido', { label: 'legalRepresentative.name' }));
  }
  if (typeof legalRepresentative.name !== 'string' || !legalRepresentative.name) {
    return next(response.errorMessage(400, 'El nombre del representante no es valido', { label: 'legalRepresentative.name' }));
  }
  if (!('lastName' in legalRepresentative)) {
    return next(response.errorMessage(400, 'El apellido paterno del representante es requerido', { label: 'legalRepresentative.lastName' }));
  }
  if (typeof legalRepresentative.lastName !== 'string' || !legalRepresentative.lastName) {
    return next(response.errorMessage(400, 'El apellido paterno del representante no es valido', { label: 'legalRepresentative.lastName' }));
  }
  if (!('motherLastName' in legalRepresentative)) {
    return next(response.errorMessage(400, 'El apellido materno del representante es requerido', { label: 'legalRepresentative.motherLastName' }));
  }
  if (typeof legalRepresentative.motherLastName !== 'string' || !legalRepresentative.motherLastName) {
    return next(response.errorMessage(400, 'El apellido materno del representante no es valido', { label: 'legalRepresentative.motherLastName' }));
  }
  if (!('birthday' in legalRepresentative)) {
    return next(response.errorMessage(400, 'La fecha de nacimiento es requerida', { label: 'legalRepresentative.birthday' }));
  }
  if (typeof legalRepresentative.birthday !== 'string' || !legalRepresentative.birthday) {
    return next(response.errorMessage(400, 'La fecha de nacimiento no es valida', { label: 'legalRepresentative.birthday' }));
  }
  // if (!('maritalStatus' in legalRepresentative)) {
  //   return next(response.errorMessage(400, 'El estado civil es requerido', {
  //     label: 'legalRepresentative.maritalStatus'
  //   }));
  // }
  if (
    !validator.isNumeric(legalRepresentative.maritalStatus.toString(), { no_symbols: true })
    || !legalRepresentative.maritalStatus) {
    return next(response.errorMessage(400, 'El estado civil no es valido', {
      label: 'legalRepresentative.maritalStatus'
    }));
  }
  if (!('address' in legalRepresentative)) {
    return next(response.errorMessage(400, 'La direccion del representante es requerida', { label: 'legalRepresentative.address' }));
  }
  if (typeof legalRepresentative.address !== 'string' || !legalRepresentative.address) {
    return next(response.errorMessage(400, 'La direccion del representante no es valida', { label: 'legalRepresentative.address' }));
  }
  if (!('extNumber' in legalRepresentative)) {
    return next(response.errorMessage(400, 'El numero exterior de la direccion del representante es requerido', { label: 'legalRepresentative.extNumber' }));
  }
  if (typeof legalRepresentative.extNumber !== 'string' || !legalRepresentative.extNumber) {
    return next(response.errorMessage(400, 'El numero exterior de la direccion del representante no es valido', { label: 'legalRepresentative.extNumber' }));
  }
  if (!('zipCode' in legalRepresentative)) {
    return next(response.errorMessage(400, 'El codigo postal del representante es requerido', { label: 'legalRepresentative.zipCode' }));
  }
  if (typeof legalRepresentative.zipCode !== 'string' || !legalRepresentative.zipCode) {
    return next(response.errorMessage(400, 'El codigo postal del representante no es valido', { label: 'legalRepresentative.zipCode' }));
  }
  if (!('suburb' in legalRepresentative)) {
    return next(response.errorMessage(400, 'La colonia del representante es requerida', { label: 'legalRepresentative.suburb' }));
  }
  if (typeof legalRepresentative.suburb !== 'string' || !legalRepresentative.suburb) {
    return next(response.errorMessage(400, 'La colonia del representante no es valida', { label: 'legalRepresentative.suburb' }));
  }
  if (!('city' in legalRepresentative)) {
    return next(response.errorMessage(400, 'La ciudade del representante es requerida', {
      label: 'legalRepresentative.city'
    }));
  }
  if (
    !validator.isNumeric(legalRepresentative.city.toString(), { no_symbols: true })
    || !legalRepresentative.city) {
    return next(response.errorMessage(400, 'La ciudade del representante no es valida', {
      label: 'legalRepresentative.city'
    }));
  }
  if (!('state' in legalRepresentative)) {
    return next(response.errorMessage(400, 'El estado del representante es requerido', {
      label: 'legalRepresentative.state'
    }));
  }
  if (
    !validator.isNumeric(legalRepresentative.state.toString(), { no_symbols: true })
    || !legalRepresentative.state) {
    return next(response.errorMessage(400, 'El estado del representante no es valido', {
      label: 'legalRepresentative.state'
    }));
  }
  if (!('country' in legalRepresentative)) {
    return next(response.errorMessage(400, 'El pais del representante es requerido', {
      label: 'legalRepresentative.country'
    }));
  }
  if (
    !validator.isNumeric(legalRepresentative.country.toString(), { no_symbols: true })
    || !legalRepresentative.country) {
    return next(response.errorMessage(400, 'El pais del representante no es valido', {
      label: 'legalRepresentative.country'
    }));
  }
  if (!('RFC' in legalRepresentative)) {
    return next(response.errorMessage(400, 'El RFC del representante es requerido', { label: 'legalRepresentative.RFC ' }));
  }
  if (typeof legalRepresentative.RFC !== 'string' || !legalRepresentative.RFC) {
    return next(response.errorMessage(400, 'El RFC del representante no es valido', { label: 'legalRepresentative.RFC ' }));
  }
  if (!('CURP' in legalRepresentative)) {
    return next(response.errorMessage(400, 'El CURP del representante es requerido', { label: 'legalRepresentative.CURP' }));
  }
  if (typeof legalRepresentative.CURP !== 'string' || !legalRepresentative.CURP) {
    return next(response.errorMessage(400, 'El CURP del representante no es valido', { label: 'legalRepresentative.CURP' }));
  }
  if (!('commerceName' in commerceInformation)) {
    return next(response.errorMessage(400, 'El nombre del comercio es requerido', { label: 'commerceInformation.commerceName' }));
  }
  if (typeof commerceInformation.commerceName !== 'string' || !commerceInformation.commerceName) {
    return next(response.errorMessage(400, 'El nombre del comercio no es valido', { label: 'commerceInformation.commerceName' }));
  }
  if (!('socialReason' in commerceInformation)) {
    return next(response.errorMessage(400, 'La razon social del comercio es requerida', { label: 'commerceInformation.socialReason' }));
  }
  if (typeof commerceInformation.socialReason !== 'string' || !commerceInformation.socialReason) {
    return next(response.errorMessage(400, 'La razon social del comercio no es valida', { label: 'commerceInformation.socialReason' }));
  }
  if (!('webPgae' in commerceInformation)) {
    return next(response.errorMessage(400, 'La pagina web del comercio es requerida', { label: 'commerceInformation.webPgae' }));
  }
  if (typeof commerceInformation.webPgae !== 'string' || !commerceInformation.webPgae) {
    return next(response.errorMessage(400, 'La pagina web del comercio no es valida', { label: 'commerceInformation.webPgae' }));
  }
  if (!('address' in commerceInformation)) {
    return next(response.errorMessage(400, 'La direccion del comercio es requerida', { label: 'commerceInformation.address' }));
  }
  if (typeof commerceInformation.address !== 'string' || !commerceInformation.address) {
    return next(response.errorMessage(400, 'La direccion del comercio no es valida', { label: 'commerceInformation.address' }));
  }
  if (!('extNumber' in commerceInformation)) {
    return next(response.errorMessage(400, 'El numero exterior de la direccion del comercio es requerido', { label: 'commerceInformation.extNumber' }));
  }
  if (typeof commerceInformation.extNumber !== 'string' || !commerceInformation.extNumber) {
    return next(response.errorMessage(400, 'El numero exterior de la direccion del comercio no es valido', { label: 'commerceInformation.extNumber' }));
  }
  if (!('zipCode' in commerceInformation)) {
    return next(response.errorMessage(400, 'El codigo postal del comercio es requerido', { label: 'commerceInformation.zipCode' }));
  }
  if (typeof commerceInformation.zipCode !== 'string' || !commerceInformation.zipCode) {
    return next(response.errorMessage(400, 'El codigo postal del comercio no es valido', { label: 'commerceInformation.zipCode' }));
  }
  if (!('suburb' in commerceInformation)) {
    return next(response.errorMessage(400, 'La colonia del comercio es requerida', { label: 'commerceInformation.suburb' }));
  }
  if (typeof commerceInformation.suburb !== 'string' || !commerceInformation.suburb) {
    return next(response.errorMessage(400, 'La colonia del comercio no es valida', { label: 'commerceInformation.suburb' }));
  }
  if (!('city' in commerceInformation)) {
    return next(response.errorMessage(400, 'La ciudade del comercio es requerida', {
      label: 'commerceInformation.city'
    }));
  }
  if (
    !validator.isNumeric(commerceInformation.city.toString(), { no_symbols: true })
    || !commerceInformation.city) {
    return next(response.errorMessage(400, 'La ciudade del comercio no es valida', {
      label: 'commerceInformation.city'
    }));
  }
  if (!('state' in commerceInformation)) {
    return next(response.errorMessage(400, 'El estado del comercio es requerido', {
      label: 'commerceInformation.state'
    }));
  }
  if (
    !validator.isNumeric(commerceInformation.state.toString(), { no_symbols: true })
    || !commerceInformation.state) {
    return next(response.errorMessage(400, 'El estado del comercio no es valido', {
      label: 'commerceInformation.state'
    }));
  }
  if (!('country' in commerceInformation)) {
    return next(response.errorMessage(400, 'El pais del comercio es requerido', {
      label: 'commerceInformation.country'
    }));
  }
  if (
    !validator.isNumeric(commerceInformation.country.toString(), { no_symbols: true })
    || !commerceInformation.country) {
    return next(response.errorMessage(400, 'El pais del comercio no es valido', {
      label: 'commerceInformation.country'
    }));
  }
  if (!('RFC' in commerceInformation)) {
    return next(response.errorMessage(400, 'El RFC del comercio es requerido', { label: 'commerceInformation.RFC' }));
  }
  if (typeof commerceInformation.RFC !== 'string' || !commerceInformation.RFC) {
    return next(response.errorMessage(400, 'El RFC del comercio no es valida', { label: 'commerceInformation.RFC' }));
  }
  if (!('month1Sale' in financialInformation)) {
    return next(response.errorMessage(400, 'Las ventas del primer mes son requeridas', { label: 'financialInformation.month1Sale' }));
  }
  if (typeof financialInformation.month1Sale !== 'string' || !financialInformation.month1Sale) {
    return next(response.errorMessage(400, 'Las ventas del primer mes no son validas', { label: 'financialInformation.month1Sale' }));
  }
  if (!('month2Sale' in financialInformation)) {
    return next(response.errorMessage(400, 'Las ventas del segundo mes son requeridas', { label: 'financialInformation.month2Sale' }));
  }
  if (typeof financialInformation.month2Sale !== 'string' || !financialInformation.month2Sale) {
    return next(response.errorMessage(400, 'Las ventas del segundo mes no son validas', { label: 'financialInformation.month2Sale' }));
  }
  if (!('month3Sale' in financialInformation)) {
    return next(response.errorMessage(400, 'Las ventas del tercer mes son requeridas', { label: 'financialInformation.month3Sale' }));
  }
  if (typeof financialInformation.month3Sale !== 'string' || !financialInformation.month3Sale) {
    return next(response.errorMessage(400, 'Las ventas del tercer mes no son validas', { label: 'financialInformation.month3Sale' }));
  }
  if (!('totalTransactionCash' in financialInformation)) {
    return next(response.errorMessage(400, 'Las ventas de ecfectivo son requeridas', { label: 'financialInformation.totalTransactionCash' }));
  }
  if (typeof financialInformation.totalTransactionCash !== 'string' || !financialInformation.totalTransactionCash) {
    return next(response.errorMessage(400, 'Las ventas de ecfectivo son validas', { label: 'financialInformation.totalTransactionCash' }));
  }
  if (!('totalTransactionEcommerce' in financialInformation)) {
    return next(response.errorMessage(400, 'Las ventas por internet son requeridas', { label: 'financialInformation.totalTransactionEcommerce' }));
  }
  if (typeof financialInformation.totalTransactionEcommerce !== 'string' || !financialInformation.totalTransactionEcommerce) {
    return next(response.errorMessage(400, 'Las ventas por internet son validas', { label: 'financialInformation.totalTransactionEcommerce' }));
  }
  if (!('totalTransactionPos' in financialInformation)) {
    return next(response.errorMessage(400, 'Las ventas en POS son requeridas', { label: 'financialInformation.totalTransactionPos' }));
  }
  if (typeof financialInformation.totalTransactionPos !== 'string' || !financialInformation.totalTransactionPos) {
    return next(response.errorMessage(400, 'Las ventas en POS son validas', { label: 'financialInformation.totalTransactionPos' }));
  }
  if (!('averagePerMonth' in financialInformation)) {
    return next(response.errorMessage(400, 'Las ventas promedio por mes son requeridas', { label: 'financialInformation.averagePerMonth' }));
  }
  if (typeof financialInformation.averagePerMonth !== 'string' || !financialInformation.averagePerMonth) {
    return next(response.errorMessage(400, 'Las ventas promedio por mes son validas', { label: 'financialInformation.averagePerMonth' }));
  }
  if (!('averagePerTransaction' in financialInformation)) {
    return next(response.errorMessage(400, 'El promedio de transacciones por mes es requerido', { label: 'financialInformation.averagePerTransaction' }));
  }
  if (typeof financialInformation.averagePerTransaction !== 'string' || !financialInformation.averagePerTransaction) {
    return next(response.errorMessage(400, 'El promedio de transacciones por mes no es valido', { label: 'financialInformation.averagePerTransaction' }));
  }
  if (!('type' in commerceInformation)) {
    return next(response.errorMessage(400, 'El tipo de comercio es requerido', {
      label: 'commerceInformation.type'
    }));
  }
  if (
    !validator.isInt(commerceInformation.type.toString(), {
      min: CommerceType.FISICA,
      max: CommerceType.MORAL
    })
  ) {
    return next(response.errorMessage(400, 'El tipo de comercio no es valido', {
      label: 'commerceInformation.type'
    }));
  }
  if (!('lineBusiness' in commerceInformation)) {
    return next(response.errorMessage(400, 'La linea del negocio es requerida', {
      label: 'commerceInformation.lineBusiness'
    }));
  }
  if (
    !validator.isNumeric(commerceInformation.lineBusiness.toString(), { no_symbols: true })
    || !commerceInformation.lineBusiness) {
    return next(response.errorMessage(400, 'La linea del negocio no es valida', {
      label: 'lineBusiness.lineBusiness'
    }));
  }
  if (!('clabe' in commerceInformation)) {
    return next(response.errorMessage(400, 'La clabe interbancaria es requerida', { label: 'commerceInformation.clabe' }));
  }
  if (typeof commerceInformation.clabe !== 'string' || !commerceInformation.clabe) {
    return next(response.errorMessage(400, 'La clabe interbancaria no es valida', { label: 'commerceInformation.clabe' }));
  }
  if (constitutiveAct) {
    if (!('city' in constitutiveAct)) {
      return next(response.errorMessage(400, 'La ciudad de la notaria es requerida', {
        label: 'constitutiveAct.city'
      }));
    }
    if (
      !validator.isNumeric(constitutiveAct.city.toString(), { no_symbols: true })
      || !constitutiveAct.city) {
      return next(response.errorMessage(400, 'La ciudad de la notaria no es valida', {
        label: 'constitutiveAct.city'
      }));
    }
    if (!('actNumber' in constitutiveAct)) {
      return next(response.errorMessage(400, 'El numero de acta es requerido', { label: 'constitutiveAct.actNumber' }));
    }
    if (typeof constitutiveAct.actNumber !== 'string' || !constitutiveAct.actNumber) {
      return next(response.errorMessage(400, 'El numero de acta no es valido', { label: 'constitutiveAct.actNumber' }));
    }
    if (!('registrationDate' in constitutiveAct)) {
      return next(response.errorMessage(400, 'La fecha de registro es requerida', { label: 'constitutiveAct.registrationDate' }));
    }
    if (typeof constitutiveAct.registrationDate !== 'string' || !constitutiveAct.registrationDate) {
      return next(response.errorMessage(400, 'La fecha de registro no es valida', { label: 'constitutiveAct.registrationDate' }));
    }
    if (!('notaryNumber' in constitutiveAct)) {
      return next(response.errorMessage(400, 'El numero de notaria es requerido', { label: 'constitutiveAct.notaryNumber' }));
    }
    if (typeof constitutiveAct.notaryNumber !== 'string' || !constitutiveAct.notaryNumber) {
      return next(response.errorMessage(400, 'El numero de notaria no es valido', { label: 'constitutiveAct.notaryNumber' }));
    }
    if (!('nameOfTheNotary' in constitutiveAct)) {
      return next(response.errorMessage(400, 'El nombre del notario es requerido', { label: 'constitutiveAct.nameOfTheNotary' }));
    }
    if (typeof constitutiveAct.nameOfTheNotary !== 'string' || !constitutiveAct.nameOfTheNotary) {
      return next(response.errorMessage(400, 'El nombre del notario no es valido', { label: 'constitutiveAct.nameOfTheNotary' }));
    }
  }
  return next();
}

function isValidSublaiCommerce(req, res, next) {
  const {
    legalRepresentative,
    commerceInformation,
    constitutiveAct
  } = req.body;
  if (!('name' in legalRepresentative)) {
    return next(response.errorMessage(400, 'El nombre del representante es requerido', { label: 'legalRepresentative.name' }));
  }
  if (typeof legalRepresentative.name !== 'string' || !legalRepresentative.name) {
    return next(response.errorMessage(400, 'El nombre del representante no es valido', { label: 'legalRepresentative.name' }));
  }
  if (!('lastName' in legalRepresentative)) {
    return next(response.errorMessage(400, 'El apellido paterno del representante es requerido', { label: 'legalRepresentative.lastName' }));
  }
  if (typeof legalRepresentative.lastName !== 'string' || !legalRepresentative.lastName) {
    return next(response.errorMessage(400, 'El apellido paterno del representante no es valido', { label: 'legalRepresentative.lastName' }));
  }
  if (!('motherLastName' in legalRepresentative)) {
    return next(response.errorMessage(400, 'El apellido materno del representante es requerido', { label: 'legalRepresentative.motherLastName' }));
  }
  if (typeof legalRepresentative.motherLastName !== 'string' || !legalRepresentative.motherLastName) {
    return next(response.errorMessage(400, 'El apellido materno del representante no es valido', { label: 'legalRepresentative.motherLastName' }));
  }
  if (!('birthday' in legalRepresentative)) {
    return next(response.errorMessage(400, 'La fecha de nacimiento es requerida', { label: 'legalRepresentative.birthday' }));
  }
  if (typeof legalRepresentative.birthday !== 'string' || !legalRepresentative.birthday) {
    return next(response.errorMessage(400, 'La fecha de nacimiento no es valida', { label: 'legalRepresentative.birthday' }));
  }
  // if (!('idMaritalStatus' in legalRepresentative)) {
  //   return next(response.errorMessage(400, 'El estado civil es requerido', {
  //     label: 'legalRepresentative.idMaritalStatus'
  //   }));
  // }
  // if (
  //   !validator.isNumeric(legalRepresentative.idMaritalStatus.toString(), { no_symbols: true })
  //   || !legalRepresentative.idMaritalStatus) {
  //   return next(response.errorMessage(400, 'El estado civil no es valido', {
  //     label: 'legalRepresentative.maritalStatus'
  //   }));
  // }
  if (!('address' in legalRepresentative)) {
    return next(response.errorMessage(400, 'La direccion del representante es requerida', { label: 'legalRepresentative' }));
  }
  if (typeof legalRepresentative.address !== 'object' || !legalRepresentative.address) {
    return next(response.errorMessage(400, 'La direccion del representante no es valida', { label: 'legalRepresentative.address' }));
  }
  if (!('exteriorNumber' in legalRepresentative.address)) {
    return next(response.errorMessage(400, 'El numero exterior de la direccion del representante es requerido', { label: 'legalRepresentative.address.exteriorNumber' }));
  }
  if (typeof legalRepresentative.address.exteriorNumber !== 'string' || !legalRepresentative.address.exteriorNumber) {
    return next(response.errorMessage(400, 'El numero exterior de la direccion del representante no es valido', { label: 'legalRepresentative.address.exteriorNumber' }));
  }
  if (!('zipCode' in legalRepresentative.address)) {
    return next(response.errorMessage(400, 'El codigo postal del representante es requerido', { label: 'legalRepresentative.address.zipCode' }));
  }
  if (typeof legalRepresentative.address.zipCode !== 'string' || !legalRepresentative.address.zipCode) {
    return next(response.errorMessage(400, 'El codigo postal del representante no es valido', { label: 'legalRepresentative.address.zipCode' }));
  }
  if (!('suburb' in legalRepresentative.address)) {
    return next(response.errorMessage(400, 'La colonia del representante es requerida', { label: 'legalRepresentative.address.suburb' }));
  }
  if (typeof legalRepresentative.address.suburb !== 'string' || !legalRepresentative.address.suburb) {
    return next(response.errorMessage(400, 'La colonia del representante no es valida', { label: 'legalRepresentative.address.suburb' }));
  }
  if (!('idCity' in legalRepresentative.address)) {
    return next(response.errorMessage(400, 'La ciudad del representante es requerida', {
      label: 'legalRepresentative.address.idCity'
    }));
  }
  // if (
  //   !validator.isNumeric(legalRepresentative.address.idCity.toString(), { no_symbols: true })
  //   || !legalRepresentative.address.idCity) {
  //   return next(response.errorMessage(400, 'La ciudad del representante no es valida', {
  //     label: 'legalRepresentative.address.idCity'
  //   }));
  // }
  if (!('idState' in legalRepresentative.address)) {
    return next(response.errorMessage(400, 'El estado del representante es requerido', {
      label: 'legalRepresentative.address.idState'
    }));
  }
  if (
    !validator.isNumeric(legalRepresentative.address.idState.toString(), { no_symbols: true })
    || !legalRepresentative.address.idState) {
    return next(response.errorMessage(400, 'El estado del representante no es valido', {
      label: 'legalRepresentative.address.idState'
    }));
  }
  if (!('idCountry' in legalRepresentative.address)) {
    return next(response.errorMessage(400, 'El pais del representante es requerido', {
      label: 'legalRepresentative.address.idCountry'
    }));
  }
  if (
    !validator.isNumeric(legalRepresentative.address.idCountry.toString(), { no_symbols: true })
    || !legalRepresentative.address.idCountry) {
    return next(response.errorMessage(400, 'El pais del representante no es valido', {
      label: 'legalRepresentative.address.idCountry'
    }));
  }
  if (!('rfc' in legalRepresentative)) {
    return next(response.errorMessage(400, 'El RFC del representante es requerido', { label: 'legalRepresentative.rfc ' }));
  }
  if (typeof legalRepresentative.rfc !== 'string' || !legalRepresentative.rfc) {
    return next(response.errorMessage(400, 'El RFC del representante no es valido', { label: 'legalRepresentative.rfc ' }));
  }
  if (!('curp' in legalRepresentative)) {
    return next(response.errorMessage(400, 'El CURP del representante es requerido', { label: 'legalRepresentative.curp' }));
  }
  if (typeof legalRepresentative.curp !== 'string' || !legalRepresentative.curp) {
    return next(response.errorMessage(400, 'El CURP del representante no es valido', { label: 'legalRepresentative.curp' }));
  }
  if (!('commerceName' in commerceInformation)) {
    return next(response.errorMessage(400, 'El nombre del comercio es requerido', { label: 'commerceInformation.commerceName' }));
  }
  if (typeof commerceInformation.commerceName !== 'string' || !commerceInformation.commerceName) {
    return next(response.errorMessage(400, 'El nombre del comercio no es valido', { label: 'commerceInformation.commerceName' }));
  }
  if (!('socialReason' in commerceInformation)) {
    return next(response.errorMessage(400, 'La razon social del comercio es requerida', { label: 'commerceInformation.socialReason' }));
  }
  if (typeof commerceInformation.socialReason !== 'string' || !commerceInformation.socialReason) {
    return next(response.errorMessage(400, 'La razon social del comercio no es valida', { label: 'commerceInformation.socialReason' }));
  }
  if (!('webPage' in commerceInformation)) {
    return next(response.errorMessage(400, 'La pagina web del comercio es requerida', { label: 'commerceInformation.webPage' }));
  }
  if (typeof commerceInformation.webPage !== 'string' || !commerceInformation.webPage) {
    return next(response.errorMessage(400, 'La pagina web del comercio no es valida', { label: 'commerceInformation.webPage' }));
  }
  if (!('address' in commerceInformation)) {
    return next(response.errorMessage(400, 'La direccion del comercio es requerida', { label: 'commerceInformation.address' }));
  }
  if (typeof commerceInformation.address !== 'object' || !commerceInformation.address) {
    return next(response.errorMessage(400, 'La direccion del comercio no es valida', { label: 'commerceInformation.address' }));
  }
  if (!('exteriorNumber' in commerceInformation.address)) {
    return next(response.errorMessage(400, 'El numero exterior de la direccion del comercio es requerido', { label: 'commerceInformation.address.exteriorNumber' }));
  }
  if (typeof commerceInformation.address.exteriorNumber !== 'string' || !commerceInformation.address.exteriorNumber) {
    return next(response.errorMessage(400, 'El numero exterior de la direccion del comercio no es valido', { label: 'commerceInformation.address.exteriorNumber' }));
  }
  if (!('zipCode' in commerceInformation.address)) {
    return next(response.errorMessage(400, 'El codigo postal del comercio es requerido', { label: 'commerceInformation.address.zipCode' }));
  }
  if (typeof commerceInformation.address.zipCode !== 'string' || !commerceInformation.address.zipCode) {
    return next(response.errorMessage(400, 'El codigo postal del comercio no es valido', { label: 'commerceInformation.address.zipCode' }));
  }
  if (!('suburb' in commerceInformation.address)) {
    return next(response.errorMessage(400, 'La colonia del comercio es requerida', { label: 'commerceInformation.address.suburb' }));
  }
  if (typeof commerceInformation.address.suburb !== 'string' || !commerceInformation.address.suburb) {
    return next(response.errorMessage(400, 'La colonia del comercio no es valida', { label: 'commerceInformation.address.suburb' }));
  }
  // if (!('idCity' in commerceInformation.address)) {
  //   return next(response.errorMessage(400, 'La ciudad del comercio es requerida', {
  //     label: 'commerceInformation.idCity'
  //   }));
  // }
  // if (
  //   !validator.isNumeric(commerceInformation.address.idCity.toString(), { no_symbols: true })
  //   || !commerceInformation.address.idCity) {
  //   return next(response.errorMessage(400, 'La ciudade del comercio no es valida', {
  //     label: 'commerceInformation.address.idCity'
  //   }));
  // }
  if (!('idState' in commerceInformation.address)) {
    return next(response.errorMessage(400, 'El estado del comercio es requerido', {
      label: 'commerceInformation.addres.idState'
    }));
  }
  if (
    !validator.isNumeric(commerceInformation.address.idState.toString(), { no_symbols: true })
    || !commerceInformation.address.idState) {
    return next(response.errorMessage(400, 'El estado del comercio no es valido', {
      label: 'commerceInformation.address.idState'
    }));
  }
  if (!('idCountry' in commerceInformation.address)) {
    return next(response.errorMessage(400, 'El pais del comercio es requerido', {
      label: 'commerceInformation.idCountry'
    }));
  }
  if (
    !validator.isNumeric(commerceInformation.address.idCountry.toString(), { no_symbols: true })
    || !commerceInformation.address.idCountry) {
    return next(response.errorMessage(400, 'El pais del comercio no es valido', {
      label: 'commerceInformation.address.idCountry'
    }));
  }
  if (!('rfc' in commerceInformation)) {
    return next(response.errorMessage(400, 'El RFC del comercio es requerido', { label: 'commerceInformation.rfc' }));
  }
  if (typeof commerceInformation.rfc !== 'string' || !commerceInformation.rfc) {
    return next(response.errorMessage(400, 'El RFC del comercio no es valida', { label: 'commerceInformation.rfc' }));
  }
  if (!('month1' in commerceInformation.financialInformation)) {
    return next(response.errorMessage(400, 'Las ventas del primer mes son requeridas', { label: 'commerceInformation.financialInformation.month1' }));
  }
  if (typeof commerceInformation.financialInformation.month1 !== 'string' || !commerceInformation.financialInformation.month1) {
    return next(response.errorMessage(400, 'Las ventas del primer mes no son validas', { label: 'financialInformation.month1Sale' }));
  }
  if (!('month2' in commerceInformation.financialInformation)) {
    return next(response.errorMessage(400, 'Las ventas del segundo mes son requeridas', { label: 'commerceInformation.financialInformation.month2' }));
  }
  if (typeof commerceInformation.financialInformation.month2 !== 'string' || !commerceInformation.financialInformation.month2) {
    return next(response.errorMessage(400, 'Las ventas del segundo mes no son validas', { label: 'financialInformation.month2' }));
  }
  if (!('month3' in commerceInformation.financialInformation)) {
    return next(response.errorMessage(400, 'Las ventas del tercer mes son requeridas', { label: 'commerceInformation.financialInformation.month3' }));
  }
  if (typeof commerceInformation.financialInformation.month3 !== 'string' || !commerceInformation.financialInformation.month3) {
    return next(response.errorMessage(400, 'Las ventas del tercer mes no son validas', { label: 'financialInformation.month3Sale' }));
  }
  if (!('totalCash' in commerceInformation.financialInformation)) {
    return next(response.errorMessage(400, 'Las ventas de ecfectivo son requeridas', { label: 'commerceInformation.financialInformation.totalCash' }));
  }
  if (typeof commerceInformation.financialInformation.totalCash !== 'string' || !commerceInformation.financialInformation.totalCash) {
    return next(response.errorMessage(400, 'Las ventas de ecfectivo son validas', { label: 'commerceInformation.financialInformation.totalCash' }));
  }
  if (!('totalEcommerce' in commerceInformation.financialInformation)) {
    return next(response.errorMessage(400, 'Las ventas por internet son requeridas', { label: 'commerceInformation.financialInformation.totalEcommerce' }));
  }
  if (typeof commerceInformation.financialInformation.totalEcommerce !== 'string' || !commerceInformation.financialInformation.totalEcommerce) {
    return next(response.errorMessage(400, 'Las ventas por internet son validas', { label: 'commerceInformation.financialInformation.totalEcommerce' }));
  }
  if (!('totalPos' in commerceInformation.financialInformation)) {
    return next(response.errorMessage(400, 'Las ventas en POS son requeridas', { label: 'commerceInformation.financialInformation.totalPos' }));
  }
  if (typeof commerceInformation.financialInformation.totalPos !== 'string' || !commerceInformation.financialInformation.totalPos) {
    return next(response.errorMessage(400, 'Las ventas en POS son validas', { label: 'commerceInformation.financialInformation.totalPos' }));
  }
  if (!('averagePerMonth' in commerceInformation.financialInformation)) {
    return next(response.errorMessage(400, 'Las ventas promedio por mes son requeridas', { label: 'commerceInformation.financialInformation.averagePerMonth' }));
  }
  if (typeof commerceInformation.financialInformation.averagePerMonth !== 'string' || !commerceInformation.financialInformation.averagePerMonth) {
    return next(response.errorMessage(400, 'Las ventas promedio por mes son validas', { label: 'commerceInformation.financialInformation.averagePerMonth' }));
  }
  if (!('averagePerTransaction' in commerceInformation.financialInformation)) {
    return next(response.errorMessage(400, 'El promedio de transacciones por mes es requerido', { label: 'commerceInformation.financialInformation.averagePerTransaction' }));
  }
  if (typeof commerceInformation.financialInformation.averagePerTransaction !== 'string' || !commerceInformation.financialInformation.averagePerTransaction) {
    return next(response.errorMessage(400, 'El promedio de transacciones por mes no es valido', { label: 'commerceInformation.financialInformation.averagePerTransaction' }));
  }
  if (!('idLineBusiness' in commerceInformation)) {
    return next(response.errorMessage(400, 'La linea del negocio es requerida', {
      label: 'commerceInformation.idLineBusiness'
    }));
  }
  if (
    !validator.isNumeric(commerceInformation.idLineBusiness.toString(), { no_symbols: true })
    || !commerceInformation.idLineBusiness) {
    return next(response.errorMessage(400, 'La linea del negocio no es valida', {
      label: 'lineBusiness.idLineBusiness'
    }));
  }
  if (constitutiveAct) {
    if (!('notaryCity' in constitutiveAct)) {
      return next(response.errorMessage(400, 'La ciudad de la notaria es requerida', {
        label: 'constitutiveAct.notaryCity'
      }));
    }
    if (
      !validator.isNumeric(constitutiveAct.notaryCity.toString(), { no_symbols: true })
      || !constitutiveAct.notaryCity) {
      return next(response.errorMessage(400, 'La ciudad de la notaria no es valida', {
        label: 'constitutiveAct.notaryCity'
      }));
    }
    if (!('actNumber' in constitutiveAct)) {
      return next(response.errorMessage(400, 'El numero de acta es requerido', { label: 'constitutiveAct.actNumber' }));
    }
    if (typeof constitutiveAct.actNumber !== 'string' || !constitutiveAct.actNumber) {
      return next(response.errorMessage(400, 'El numero de acta no es valido', { label: 'constitutiveAct.actNumber' }));
    }
    if (!('registrationDate' in constitutiveAct)) {
      return next(response.errorMessage(400, 'La fecha de registro es requerida', { label: 'constitutiveAct.registrationDate' }));
    }
    if (typeof constitutiveAct.registrationDate !== 'string' || !constitutiveAct.registrationDate) {
      return next(response.errorMessage(400, 'La fecha de registro no es valida', { label: 'constitutiveAct.registrationDate' }));
    }
    if (!('notaryNumber' in constitutiveAct)) {
      return next(response.errorMessage(400, 'El numero de notaria es requerido', { label: 'constitutiveAct.notaryNumber' }));
    }
    if (typeof constitutiveAct.notaryNumber !== 'string' || !constitutiveAct.notaryNumber) {
      return next(response.errorMessage(400, 'El numero de notaria no es valido', { label: 'constitutiveAct.notaryNumber' }));
    }
    if (!('nameOfTheNotary' in constitutiveAct)) {
      return next(response.errorMessage(400, 'El nombre del notario es requerido', { label: 'constitutiveAct.nameOfTheNotary' }));
    }
    if (typeof constitutiveAct.nameOfTheNotary !== 'string' || !constitutiveAct.nameOfTheNotary) {
      return next(response.errorMessage(400, 'El nombre del notario no es valido', { label: 'constitutiveAct.nameOfTheNotary' }));
    }
    if (!('publicInstrumentNumber' in constitutiveAct)) {
      return next(response.errorMessage(400, 'El número del instrumento público es requerido', { label: 'constitutiveAct.publicInstrumentNumber' }));
    }
    if (typeof constitutiveAct.publicInstrumentNumber !== 'string' || !constitutiveAct.publicInstrumentNumber) {
      return next(response.errorMessage(400, 'El número del instrumento público no es valido', { label: 'constitutiveAct.publicInstrumentNumber' }));
    }
    if (!('publicInstrumentDate' in constitutiveAct)) {
      return next(response.errorMessage(400, 'La fecha del instrumento público es requerida', { label: 'constitutiveAct.publicInstrumentDate' }));
    }
    if (typeof constitutiveAct.publicInstrumentDate !== 'string' || !constitutiveAct.publicInstrumentDate) {
      return next(response.errorMessage(400, 'La fecha del intrumento público no es valida', { label: 'constitutiveAct.publicInstrumentDate' }));
    }
    if (!('publicInstrumentDateRegistration' in constitutiveAct)) {
      return next(response.errorMessage(400, 'La fecha de registro del instrumento público es requerida', { label: 'constitutiveAct.publicInstrumentDateRegistration' }));
    }
    if (typeof constitutiveAct.publicInstrumentDateRegistration !== 'string' || !constitutiveAct.publicInstrumentDateRegistration) {
      return next(response.errorMessage(400, 'La fecha de registro del instrumento público no es valida', { label: 'constitutiveAct.publicInstrumentDateRegistration' }));
    }
    if (!('publicInstrumentLocation' in constitutiveAct)) {
      return next(response.errorMessage(400, 'La ciudad del instrumento público es requerida', { label: 'constitutiveAct.publicInstrumentLocation' }));
    }
    if (typeof constitutiveAct.publicInstrumentLocation !== 'string' || !constitutiveAct.publicInstrumentLocation) {
      return next(response.errorMessage(400, 'La ciudad del instrumento público no es valida', { label: 'constitutiveAct.publicInstrumentLocation' }));
    }
    if (!('publicInstrumentNotary' in constitutiveAct)) {
      return next(response.errorMessage(400, 'La notaria del instrumento público es requerida', { label: 'constitutiveAct.publicInstrumentNotary' }));
    }
    if (typeof constitutiveAct.publicInstrumentNotary !== 'string' || !constitutiveAct.publicInstrumentNotary) {
      return next(response.errorMessage(400, 'La notaria del instrumento público no es valida', { label: 'constitutiveAct.publicInstrumentNotary' }));
    }
    if (!('publicInstrumentNotaryNumber' in constitutiveAct)) {
      return next(response.errorMessage(400, 'El número de la notaria del instrumento público es requerido', { label: 'constitutiveAct.publicInstrumentNotaryNumber' }));
    }
    if (typeof constitutiveAct.publicInstrumentNotaryNumber !== 'string' || !constitutiveAct.publicInstrumentNotaryNumber) {
      return next(response.errorMessage(400, 'El número de la notaria del instrumento público no es valido', { label: 'constitutiveAct.publicInstrumentNotaryNumber' }));
    }
  }
  return next();
}

module.exports = {
  isValidCommerce,
  isValidSublaiCommerce
};
