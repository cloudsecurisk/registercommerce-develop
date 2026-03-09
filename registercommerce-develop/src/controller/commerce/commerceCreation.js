const config = require('config');
const response = require('../../utils/response');
const commerceRepository = require('../../repository/commerce');
const organizationRepository = require('../../repository/organization');
const sendRequestMpos = require('../../utils/rest/request');
const sendHeaders = require('../../utils/sendHeaders');

const mposURL = config.get('mpos.base');

const Logger = require('../../utils/logger/GLogger');

const Glogger = new Logger('commerce-create-controller');

async function createCommerce(req, res, next) {
  const {
    id: idUser,
    email,
    idSession
  } = res.locals.user || { id: null, email: null, idSession: null };
  const { user } = req.query;

  const {
    products,
    legalRepresentative,
    commerceInformation,
    financialInformation,
    constitutiveAct
  } = req.body;
  let data = {
    representativeName: legalRepresentative.name,
    representativeLastName: legalRepresentative.lastName,
    representativeMotherLastName: legalRepresentative.motherLastName,
    birthday: legalRepresentative.birthday,
    maritalStatus: legalRepresentative.maritalStatus,
    representativeAddress: legalRepresentative.address,
    representativeExtNumber: legalRepresentative.extNumber,
    representativeIntNumber: legalRepresentative.intNumber ? legalRepresentative.intNumber : null,
    representativeZipCode: legalRepresentative.zipCode,
    representativeSuburb: legalRepresentative.suburb,
    representativeCity: legalRepresentative.city,
    representativeState: legalRepresentative.state,
    representativeCountry: legalRepresentative.country,
    representativeRFC: legalRepresentative.RFC,
    CURP: legalRepresentative.CURP,
    gender: legalRepresentative.gender || null,
    electronicSignatureSerialNumber: legalRepresentative.electronicSignatureSerialNumber || null,
    commerceName: commerceInformation.commerceName,
    socialReason: commerceInformation.socialReason,
    commerceWebPgae: commerceInformation.webPgae,
    commerceAddress: commerceInformation.address,
    commerceExtNumber: commerceInformation.extNumber,
    commerceIntNumber: commerceInformation.intNumber ? commerceInformation.intNumber : null,
    commerceZipCode: commerceInformation.zipCode,
    commerceSuburb: commerceInformation.suburb,
    commerceCity: commerceInformation.city,
    commerceState: commerceInformation.state,
    commerceCountry: commerceInformation.country,
    commerceRFC: commerceInformation.RFC,
    commerceEmail: commerceInformation.email,
    commercePhone: commerceInformation.phone,
    commerceMonth1Sale: financialInformation.month1Sale,
    commerceMonth2Sale: financialInformation.month2Sale,
    commerceMonth3Sale: financialInformation.month3Sale,
    totalTransactionCash: financialInformation.totalTransactionCash,
    totalTransactionEcommerce: financialInformation.totalTransactionEcommerce,
    totalTransactionPos: financialInformation.totalTransactionPos,
    commerceAveragePerMonth: financialInformation.averagePerMonth,
    commerceAveragePerTransaction: financialInformation.averagePerTransaction,
    commerceType: commerceInformation.type,
    lineBusiness: commerceInformation.lineBusiness,
    idOfificialDocument: legalRepresentative.idOfificialDocument,
    oficialDocumentNumber: legalRepresentative.oficialDocumentNumber,
    validity: legalRepresentative.validity,
    electronicSignatureSerialNumberC: commerceInformation.electronicSignatureSerialNumber || null,
    latitude: commerceInformation.latitude || null,
    longitude: commerceInformation.longitude || null,
    origen: user ? 'Mesa de control' : 'Usuario'
  };
  if (constitutiveAct) {
    data = {
      ...data,
      notaryCity: constitutiveAct.notaryCity || constitutiveAct.city || null,
      actNumber: constitutiveAct.actNumber,
      registrationDate: constitutiveAct.registrationDate,
      notaryNumber: constitutiveAct.notaryNumber,
      nameOfTheNotary: constitutiveAct.nameOfTheNotary,
      numeroCatastro: constitutiveAct.numeroCatastro,
      publicInstrumentNumber: constitutiveAct.publicInstrumentNumber || null,
      publicInstrumentDate: constitutiveAct.publicInstrumentDate || null,
      publicInstrumentLocation: constitutiveAct.fiscalForm_publicInstrumentLocation || null,
      publicInstrumentNotary: constitutiveAct.publicInstrumentNotary || null,
      publicInstrumentNotaryNumber: constitutiveAct.publicInstrumentNotaryNumber || null,
      publicInstrumentDateRegistration:
        constitutiveAct.publicInstrumentDateRegistration || null,
      idPublicInstrumentCity: constitutiveAct.idPublicInstrumentCity || null,
    };
  } else {
    data = {
      ...data,
      notaryCity: null,
      actNumber: null,
      registrationDate: null,
      notaryNumber: null,
      nameOfTheNotary: null,
      numeroCatastro: null,
      publicInstrumentNumber: null,
      publicInstrumentDate: null,
      publicInstrumentLocation: null,
      publicInstrumentNotary: null,
      publicInstrumentNotaryNumber: null,
      publicInstrumentDateRegistration: null,
      idPublicInstrumentCity: null,
    };
  }
  try {
    const commerce = await commerceRepository.create(data);
    const organizationToSave = {
      idCommerce: commerce[0].idCommerce,
      idUser,
      idRoleMpos: products.mposEcommerce ? 1 : 0,
      idRoleEcommerce: products.mposEcommerce ? 1 : 0,
      idRoleTransfer: products.steeCards ? 1 : 0,
      idRoleCards: products.steeCards ? 1 : 0
    };
    await organizationRepository.save(organizationToSave);
    sendRequestMpos({
      method: 'POST',
      url: `${mposURL}/commerce/registerCommerce`,
      headers: {
        authorization: req.get('authorization'),
        'Content-Type': 'application/json',
        ...sendHeaders(req)
      },
      body: {
        commerce: {
          idCommerce: commerce[0].idCommerce,
          clabeBanco: commerceInformation.clabe,
          idUser
        },
        generalInfo: {
          rfc: commerceInformation.RFC,
          voucherName: commerceInformation.commerceName,
          socialReason: commerceInformation.socialReason,
          email: commerceInformation.email,
          phone: commerceInformation.phone
        }
      }
    });
    Glogger.info({
      message: 'Commerce created successfully.',
      user: {
        id: idUser,
        email,
        idSession
      },
      status: 200
    }, req);
    return res.json(response.successData({
      idCommerce: commerce[0].idCommerce
    }));
  } catch (ex) {
    console.log('Error', ex);
    Glogger.error({
      message: 'Error creating commerce.',
      user: {
        id: idUser,
        email,
        idSession
      },
      status: 500
    }, req, ex);

    if (ex.errors && ex.errors[0] && ex.errors[0].path === 'commerceName_UNIQUE') {
      return next(response.errorMessage(500, 'Internal Server Error', {
        fields: [
          {
            field: 'commerceName',
            error: 'UNIQUE'
          }
        ]
      }));
    }

    if (ex.errors && ex.errors[0] && ex.errors[0].path === 'webPage_UNIQUE') {
      return next(response.errorMessage(500, 'Internal Server Error', {
        fields: [
          {
            field: 'webPage',
            error: 'UNIQUE'
          }
        ]
      }));
    }
    return next(response.errorMessage(500, 'Internal Server Error'));
  }
}

async function migrationCommerceMpos(req, res, next) {
  const { id, email, idSession } = res.locals.user || { id: null, email: null, idSession: null };
  const {
    legalRepresentative,
    commerceInformation,
    financialInformation,
    constitutiveAct,
    mposCommerceInfo
  } = req.body;
  let data = {
    representativeName: legalRepresentative.representativeName,
    representativeLastName: legalRepresentative.representativeLastName,
    representativeMotherLastName: legalRepresentative.representativeMotherLastName,
    birthday: legalRepresentative.birthday,
    maritalStatus: legalRepresentative.maritalStatus,
    representativeAddress: legalRepresentative.representativeAddress,
    representativeExtNumber: legalRepresentative.representativeExtNumber,
    representativeIntNumber: legalRepresentative.representativeIntNumber
      ? legalRepresentative.representativeIntNumber : null,
    representativeZipCode: legalRepresentative.representativeZipCode,
    representativeSuburb: legalRepresentative.representativeSuburb,
    representativeCity: legalRepresentative.representativeCity,
    representativeState: legalRepresentative.representativeState,
    representativeCountry: legalRepresentative.representativeCountry,
    representativeRFC: legalRepresentative.representativeRFC,
    CURP: legalRepresentative.CURP,
    commerceName: commerceInformation.commerceName,
    socialReason: commerceInformation.socialReason,
    commerceWebPgae: commerceInformation.commerceWebPgae,
    commerceAddress: commerceInformation.commerceAddress,
    commerceExtNumber: commerceInformation.commerceExtNumber,
    commerceIntNumber: commerceInformation.commerceIntNumber
      ? commerceInformation.commerceIntNumber : null,
    commerceZipCode: commerceInformation.commerceZipCode,
    commerceSuburb: commerceInformation.commerceSuburb,
    commerceCity: commerceInformation.commerceCity,
    commerceState: commerceInformation.commerceState,
    commerceCountry: commerceInformation.commerceCountry,
    commerceRFC: commerceInformation.commerceRFC,
    commerceEmail: commerceInformation.commerceEmail,
    commercePhone: commerceInformation.commercePhone,
    commerceMonth1Sale: financialInformation.commerceMonth1Sale,
    commerceMonth2Sale: financialInformation.commerceMonth2Sale,
    commerceMonth3Sale: financialInformation.commerceMonth3Sale,
    totalTransactionCash: financialInformation.totalTransactionCash,
    totalTransactionEcommerce: financialInformation.totalTransactionEcommerce,
    totalTransactionPos: financialInformation.totalTransactionPos,
    commerceAveragePerMonth: financialInformation.commerceAveragePerMonth,
    commerceAveragePerTransaction: financialInformation.commerceAveragePerTransaction,
    commerceType: commerceInformation.commerceType,
    lineBusiness: commerceInformation.lineOfBusiness ? commerceInformation.lineOfBusiness : null,
    idOfificialDocument: legalRepresentative.idOfificialDocument,
    oficialDocumentNumber: legalRepresentative.oficialDocumentNumber,
    validity: legalRepresentative.validity,
    gender: null,
    electronicSignatureSerialNumber: null,
    latitude: null,
    longitude: null
  };
  if (constitutiveAct) {
    data = {
      ...data,
      notaryCity: constitutiveAct.notaryCity,
      actNumber: constitutiveAct.actNumber,
      registrationDate: constitutiveAct.registrationDate,
      notaryNumber: constitutiveAct.notaryNumber,
      nameOfTheNotary: constitutiveAct.nameOfTheNotary,
      numeroCatastro: constitutiveAct.numeroCatastro
    };
  } else {
    data = {
      ...data,
      notaryCity: null,
      actNumber: null,
      registrationDate: null,
      notaryNumber: null,
      nameOfTheNotary: null,
      numeroCatastro: null
    };
  }
  try {
    const commerce = await commerceRepository.create(data);
    const organizationToSave = {
      idCommerce: commerce[0].idCommerce,
      idUser: 2,
      idRoleMpos: 1,
      idRoleEcommerce: 1,
      idRoleTransfer: 1
    };
    await organizationRepository.save(organizationToSave);

    sendRequestMpos({
      method: 'PATCH',
      url: `${mposURL}/commerce/${mposCommerceInfo.id}/idCommerce`,
      headers: {
        authorization: req.get('authorization'),
        'Content-Type': 'application/json',
        ...sendHeaders(req)
      },
      body: {
        idCommerce: commerce[0].idCommerce
      }
    });
    Glogger.info({
      message: 'Commerce mpos updated successfully',
      user: {
        id,
        email,
        idSession
      },
      status: 200
    }, req);
    return res.json(response.successData('idCommerce de mpos modificado'));
  } catch (ex) {
    console.log('Error', ex);
    Glogger.error({
      message: 'Error updating commerce mpos',
      user: {
        id,
        email,
        idSession
      },
      status: 500
    }, req, ex);
    if (ex.errors && ex.errors[0] && ex.errors[0].path === 'commerceName_UNIQUE') {
      return next(response.errorMessage(500, 'Internal Server Error', {
        fields: [
          {
            field: 'commerceName',
            error: 'UNIQUE'
          }
        ]
      }));
    }

    if (ex.errors && ex.errors[0] && ex.errors[0].path === 'webPage_UNIQUE') {
      return next(response.errorMessage(500, 'Internal Server Error', {
        fields: [
          {
            field: 'webPage',
            error: 'UNIQUE'
          }
        ]
      }));
    }
    return next(response.errorMessage(500, 'Internal Server Error'));
  }
}

module.exports = {
  createCommerce,
  migrationCommerceMpos
};
