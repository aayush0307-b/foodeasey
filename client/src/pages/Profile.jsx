import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import authService from '../services/authService';
import { FiUser, FiMail, FiPhone, FiMapPin, FiEdit2, FiLogOut, FiSave, FiX } from 'react-icons/fi';
import toast from 'react-hot-toast';

const Profile = () => {
  const { user, logout, updateUser } = useAuth();
  const navigate = useNavigate();
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    address: {
      street: user?.address?.street || '',
      city: user?.address?.city || '',
      state: user?.address?.state || '',
      pincode: user?.address?.pincode || '',
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (['street', 'city', 'state', 'pincode'].includes(name)) {
      setForm((p) => ({ ...p, address: { ...p.address, [name]: value } }));
    } else {
      setForm((p) => ({ ...p, [name]: value }));
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const updated = await authService.updateProfile(form);
      updateUser(updated);
      setEditing(false);
      toast.success('Profile updated!');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const roleBadgeColors = {
    user: 'badge-primary',
    vendor: 'badge-warning',
    admin: 'badge-error',
  };

  return (
    <div className="py-8 md:py-10">
      <div className="page-container max-w-2xl">
        {/* Header Card */}
        <div className="card p-6 md:p-8 mb-6 relative overflow-hidden">
          {/* Background gradient */}
          <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-primary opacity-10 rounded-t-2xl" />

          <div className="relative flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-primary rounded-2xl flex items-center justify-center shadow-primary text-white text-2xl md:text-3xl font-black">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <div>
                <h1 className="text-xl md:text-2xl font-black text-secondary">{user?.name}</h1>
                <p className="text-muted text-sm">{user?.email}</p>
                <span className={`badge mt-1 ${roleBadgeColors[user?.role] || 'badge-primary'} capitalize`}>
                  {user?.role}
                </span>
              </div>
            </div>

            <div className="flex gap-2">
              {editing ? (
                <>
                  <button
                    onClick={() => setEditing(false)}
                    className="p-2 rounded-xl text-muted hover:bg-gray-100 transition-colors"
                  >
                    <FiX />
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={loading}
                    className="btn-primary text-sm py-2 px-4 flex items-center gap-1.5"
                  >
                    {loading ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <FiSave className="text-sm" />
                    )}
                    Save
                  </button>
                </>
              ) : (
                <button
                  id="edit-profile-btn"
                  onClick={() => setEditing(true)}
                  className="flex items-center gap-2 btn-outline text-sm py-2 px-4"
                >
                  <FiEdit2 className="text-sm" /> Edit
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Personal Info */}
        <div className="card p-5 md:p-6 mb-4">
          <h2 className="font-bold text-secondary mb-4 flex items-center gap-2">
            <FiUser className="text-primary" /> Personal Information
          </h2>
          <div className="space-y-4">
            {/* Name */}
            <div>
              <label className="text-xs text-muted font-medium mb-1 block">Full Name</label>
              {editing ? (
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  className="input-field"
                />
              ) : (
                <p className="text-secondary font-medium">{user?.name}</p>
              )}
            </div>
            {/* Email (not editable) */}
            <div>
              <label className="text-xs text-muted font-medium mb-1 block">Email</label>
              <div className="flex items-center gap-2">
                <FiMail className="text-muted text-sm" />
                <p className="text-secondary">{user?.email}</p>
              </div>
            </div>
            {/* Phone */}
            <div>
              <label className="text-xs text-muted font-medium mb-1 block">Phone</label>
              {editing ? (
                <input
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="Enter phone number"
                  className="input-field"
                />
              ) : (
                <div className="flex items-center gap-2">
                  <FiPhone className="text-muted text-sm" />
                  <p className="text-secondary">{user?.phone || <span className="text-muted italic">Not set</span>}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Address */}
        <div className="card p-5 md:p-6 mb-4">
          <h2 className="font-bold text-secondary mb-4 flex items-center gap-2">
            <FiMapPin className="text-primary" /> Delivery Address
          </h2>
          {editing ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { name: 'street', placeholder: 'Street / House No.', full: true },
                { name: 'city', placeholder: 'City' },
                { name: 'state', placeholder: 'State' },
                { name: 'pincode', placeholder: 'Pincode' },
              ].map(({ name, placeholder, full }) => (
                <input
                  key={name}
                  type="text"
                  name={name}
                  value={form.address[name]}
                  onChange={handleChange}
                  placeholder={placeholder}
                  className={`input-field ${full ? 'sm:col-span-2' : ''}`}
                />
              ))}
            </div>
          ) : (
            <div>
              {user?.address?.street ? (
                <p className="text-secondary">
                  {user.address.street}, {user.address.city}, {user.address.state} — {user.address.pincode}
                </p>
              ) : (
                <p className="text-muted italic">No address saved. Click edit to add one.</p>
              )}
            </div>
          )}
        </div>

        {/* Danger Zone */}
        <div className="card p-5 md:p-6 border border-error/20">
          <h2 className="font-bold text-error mb-3">Account Actions</h2>
          <button
            id="logout-btn"
            onClick={handleLogout}
            className="flex items-center gap-2 text-error hover:bg-red-50 px-4 py-2.5 rounded-xl transition-colors font-medium text-sm w-full"
          >
            <FiLogOut /> Sign out of your account
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
