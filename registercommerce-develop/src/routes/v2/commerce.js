const router = require('express').Router();
const formidableMiddleware = require('express-formidable');
const commerceCreationV2 = require('../../controller/commerce/commerceCreationV2');
const { hasPermitsOauthCommerceService } = require('../../middleware/permits');

router.post(
  '/',
  formidableMiddleware(),
  hasPermitsOauthCommerceService({ route: 'commerceService', passUser: true }),
  commerceCreationV2
);

module.exports = router;
