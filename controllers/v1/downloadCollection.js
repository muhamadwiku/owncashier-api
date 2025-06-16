const mongoose = require('mongoose');
const XLSX = require('xlsx');
const archiver = require('archiver');
const stream = require('stream');

const downloadAllCollections = async (req, res) => {
  try {
    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();
    const result = {};

    for (const col of collections) {
      const colName = col.name;
      const data = await db.collection(colName).find({}).toArray();
      result[colName] = data;
    }

    res.setHeader('Content-Disposition', 'attachment; filename="owncashier-web-backup.json"');
    res.setHeader('Content-Type', 'application/json');
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


const downloadAllCollectionsXLSX = async (req, res) => {
  try {
    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();
    const workbook = XLSX.utils.book_new();

    for (const col of collections) {
      const colName = col.name;
      const data = await db.collection(colName).find({}).toArray();
      const cleanData = data.map(doc => ({ ...doc, _id: doc._id ? doc._id.toString() : undefined }));
      const worksheet = XLSX.utils.json_to_sheet(cleanData);
      XLSX.utils.book_append_sheet(workbook, worksheet, colName.substring(0, 31));
    }

    const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });

    res.setHeader('Content-Disposition', 'attachment; filename="owncashier-web-backup.xlsx"');
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.send(buffer);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


const downloadCollectionCSV = async (req, res) => {
  try {
    const db = mongoose.connection.db;
    const { collectionName } = req.params;
    const data = await db.collection(collectionName).find({}).toArray();
    const cleanData = data.map(doc => ({ ...doc, _id: doc._id ? doc._id.toString() : undefined }));
    const worksheet = XLSX.utils.json_to_sheet(cleanData);
    const csv = XLSX.utils.sheet_to_csv(worksheet);

    res.setHeader('Content-Disposition', `attachment; filename="${collectionName}.csv"`);
    res.setHeader('Content-Type', 'text/csv');
    res.send(csv);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


const downloadAllCollectionsCSV = async (req, res) => {
  try {
    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();

    res.setHeader('Content-Disposition', 'attachment; filename="owncashier-web-backup-csv.zip"');
    res.setHeader('Content-Type', 'application/zip');

    const archive = archiver('zip');
    archive.pipe(res);

    for (const col of collections) {
      const colName = col.name;
      const data = await db.collection(colName).find({}).toArray();
      const cleanData = data.map(doc => ({ ...doc, _id: doc._id ? doc._id.toString() : undefined }));
      const worksheet = XLSX.utils.json_to_sheet(cleanData);
      const csv = XLSX.utils.sheet_to_csv(worksheet);

      // Tambahkan file CSV ke archive
      archive.append(csv, { name: `${colName}.csv` });
    }

    await archive.finalize();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


module.exports = {
  downloadAllCollections,
  downloadAllCollectionsXLSX,
  downloadCollectionCSV,
  downloadAllCollectionsCSV
 };


