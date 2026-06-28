const User = require('../models/User');
const Vendor = require('../models/Vendor');
const Food = require('../models/Food');
const generateToken = require('../utils/generateToken');
const sendResponse = require('../utils/sendResponse');

// @desc    Register a new partner (vendor or restaurant)
// @route   POST /api/partners/register
// @access  Public
const registerPartner = async (req, res, next) => {
  try {
    const {
      // Basic info
      ownerName,
      businessName,
      mobileNumber,
      whatsappNumber,
      email,
      password,
      // Partner type
      partnerType,
      // Business details
      businessDescription,
      foodCategories,
      // Address
      shopAddress,
      city,
      state,
      pincode,
      // Location coordinates
      latitude,
      longitude,
      // Images
      logoImage,
      coverImage,
      galleryImages,
      // Timing
      openingTime,
      closingTime,
      // Verification
      govtIdProof,
      gstNumber,
      fssaiLicense,
      // Additional
      avgPrepTime,
      deliveryRadius,
      isVegOnly,
    } = req.body;

    if (!ownerName || !businessName || !email || !password) {
      res.status(400);
      return next(new Error('Please provide owner name, business name, email and password'));
    }

    // Check if email already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      res.status(400);
      return next(new Error('Email already registered'));
    }

    // Create user account with vendor role
    const user = await User.create({
      name: ownerName,
      email,
      phone: mobileNumber,
      password,
      role: 'vendor',
    });

    // Create vendor/restaurant profile with pending status
    const vendor = await Vendor.create({
      partnerType: partnerType || 'restaurant',
      ownerName,
      name: businessName,
      mobileNumber,
      whatsappNumber,
      email,
      description: businessDescription || '',
      foodCategories: foodCategories || [],
      cuisineTypes: foodCategories || [],
      location: {
        address: shopAddress || '',
        city: city || '',
        state: state || '',
        pincode: pincode || '',
        coordinates: {
          lat: latitude || 19.076,
          lng: longitude || 72.8777,
        },
      },
      logoImage: logoImage || '',
      image: logoImage || '',
      coverImage: coverImage || '',
      galleryImages: galleryImages || [],
      openingTime: openingTime || '09:00',
      closingTime: closingTime || '22:00',
      govtIdProof: govtIdProof || '',
      gstNumber: gstNumber || '',
      fssaiLicense: fssaiLicense || '',
      avgPrepTime: avgPrepTime || 20,
      deliveryRadius: deliveryRadius || 5,
      isVegOnly: isVegOnly || false,
      status: 'pending',
      ownerId: user._id,
    });

    // Issue JWT token
    generateToken(res, user._id);

    sendResponse(res, 201, true, 'Partner registration submitted successfully. Pending verification.', {
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
      vendor: {
        _id: vendor._id,
        name: vendor.name,
        partnerType: vendor.partnerType,
        status: vendor.status,
      },
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get partner dashboard data
// @route   GET /api/partners/dashboard
// @access  Private (vendor/admin)
const getPartnerDashboard = async (req, res, next) => {
  try {
    const vendor = await Vendor.findOne({ ownerId: req.user._id });
    if (!vendor) {
      res.status(404);
      return next(new Error('No partner profile found'));
    }

    const foods = await Food.find({ vendorId: vendor._id });

    const Order = require('../models/Order');
    const orders = await Order.find({ vendorId: vendor._id })
      .populate('userId', 'name phone email')
      .sort({ createdAt: -1 });

    const totalRevenue = orders
      .filter((o) => o.status === 'delivered')
      .reduce((sum, o) => sum + o.totalAmount, 0);

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayOrders = orders.filter((o) => new Date(o.createdAt) >= todayStart);
    const todayRevenue = todayOrders
      .filter((o) => o.status === 'delivered')
      .reduce((sum, o) => sum + o.totalAmount, 0);

    sendResponse(res, 200, true, 'Dashboard data fetched', {
      vendor,
      foods,
      orders,
      stats: {
        totalOrders: orders.length,
        activeMenuItems: foods.filter((f) => f.isAvailable).length,
        todayRevenue,
        totalRevenue,
        pendingOrders: orders.filter((o) => o.status === 'pending').length,
        todayOrders: todayOrders.length,
      },
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update partner business profile
// @route   PUT /api/partners/profile
// @access  Private (vendor/admin)
const updatePartnerProfile = async (req, res, next) => {
  try {
    const vendor = await Vendor.findOne({ ownerId: req.user._id });
    if (!vendor) {
      res.status(404);
      return next(new Error('No partner profile found'));
    }

    const allowedUpdates = [
      'name', 'description', 'mobileNumber', 'whatsappNumber',
      'openingTime', 'closingTime', 'isVegOnly', 'avgPrepTime',
      'deliveryRadius', 'logoImage', 'coverImage', 'galleryImages',
      'foodCategories', 'cuisineTypes', 'isOpen',
    ];

    allowedUpdates.forEach((field) => {
      if (req.body[field] !== undefined) vendor[field] = req.body[field];
    });

    // Handle nested location update
    if (req.body.location) {
      vendor.location = { ...vendor.location.toObject(), ...req.body.location };
    }

    const updated = await vendor.save();
    sendResponse(res, 200, true, 'Profile updated successfully', updated);
  } catch (err) {
    next(err);
  }
};

// @desc    Add a food item to partner's menu
// @route   POST /api/partners/menu
// @access  Private (vendor/admin)
const addMenuItem = async (req, res, next) => {
  try {
    const vendor = await Vendor.findOne({ ownerId: req.user._id });
    if (!vendor) {
      res.status(404);
      return next(new Error('No partner profile found'));
    }

    const {
      name, description, price, discountPrice,
      category, image, isVeg, preparationTime, isAvailable,
    } = req.body;

    // Map partner food categories to Food model enum values
    const validFoodCategories = [
      'Burgers', 'Pizza', 'Biryani', 'Chinese', 'Desserts', 'Drinks',
      'Salads', 'Sandwiches', 'Momos', 'South Indian', 'North Indian',
      'Fast Food', 'Healthy',
    ];
    const mappedCategory = validFoodCategories.includes(category) ? category : 'Fast Food';

    const food = await Food.create({
      name,
      description: description || '',
      price: Number(price),
      discountPrice: discountPrice ? Number(discountPrice) : undefined,
      category: mappedCategory,
      image: image || '',
      isVeg: isVeg || false,
      preparationTime: preparationTime || '20-30 min',
      isAvailable: isAvailable !== undefined ? isAvailable : true,
      vendorId: vendor._id,
    });

    sendResponse(res, 201, true, 'Menu item added', food);
  } catch (err) {
    next(err);
  }
};

// @desc    Edit a food item
// @route   PUT /api/partners/menu/:id
// @access  Private (vendor/admin)
const editMenuItem = async (req, res, next) => {
  try {
    const vendor = await Vendor.findOne({ ownerId: req.user._id });
    if (!vendor) {
      res.status(404);
      return next(new Error('No partner profile found'));
    }

    const food = await Food.findOne({ _id: req.params.id, vendorId: vendor._id });
    if (!food) {
      res.status(404);
      return next(new Error('Food item not found'));
    }

    const updatable = ['name', 'description', 'price', 'discountPrice', 'category', 'image', 'isVeg', 'preparationTime', 'isAvailable'];
    updatable.forEach((field) => {
      if (req.body[field] !== undefined) food[field] = req.body[field];
    });

    const updated = await food.save();
    sendResponse(res, 200, true, 'Menu item updated', updated);
  } catch (err) {
    next(err);
  }
};

// @desc    Delete a food item
// @route   DELETE /api/partners/menu/:id
// @access  Private (vendor/admin)
const deleteMenuItem = async (req, res, next) => {
  try {
    const vendor = await Vendor.findOne({ ownerId: req.user._id });
    if (!vendor) {
      res.status(404);
      return next(new Error('No partner profile found'));
    }

    const food = await Food.findOneAndDelete({ _id: req.params.id, vendorId: vendor._id });
    if (!food) {
      res.status(404);
      return next(new Error('Food item not found'));
    }

    sendResponse(res, 200, true, 'Menu item deleted');
  } catch (err) {
    next(err);
  }
};

// @desc    Toggle food item availability
// @route   PATCH /api/partners/menu/:id/availability
// @access  Private (vendor/admin)
const toggleMenuItemAvailability = async (req, res, next) => {
  try {
    const vendor = await Vendor.findOne({ ownerId: req.user._id });
    if (!vendor) {
      res.status(404);
      return next(new Error('No partner profile found'));
    }

    const food = await Food.findOne({ _id: req.params.id, vendorId: vendor._id });
    if (!food) {
      res.status(404);
      return next(new Error('Food item not found'));
    }

    food.isAvailable = !food.isAvailable;
    const updated = await food.save();
    sendResponse(res, 200, true, `Item marked as ${updated.isAvailable ? 'available' : 'unavailable'}`, updated);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  registerPartner,
  getPartnerDashboard,
  updatePartnerProfile,
  addMenuItem,
  editMenuItem,
  deleteMenuItem,
  toggleMenuItemAvailability,
};
