const router = require('express').Router();
const { hasPermitsOauth, hasPermitsOauthCommerceService, hasPermitsOauthWToken } = require('../middleware/permits');
const commerceCreation = require('../controller/commerce/commerceCreation');
const commercePermitsController = require('../controller/commerce/commercePermits');
const commerceListController = require('../controller/commerce/commerceList');
const commerceDetailsController = require('../controller/commerce/commerceDetails');
const commerceUpdateDetails = require('../controller/commerce/commerceUpdateDetails');
const { getAllCommerces, getUsersCommerce } = require('../controller/commerce/commerceDetailsPagination');
const { commerceSubAI } = require('../controller/commerce/commerceSubAI');
const getCommerceInfoById = require('../middleware/getCommerceInfoById');
const getCommerceUser = require('../controller/commerce/commerceUser');
const { getNewCommercesList } = require('../controller/commerce/newCommercesList');
const { sublaiCommerceDocsWebhook } = require('../controller/commerce/sublaiCommerceDocsWebhook');


router.get(
  '/',
  hasPermitsOauthCommerceService({ route: 'commerceService/commerceList/admin', passUser: true }),
  getAllCommerces
);

router.get(
  '/:idCommerce/alert',
  hasPermitsOauthCommerceService({
    route: 'commerceService/data/sublai',
    passUser: true,
    service: ['SubIa']
  }),
  commerceSubAI
);

router.get(
  '/:idCommerce/users',
  hasPermitsOauthCommerceService({ route: 'commerceService/commerceList/admin', passUser: true }),
  getUsersCommerce
);

router.get(
  '/manager/list',
  hasPermitsOauthCommerceService({ route: 'commerceService/commerceList/admin', passUser: true }),
  getNewCommercesList
);

router.post(
  '/',
  hasPermitsOauthCommerceService({ route: 'commerceService', passUser: true }),
  // commerceValidation.isValidCommerce,
  commerceCreation.createCommerce
);

router.put(
  '/sublai/commerce',
  hasPermitsOauthCommerceService({
    route: 'commerceService/create/sublai',
    passUser: true,
    service: ['SubIa']
  }),
  // commerceValidation.isValidSublaiCommerce,
  sublaiCommerceDocsWebhook
);

router.post(
  '/migrationMpos',
  hasPermitsOauthCommerceService({ route: 'commerceService', passUser: true }),
  commerceCreation.migrationCommerceMpos
);

router.get(
  '/list',
  hasPermitsOauthCommerceService({ route: 'commerceService/commerceList', passUser: true }),
  commerceListController.getCommerceList
);

router.get(
  '/:idCommerce',
  hasPermitsOauthCommerceService({
    route: 'commerceService/commerceList',
    passUser: true,
    service: ['Espiral Card Core']
  }),
  commerceDetailsController.getEcommerceDetails
);

router.get(
  '/permits/:idCommerce',
  hasPermitsOauth,
  commercePermitsController.getCommercePermits
);

router.get(
  '/permitsWToken/:idCommerce',
  hasPermitsOauthWToken,
  commercePermitsController.getCommercePermits
);

router.put(
  '/:idCommerce',
  hasPermitsOauthCommerceService({ route: 'commerceService/updateInfo', passUser: true }),
  commerceUpdateDetails.updateCommerceDatails
);

router.put(
  '/updateAddress/:idCommerce',
  getCommerceInfoById,
  hasPermitsOauthCommerceService({ route: 'commerceService/updateInfo', passUser: true }),
  commerceUpdateDetails.updateCommerceAddress
);

router.put(
  '/updateLegalRepre/:idLegalRepre',
  hasPermitsOauthCommerceService({ route: 'commerceService/updateInfo', passUser: true }),
  commerceUpdateDetails.updateLegalRepresentative
);

router.put(
  '/updateFinancialInfo/:idCommerce',
  hasPermitsOauthCommerceService({ route: 'commerceService/updateInfo', passUser: true }),
  commerceUpdateDetails.updateFinancialInformation
);

router.get(
  '/user/:idCommerce',
  hasPermitsOauthCommerceService({
    route: 'commerceService/pushNotifications',
    passUser: true,
    service: ['Espiral Card Core', 'Notifications']
  }),
  getCommerceUser
);

router.put(
  '/:idCommerce/updateExecutive',
  hasPermitsOauthCommerceService({ route: 'commerceService/commerce/executive', passUser: true }),
  commerceUpdateDetails.updateExecutives
);

router.put(
  '/:idCommerce/updateStatus',
  hasPermitsOauthCommerceService({ route: 'commerceService/updateInfoStatus', passUser: true }),
  commerceUpdateDetails.updateCommerceStatus
);

module.exports = router;
