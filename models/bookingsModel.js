const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
  {
    baglog: {
      type: mongoose.Schema.ObjectId,
      ref: 'baglogs',
      required: true,
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'users',
      required: true,
    },
    totalOrder: {
      type: Number,
      required: true,
    },
    totalPrice: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      default: 'Menunggu Antrean',
    },
    estimation: {
      type: Date,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('bookings', bookingSchema);
