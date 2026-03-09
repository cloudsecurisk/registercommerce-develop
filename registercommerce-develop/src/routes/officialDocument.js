const router = require('express').Router();
// const { oauth } = require('../utils');
const officialDocumentController = require('../controller/officialDocument/get');

router.get(
  '/',
  // oauth({ route: 'officialDocument' }),
  officialDocumentController.getOfficialDocument
);

module.exports = router;
