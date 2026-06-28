import API from './api';

const partnerService = {
  // Register a new partner
  register: async (data) => {
    const res = await API.post('/partners/register', data);
    return res.data.data;
  },

  // Get partner dashboard data (vendor + foods + orders + stats)
  getDashboard: async () => {
    const res = await API.get('/partners/dashboard');
    return res.data.data;
  },

  // Update business profile
  updateProfile: async (data) => {
    const res = await API.put('/partners/profile', data);
    return res.data.data;
  },

  // Add a new menu item
  addMenuItem: async (data) => {
    const res = await API.post('/partners/menu', data);
    return res.data.data;
  },

  // Edit an existing menu item
  editMenuItem: async (id, data) => {
    const res = await API.put(`/partners/menu/${id}`, data);
    return res.data.data;
  },

  // Delete a menu item
  deleteMenuItem: async (id) => {
    const res = await API.delete(`/partners/menu/${id}`);
    return res.data;
  },

  // Toggle availability of a menu item
  toggleAvailability: async (id) => {
    const res = await API.patch(`/partners/menu/${id}/availability`);
    return res.data.data;
  },
};

export default partnerService;
