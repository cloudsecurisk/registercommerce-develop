const db = require('../../models');
const { commerces: Commerces } = require('../../models');
const paginate = require('../utils/pagination');

function findOne(query) {
  return Commerces.findOne(query);
}

function create(commerce) {
  return db.sequelize.query(
    `CALL createNewCommerce(
      :representativeName,
      :representativeLastName,
      :representativeMotherLastName,
      :birthday,
      :maritalStatus,
      :representativeAddress,
      :representativeExtNumber,
      :representativeIntNumber,
      :representativeZipCode ,
      :representativeSuburb,
      :representativeCity,
      :representativeState,
      :representativeCountry,
      :representativeRFC,
      :CURP,
      :publicInstrumentNumber,
      :publicInstrumentDate,
      :publicInstrumentLocation,
      :publicInstrumentNotary,
      :publicInstrumentNotaryNumber,
      :publicInstrumentDateRegistration,
      :idPublicInstrumentCity,
      :commerceName,
      :socialReason,
      :commerceWebPgae,
      :commerceAddress,
      :commerceExtNumber,
      :commerceIntNumber,
      :commerceZipCode,
      :commerceSuburb,
      :commerceCity,
      :commerceState,
      :commerceCountry,
      :commerceRFC,
      :commerceEmail,
      :commercePhone,
      :commerceMonth1Sale,
      :commerceMonth2Sale,
      :commerceMonth3Sale,
      :totalTransactionCash,
      :totalTransactionEcommerce,
      :totalTransactionPos,
      :commerceAveragePerMonth,
      :commerceAveragePerTransaction,
      :commerceType,
      :lineBusiness,
      :idOfificialDocument,
      :oficialDocumentNumber,
      :validity,
      :notaryCity,
      :actNumber,
      :registrationDate,
      :notaryNumber,
      :nameOfTheNotary,
      :numeroCatastro,
      :gender,
      :electronicSignatureSerialNumber,
      :electronicSignatureSerialNumberC,
      :latitude,
      :longitude,
      :origen
    )`,
    { replacements: { ...commerce }, raw: true, plain: false }
  );
}

function update(updateInfo, where) {
  return Commerces.update(updateInfo, { where });
}

function save(query) {
  return Commerces.create({ ...query });
}

function findPaginate(query, options) {
  return paginate(options, Commerces, { ...query });
}

function findAll(query) {
  return Commerces.findAll({ ...query });
}

module.exports = {
  create,
  findOne,
  findPaginate,
  findAll,
  update,
  save
};
