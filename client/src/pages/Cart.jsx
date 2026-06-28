import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import orderService from '../services/orderService';
import { FiMinus, FiPlus, FiTrash2, FiShoppingCart, FiArrowRight, FiTag } from 'react-icons/fi';
import { MdOutlineDeliveryDining } from 'react-icons/md';
import toast from 'react-hot-toast';

const Cart = () => {
  const { cartItems, removeFromCart, updateQuantity, clearCart, cartTotal } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [placing, setPlacing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('cod');

  const deliveryFee = cartTotal > 300 ? 0 : 40;
  const taxes = Math.round(cartTotal * 0.05);
  const grandTotal = cartTotal + deliveryFee + taxes;

  const handleCheckout = async () => {
    if (!user) {
      navigate('/login', { state: { from: { pathname: '/cart' } } });
      return;
    }
    if (cartItems.length === 0) return;

    setPlacing(true);
    try {
      const orderData = {
        items: cartItems.map((item) => ({
          foodId: item._id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image,
        })),
        totalAmount: grandTotal,
        vendorId: cartItems[0]?.vendorId,
        paymentMethod,
        deliveryAddress: user.address || { street: 'Home', city: 'Mumbai', state: 'Maharashtra', pincode: '400001' },
      };

      await orderService.placeOrder(orderData);
      clearCart();
      toast.success('🎉 Order placed successfully!');
      navigate('/orders');
    } catch (err) {
      toast.error(err.message || 'Failed to place order');
    } finally {
      setPlacing(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="text-center max-w-sm mx-auto px-4">
          <div className="text-8xl mb-6 animate-float">🛒</div>
          <h2 className="text-2xl font-black text-secondary mb-3">Your cart is empty</h2>
          <p className="text-muted mb-6">Looks like you haven't added anything yet. Browse our menu and find something delicious!</p>
          <Link to="/vendors" className="btn-primary inline-flex items-center gap-2">
            <FiShoppingCart /> Start Ordering
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8 md:py-10">
      <div className="page-container">
        <h1 className="text-3xl font-black text-secondary mb-2">Your Cart</h1>
        <p className="text-muted mb-8">{cartItems.length} item(s) in your cart</p>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <div key={item._id} className="card p-4 flex gap-4 items-center">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-20 h-20 rounded-xl object-cover flex-shrink-0"
                  onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200'; }}
                />
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-secondary text-sm md:text-base line-clamp-1">{item.name}</h3>
                  <p className="text-muted text-xs mt-0.5">{item.category}</p>
                  <p className="text-primary font-bold mt-1">₹{item.price}</p>
                </div>

                {/* Quantity Controls */}
                <div className="flex items-center gap-2 bg-background rounded-xl px-3 py-2 flex-shrink-0">
                  <button
                    onClick={() => updateQuantity(item._id, item.quantity - 1)}
                    className="text-secondary hover:text-primary transition-colors"
                  >
                    <FiMinus className="text-sm" />
                  </button>
                  <span className="font-bold text-secondary w-5 text-center text-sm">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item._id, item.quantity + 1)}
                    className="text-secondary hover:text-primary transition-colors"
                  >
                    <FiPlus className="text-sm" />
                  </button>
                </div>

                {/* Item total */}
                <div className="text-right flex-shrink-0">
                  <p className="font-bold text-secondary">₹{item.price * item.quantity}</p>
                  <button
                    onClick={() => removeFromCart(item._id)}
                    className="text-error hover:text-red-700 mt-1 transition-colors"
                  >
                    <FiTrash2 className="text-sm" />
                  </button>
                </div>
              </div>
            ))}

            {/* Clear Cart */}
            <button
              onClick={() => { clearCart(); toast.success('Cart cleared'); }}
              className="text-sm text-error font-medium hover:underline"
            >
              Clear entire cart
            </button>

            {/* Promo */}
            <div className="card p-4">
              <div className="flex items-center gap-3">
                <FiTag className="text-primary text-lg flex-shrink-0" />
                <input
                  type="text"
                  placeholder="Enter promo code"
                  className="flex-1 bg-transparent outline-none text-sm text-secondary placeholder-muted"
                />
                <button className="text-primary font-semibold text-sm hover:text-primary-700">Apply</button>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="space-y-4">
            <div className="card p-5">
              <h2 className="font-bold text-secondary text-lg mb-4">Order Summary</h2>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted">Subtotal</span>
                  <span className="font-medium text-secondary">₹{cartTotal}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted flex items-center gap-1">
                    <MdOutlineDeliveryDining className="text-primary" /> Delivery Fee
                  </span>
                  <span className={`font-medium ${deliveryFee === 0 ? 'text-success' : 'text-secondary'}`}>
                    {deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}
                  </span>
                </div>
                {deliveryFee === 0 && (
                  <p className="text-xs text-success">🎉 Free delivery on orders above ₹300!</p>
                )}
                <div className="flex justify-between">
                  <span className="text-muted">Taxes (5%)</span>
                  <span className="font-medium text-secondary">₹{taxes}</span>
                </div>
                <div className="border-t border-border pt-3 flex justify-between">
                  <span className="font-bold text-secondary text-base">Total</span>
                  <span className="font-black text-primary text-xl">₹{grandTotal}</span>
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="card p-5">
              <h3 className="font-semibold text-secondary mb-3">Payment Method</h3>
              <div className="space-y-2">
                {[
                  { value: 'cod', label: '💵 Cash on Delivery' },
                  { value: 'online', label: '💳 Pay Online (UPI/Card)' },
                ].map(({ value, label }) => (
                  <label key={value} className="flex items-center gap-3 cursor-pointer p-3 rounded-xl hover:bg-background transition-colors">
                    <input
                      type="radio"
                      name="payment"
                      value={value}
                      checked={paymentMethod === value}
                      onChange={() => setPaymentMethod(value)}
                      className="accent-primary"
                    />
                    <span className="text-sm font-medium text-secondary">{label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Checkout */}
            <button
              id="checkout-btn"
              onClick={handleCheckout}
              disabled={placing}
              className="btn-primary w-full py-4 text-base flex items-center justify-center gap-2"
            >
              {placing ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Placing Order...
                </>
              ) : (
                <>
                  Place Order — ₹{grandTotal} <FiArrowRight />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
