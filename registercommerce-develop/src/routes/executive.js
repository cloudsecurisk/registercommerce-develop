const router = require('express').Router();
const { hasPermitsOauthCommerceService } = require('../middleware/permits');
const getExecutivesController = require('../controller/executives/getExecutives');
const postExecutivesController = require('../controller/executives/postExecutives');
const putExecutivesController = require('../controller/executives/putExecutives');

router.get(
  '/',
  hasPermitsOauthCommerceService({ route: 'commerceService/commerceList/admin', passUser: true }),
  getExecutivesController.getExecutives
);

router.get(
  '/roleExecutive',
  hasPermitsOauthCommerceService({ route: 'commerceService/commerceList/admin', passUser: true }),
  getExecutivesController.getRoleExecutives
);

router.post(
  '/createExecutive',
  hasPermitsOauthCommerceService({ route: 'commerceService/executive', passUser: true }),
  postExecutivesController.createExecutive
);

router.put(
  '/:idExecutive/updateExecutive',
  hasPermitsOauthCommerceService({ route: 'commerceService/executive', passUser: true }),
  putExecutivesController.updateExecutive
);

router.post(
  '/:idExecutive/assignRoleExecutive',
  hasPermitsOauthCommerceService({ route: 'commerceService/executive', passUser: true }),
  postExecutivesController.assignRoleExecutive
);

router.post(
  '/distributor/:idCommerce',
  hasPermitsOauthCommerceService({
    route: 'commerceService/executive/get',
    passUser: true,
    service: ['mpos-transactions']
  }),
  getExecutivesController.getDistributor
);

module.exports = router;
