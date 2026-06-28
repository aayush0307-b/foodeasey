const express = require('express');
const router = express.Router();
const {
  registerPartner,
  getPartnerDashboard,
  updatePartnerProfile,
  addMenuItem,
  editMenuItem,
  deleteMenuItem,
  toggleMenuItemAvailability,
} = require('../controllers/partnerController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Public
router.post('/register', registerPartner);

// Protected (vendor or admin)
router.get('/dashboard', protect, authorize('vendor', 'admin'), getPartnerDashboard);
router.put('/profile', protect, authorize('vendor', 'admin'), updatePartnerProfile);
router.post('/menu', protect, authorize('vendor', 'admin'), addMenuItem);
router.put('/menu/:id', protect, authorize('vendor', 'admin'), editMenuItem);
router.delete('/menu/:id', protect, authorize('vendor', 'admin'), deleteMenuItem);
router.patch('/menu/:id/availability', protect, authorize('vendor', 'admin'), toggleMenuItemAvailability);

module.exports = router;
