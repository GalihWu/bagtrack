const mongoose = require('mongoose');

const baglogSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  stock: {
    type: Boolean,
    default: true,
  },
  desc: {
    type: String,
    required: true,
  },
  img: {
    type: String,
    required: false,
  },
  price: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model('baglogs', baglogSchema);
