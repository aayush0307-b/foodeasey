const Order = require('../models/Order');
const sendResponse = require('../utils/sendResponse');

// @desc    Place an order
// @route   POST /api/orders
// @access  Private
const placeOrder = async (req, res, next) => {
  try {
    const { items, totalAmount, vendorId, deliveryAddress, paymentMethod } = req.body;

    if (!items || items.length === 0) {
      res.status(400);
      return next(new Error('No items in order'));
    }

    const order = await Order.create({
      userId: req.user._id,
      vendorId,
      items,
      totalAmount,
      deliveryAddress,
      paymentMethod: paymentMethod || 'cod',
      status: 'pending',
      paymentStatus: paymentMethod === 'cod' ? 'pending' : 'paid',
    });

    sendResponse(res, 201, true, 'Order placed successfully', order);
  } catch (err) {
    next(err);
  }
};

// @desc    Get my orders
// @route   GET /api/orders/my-orders
// @access  Private
const getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ userId: req.user._id })
      .populate('vendorId', 'name image')
      .sort({ createdAt: -1 });
    sendResponse(res, 200, true, 'Orders fetched', orders);
  } catch (err) {
    next(err);
  }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('userId', 'name email')
      .populate('vendorId', 'name image location');

    if (!order) {
      res.status(404);
      return next(new Error('Order not found'));
    }

    if (
      order.userId._id.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin' &&
      req.user.role !== 'vendor'
    ) {
      res.status(403);
      return next(new Error('Not authorized to view this order'));
    }

    sendResponse(res, 200, true, 'Order fetched', order);
  } catch (err) {
    next(err);
  }
};

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private (vendor/admin)
const updateOrderStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!order) {
      res.status(404);
      return next(new Error('Order not found'));
    }
    sendResponse(res, 200, true, 'Order status updated', order);
  } catch (err) {
    next(err);
  }
};

// @desc    Get vendor orders
// @route   GET /api/orders/vendor-orders
// @access  Private (vendor)
const getVendorOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ vendorId: req.query.vendorId })
      .populate('userId', 'name email phone')
      .sort({ createdAt: -1 });
    sendResponse(res, 200, true, 'Vendor orders fetched', orders);
  } catch (err) {
    next(err);
  }
};

// @desc    Cancel order
// @route   PUT /api/orders/:id/cancel
// @access  Private
const cancelOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      res.status(404);
      return next(new Error('Order not found'));
    }
    if (order.status !== 'pending') {
      res.status(400);
      return next(new Error('Cannot cancel order that has already been confirmed'));
    }
    order.status = 'cancelled';
    await order.save();
    sendResponse(res, 200, true, 'Order cancelled', order);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  placeOrder,
  getMyOrders,
  getOrderById,
  updateOrderStatus,
  getVendorOrders,
  cancelOrder,
};
