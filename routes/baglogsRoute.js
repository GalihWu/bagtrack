const router = require('express').Router();
const Baglog = require('../models/baglogModel');
const authMiddleware = require('../middlewares/authMiddleware');

// add-baglog

router.post('/add-baglog', authMiddleware, async (req, res) => {
  try {
    const existingBaglog = await Baglog.findOne({ name: req.body.name });
    if (existingBaglog) {
      return res.status(200).send({
        success: false,
        message: 'Baglog already exists',
      });
    }
    const newBaglog = new Baglog(req.body);
    await newBaglog.save();
    return res.status(200).send({
      success: true,
      message: 'Baglog added successfully',
    });
  } catch (error) {
    res.status(500).send({ success: false, message: error.message });
  }
});

// update-baglog

router.post('/update-baglog', authMiddleware, async (req, res) => {
  try {
    await Baglog.findByIdAndUpdate(req.body._id, req.body);
    return res.status(200).send({
      success: true,
      message: 'Baglog updated successfully',
    });
  } catch (error) {
    res.status(500).send({ success: false, message: error.message });
  }
});

// delete-baglog

router.post('/delete-baglog', authMiddleware, async (req, res) => {
  try {
    await Baglog.findByIdAndDelete(req.body._id);
    return res.status(200).send({
      success: true,
      message: 'Baglog deleted successfully',
    });
  } catch (error) {
    res.status(500).send({ success: false, message: error.message });
  }
});

// get-all-baglogs

router.post('/get-all-baglogs', authMiddleware, async (req, res) => {
  try {
    const baglogs = await Baglog.find(req.body);
    return res.status(200).send({
      success: true,
      message: 'Baglogs fetched successfully',
      data: baglogs,
    });
  } catch (error) {
    res.status(500).send({ success: false, message: error.message });
  }
});

// get-baglog-by-id

router.post('/get-baglog-by-id', authMiddleware, async (req, res) => {
  try {
    const baglog = await Baglog.findById(req.body._id);
    return res.status(200).send({
      success: true,
      message: 'Baglog fetched successfully',
      data: baglog,
    });
  } catch (error) {
    res.status(500).send({ success: false, message: error.message });
  }
});

module.exports = router;
