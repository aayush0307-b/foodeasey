import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import vendorService from '../services/vendorService';
import orderService from '../services/orderService';
import foodService from '../services/foodService';
import { FiPackage, FiEdit2, FiPlus, FiTrash2, FiToggleLeft, FiToggleRight } from 'react-icons/fi';
import { MdOutlineRestaurant } from 'react-icons/md';
import toast from 'react-hot-toast';

const VendorDashboard = () => {
  const { user } = useAuth();
  const [vendor, setVendor] = useState(null);
  const [foods, setFoods] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [showFoodForm, setShowFoodForm] = useState(false);
  const [newFood, setNewFood] = useState({ name: '', description: '', price: '', image: '', category: 'Burgers', isVeg: false });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { vendor: v, foods: f } = await vendorService.getMyVendor();
        setVendor(v);
        setFoods(f);
        const o = await orderService.getVendorOrders(v._id);
        setOrders(o);
      } catch (err) {
        toast.error('Could not load vendor data. Make sure you have a vendor profile.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const stats = [
    { label: 'Total Orders', value: orders.length, icon: FiPackage, color: 'bg-primary/10 text-primary' },
    { label: 'Menu Items', value: foods.length, icon: MdOutlineRestaurant, color: 'bg-success/10 text-success' },
    { label: 'Revenue', value: `₹${orders.reduce((s, o) => s + o.totalAmount, 0).toLocaleString()}`, icon: FiPackage, color: 'bg-warning/10 text-warning' },
    { label: 'Pending', value: orders.filter((o) => o.status === 'pending').length, icon: FiPackage, color: 'bg-error/10 text-error' },
  ];

  const handleAddFood = async (e) => {
    e.preventDefault();
    try {
      const created = await foodService.createFood({ ...newFood, vendorId: vendor._id, price: Number(newFood.price) });
      setFoods((p) => [created, ...p]);
      setShowFoodForm(false);
      setNewFood({ name: '', description: '', price: '', image: '', category: 'Burgers', isVeg: false });
      toast.success('Food item added!');
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleDeleteFood = async (id) => {
    if (!window.confirm('Delete this item?')) return;
    await foodService.deleteFood(id);
    setFoods((p) => p.filter((f) => f._id !== id));
    toast.success('Item deleted');
  };

  const handleUpdateStatus = async (orderId, status) => {
    const updated = await orderService.updateOrderStatus(orderId, status);
    setOrders((p) => p.map((o) => (o._id === orderId ? { ...o, status: updated.status } : o)));
    toast.success('Order status updated');
  };

  if (loading) {
    return (
      <div className="page-container py-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[...Array(4)].map((_, i) => <div key={i} className="skeleton h-24 rounded-2xl" />)}
        </div>
        <div className="skeleton h-64 rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="py-8 md:py-10">
      <div className="page-container">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-black text-secondary">
              {vendor ? vendor.name : 'Vendor Dashboard'}
            </h1>
            <p className="text-muted text-sm">Manage your restaurant and orders</p>
          </div>
          {vendor && (
            <div className={`badge py-2 px-4 ${vendor.isOpen ? 'badge-success' : 'bg-gray-100 text-gray-500'} text-sm`}>
              {vendor.isOpen ? '● Open' : '● Closed'}
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="card p-4">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${color}`}>
                <Icon className="text-lg" />
              </div>
              <p className="text-2xl font-black text-secondary">{value}</p>
              <p className="text-muted text-xs mt-0.5">{label}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-background rounded-xl p-1 mb-6 w-fit">
          {['overview', 'menu', 'orders'].map((tab) => (
            <button
              key={tab}
              id={`vendor-tab-${tab}`}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition-all capitalize ${
                activeTab === tab ? 'bg-white text-primary shadow-card' : 'text-muted hover:text-secondary'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Menu Tab */}
        {activeTab === 'menu' && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-bold text-secondary">Menu Items ({foods.length})</h2>
              <button
                onClick={() => setShowFoodForm(!showFoodForm)}
                className="btn-primary text-sm py-2 px-4 flex items-center gap-2"
              >
                <FiPlus /> Add Item
              </button>
            </div>

            {/* Add Food Form */}
            {showFoodForm && (
              <div className="card p-5 mb-5">
                <h3 className="font-semibold text-secondary mb-4">Add New Food Item</h3>
                <form onSubmit={handleAddFood} className="grid sm:grid-cols-2 gap-3">
                  <input required placeholder="Food name" value={newFood.name} onChange={(e) => setNewFood(p => ({ ...p, name: e.target.value }))} className="input-field" />
                  <input required placeholder="Price (₹)" type="number" value={newFood.price} onChange={(e) => setNewFood(p => ({ ...p, price: e.target.value }))} className="input-field" />
                  <textarea placeholder="Description" value={newFood.description} onChange={(e) => setNewFood(p => ({ ...p, description: e.target.value }))} className="input-field sm:col-span-2 resize-none h-20" />
                  <input placeholder="Image URL" value={newFood.image} onChange={(e) => setNewFood(p => ({ ...p, image: e.target.value }))} className="input-field sm:col-span-2" />
                  <select value={newFood.category} onChange={(e) => setNewFood(p => ({ ...p, category: e.target.value }))} className="input-field">
                    {['Burgers', 'Pizza', 'Biryani', 'Chinese', 'Desserts', 'Drinks', 'Salads', 'South Indian', 'North Indian', 'Fast Food', 'Momos', 'Healthy'].map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                  <label className="flex items-center gap-2 input-field cursor-pointer">
                    <input type="checkbox" checked={newFood.isVeg} onChange={(e) => setNewFood(p => ({ ...p, isVeg: e.target.checked }))} className="accent-primary" />
                    <span className="text-sm text-secondary">Vegetarian</span>
                  </label>
                  <div className="sm:col-span-2 flex gap-3 justify-end">
                    <button type="button" onClick={() => setShowFoodForm(false)} className="btn-outline text-sm py-2 px-4">Cancel</button>
                    <button type="submit" className="btn-primary text-sm py-2 px-4">Add Item</button>
                  </div>
                </form>
              </div>
            )}

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {foods.map((food) => (
                <div key={food._id} className="card p-4 flex gap-3">
                  <img src={food.image} alt={food.name} className="w-16 h-16 rounded-xl object-cover flex-shrink-0"
                    onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200'; }} />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-secondary text-sm line-clamp-1">{food.name}</p>
                    <p className="text-xs text-muted">{food.category} • {food.isVeg ? '🌿 Veg' : '🍖 Non-Veg'}</p>
                    <p className="text-primary font-bold text-sm mt-1">₹{food.price}</p>
                  </div>
                  <button onClick={() => handleDeleteFood(food._id)} className="text-error hover:text-red-700 self-start flex-shrink-0">
                    <FiTrash2 className="text-sm" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div>
            <h2 className="font-bold text-secondary mb-4">Incoming Orders ({orders.length})</h2>
            {orders.length === 0 ? (
              <div className="text-center py-16 text-muted">
                <span className="text-5xl block mb-3">📦</span>
                <p>No orders yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <div key={order._id} className="card p-5">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <p className="font-bold text-secondary text-sm">#{order._id?.slice(-8).toUpperCase()}</p>
                        <p className="text-muted text-xs">{order.userId?.name} • {order.userId?.phone}</p>
                      </div>
                      <span className="font-black text-primary text-lg">₹{order.totalAmount}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className={`badge text-xs ${
                        order.status === 'pending' ? 'badge-warning' :
                        order.status === 'delivered' ? 'badge-success' :
                        order.status === 'cancelled' ? 'badge-error' : 'badge-primary'
                      }`}>
                        {order.status}
                      </span>
                      <select
                        value={order.status}
                        onChange={(e) => handleUpdateStatus(order._id, e.target.value)}
                        className="text-xs border border-border rounded-lg px-2 py-1.5 text-secondary bg-white focus:outline-none focus:border-primary"
                      >
                        {['pending', 'confirmed', 'preparing', 'out_for_delivery', 'delivered', 'cancelled'].map(s => (
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

        {/* Overview Tab */}
        {activeTab === 'overview' && vendor && (
          <div className="card p-6">
            <h2 className="font-bold text-secondary mb-4 flex items-center gap-2">
              <MdOutlineRestaurant className="text-primary" /> Restaurant Info
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-muted mb-1">Restaurant Name</p>
                <p className="font-semibold text-secondary">{vendor.name}</p>
              </div>
              <div>
                <p className="text-xs text-muted mb-1">Location</p>
                <p className="font-semibold text-secondary">{vendor.location?.address}, {vendor.location?.city}</p>
              </div>
              <div>
                <p className="text-xs text-muted mb-1">Delivery Time</p>
                <p className="font-semibold text-secondary">{vendor.deliveryTime}</p>
              </div>
              <div>
                <p className="text-xs text-muted mb-1">Min. Order</p>
                <p className="font-semibold text-secondary">₹{vendor.minOrder}</p>
              </div>
              <div>
                <p className="text-xs text-muted mb-1">Rating</p>
                <p className="font-semibold text-secondary">⭐ {vendor.rating?.toFixed(1)}</p>
              </div>
              <div>
                <p className="text-xs text-muted mb-1">Cuisines</p>
                <p className="font-semibold text-secondary">{vendor.cuisineTypes?.join(', ')}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VendorDashboard;
