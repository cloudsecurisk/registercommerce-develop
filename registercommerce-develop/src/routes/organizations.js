const router = require('express').Router();
const organizationsController = require('../controller/organizations');
const { hasPermitsOauthCommerceService } = require('../middleware/permits');

router.post(
  '/',
  hasPermitsOauthCommerceService({ route: 'commerceService/organizarion', passUser: true }),
  organizationsController.createOrganization
);

router.delete(
  '/:idCommerce',
  hasPermitsOauthCommerceService({ route: 'commerceService/organizarion', passUser: true }),
  organizationsController.removeUserFromOrganization
);

// router.put(
//   '/:idCommerce',
//   hasPermitsOauthCommerceService({ route: 'commerceService/organizarion', passUser: true }),
//   organizationsController.updateOrganizationStatus
// );

module.exports = router;
