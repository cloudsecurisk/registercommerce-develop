const router = require('express').Router();
const commerce = require('./commerce');
const commerceDocument = require('./commerceDocument');
const lineBussiness = require('./lineBussiness');
const countries = require('./countries');
const officialDocument = require('./officialDocument');
const states = require('./states');
const cities = require('./cities');
const executive = require('./executive');
const contract = require('./contract');
const contractWeetrust = require('./contractWeetrust');
const user = require('./user');
const organizations = require('./organizations');
const amex = require('./amex');
const sgs = require('./sgs');
const webhooks = require('./webhooks');
const onboarding = require('./onboardign');
const regcheq = require('./regcheq');

router.use('/commerce', commerce);
router.use('/commerceDocument', commerceDocument);
router.use('/linebussiness', lineBussiness);
router.use('/countries', countries);
router.use('/officialDocument', officialDocument);
router.use('/states', states);
router.use('/city', cities);
router.use('/contract', contract);
router.use('/contract-weetrust', contractWeetrust);
router.use('/executive', executive);
router.use('/user', user);
router.use('/organizations', organizations);
router.use('/amex', amex);
router.use('/sgs', sgs);
router.use('/webhooks/weetrust', webhooks);
router.use('/onboarding', onboarding);
router.use('/regcheq', regcheq);

/** ROUTES V2 */

const commerceV2 = require('./v2/commerce');
const commerceDocumentV2 = require('./v2/commerceDocument');

router.use('/v2/commerce', commerceV2);
router.use('/v2/commerceDocument', commerceDocumentV2);

module.exports = router;
