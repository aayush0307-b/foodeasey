import API from './api';

const orderService = {
  placeOrder: async (data) => {
    const res = await API.post('/orders', data);
    return res.data.data;
  },
  getMyOrders: async () => {
    const res = await API.get('/orders/my-orders');
    return res.data.data;
  },
  getOrderById: async (id) => {
    const res = await API.get(`/orders/${id}`);
    return res.data.data;
  },
  updateOrderStatus: async (id, status) => {
    const res = await API.put(`/orders/${id}/status`, { status });
    return res.data.data;
  },
  cancelOrder: async (id) => {
    const res = await API.put(`/orders/${id}/cancel`);
    return res.data.data;
  },
  getVendorOrders: async (vendorId) => {
    const res = await API.get('/orders/vendor-orders', { params: { vendorId } });
    return res.data.data;
  },
};

export default orderService;
