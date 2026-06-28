import API from './api';

const vendorService = {
  getVendors: async (params = {}) => {
    const res = await API.get('/vendors', { params });
    return res.data.data;
  },
  getVendorById: async (id) => {
    const res = await API.get(`/vendors/${id}`);
    return res.data.data;
  },
  getMyVendor: async () => {
    const res = await API.get('/vendors/my-vendor');
    return res.data.data;
  },
  createVendor: async (data) => {
    const res = await API.post('/vendors', data);
    return res.data.data;
  },
  updateVendor: async (id, data) => {
    const res = await API.put(`/vendors/${id}`, data);
    return res.data.data;
  },
};

export default vendorService;
