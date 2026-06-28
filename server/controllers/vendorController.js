const Vendor = require('../models/Vendor');
const Food = require('../models/Food');
const sendResponse = require('../utils/sendResponse');

// @desc    Get all vendors
// @route   GET /api/vendors
// @access  Public
const getVendors = async (req, res, next) => {
  try {
    const { search, isOpen, city } = req.query;
    const query = {};

    if (search) query.name = { $regex: search, $options: 'i' };
    if (isOpen !== undefined) query.isOpen = isOpen === 'true';
    if (city) query['location.city'] = { $regex: city, $options: 'i' };

    const vendors = await Vendor.find(query).sort({ rating: -1 });
    sendResponse(res, 200, true, 'Vendors fetched', vendors);
  } catch (err) {
    next(err);
  }
};

// @desc    Get single vendor with its foods
// @route   GET /api/vendors/:id
// @access  Public
const getVendorById = async (req, res, next) => {
  try {
    const vendor = await Vendor.findById(req.params.id);
    if (!vendor) {
      res.status(404);
      return next(new Error('Vendor not found'));
    }
    const foods = await Food.find({ vendorId: req.params.id, isAvailable: true });
    sendResponse(res, 200, true, 'Vendor fetched', { vendor, foods });
  } catch (err) {
    next(err);
  }
};

// @desc    Create vendor
// @route   POST /api/vendors
// @access  Private (admin)
const createVendor = async (req, res, next) => {
  try {
    const vendor = await Vendor.create({ ...req.body, ownerId: req.user._id });
    sendResponse(res, 201, true, 'Vendor created', vendor);
  } catch (err) {
    next(err);
  }
};

// @desc    Update vendor
// @route   PUT /api/vendors/:id
// @access  Private (vendor/admin)
const updateVendor = async (req, res, next) => {
  try {
    const vendor = await Vendor.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!vendor) {
      res.status(404);
      return next(new Error('Vendor not found'));
    }
    sendResponse(res, 200, true, 'Vendor updated', vendor);
  } catch (err) {
    next(err);
  }
};

// @desc    Get vendor by owner
// @route   GET /api/vendors/my-vendor
// @access  Private (vendor)
const getMyVendor = async (req, res, next) => {
  try {
    const vendor = await Vendor.findOne({ ownerId: req.user._id });
    if (!vendor) {
      res.status(404);
      return next(new Error('No vendor profile found'));
    }
    const foods = await Food.find({ vendorId: vendor._id });
    sendResponse(res, 200, true, 'My vendor fetched', { vendor, foods });
  } catch (err) {
    next(err);
  }
};

module.exports = { getVendors, getVendorById, createVendor, updateVendor, getMyVendor };
