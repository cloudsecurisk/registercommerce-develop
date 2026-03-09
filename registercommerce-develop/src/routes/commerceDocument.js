const router = require('express').Router();
const formidableMiddleware = require('express-formidable');
const { hasPermitsOauthCommerceService } = require('../middleware/permits');
const saveCommerceDocumentController = require('../controller/commerceDocument/saveDocuments');
const updateCommerceDocumentController = require('../controller/commerceDocument/updateDocument');
const getCommerceDocumentController = require('../controller/commerceDocument/getDocuments');

router.post(
  '/:id',
  formidableMiddleware(),
  hasPermitsOauthCommerceService({ route: 'commerceService/documents', passUser: true }),
  saveCommerceDocumentController.createCommerceDocument
);

router.put(
  '/:id',
  formidableMiddleware(),
  hasPermitsOauthCommerceService({ route: 'commerceService/documents', passUser: true }),
  updateCommerceDocumentController.updateCommerceDocument
);

router.get(
  '/:id',
  hasPermitsOauthCommerceService({ route: 'commerceService/commerceList', passUser: true }),
  getCommerceDocumentController.getDocuments
);

module.exports = router;
