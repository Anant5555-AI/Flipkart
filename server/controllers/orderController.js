const Order = require('../models/Order');
const Product = require('../models/Product');
const asyncHandler = require('express-async-handler');

const createOrder = asyncHandler(async (req, res) => {
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
    // 1. Create Order
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
    // Using for...of loop to handle async/await correctly
    for (const item of orderItems) {
      const product = await Product.findById(item.id);
      if (product) {
        product.stock = Math.max(0, product.stock - item.quantity); // Prevent negative stock
        await product.save();

        // 3. Emit Event via Socket.io
        // req.io is attached in app.js
        if (req.io) {
          req.io.emit('product:update', {
            id: product._id,
            stock: product.stock
          });
        }
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
