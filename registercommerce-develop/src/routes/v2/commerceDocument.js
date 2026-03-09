const router = require('express').Router();
const formidableMiddleware = require('express-formidable');
const { updateDoc, updateCommerceDocument, replaceSublaiDocs } = require('../../controller/commerceDocument/v2/updateDocument');
const { createCommerceDocumentV2, getSignedUrl } = require('../../controller/commerceDocument/v2/saveDocuments');
const { hasPermitsOauthCommerceService } = require('../../middleware/permits');
const getCommerceDocumentTypes = require('../../controller/commerceDocumentType');
const { sublaiDocsObservation } = require('../../controller/commerce/sublaiCommerceDocsWebhook');
const sendToSublai = require('../../controller/commerceDocument/v2/sendToSublai');

router.get(
  '/types',
  hasPermitsOauthCommerceService({ route: 'commerceService', passUser: true }),
  getCommerceDocumentTypes
);

router.post(
  '/replace-sublai',
  formidableMiddleware(),
  hasPermitsOauthCommerceService({ route: 'commerceService', passUser: true }),
  replaceSublaiDocs
);

router.put(
  '/sublai',
  hasPermitsOauthCommerceService({
    route: 'commerceService/create/sublai',
    passUser: true,
    service: ['SubIa']
  }),
  sublaiDocsObservation
);

router.put(
  '/:idDocument',
  hasPermitsOauthCommerceService({ route: 'commerceService/documents', passUser: true }),
  updateDoc
);

router.post(
  '/getSignedUrl',
  hasPermitsOauthCommerceService({ route: 'commerceService', passUser: true }),
  getSignedUrl
);

router.post(
  '/:idCommerce',
  formidableMiddleware(),
  hasPermitsOauthCommerceService({ route: 'commerceService/documents', passUser: true }),
  createCommerceDocumentV2
);

router.put(
  '/:idDocument/replace',
  formidableMiddleware(),
  hasPermitsOauthCommerceService({ route: 'commerceService/documents', passUser: true }),
  updateCommerceDocument
);

router.post(
  '/send-sublai/:idCommerce',
  hasPermitsOauthCommerceService({ route: 'commerceService/documents', passUser: true }),
  sendToSublai
);

module.exports = router;
