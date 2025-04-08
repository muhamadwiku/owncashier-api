const Package = require('../models/package');


// Create
exports.createPackage = async (req, res) => {
  try {
    const package = new Package(req.body);
    await package.save();
    res.status(201).json(package);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Read All
exports.getAllPackages = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const packages = await Package?.find()
      .skip((page - 1) * limit)
      .limit(limit);

    res.json(packages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Read One
exports.getPackage = async (req, res) => {
  try {
    const package = await Package.findById(req.params.id);
    if (!package) return res.status(404).json({ error: 'Paket not found' });
    res.json(package);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update
exports.updatePackage = async (req, res) => {
  try {
    const package = await Package.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!package) return res.status(404).json({ error: 'Paket not found' });
    res.json(package);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete
exports.deletePackage = async (req, res) => {
  try {
    const package = await Package.findByIdAndDelete(req.params.id);
    if (!package) return res.status(404).json({ error: 'Paket not found' });
    res.json({ message: 'Paket deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};