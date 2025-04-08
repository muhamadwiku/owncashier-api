// controllers/combinedController.js
const Transaction = require('../models/transaction');

// Helper function untuk escape regex
const escapeRegex = (text) => {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

exports.getAllData = async (req, res) => {
  try {
    const { search } = req.query;
    
    // Filter tanggal hari ini
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    const endOfToday = new Date();
    endOfToday.setHours(23, 59, 59, 999);

    const pipeline = [
      // Filter data transaksi hari ini
      {
        $match: {
          createdAt: {
            $gte: startOfToday,
            $lt: endOfToday
          }
        }
      },
      // Lookup ke collection user
      {
        $lookup: {
          from: "owncashier-user",
          localField: "numberPlates",
          foreignField: "numberPlates",
          as: "userData"
        }
      },
      // Lookup ke collection package
      {
        $lookup: {
          from: "owncashier-package",
          localField: "packageName",
          foreignField: "packageName",
          as: "packageData"
        }
      },
      { $unwind: "$userData" },
      { $unwind: "$packageData" }
    ];

    // Tambahkan kondisi pencarian jika ada parameter search
    if (search) {
      const regex = new RegExp(escapeRegex(search), 'i');
      pipeline.push({
        $match: {
          $or: [
            { "userData.customerName": { $regex: regex } },
            { "numberPlates": { $regex: regex } },
            { "userData.email": { $regex: regex } },
            { "packageName": { $regex: regex } },
            { "packageData.description": { $regex: regex } },
            { "userData.phoneNumber": { $regex: regex } }
          ]
        }
      });
    }

    // Tambahkan projection
    pipeline.push({
      $project: {
        _id: 0,
        customerName: "$userData.customerName",
        numberPlates: 1,
        email: "$userData.email",
        packageName: 1,
        price: "$packageData.price",
        description: "$packageData.description",
        phoneNumber: "$userData.phoneNumber",
        createdAt: 1,
        updatedAt: 1
      }
    });

    const result = await Transaction.aggregate(pipeline);
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};