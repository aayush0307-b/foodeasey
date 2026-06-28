const express = require('express');
const router = express.Router();
const { getVendors, getVendorById, createVendor, updateVendor, getMyVendor } = require('../controllers/vendorController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/', getVendors);
router.get('/my-vendor', protect, authorize('vendor', 'admin'), getMyVendor);
router.get('/:id', getVendorById);
router.post('/', protect, authorize('admin'), createVendor);
router.put('/:id', protect, authorize('vendor', 'admin'), updateVendor);

module.exports = router;
