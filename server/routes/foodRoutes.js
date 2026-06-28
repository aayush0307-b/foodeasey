const express = require('express');
const router = express.Router();
const {
  getFoods,
  getFoodById,
  getFoodsByVendor,
  createFood,
  updateFood,
  deleteFood,
  getPopularFoods,
} = require('../controllers/foodController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/', getFoods);
router.get('/popular', getPopularFoods);
router.get('/vendor/:vendorId', getFoodsByVendor);
router.get('/:id', getFoodById);
router.post('/', protect, authorize('vendor', 'admin'), createFood);
router.put('/:id', protect, authorize('vendor', 'admin'), updateFood);
router.delete('/:id', protect, authorize('vendor', 'admin'), deleteFood);

module.exports = router;
