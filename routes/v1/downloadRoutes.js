const express = require('express');
const router = express.Router();
const { downloadAllCollections,
  downloadAllCollectionsXLSX,
  downloadCollectionCSV,
  downloadAllCollectionsCSV
  } = require('../../controllers/v1/downloadCollection');

router.get('/', downloadAllCollections);
router.get('/xlsx', downloadAllCollectionsXLSX);
router.get('/csv/:collectionname', downloadCollectionCSV);
router.get('/csv', downloadAllCollectionsCSV);

module.exports = router;