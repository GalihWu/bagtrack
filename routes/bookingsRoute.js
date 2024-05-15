const router = require('express').Router();
const authMiddleware = require('../middlewares/authMiddleware');
const Booking = require('../models/bookingsModel');
const Baglog = require('../models/baglogModel');
const stripe = require('stripe')(process.env.stripe_key);
const { v4: uuidv4 } = require('uuid');

// book a seat
router.post('/book-seat', authMiddleware, async (req, res) => {
  try {
    const newBooking = new Booking({
      ...req.body,
      user: req.body.userId,
    });
    await newBooking.save();
    const baglog = await Baglog.findById(req.body.baglog);
    // baglog.seatsBooked = [...baglog.seatsBooked, ...req.body.seats];
    await baglog.save();
    res.status(200).send({
      message: 'Booking successful',
      data: newBooking,
      success: true,
    });
  } catch (error) {
    res.status(500).send({
      message: 'Booking failed',
      data: error,
      success: false,
    });
  }
});

// make payment

router.post('/make-payment', authMiddleware, async (req, res) => {
  try {
    const { token, amount } = req.body;
    const customer = await stripe.customers.create({
      email: token.email,
      source: token.id,
    });
    const payment = await stripe.charges.create(
      {
        amount: amount,
        currency: 'inr',
        customer: customer.id,
        receipt_email: token.email,
      },
      {
        idempotencyKey: uuidv4(),
      }
    );

    if (payment) {
      res.status(200).send({
        message: 'Payment successful',
        data: {
          transactionId: payment.source.id,
        },
        success: true,
      });
    } else {
      res.status(500).send({
        message: 'Payment failed',
        data: error,
        success: false,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: 'Payment failed',
      data: error,
      success: false,
    });
  }
});

// get bookings by user id
router.post('/get-bookings-by-user-id', authMiddleware, async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.body.userId })
      .populate('baglog')
      .populate('user');
    res.status(200).send({
      message: 'Bookings fetched successfully',
      data: bookings,
      success: true,
    });
  } catch (error) {
    res.status(500).send({
      message: 'Bookings fetch failed',
      data: error,
      success: false,
    });
  }
});

// get bookings by id
router.post('/get-bookings-by-id', authMiddleware, async (req, res) => {
  try {
    const bookings = await Booking.find(req.body._id).populate('baglog');
    res.status(200).send({
      message: 'Bookings fetched successfully',
      data: bookings,
      success: true,
    });
  } catch (error) {
    res.status(500).send({
      message: 'Bookings fetch failed',
      data: error,
      success: false,
    });
  }
});

// get all bookings
router.post('/get-all-bookings', authMiddleware, async (req, res) => {
  try {
    const bookings = await Booking.find().populate('baglog').populate('user');
    res.status(200).send({
      message: 'Bookings fetched successfully',
      data: bookings,
      success: true,
    });
  } catch (error) {
    res.status(500).send({
      message: 'Bookings fetch failed',
      data: error,
      success: false,
    });
  }
});

// delete-bookings

router.post('/delete-booking', authMiddleware, async (req, res) => {
  try {
    await Booking.findByIdAndDelete(req.body._id);
    return res.status(200).send({
      success: true,
      message: 'Booking deleted successfully',
    });
  } catch (error) {
    res.status(500).send({ success: false, message: error.message });
  }
});

// update-bookings

router.post('/update-booking', authMiddleware, async (req, res) => {
  try {
    await Booking.findByIdAndUpdate(req.body._id, req.body);
    return res.status(200).send({
      success: true,
      message: 'Booking updated successfully',
    });
  } catch (error) {
    res.status(500).send({ success: false, message: error.message });
  }
});

module.exports = router;
