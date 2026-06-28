const express = require('express');
const router = express.Router();
const {
  getAdminStats,
  getAllPartners,
  getPartnerById,
  approvePartner,
  rejectPartner,
  getAllUsers,
  deletePartner,
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/authMiddleware');

// All admin routes require authentication + admin role
router.use(protect, authorize('admin'));

router.get('/stats', getAdminStats);
router.get('/partners', getAllPartners);
router.get('/partners/:id', getPartnerById);
router.patch('/partners/:id/approve', approvePartner);
router.patch('/partners/:id/reject', rejectPartner);
router.delete('/partners/:id', deletePartner);
router.get('/users', getAllUsers);

module.exports = router;
