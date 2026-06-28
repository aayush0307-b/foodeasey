import { Routes, Route } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import ProtectedRoute from '../components/ProtectedRoute';

import Home from '../pages/Home';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Vendors from '../pages/Vendors';
import FoodDetails from '../pages/FoodDetails';
import Cart from '../pages/Cart';
import Orders from '../pages/Orders';
import Profile from '../pages/Profile';
import VendorDashboard from '../pages/VendorDashboard';
import PartnerRegister from '../pages/PartnerRegister';
import PartnerSuccess from '../pages/PartnerSuccess';
import PartnerDashboard from '../pages/PartnerDashboard';
import AdminPanel from '../pages/AdminPanel';
import NotFound from '../pages/NotFound';

const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        {/* Public routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/vendors" element={<Vendors />} />
        <Route path="/vendors/:id" element={<Vendors />} />
        <Route path="/food/:id" element={<FoodDetails />} />

        {/* Protected routes */}
        <Route
          path="/cart"
          element={
            <ProtectedRoute>
              <Cart />
            </ProtectedRoute>
          }
        />
        <Route
          path="/orders"
          element={
            <ProtectedRoute>
              <Orders />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/vendor-dashboard"
          element={
            <ProtectedRoute allowedRoles={['vendor', 'admin']}>
              <VendorDashboard />
            </ProtectedRoute>
          }
        />

        {/* Partner routes */}
        <Route path="/partner/register" element={<PartnerRegister />} />
        <Route path="/partner/success" element={<PartnerSuccess />} />
        <Route
          path="/partner/dashboard"
          element={
            <ProtectedRoute allowedRoles={['vendor', 'admin']}>
              <PartnerDashboard />
            </ProtectedRoute>
          }
        />

        {/* Admin routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminPanel />
            </ProtectedRoute>
          }
        />

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
