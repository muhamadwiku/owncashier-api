const mongoose = require('mongoose');

const MONGO_FREE_LIMIT_MB = 512;


// Mendapatkan daftar nama semua collection di database
const listAllCollections = async (req, res) => {
  try {
    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();
    const collectionNames = collections.map(col => col.name);
    res.json({ collections: collectionNames });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getDatabaseStats = async (req, res) => {
  try {
    const db = mongoose.connection.db;
    const stats = await db.stats();
    // storageSize dan dataSize dalam byte, konversi ke MB
    const storageSizeMB = (stats.storageSize / (1024 * 1024)).toFixed(2);
    const dataSizeMB = (stats.dataSize / (1024 * 1024)).toFixed(2);

    res.json({
      db: stats.db,
      collections: stats.collections,
      objects: stats.objects,
      storageSizeMB,
      dataSizeMB
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


const getCollectionsStats = async (req, res) => {
  try {
    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();
    const stats = [];

    for (const col of collections) {
      const colName = col.name;
      // Gunakan db.command untuk mendapatkan statistik koleksi
      const colStats = await db.command({ collStats: colName });
      const storageSizeMB = (colStats.storageSize / (1024 * 1024));
      const percentOfLimit = ((storageSizeMB / MONGO_FREE_LIMIT_MB) * 100).toFixed(2);

      stats.push({
        collection: colName,
        storageSizeMB: storageSizeMB.toFixed(2),
        percentOfLimit: percentOfLimit
      });
    }

    res.json({
      mongoFreeLimitMB: MONGO_FREE_LIMIT_MB,
      collections: stats
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


module.exports = {
  listAllCollections,
  getDatabaseStats,
  getCollectionsStats
 };