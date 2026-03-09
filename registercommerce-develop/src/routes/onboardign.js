const router = require('express').Router();
const { onboarding, updateOnboarding } = require('../controller/onboarding');
const { hasPermitsOauthCommerceService } = require('../middleware/permits');

router.post(
  '/',
  hasPermitsOauthCommerceService({ route: 'commerceService/onboarding/user', passUser: true }),
  onboarding
);

router.put(
  '/update/:idOnboarding',
  hasPermitsOauthCommerceService({ route: 'commerceService/onboarding/user', passUser: true }),
  updateOnboarding
);

module.exports = router;
