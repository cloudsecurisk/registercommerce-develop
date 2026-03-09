const router = require('express').Router();
const { hasPermitsOauthCommerceService } = require('../middleware/permits');
const { createComment } = require('../controller/comments');

router.post(
  '/',
  hasPermitsOauthCommerceService({ route: 'commerceService/commerceList/admin', passUser: true }),
  createComment
);

module.exports = router;
