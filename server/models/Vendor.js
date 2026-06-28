const mongoose = require('mongoose');

const vendorSchema = new mongoose.Schema(
  {
    // Partner type
    partnerType: {
      type: String,
      enum: ['vendor', 'restaurant'],
      default: 'restaurant',
    },

    // Owner & contact
    ownerName: {
      type: String,
      trim: true,
    },
    name: {
      type: String,
      required: [true, 'Business name is required'],
      trim: true,
    },
    mobileNumber: {
      type: String,
      trim: true,
    },
    whatsappNumber: {
      type: String,
      trim: true,
      // Stored for future WhatsApp order notification integration
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
    },

    // Business details
    description: {
      type: String,
      default: '',
    },
    foodCategories: {
      type: [String],
      default: [],
    },
    cuisineTypes: [String], // legacy field kept for compatibility

    // Location & address
    location: {
      address: String,
      city: { type: String, default: 'Mumbai' },
      state: String,
      pincode: String,
      coordinates: {
        lat: { type: Number, default: 19.076 },
        lng: { type: Number, default: 72.8777 },
      },
    },

    // Images
    image: {
      type: String,
      default: 'https://images.unsplash.com/photo-1514190051997-0f6f39ca5cde?w=800',
    },
    logoImage: {
      type: String,
      default: '',
    },
    coverImage: {
      type: String,
      default: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1200',
    },
    galleryImages: {
      type: [String],
      default: [],
    },

    // Ratings
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

    // Status
    isOpen: {
      type: Boolean,
      default: true,
    },
    status: {
      type: String,
      enum: ['pending', 'active', 'rejected'],
      default: 'pending',
    },
    rejectionReason: {
      type: String,
      default: '',
    },

    // Operations
    deliveryTime: {
      type: String,
      default: '30-45 min',
    },
    minOrder: {
      type: Number,
      default: 100,
    },
    avgPrepTime: {
      type: Number,
      default: 20, // minutes
    },
    deliveryRadius: {
      type: Number,
      default: 5, // km
    },
    isVegOnly: {
      type: Boolean,
      default: false,
    },

    // Business hours
    openingTime: {
      type: String,
      default: '09:00',
    },
    closingTime: {
      type: String,
      default: '22:00',
    },

    // Verification documents
    govtIdProof: {
      type: String,
      default: '', // optional, for street food vendors
    },
    gstNumber: {
      type: String,
      default: '', // optional, for restaurants
    },
    fssaiLicense: {
      type: String,
      default: '', // optional, for restaurants
    },

    // Owner reference
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Vendor', vendorSchema);
