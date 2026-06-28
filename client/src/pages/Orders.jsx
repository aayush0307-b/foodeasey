import { useState, useEffect } from 'react';
import orderService from '../services/orderService';
import { FiPackage, FiClock, FiCheckCircle, FiXCircle, FiTruck } from 'react-icons/fi';
import { MdOutlineRestaurant } from 'react-icons/md';

const STATUS_CONFIG = {
  pending: { label: 'Pending', color: 'badge-warning', icon: FiClock },
  confirmed: { label: 'Confirmed', color: 'badge-primary', icon: FiCheckCircle },
  preparing: { label: 'Preparing', color: 'badge-warning', icon: MdOutlineRestaurant },
  out_for_delivery: { label: 'Out for Delivery', color: 'badge-primary', icon: FiTruck },
  delivered: { label: 'Delivered', color: 'badge-success', icon: FiCheckCircle },
  cancelled: { label: 'Cancelled', color: 'badge-error', icon: FiXCircle },
};

const OrderCard = ({ order }) => {
  const config = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending;
  const StatusIcon = config.icon;

  return (
    <div className="card p-5 md:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
        <div>
          <p className="text-xs text-muted font-medium">Order ID</p>
          <p className="font-bold text-secondary text-sm">#{order._id?.slice(-8).toUpperCase()}</p>
        </div>
        <div className="flex items-center gap-2">
          <span className={`badge ${config.color} flex items-center gap-1.5 py-1.5 px-3`}>
            <StatusIcon className="text-xs" />
            {config.label}
          </span>
        </div>
      </div>

      {/* Items */}
      <div className="space-y-2.5 mb-4">
        {order.items?.map((item, i) => (
          <div key={i} className="flex items-center gap-3">
            <img
              src={item.image}
              alt={item.name}
              className="w-10 h-10 rounded-lg object-cover flex-shrink-0"
              onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=100'; }}
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-secondary line-clamp-1">{item.name}</p>
              <p className="text-xs text-muted">Qty: {item.quantity} × ₹{item.price}</p>
            </div>
            <p className="text-sm font-semibold text-secondary flex-shrink-0">₹{item.price * item.quantity}</p>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="border-t border-border pt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div className="flex items-center gap-4 text-xs text-muted">
          <span className="flex items-center gap-1">
            <FiClock className="text-primary" />
            {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
          </span>
          {order.vendorId?.name && (
            <span className="flex items-center gap-1">
              <MdOutlineRestaurant className="text-primary" />
              {order.vendorId.name}
            </span>
          )}
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-muted capitalize bg-background px-2 py-1 rounded-lg">
            {order.paymentMethod === 'cod' ? '💵 COD' : '💳 Online'}
          </span>
          <span className="font-black text-primary text-lg">₹{order.totalAmount}</span>
        </div>
      </div>
    </div>
  );
};

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('current');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await orderService.getMyOrders();
        setOrders(data);
      } catch {
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const currentOrders = orders.filter((o) => !['delivered', 'cancelled'].includes(o.status));
  const pastOrders = orders.filter((o) => ['delivered', 'cancelled'].includes(o.status));

  const displayed = activeTab === 'current' ? currentOrders : pastOrders;

  return (
    <div className="py-8 md:py-10">
      <div className="page-container max-w-3xl">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
            <FiPackage className="text-primary text-lg" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-secondary">My Orders</h1>
            <p className="text-muted text-sm">{orders.length} total orders</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-background rounded-xl p-1 mb-6 w-fit">
          {[
            { key: 'current', label: 'Active', count: currentOrders.length },
            { key: 'past', label: 'Past', count: pastOrders.length },
          ].map(({ key, label, count }) => (
            <button
              key={key}
              id={`orders-tab-${key}`}
              onClick={() => setActiveTab(key)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
                activeTab === key
                  ? 'bg-white text-primary shadow-card'
                  : 'text-muted hover:text-secondary'
              }`}
            >
              {label}
              <span className={`badge text-xs py-0.5 px-2 ${activeTab === key ? 'badge-primary' : 'bg-border text-muted'}`}>
                {count}
              </span>
            </button>
          ))}
        </div>

        {/* Orders */}
        {loading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="skeleton h-40 rounded-2xl" />
            ))}
          </div>
        ) : displayed.length === 0 ? (
          <div className="text-center py-20">
            <span className="text-7xl block mb-4">📦</span>
            <h3 className="text-xl font-bold text-secondary mb-2">
              {activeTab === 'current' ? 'No Active Orders' : 'No Past Orders'}
            </h3>
            <p className="text-muted">
              {activeTab === 'current' ? 'Your current orders will appear here' : 'Your completed orders will appear here'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {displayed.map((order) => (
              <OrderCard key={order._id} order={order} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;
