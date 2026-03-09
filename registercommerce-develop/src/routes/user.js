const router = require('express').Router();

const { hasPermitsOauthCommerceService } = require('../middleware/permits');
const { getCommers } = require('../controller/commerce/commerceDetailsPagination');

router.get(
  '/:idUser/commerce',
  hasPermitsOauthCommerceService({ route: 'commerceService/commerceList', passUser: true }),
  getCommers
);

module.exports = router;
