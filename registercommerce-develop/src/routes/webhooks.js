const router = require('express').Router();
const {
  getWeetrustWebhooks,
  createWeetrustWebhooks,
  completedDocument,
  updateWebhookUrl,
  deleteWeetrustWebhookById
} = require('../controller/webhooks/weetrustWebhooks');
const { hasPermitsOauthCommerceService } = require('../middleware/permits');

router.get(
  '/',
  hasPermitsOauthCommerceService({
    route: 'commerceService/contractWeetrust',
    service: ['weetrust']
  }),
  getWeetrustWebhooks
);

router.post(
  '/',
  hasPermitsOauthCommerceService({
    route: 'commerceService/contractWeetrust',
    service: ['weetrust']
  }),
  createWeetrustWebhooks
);

router.put(
  '/',
  hasPermitsOauthCommerceService({
    route: 'commerceService/contractWeetrust',
    service: ['weetrust']
  }),
  updateWebhookUrl
);

router.delete(
  '/:id',
  hasPermitsOauthCommerceService({
    route: 'commerceService/contractWeetrust',
    service: ['weetrust']
  }),
  deleteWeetrustWebhookById
);

router.post(
  '/completed-contract',
  hasPermitsOauthCommerceService({
    route: 'commerceService/contractWeetrust',
    service: ['weetrust']
  }),
  completedDocument
);

module.exports = router;
