const express = require('express');
const router = express.Router();
const {
  listAllCollections,
  getDatabaseStats,
  getCollectionsStats
} = require('../../controllers/v1/dbstatisticsController');

// Daftar semua nama collection
router.get('/collections', listAllCollections);

// Statistik database (total storage, data size, dll)
router.get('/db-stats', getDatabaseStats);

// Statistik storage per collection dan persentase dari 512MB
router.get('/collections-stats', getCollectionsStats);

module.exports = router;
