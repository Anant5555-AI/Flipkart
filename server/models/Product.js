const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please enter product title'],
    trim: true
  },
  price: {
    type: Number,
    required: [true, 'Please enter product price'],
    min: [0, 'Price cannot be negative']
  },
  originalPrice: {
    type: Number,
    min: [0, 'Original price cannot be negative']
  },
  image: {
    type: String,
    required: [true, 'Please enter product image URL']
  },
  images: [{
    type: String
  }],
  category: {
    type: String,
    required: [true, 'Please enter product category'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Please enter product description']
  },
  rating: {
    rate: {
      type: Number,
      min: [0, 'Rating cannot be less than 0'],
      max: [5, 'Rating cannot be more than 5'],
      default: 0
    },
    count: {
      type: Number,
      min: [0, 'Review count cannot be negative'],
      default: 0
    }
  },
  discount: {
    type: Number,
    min: [0, 'Discount cannot be negative'],
    max: [100, 'Discount cannot be more than 100'],
    default: 0
  },
  brand: {
    type: String,
    required: [true, 'Please enter product brand'],
    trim: true
  },
  stock: {
    type: Number,
    min: [0, 'Stock cannot be negative'],
    default: 0
  },
  inStock: {
    type: Boolean,
    default: true
  }
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for discounted price
productSchema.virtual('discountedPrice').get(function() {
  return this.originalPrice ? this.originalPrice - (this.originalPrice * this.discount / 100) : this.price;
});

// Index for better search performance
productSchema.index({ title: 'text', description: 'text', category: 'text', brand: 'text' });

module.exports = mongoose.model('Product', productSchema);
