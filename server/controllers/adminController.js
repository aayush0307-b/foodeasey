const User = require('../models/User');
const Vendor = require('../models/Vendor');
const Order = require('../models/Order');
const Food = require('../models/Food');
const sendResponse = require('../utils/sendResponse');

// @desc    Get admin overview stats
// @route   GET /api/admin/stats
// @access  Private (admin)
const getAdminStats = async (req, res, next) => {
  try {
    const [totalUsers, totalVendors, totalOrders, totalFoods, pendingVendors] = await Promise.all([
      User.countDocuments({ role: 'user' }),
      Vendor.countDocuments(),
      Order.countDocuments(),
      Food.countDocuments(),
      Vendor.countDocuments({ status: 'pending' }),
    ]);

    const orders = await Order.find().sort({ createdAt: -1 }).limit(5).populate('userId', 'name');
    const totalRevenue = await Order.aggregate([
      { $match: { status: 'delivered' } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } },
    ]);

    sendResponse(res, 200, true, 'Admin stats fetched', {
      totalUsers,
      totalVendors,
      totalOrders,
      totalFoods,
      pendingVendors,
      totalRevenue: totalRevenue[0]?.total || 0,
      recentOrders: orders,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get all partner registrations (with filters)
// @route   GET /api/admin/partners
// @access  Private (admin)
const getAllPartners = async (req, res, next) => {
  try {
    const { status, search, partnerType } = req.query;
    const query = {};

    if (status && status !== 'all') query.status = status;
    if (partnerType && partnerType !== 'all') query.partnerType = partnerType;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { ownerName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { 'location.city': { $regex: search, $options: 'i' } },
      ];
    }

    const partners = await Vendor.find(query)
      .populate('ownerId', 'name email phone role')
      .sort({ createdAt: -1 });

    sendResponse(res, 200, true, 'Partners fetched', partners);
  } catch (err) {
    next(err);
  }
};

// @desc    Get single partner details
// @route   GET /api/admin/partners/:id
// @access  Private (admin)
const getPartnerById = async (req, res, next) => {
  try {
    const partner = await Vendor.findById(req.params.id).populate('ownerId', 'name email phone role createdAt');
    if (!partner) {
      res.status(404);
      return next(new Error('Partner not found'));
    }
    const foods = await Food.find({ vendorId: partner._id });
    const orders = await Order.find({ vendorId: partner._id });
    sendResponse(res, 200, true, 'Partner details fetched', { partner, foods, orders });
  } catch (err) {
    next(err);
  }
};

// @desc    Approve a partner registration
// @route   PATCH /api/admin/partners/:id/approve
// @access  Private (admin)
const approvePartner = async (req, res, next) => {
  try {
    const partner = await Vendor.findById(req.params.id);
    if (!partner) {
      res.status(404);
      return next(new Error('Partner not found'));
    }

    partner.status = 'active';
    partner.isOpen = true;
    await partner.save();

    // Also ensure the owner user has role=vendor
    if (partner.ownerId) {
      await User.findByIdAndUpdate(partner.ownerId, { role: 'vendor' });
    }

    sendResponse(res, 200, true, `Partner "${partner.name}" approved successfully`, partner);
  } catch (err) {
    next(err);
  }
};

// @desc    Reject a partner registration
// @route   PATCH /api/admin/partners/:id/reject
// @access  Private (admin)
const rejectPartner = async (req, res, next) => {
  try {
    const partner = await Vendor.findById(req.params.id);
    if (!partner) {
      res.status(404);
      return next(new Error('Partner not found'));
    }

    const { reason } = req.body;
    partner.status = 'rejected';
    partner.isOpen = false;
    if (reason) partner.rejectionReason = reason;
    await partner.save();

    sendResponse(res, 200, true, `Partner "${partner.name}" rejected`, partner);
  } catch (err) {
    next(err);
  }
};

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private (admin)
const getAllUsers = async (req, res, next) => {
  try {
    const { role, search } = req.query;
    const query = {};
    if (role && role !== 'all') query.role = role;
    if (search) query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
    ];
    const users = await User.find(query).sort({ createdAt: -1 });
    sendResponse(res, 200, true, 'Users fetched', users);
  } catch (err) {
    next(err);
  }
};

// @desc    Delete a partner/vendor record
// @route   DELETE /api/admin/partners/:id
// @access  Private (admin)
const deletePartner = async (req, res, next) => {
  try {
    const partner = await Vendor.findByIdAndDelete(req.params.id);
    if (!partner) {
      res.status(404);
      return next(new Error('Partner not found'));
    }
    sendResponse(res, 200, true, 'Partner deleted');
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getAdminStats,
  getAllPartners,
  getPartnerById,
  approvePartner,
  rejectPartner,
  getAllUsers,
  deletePartner,
};
