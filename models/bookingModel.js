const mongoose = require('mongoose');
const validator = require('validator');
const bookingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  foods: [
    {
      food: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Food',
      },
      quantity: {
        type: Number,
        min: 1,
        max: 100,
        default: 1,
      },
    },
  ],
  addressShipping: {
   //GeoJSON,
   type: {
    type: String,
    default: 'Point',
    enum: ['Point'],
    },
    coordinates: [Number],
    city: String,
    line: String,
    postal: String,
    country: String,
    description: String,
  },
  infoUserReceive: {
    name: String,
    phone: String
  },
  price: Number,
  createAt: {
    type: Date,
    default: Date.now(),
  },
  isShipped: {
    type: Boolean,
    default: false
  }
});
const Booking = mongoose.model('Booking', bookingSchema);
module.exports = Booking;
