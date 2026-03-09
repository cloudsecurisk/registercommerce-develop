const router = require('express').Router();
const amexController = require('../controller/amex/records');
const { hasPermitsOauthCommerceService } = require('../middleware/permits');

router.get(
  '/',
  hasPermitsOauthCommerceService({ route: 'amex/addMerchantAmex', passUser: true }),
  amexController.getAmexRecords
);

router.put(
  '/',
  hasPermitsOauthCommerceService({ route: 'amex/addMerchantAmex', passUser: true }),
  amexController.updateAmexRecords
);

router.get(
  '/recordFiles/:idEcommerce',
  hasPermitsOauthCommerceService({ route: 'amex/addMerchantAmex', passUser: true }),
  amexController.getRecordFiles
);

router.put(
  '/recordFiles/:idCommerce',
  hasPermitsOauthCommerceService({ route: 'amex/addMerchantAmex', passUser: true }),
  amexController.updateRecordFile
);

module.exports = router;
