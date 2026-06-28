import API from './api';

const adminService = {
  getStats: async () => {
    const res = await API.get('/admin/stats');
    return res.data.data;
  },
  getAllPartners: async (params = {}) => {
    const res = await API.get('/admin/partners', { params });
    return res.data.data;
  },
  getPartnerById: async (id) => {
    const res = await API.get(`/admin/partners/${id}`);
    return res.data.data;
  },
  approvePartner: async (id) => {
    const res = await API.patch(`/admin/partners/${id}/approve`);
    return res.data.data;
  },
  rejectPartner: async (id, reason = '') => {
    const res = await API.patch(`/admin/partners/${id}/reject`, { reason });
    return res.data.data;
  },
  deletePartner: async (id) => {
    const res = await API.delete(`/admin/partners/${id}`);
    return res.data;
  },
  getAllUsers: async (params = {}) => {
    const res = await API.get('/admin/users', { params });
    return res.data.data;
  },
};

export default adminService;
