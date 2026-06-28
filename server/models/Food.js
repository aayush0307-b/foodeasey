const mongoose = require('mongoose');

const foodSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Food name is required'],
      trim: true,
    },
    description: {
      type: String,
      default: '',
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: 0,
    },
    discountPrice: {
      type: Number,
      min: 0,
    },
    image: {
      type: String,
      default: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800',
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: ['Burgers', 'Pizza', 'Biryani', 'Chinese', 'Desserts', 'Drinks', 'Salads', 'Sandwiches', 'Momos', 'South Indian', 'North Indian', 'Fast Food', 'Healthy', 'Chaat', 'Bakery', 'Beverages', 'Other'],
    },
    vendorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Vendor',
      required: true,
    },
    rating: {
      type: Number,
      default: 4.0,
      min: 0,
      max: 5,
    },
    totalRatings: {
      type: Number,
      default: 0,
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
    isVeg: {
      type: Boolean,
      default: false,
    },
    preparationTime: {
      type: String,
      default: '20-30 min',
    },
    tags: [String],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Food', foodSchema);
