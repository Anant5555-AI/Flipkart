const Order = require('../models/Order');
const Product = require('../models/Product');
const asyncHandler = require('express-async-handler');
const mongoose = require('mongoose');

const createOrder = asyncHandler(async (req, res) => {
  console.log('---------------- CREATE ORDER REQUEST RECEIVED ----------------');
  console.log('Body:', JSON.stringify(req.body, null, 2));

  const {
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice
  } = req.body;

  if (orderItems && orderItems.length === 0) {
    res.status(400);
    throw new Error('No order items');
  } else {
    // 1. Create Order with Validated Items
    const validItems = orderItems.filter(item => {
      // Allow ObjectId or if we change schema later, but for now check validity if we want to query DB
      if (mongoose.Types.ObjectId.isValid(item.id)) return true;
      // If it's a legacy number ID like 10, we can accept it for the Order (since schema is Mixed)
      // BUT we cannot query Product.findById with it directly.
      return true;
    });

    const order = new Order({
      user: req.user._id,
      items: orderItems.map(item => ({
        product: item.id,
        name: item.title,
        image: item.image,
        price: item.price,
        quantity: item.quantity
      })),
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
    });

    const createdOrder = await order.save();

    // 2. Decrement Stock & Real-time Update
    for (const item of orderItems) {
      // Robust check: valid 24-char hex string
      const isValidObjectId = mongoose.Types.ObjectId.isValid(item.id) && String(item.id).length === 24;

      if (isValidObjectId) {
        const product = await Product.findById(item.id);
        if (product) {
          product.stock = Math.max(0, product.stock - item.quantity); // Prevent negative stock
          await product.save();

          // 3. Emit Event via Socket.io
          if (req.io) {
            req.io.emit('product:update', {
              id: product._id,
              stock: product.stock
            });
          }
        }
      } else {
        console.warn(`Skipping stock update for invalid Product ID: ${item.id} (Type: ${typeof item.id})`);
      }
    }

    res.status(201).json(createdOrder);
  }
});


const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate('user', 'name email');

  if (order) {
    res.json(order);
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
});


const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id });
  res.json(orders);
});

module.exports = {
  createOrder,
  getOrderById,
  getMyOrders
};
