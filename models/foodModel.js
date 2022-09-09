const mongoose = require('mongoose');
const foodSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: true,
    unique: true
  },
  price: {
    type: Number,
    required: [true, 'A food must have a price!'],
  },
  images: [
    {
      type: String,
      required: [true, 'A tour must have a image'],
    },
  ],
  createAt: {
    type: Date,
    default: Date.now(),
    select: false,
  },
  description: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['bugger', 'other', 'noodle', 'drink', 'salas'],
    default: 'other'
  }
});
const Food = mongoose.model('Food', foodSchema);
module.exports = Food;
