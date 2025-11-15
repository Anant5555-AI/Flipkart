const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({

  // Basic info
  title: {
    type: String,
    required: true,
    trim: true
  },

  description: {
    type: String,
    required: true
  },

  category: {
    type: String,
    required: true,
    trim: true
  },

  // Pricing
  price: {
    type: Number,
    required: true,
    min: 0
  },

  // DummyJSON uses this instead of "discount"
  discountPercentage: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },

  // Rating (DummyJSON uses simple number)
  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0
  },

  stock: {
    type: Number,
    min: 0,
    default: 0
  },

  brand: {
    type: String,
    required: true
  },

  // Images
  thumbnail: {
    type: String, // main image
    required: true
  },

  images: [{
    type: String
  }],

  // Optional fields in DummyJSON
  sku: String,
  weight: Number,
  dimensions: {
    width: Number,
    height: Number,
    depth: Number
  },

  warrantyInformation: String,
  shippingInformation: String,
  availabilityStatus: String,

  // reviews is array of objects
  reviews: [
    {
      rating: Number,
      comment: String,
      date: String,
      reviewerName: String,
      reviewerEmail: String
    }
  ],

  returnPolicy: String,
  minimumOrderQuantity: Number,

  meta: {
    createdAt: String,
    updatedAt: String,
    barcode: String,
    qrCode: String
  }

}, { timestamps: true });

module.exports = mongoose.model("Product", productSchema);
