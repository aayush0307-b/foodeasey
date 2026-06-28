import API from './api';

const foodService = {
  getFoods: async (params = {}) => {
    const res = await API.get('/foods', { params });
    return res.data.data;
  },
  getPopularFoods: async () => {
    const res = await API.get('/foods/popular');
    return res.data.data;
  },
  getFoodById: async (id) => {
    const res = await API.get(`/foods/${id}`);
    return res.data.data;
  },
  getFoodsByVendor: async (vendorId) => {
    const res = await API.get(`/foods/vendor/${vendorId}`);
    return res.data.data;
  },
  createFood: async (data) => {
    const res = await API.post('/foods', data);
    return res.data.data;
  },
  updateFood: async (id, data) => {
    const res = await API.put(`/foods/${id}`, data);
    return res.data.data;
  },
  deleteFood: async (id) => {
    await API.delete(`/foods/${id}`);
  },
};

export default foodService;
