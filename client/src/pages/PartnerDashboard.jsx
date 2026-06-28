import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import partnerService from '../services/partnerService';
import orderService from '../services/orderService';
import toast from 'react-hot-toast';
import {
  FiGrid, FiPackage, FiList, FiUser, FiStar, FiBarChart2,
  FiSettings, FiPlus, FiEdit2, FiTrash2, FiToggleLeft, FiToggleRight,
  FiX, FiCheck, FiMenu, FiChevronRight, FiMapPin, FiClock,
  FiPhone, FiMail, FiNavigation, FiSave, FiImage, FiTrendingUp,
  FiShoppingBag, FiDollarSign, FiAlertCircle
} from 'react-icons/fi';
import { HiOutlineSparkles } from 'react-icons/hi';
import { MdOutlineRestaurant, MdOutlineStorefront } from 'react-icons/md';

// ─── Constants ───────────────────────────────────────────────
const PARTNER_FOOD_CATEGORIES = [
  'Fast Food', 'Chinese', 'South Indian', 'North Indian', 'Chaat',
  'Bakery', 'Beverages', 'Desserts', 'Other',
];

const ALL_FOOD_CATEGORIES = [
  'Fast Food', 'Chinese', 'South Indian', 'North Indian', 'Chaat',
  'Bakery', 'Beverages', 'Desserts', 'Burgers', 'Pizza', 'Biryani',
  'Drinks', 'Salads', 'Sandwiches', 'Momos', 'Healthy', 'Other',
];

const NAV_ITEMS = [
  { id: 'home', label: 'Dashboard', icon: FiGrid },
  { id: 'orders', label: 'Orders', icon: FiPackage },
  { id: 'menu', label: 'Menu Management', icon: FiList },
  { id: 'profile', label: 'Business Profile', icon: FiUser },
  { id: 'reviews', label: 'Reviews & Ratings', icon: FiStar },
  { id: 'analytics', label: 'Analytics', icon: FiBarChart2 },
  { id: 'settings', label: 'Settings', icon: FiSettings },
];

const ORDER_STATUSES = ['pending', 'confirmed', 'preparing', 'out_for_delivery', 'delivered', 'cancelled'];

const emptyFoodForm = {
  name: '', description: '', price: '', discountPrice: '',
  category: 'Fast Food', image: '', isVeg: false,
  preparationTime: '20-30 min', isAvailable: true,
};

// ─── Sub-components ──────────────────────────────────────────

const StatCard = ({ label, value, icon: Icon, gradient, sub }) => (
  <div className={`rounded-2xl p-5 text-white relative overflow-hidden ${gradient}`}>
    <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -translate-y-8 translate-x-8" />
    <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center mb-3">
      <Icon className="text-xl" />
    </div>
    <p className="text-3xl font-black">{value}</p>
    <p className="text-white/80 text-sm font-medium mt-0.5">{label}</p>
    {sub && <p className="text-white/50 text-xs mt-1">{sub}</p>}
  </div>
);

const StatusBadge = ({ status }) => {
  const colors = {
    pending: 'bg-yellow-100 text-yellow-700',
    confirmed: 'bg-blue-100 text-blue-700',
    preparing: 'bg-orange-100 text-orange-700',
    out_for_delivery: 'bg-purple-100 text-purple-700',
    delivered: 'bg-green-100 text-green-700',
    cancelled: 'bg-red-100 text-red-700',
  };
  return (
    <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize ${colors[status] || 'bg-gray-100 text-gray-600'}`}>
      {status?.replace(/_/g, ' ')}
    </span>
  );
};

// ─── Main Component ──────────────────────────────────────────

const PartnerDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('home');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [vendor, setVendor] = useState(null);
  const [foods, setFoods] = useState([]);
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);

  // Menu state
  const [showFoodForm, setShowFoodForm] = useState(false);
  const [editingFood, setEditingFood] = useState(null);
  const [foodForm, setFoodForm] = useState(emptyFoodForm);

  // Profile state
  const [profileForm, setProfileForm] = useState({});
  const [savingProfile, setSavingProfile] = useState(false);

  // Orders filter
  const [orderFilter, setOrderFilter] = useState('all');

  // Fetch on mount
  useEffect(() => {
    const load = async () => {
      try {
        const data = await partnerService.getDashboard();
        setVendor(data.vendor);
        setFoods(data.foods || []);
        setOrders(data.orders || []);
        setStats(data.stats || {});
        setProfileForm({
          name: data.vendor?.name || '',
          description: data.vendor?.description || '',
          mobileNumber: data.vendor?.mobileNumber || '',
          whatsappNumber: data.vendor?.whatsappNumber || '',
          openingTime: data.vendor?.openingTime || '09:00',
          closingTime: data.vendor?.closingTime || '22:00',
          isVegOnly: data.vendor?.isVegOnly || false,
          avgPrepTime: data.vendor?.avgPrepTime || 20,
          deliveryRadius: data.vendor?.deliveryRadius || 5,
          logoImage: data.vendor?.logoImage || '',
          coverImage: data.vendor?.coverImage || '',
          'location.address': data.vendor?.location?.address || '',
          'location.city': data.vendor?.location?.city || '',
          'location.state': data.vendor?.location?.state || '',
          'location.pincode': data.vendor?.location?.pincode || '',
        });
      } catch (err) {
        toast.error('Could not load partner data.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  // ── Menu handlers ──
  const openAddForm = () => {
    setEditingFood(null);
    setFoodForm(emptyFoodForm);
    setShowFoodForm(true);
  };

  const openEditForm = (food) => {
    setEditingFood(food);
    setFoodForm({
      name: food.name,
      description: food.description || '',
      price: food.price,
      discountPrice: food.discountPrice || '',
      category: food.category,
      image: food.image || '',
      isVeg: food.isVeg || false,
      preparationTime: food.preparationTime || '20-30 min',
      isAvailable: food.isAvailable,
    });
    setShowFoodForm(true);
  };

  const handleFoodFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFoodForm((p) => ({ ...p, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleFoodSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingFood) {
        const updated = await partnerService.editMenuItem(editingFood._id, {
          ...foodForm,
          price: Number(foodForm.price),
          discountPrice: foodForm.discountPrice ? Number(foodForm.discountPrice) : undefined,
        });
        setFoods((p) => p.map((f) => (f._id === editingFood._id ? updated : f)));
        toast.success('Menu item updated!');
      } else {
        const created = await partnerService.addMenuItem({
          ...foodForm,
          price: Number(foodForm.price),
          discountPrice: foodForm.discountPrice ? Number(foodForm.discountPrice) : undefined,
        });
        setFoods((p) => [created, ...p]);
        toast.success('Menu item added!');
      }
      setShowFoodForm(false);
      setEditingFood(null);
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleDeleteFood = async (id) => {
    if (!window.confirm('Delete this menu item?')) return;
    try {
      await partnerService.deleteMenuItem(id);
      setFoods((p) => p.filter((f) => f._id !== id));
      toast.success('Item deleted');
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleToggleAvailability = async (id) => {
    try {
      const updated = await partnerService.toggleAvailability(id);
      setFoods((p) => p.map((f) => (f._id === id ? updated : f)));
      toast.success(`Item marked ${updated.isAvailable ? 'available' : 'unavailable'}`);
    } catch (err) {
      toast.error(err.message);
    }
  };

  // ── Profile handlers ──
  const handleProfileChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProfileForm((p) => ({ ...p, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleProfileSave = async () => {
    setSavingProfile(true);
    try {
      const payload = {
        name: profileForm.name,
        description: profileForm.description,
        mobileNumber: profileForm.mobileNumber,
        whatsappNumber: profileForm.whatsappNumber,
        openingTime: profileForm.openingTime,
        closingTime: profileForm.closingTime,
        isVegOnly: profileForm.isVegOnly,
        avgPrepTime: Number(profileForm.avgPrepTime),
        deliveryRadius: Number(profileForm.deliveryRadius),
        logoImage: profileForm.logoImage,
        coverImage: profileForm.coverImage,
        location: {
          address: profileForm['location.address'],
          city: profileForm['location.city'],
          state: profileForm['location.state'],
          pincode: profileForm['location.pincode'],
        },
      };
      const updated = await partnerService.updateProfile(payload);
      setVendor(updated);
      toast.success('Profile saved successfully!');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSavingProfile(false);
    }
  };

  // ── Order handlers ──
  const handleOrderStatus = async (orderId, status) => {
    try {
      const updated = await orderService.updateOrderStatus(orderId, status);
      setOrders((p) => p.map((o) => (o._id === orderId ? { ...o, status: updated.status } : o)));
      toast.success('Order status updated');
    } catch (err) {
      toast.error(err.message);
    }
  };

  const filteredOrders = orderFilter === 'all' ? orders : orders.filter((o) => o.status === orderFilter);

  // ── Loading skeleton ──
  if (loading) {
    return (
      <div className="flex h-screen bg-background">
        <div className="w-64 bg-white border-r border-border h-full" />
        <div className="flex-1 p-8 space-y-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="skeleton h-24 rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  const vendorStatus = vendor?.status;

  return (
    <div className="flex h-[calc(100vh-64px)] bg-background overflow-hidden">
      {/* ── Sidebar ── */}
      <aside
        className={`fixed md:static inset-y-0 left-0 z-40 w-64 bg-secondary-dark flex flex-col transition-transform duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Sidebar header */}
        <div className="p-5 border-b border-white/10">
          <div className="flex items-center gap-3">
            {vendor?.logoImage ? (
              <img src={vendor.logoImage} alt="logo" className="w-10 h-10 rounded-xl object-cover ring-2 ring-primary/40" />
            ) : (
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-orange-500 rounded-xl flex items-center justify-center">
                {vendor?.partnerType === 'vendor' ? (
                  <MdOutlineStorefront className="text-white text-xl" />
                ) : (
                  <MdOutlineRestaurant className="text-white text-xl" />
                )}
              </div>
            )}
            <div className="min-w-0">
              <p className="text-white font-bold text-sm truncate">{vendor?.name || 'My Business'}</p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className={`w-2 h-2 rounded-full ${
                  vendorStatus === 'active' ? 'bg-green-400' :
                  vendorStatus === 'pending' ? 'bg-yellow-400' : 'bg-red-400'
                }`} />
                <span className="text-white/50 text-xs capitalize">{vendorStatus}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Nav items */}
        <nav className="flex-1 py-4 overflow-y-auto">
          {NAV_ITEMS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => { setActiveTab(id); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-5 py-3 text-sm font-medium transition-all duration-200 group ${
                activeTab === id
                  ? 'bg-primary text-white'
                  : 'text-white/60 hover:bg-white/5 hover:text-white'
              }`}
            >
              <Icon className={`text-base flex-shrink-0 ${activeTab === id ? 'text-white' : 'text-white/40 group-hover:text-white/70'}`} />
              <span>{label}</span>
              {activeTab === id && <FiChevronRight className="ml-auto text-white/60" />}
            </button>
          ))}
        </nav>

        {/* Sidebar footer */}
        <div className="p-4 border-t border-white/10">
          <div className="flex items-center gap-2 text-white/40 text-xs">
            <HiOutlineSparkles className="text-primary" />
            <span>FoodEasey Partner Portal</span>
          </div>
        </div>
      </aside>

      {/* Sidebar overlay (mobile) */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-30 md:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* ── Main Content ── */}
      <main className="flex-1 overflow-y-auto bg-background">
        {/* Top bar */}
        <div className="sticky top-0 z-20 bg-white border-b border-border px-4 md:px-6 h-14 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(true)} className="md:hidden p-2 rounded-lg hover:bg-gray-100">
              <FiMenu className="text-secondary" />
            </button>
            <h2 className="font-bold text-secondary capitalize">{NAV_ITEMS.find((n) => n.id === activeTab)?.label}</h2>
          </div>
          <div className="flex items-center gap-2">
            {vendor?.isOpen !== undefined && (
              <span className={`badge ${vendor.isOpen ? 'badge-success' : 'bg-gray-100 text-gray-500'} text-xs`}>
                {vendor.isOpen ? '● Open' : '● Closed'}
              </span>
            )}
            {vendorStatus === 'pending' && (
              <span className="badge badge-warning text-xs">⏳ Pending Approval</span>
            )}
          </div>
        </div>

        {/* Pending notice */}
        {vendorStatus === 'pending' && (
          <div className="mx-4 md:mx-6 mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-2xl flex items-start gap-3">
            <FiAlertCircle className="text-yellow-500 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-semibold text-yellow-800 text-sm">Account Pending Verification</p>
              <p className="text-yellow-700 text-xs mt-0.5">Our team is reviewing your registration. You can explore the dashboard but full features will be active once approved.</p>
            </div>
          </div>
        )}

        <div className="p-4 md:p-6 space-y-6">

          {/* ══ DASHBOARD HOME ══ */}
          {activeTab === 'home' && (
            <div className="space-y-6 animate-fade-in">
              {/* Stats */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard label="Total Orders" value={stats.totalOrders || 0} icon={FiShoppingBag} gradient="bg-gradient-to-br from-primary to-rose-600" />
                <StatCard label="Active Menu Items" value={stats.activeMenuItems || 0} icon={FiList} gradient="bg-gradient-to-br from-blue-500 to-blue-700" />
                <StatCard label="Today's Revenue" value={`₹${(stats.todayRevenue || 0).toLocaleString()}`} icon={FiDollarSign} gradient="bg-gradient-to-br from-green-500 to-emerald-700" />
                <StatCard label="Pending Orders" value={stats.pendingOrders || 0} icon={FiAlertCircle} gradient="bg-gradient-to-br from-orange-400 to-orange-600" />
              </div>

              {/* Quick Info */}
              {vendor && (
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="card p-5">
                    <h3 className="font-bold text-secondary mb-4 flex items-center gap-2">
                      <MdOutlineRestaurant className="text-primary" /> Business Overview
                    </h3>
                    <div className="space-y-3">
                      {[
                        { label: 'Business Name', value: vendor.name },
                        { label: 'Partner Type', value: vendor.partnerType === 'vendor' ? '🛒 Street Food Vendor' : '🍽️ Restaurant' },
                        { label: 'City', value: vendor.location?.city },
                        { label: 'Cuisines', value: vendor.foodCategories?.join(', ') || vendor.cuisineTypes?.join(', ') || '—' },
                        { label: 'Rating', value: `⭐ ${vendor.rating?.toFixed(1)}` },
                        { label: 'Hours', value: `${vendor.openingTime} – ${vendor.closingTime}` },
                      ].map(({ label, value }) => (
                        <div key={label} className="flex justify-between items-center py-1 border-b border-border last:border-0">
                          <span className="text-muted text-xs">{label}</span>
                          <span className="text-secondary text-sm font-medium text-right max-w-[55%] truncate">{value || '—'}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="card p-5">
                    <h3 className="font-bold text-secondary mb-4 flex items-center gap-2">
                      <FiTrendingUp className="text-primary" /> Quick Stats
                    </h3>
                    <div className="space-y-3">
                      {[
                        { label: 'Total Menu Items', value: foods.length, color: 'text-blue-600' },
                        { label: 'Available Items', value: foods.filter((f) => f.isAvailable).length, color: 'text-green-600' },
                        { label: 'Unavailable Items', value: foods.filter((f) => !f.isAvailable).length, color: 'text-red-500' },
                        { label: 'Today\'s Orders', value: stats.todayOrders || 0, color: 'text-primary' },
                        { label: 'Total Revenue', value: `₹${(stats.totalRevenue || 0).toLocaleString()}`, color: 'text-green-600' },
                        { label: 'Delivery Radius', value: `${vendor.deliveryRadius || 5} km`, color: 'text-secondary' },
                      ].map(({ label, value, color }) => (
                        <div key={label} className="flex justify-between items-center py-1 border-b border-border last:border-0">
                          <span className="text-muted text-xs">{label}</span>
                          <span className={`text-sm font-bold ${color}`}>{value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Recent orders preview */}
              {orders.length > 0 && (
                <div className="card p-5">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-secondary flex items-center gap-2"><FiPackage className="text-primary" /> Recent Orders</h3>
                    <button onClick={() => setActiveTab('orders')} className="text-primary text-sm font-medium hover:underline">View all →</button>
                  </div>
                  <div className="space-y-3">
                    {orders.slice(0, 3).map((order) => (
                      <div key={order._id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                        <div>
                          <p className="font-semibold text-secondary text-sm">#{order._id?.slice(-6).toUpperCase()}</p>
                          <p className="text-muted text-xs">{order.userId?.name}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-primary text-sm">₹{order.totalAmount}</p>
                          <StatusBadge status={order.status} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ══ ORDERS ══ */}
          {activeTab === 'orders' && (
            <div className="space-y-4 animate-fade-in">
              {/* Filter chips */}
              <div className="flex flex-wrap gap-2">
                {['all', ...ORDER_STATUSES].map((s) => (
                  <button
                    key={s}
                    onClick={() => setOrderFilter(s)}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                      orderFilter === s ? 'bg-primary text-white shadow-primary shadow-sm' : 'bg-white text-muted border border-border hover:border-primary'
                    }`}
                  >
                    {s === 'all' ? 'All Orders' : s.replace(/_/g, ' ')}
                    {s === 'all' ? ` (${orders.length})` : ` (${orders.filter((o) => o.status === s).length})`}
                  </button>
                ))}
              </div>

              {filteredOrders.length === 0 ? (
                <div className="text-center py-20 text-muted">
                  <span className="text-5xl block mb-3">📦</span>
                  <p className="font-medium">No orders found</p>
                  <p className="text-sm">Orders will appear here when customers place them</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredOrders.map((order) => (
                    <div key={order._id} className="card p-4 md:p-5">
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div>
                          <p className="font-bold text-secondary text-sm">#{order._id?.slice(-8).toUpperCase()}</p>
                          <p className="text-muted text-xs mt-0.5">{order.userId?.name} • {order.userId?.phone}</p>
                          <p className="text-muted text-xs">{new Date(order.createdAt).toLocaleString('en-IN')}</p>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <p className="font-black text-primary text-lg">₹{order.totalAmount}</p>
                          <StatusBadge status={order.status} />
                        </div>
                      </div>
                      {order.items && (
                        <p className="text-muted text-xs mb-3">{order.items.map((i) => `${i.name} ×${i.quantity}`).join(', ')}</p>
                      )}
                      <div className="flex items-center gap-2">
                        <label className="text-xs text-muted">Update Status:</label>
                        <select
                          value={order.status}
                          onChange={(e) => handleOrderStatus(order._id, e.target.value)}
                          className="flex-1 text-xs border border-border rounded-lg px-2 py-1.5 text-secondary bg-white focus:outline-none focus:border-primary"
                        >
                          {ORDER_STATUSES.map((s) => (
                            <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ══ MENU MANAGEMENT ══ */}
          {activeTab === 'menu' && (
            <div className="space-y-4 animate-fade-in">
              <div className="flex items-center justify-between">
                <p className="text-muted text-sm">{foods.length} items · {foods.filter((f) => f.isAvailable).length} available</p>
                <button onClick={openAddForm} className="btn-primary text-sm py-2 px-4 flex items-center gap-2">
                  <FiPlus /> Add Item
                </button>
              </div>

              {/* Add/Edit Food Form */}
              {showFoodForm && (
                <div className="card p-5 border-2 border-primary/20">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-secondary">{editingFood ? 'Edit Menu Item' : 'Add New Menu Item'}</h3>
                    <button onClick={() => setShowFoodForm(false)} className="text-muted hover:text-secondary p-1"><FiX /></button>
                  </div>
                  <form onSubmit={handleFoodSubmit} className="grid sm:grid-cols-2 gap-3">
                    <div className="sm:col-span-2">
                      <label className="text-xs text-muted block mb-1">Food Name *</label>
                      <input required name="name" value={foodForm.name} onChange={handleFoodFormChange}
                        placeholder="e.g. Chicken Biryani" className="input-field" />
                    </div>
                    <div>
                      <label className="text-xs text-muted block mb-1">Price (₹) *</label>
                      <input required type="number" name="price" value={foodForm.price} onChange={handleFoodFormChange}
                        placeholder="150" className="input-field" />
                    </div>
                    <div>
                      <label className="text-xs text-muted block mb-1">Discount Price (₹)</label>
                      <input type="number" name="discountPrice" value={foodForm.discountPrice} onChange={handleFoodFormChange}
                        placeholder="120" className="input-field" />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="text-xs text-muted block mb-1">Description</label>
                      <textarea name="description" value={foodForm.description} onChange={handleFoodFormChange}
                        placeholder="Describe the dish..." rows={2} className="input-field resize-none" />
                    </div>
                    <div>
                      <label className="text-xs text-muted block mb-1">Category *</label>
                      <select required name="category" value={foodForm.category} onChange={handleFoodFormChange} className="input-field">
                        {ALL_FOOD_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="text-xs text-muted block mb-1">Preparation Time</label>
                      <input name="preparationTime" value={foodForm.preparationTime} onChange={handleFoodFormChange}
                        placeholder="20-30 min" className="input-field" />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="text-xs text-muted block mb-1">Food Image URL</label>
                      <div className="flex gap-2">
                        <input name="image" value={foodForm.image} onChange={handleFoodFormChange}
                          placeholder="https://example.com/food.jpg" className="input-field flex-1" />
                        {foodForm.image && (
                          <img src={foodForm.image} alt="preview" className="w-10 h-10 rounded-lg object-cover flex-shrink-0 border border-border"
                            onError={(e) => { e.target.style.display = 'none'; }} />
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <label className="flex items-center gap-2 cursor-pointer text-sm text-secondary select-none">
                        <input type="checkbox" name="isVeg" checked={foodForm.isVeg} onChange={handleFoodFormChange} className="accent-green-500 w-4 h-4" />
                        🌿 Vegetarian
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer text-sm text-secondary select-none">
                        <input type="checkbox" name="isAvailable" checked={foodForm.isAvailable} onChange={handleFoodFormChange} className="accent-primary w-4 h-4" />
                        Available
                      </label>
                    </div>
                    <div className="flex gap-3 justify-end sm:col-span-2">
                      <button type="button" onClick={() => setShowFoodForm(false)} className="btn-outline text-sm py-2 px-4">Cancel</button>
                      <button type="submit" className="btn-primary text-sm py-2 px-5 flex items-center gap-2">
                        <FiCheck /> {editingFood ? 'Update Item' : 'Add Item'}
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Food Grid */}
              {foods.length === 0 ? (
                <div className="text-center py-20 text-muted">
                  <span className="text-5xl block mb-3">🍽️</span>
                  <p className="font-medium">No menu items yet</p>
                  <p className="text-sm mb-4">Add your first food item to get started</p>
                  <button onClick={openAddForm} className="btn-primary text-sm px-6">Add First Item</button>
                </div>
              ) : (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {foods.map((food) => (
                    <div key={food._id} className={`card p-4 transition-all duration-200 ${!food.isAvailable ? 'opacity-60' : ''}`}>
                      <div className="flex gap-3">
                        <div className="relative flex-shrink-0">
                          <img
                            src={food.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200'}
                            alt={food.name}
                            className="w-16 h-16 rounded-xl object-cover"
                            onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200'; }}
                          />
                          <span className={`absolute -top-1 -left-1 w-4 h-4 rounded-full border-2 border-white flex items-center justify-center ${food.isVeg ? 'bg-green-500' : 'bg-red-500'}`}>
                            <span className="text-white text-[7px] font-bold">{food.isVeg ? 'V' : 'N'}</span>
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-secondary text-sm line-clamp-1">{food.name}</p>
                          <p className="text-muted text-xs">{food.category}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-primary font-bold text-sm">₹{food.price}</span>
                            {food.discountPrice && (
                              <span className="text-muted text-xs line-through">₹{food.discountPrice}</span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
                        <button
                          onClick={() => handleToggleAvailability(food._id)}
                          className={`flex items-center gap-1 text-xs font-medium transition-colors ${food.isAvailable ? 'text-green-600 hover:text-green-800' : 'text-red-500 hover:text-red-700'}`}
                        >
                          {food.isAvailable ? <FiToggleRight className="text-base" /> : <FiToggleLeft className="text-base" />}
                          {food.isAvailable ? 'Available' : 'Unavailable'}
                        </button>
                        <div className="flex items-center gap-2">
                          <button onClick={() => openEditForm(food)} className="p-1.5 rounded-lg hover:bg-blue-50 text-blue-500 transition-colors">
                            <FiEdit2 className="text-sm" />
                          </button>
                          <button onClick={() => handleDeleteFood(food._id)} className="p-1.5 rounded-lg hover:bg-red-50 text-error transition-colors">
                            <FiTrash2 className="text-sm" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ══ BUSINESS PROFILE ══ */}
          {activeTab === 'profile' && (
            <div className="space-y-5 animate-fade-in max-w-2xl">
              <div className="card p-5">
                <h3 className="font-bold text-secondary mb-4 flex items-center gap-2">
                  <FiUser className="text-primary" /> Basic Information
                </h3>
                <div className="grid sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-muted block mb-1">Business Name</label>
                    <input name="name" value={profileForm.name} onChange={handleProfileChange} className="input-field" />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="text-xs text-muted block mb-1">Description</label>
                    <textarea name="description" value={profileForm.description} onChange={handleProfileChange} rows={3} className="input-field resize-none" />
                  </div>
                  <div>
                    <label className="text-xs text-muted block mb-1">
                      <FiPhone className="inline mr-1" /> Mobile Number
                    </label>
                    <input name="mobileNumber" value={profileForm.mobileNumber} onChange={handleProfileChange} className="input-field" />
                  </div>
                  <div>
                    <label className="text-xs text-muted block mb-1">
                      📱 WhatsApp Number
                    </label>
                    <input name="whatsappNumber" value={profileForm.whatsappNumber} onChange={handleProfileChange} className="input-field" />
                    <p className="text-muted text-xs mt-0.5">Used for order notifications</p>
                  </div>
                </div>
              </div>

              <div className="card p-5">
                <h3 className="font-bold text-secondary mb-4 flex items-center gap-2">
                  <FiClock className="text-primary" /> Business Hours
                </h3>
                <div className="grid sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-muted block mb-1">Opening Time</label>
                    <input type="time" name="openingTime" value={profileForm.openingTime} onChange={handleProfileChange} className="input-field" />
                  </div>
                  <div>
                    <label className="text-xs text-muted block mb-1">Closing Time</label>
                    <input type="time" name="closingTime" value={profileForm.closingTime} onChange={handleProfileChange} className="input-field" />
                  </div>
                  <div>
                    <label className="text-xs text-muted block mb-1">Avg Prep Time (min)</label>
                    <input type="number" name="avgPrepTime" value={profileForm.avgPrepTime} onChange={handleProfileChange} className="input-field" />
                  </div>
                  <div>
                    <label className="text-xs text-muted block mb-1">Delivery Radius (km)</label>
                    <input type="number" name="deliveryRadius" value={profileForm.deliveryRadius} onChange={handleProfileChange} className="input-field" />
                  </div>
                </div>
              </div>

              <div className="card p-5">
                <h3 className="font-bold text-secondary mb-4 flex items-center gap-2">
                  <FiMapPin className="text-primary" /> Address & Location
                </h3>
                <div className="grid sm:grid-cols-2 gap-3">
                  <div className="sm:col-span-2">
                    <label className="text-xs text-muted block mb-1">Shop Address</label>
                    <input name="location.address" value={profileForm['location.address']} onChange={handleProfileChange} className="input-field" />
                  </div>
                  <div>
                    <label className="text-xs text-muted block mb-1">City</label>
                    <input name="location.city" value={profileForm['location.city']} onChange={handleProfileChange} className="input-field" />
                  </div>
                  <div>
                    <label className="text-xs text-muted block mb-1">State</label>
                    <input name="location.state" value={profileForm['location.state']} onChange={handleProfileChange} className="input-field" />
                  </div>
                  <div>
                    <label className="text-xs text-muted block mb-1">Pincode</label>
                    <input name="location.pincode" value={profileForm['location.pincode']} onChange={handleProfileChange} className="input-field" />
                  </div>
                </div>
              </div>

              <div className="card p-5">
                <h3 className="font-bold text-secondary mb-4 flex items-center gap-2">
                  <FiImage className="text-primary" /> Images
                </h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-xs text-muted block mb-1">Logo Image URL</label>
                    <div className="flex gap-2">
                      <input name="logoImage" value={profileForm.logoImage} onChange={handleProfileChange} placeholder="https://..." className="input-field flex-1" />
                      {profileForm.logoImage && (
                        <img src={profileForm.logoImage} alt="logo" className="w-10 h-10 rounded-xl object-cover border border-border flex-shrink-0"
                          onError={(e) => { e.target.style.display = 'none'; }} />
                      )}
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-muted block mb-1">Cover Banner URL</label>
                    <div className="flex gap-2">
                      <input name="coverImage" value={profileForm.coverImage} onChange={handleProfileChange} placeholder="https://..." className="input-field flex-1" />
                      {profileForm.coverImage && (
                        <img src={profileForm.coverImage} alt="cover" className="w-10 h-10 rounded-xl object-cover border border-border flex-shrink-0"
                          onError={(e) => { e.target.style.display = 'none'; }} />
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <button onClick={handleProfileSave} disabled={savingProfile}
                className="btn-primary w-full flex items-center justify-center gap-2">
                {savingProfile ? (
                  <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Saving...</>
                ) : (
                  <><FiSave /> Save Profile</>
                )}
              </button>
            </div>
          )}

          {/* ══ REVIEWS & RATINGS ══ */}
          {activeTab === 'reviews' && (
            <div className="animate-fade-in space-y-4">
              <div className="card p-6 text-center">
                <div className="text-5xl mb-3">⭐</div>
                <div className="text-4xl font-black text-secondary mb-1">{vendor?.rating?.toFixed(1) || '—'}</div>
                <p className="text-muted text-sm">{vendor?.totalRatings || 0} total ratings</p>
                <div className="flex justify-center gap-1 mt-2">
                  {[1,2,3,4,5].map((s) => (
                    <span key={s} className={`text-2xl ${s <= Math.round(vendor?.rating || 0) ? 'text-yellow-400' : 'text-gray-200'}`}>★</span>
                  ))}
                </div>
              </div>
              <div className="card p-8 text-center text-muted">
                <FiStar className="text-4xl mx-auto mb-3 text-yellow-300" />
                <p className="font-semibold text-secondary">Reviews Coming Soon</p>
                <p className="text-sm mt-1">Customer reviews and ratings will appear here once you start receiving orders.</p>
              </div>
            </div>
          )}

          {/* ══ ANALYTICS ══ */}
          {activeTab === 'analytics' && (
            <div className="animate-fade-in space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {[
                  { label: 'Total Orders', value: stats.totalOrders || 0, icon: '📦', color: 'from-blue-500 to-blue-700' },
                  { label: 'Total Revenue', value: `₹${(stats.totalRevenue || 0).toLocaleString()}`, icon: '💰', color: 'from-green-500 to-emerald-700' },
                  { label: 'Avg Order Value', value: stats.totalOrders ? `₹${Math.round((stats.totalRevenue || 0) / stats.totalOrders)}` : '—', icon: '📊', color: 'from-purple-500 to-purple-700' },
                ].map(({ label, value, icon, color }) => (
                  <div key={label} className={`rounded-2xl p-5 bg-gradient-to-br ${color} text-white`}>
                    <div className="text-3xl mb-2">{icon}</div>
                    <div className="text-2xl font-black">{value}</div>
                    <div className="text-white/70 text-sm mt-0.5">{label}</div>
                  </div>
                ))}
              </div>
              <div className="card p-8 text-center text-muted">
                <FiBarChart2 className="text-4xl mx-auto mb-3 text-primary" />
                <p className="font-semibold text-secondary">Advanced Analytics Coming Soon</p>
                <p className="text-sm mt-1">Detailed charts, revenue graphs, and order trends will be available here.</p>
              </div>
            </div>
          )}

          {/* ══ SETTINGS ══ */}
          {activeTab === 'settings' && (
            <div className="animate-fade-in space-y-4 max-w-lg">
              <div className="card p-5">
                <h3 className="font-bold text-secondary mb-4 flex items-center gap-2"><FiSettings className="text-primary" /> Account Settings</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between py-3 border-b border-border">
                    <div>
                      <p className="font-medium text-secondary text-sm">Email</p>
                      <p className="text-muted text-xs">{user?.email}</p>
                    </div>
                    <span className="badge badge-primary text-xs">Verified</span>
                  </div>
                  <div className="flex items-center justify-between py-3 border-b border-border">
                    <div>
                      <p className="font-medium text-secondary text-sm">Account Status</p>
                      <p className="text-muted text-xs capitalize">{vendorStatus}</p>
                    </div>
                    <span className={`badge text-xs ${vendorStatus === 'active' ? 'badge-success' : vendorStatus === 'pending' ? 'badge-warning' : 'badge-error'}`}>
                      {vendorStatus}
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-3">
                    <div>
                      <p className="font-medium text-secondary text-sm">Partner Type</p>
                      <p className="text-muted text-xs capitalize">{vendor?.partnerType}</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="card p-8 text-center text-muted">
                <FiSettings className="text-4xl mx-auto mb-3 text-primary animate-spin-slow" />
                <p className="font-semibold text-secondary">More Settings Coming Soon</p>
                <p className="text-sm mt-1">Password change, notification preferences, and more will be available here.</p>
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
};

export default PartnerDashboard;
