import API from './api';

const authService = {
  register: async (data) => {
    const res = await API.post('/auth/register', data);
    return res.data.data;
  },
  login: async (data) => {
    const res = await API.post('/auth/login', data);
    return res.data.data;
  },
  logout: async () => {
    await API.post('/auth/logout');
  },
  getMe: async () => {
    const res = await API.get('/auth/me');
    return res.data.data;
  },
  updateProfile: async (data) => {
    const res = await API.put('/auth/profile', data);
    return res.data.data;
  },
};

export default authService;
