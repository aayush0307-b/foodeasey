const Food = require('../models/Food');
const sendResponse = require('../utils/sendResponse');

// @desc    Get all foods
// @route   GET /api/foods
// @access  Public
const getFoods = async (req, res, next) => {
  try {
    const { search, category, vendorId, isVeg, minPrice, maxPrice } = req.query;
    const query = { isAvailable: true };

    if (search) query.name = { $regex: search, $options: 'i' };
    if (category) query.category = category;
    if (vendorId) query.vendorId = vendorId;
    if (isVeg !== undefined) query.isVeg = isVeg === 'true';
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    const foods = await Food.find(query)
      .populate('vendorId', 'name location isOpen')
      .sort({ rating: -1 });
    sendResponse(res, 200, true, 'Foods fetched', foods);
  } catch (err) {
    next(err);
  }
};

// @desc    Get popular foods
// @route   GET /api/foods/popular
// @access  Public
const getPopularFoods = async (req, res, next) => {
  try {
    const foods = await Food.find({ isAvailable: true })
      .populate('vendorId', 'name isOpen deliveryTime')
      .sort({ rating: -1, totalRatings: -1 })
      .limit(10);
    sendResponse(res, 200, true, 'Popular foods fetched', foods);
  } catch (err) {
    next(err);
  }
};

// @desc    Get foods by vendor
// @route   GET /api/foods/vendor/:vendorId
// @access  Public
const getFoodsByVendor = async (req, res, next) => {
  try {
    const foods = await Food.find({ vendorId: req.params.vendorId, isAvailable: true });
    sendResponse(res, 200, true, 'Vendor foods fetched', foods);
  } catch (err) {
    next(err);
  }
};

// @desc    Get single food
// @route   GET /api/foods/:id
// @access  Public
const getFoodById = async (req, res, next) => {
  try {
    const food = await Food.findById(req.params.id).populate(
      'vendorId',
      'name location rating isOpen deliveryTime'
    );
    if (!food) {
      res.status(404);
      return next(new Error('Food not found'));
    }
    sendResponse(res, 200, true, 'Food fetched', food);
  } catch (err) {
    next(err);
  }
};

// @desc    Create food
// @route   POST /api/foods
// @access  Private (vendor/admin)
const createFood = async (req, res, next) => {
  try {
    const food = await Food.create(req.body);
    sendResponse(res, 201, true, 'Food created', food);
  } catch (err) {
    next(err);
  }
};

// @desc    Update food
// @route   PUT /api/foods/:id
// @access  Private (vendor/admin)
const updateFood = async (req, res, next) => {
  try {
    const food = await Food.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!food) {
      res.status(404);
      return next(new Error('Food not found'));
    }
    sendResponse(res, 200, true, 'Food updated', food);
  } catch (err) {
    next(err);
  }
};

// @desc    Delete food
// @route   DELETE /api/foods/:id
// @access  Private (vendor/admin)
const deleteFood = async (req, res, next) => {
  try {
    const food = await Food.findByIdAndDelete(req.params.id);
    if (!food) {
      res.status(404);
      return next(new Error('Food not found'));
    }
    sendResponse(res, 200, true, 'Food deleted');
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getFoods,
  getFoodById,
  getFoodsByVendor,
  createFood,
  updateFood,
  deleteFood,
  getPopularFoods,
};
