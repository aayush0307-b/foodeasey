import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import foodService from '../services/foodService';
import { useCart } from '../context/CartContext';
import { FiStar, FiClock, FiMinus, FiPlus, FiArrowLeft, FiShoppingCart } from 'react-icons/fi';
import { MdOutlineDeliveryDining, MdOutlineStorefront } from 'react-icons/md';

const FoodDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, updateQuantity, cartItems } = useCart();
  const [food, setFood] = useState(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);

  const cartItem = cartItems.find((i) => i._id === id);

  useEffect(() => {
    const fetchFood = async () => {
      try {
        const data = await foodService.getFoodById(id);
        setFood(data);
      } catch {
        navigate('/');
      } finally {
        setLoading(false);
      }
    };
    fetchFood();
  }, [id]);

  if (loading) {
    return (
      <div className="page-container py-10 md:py-16">
        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
          <div className="skeleton h-80 rounded-3xl" />
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className={`skeleton h-6 rounded-xl ${i === 0 ? 'w-3/4' : i === 1 ? 'w-full' : 'w-1/2'}`} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!food) return null;

  const { name, description, price, image, category, rating, isVeg, vendorId, preparationTime, tags } = food;

  const handleAddToCart = () => {
    for (let i = 0; i < qty; i++) {
      addToCart({ ...food, vendorId: vendorId?._id || vendorId });
    }
  };

  return (
    <div className="py-6 md:py-10">
      <div className="page-container">
        {/* Back */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-secondary hover:text-primary transition-colors mb-6 font-medium"
        >
          <FiArrowLeft /> Back
        </button>

        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8 md:gap-12">
            {/* Image */}
            <div className="relative">
              <div className="relative overflow-hidden rounded-3xl h-72 md:h-96 shadow-card-hover">
                <img
                  src={image}
                  alt={name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800';
                  }}
                />
                {/* Veg/Non-Veg */}
                <div className="absolute top-4 left-4">
                  <div className={`w-6 h-6 rounded border-2 flex items-center justify-center bg-white shadow ${isVeg ? 'border-green-600' : 'border-red-600'}`}>
                    <div className={`w-3 h-3 rounded-full ${isVeg ? 'bg-green-600' : 'bg-red-600'}`} />
                  </div>
                </div>
              </div>

              {/* Tags */}
              {tags?.length > 0 && (
                <div className="flex gap-2 mt-3 flex-wrap">
                  {tags.map((tag) => (
                    <span key={tag} className="badge-primary capitalize">{tag}</span>
                  ))}
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex flex-col">
              <span className="badge-primary text-xs mb-3 self-start">{category}</span>
              <h1 className="text-2xl md:text-3xl font-black text-secondary mb-3">{name}</h1>
              <p className="text-muted leading-relaxed mb-5">{description}</p>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-3 mb-6">
                {[
                  { icon: FiStar, label: 'Rating', value: rating?.toFixed(1), iconClass: 'text-yellow-400 fill-yellow-400' },
                  { icon: FiClock, label: 'Prep Time', value: preparationTime, iconClass: 'text-primary' },
                  { icon: MdOutlineDeliveryDining, label: 'Delivery', value: vendorId?.deliveryTime || '30-45 min', iconClass: 'text-primary' },
                ].map(({ icon: Icon, label, value, iconClass }) => (
                  <div key={label} className="bg-background rounded-2xl p-3 text-center">
                    <Icon className={`text-xl mx-auto mb-1 ${iconClass}`} />
                    <div className="font-bold text-secondary text-sm">{value}</div>
                    <div className="text-muted text-xs">{label}</div>
                  </div>
                ))}
              </div>

              {/* Vendor */}
              {vendorId && (
                <div className="flex items-center gap-3 p-3 bg-background rounded-xl mb-6">
                  <MdOutlineStorefront className="text-primary text-xl flex-shrink-0" />
                  <div>
                    <p className="text-xs text-muted">From</p>
                    <p className="font-semibold text-secondary text-sm">{vendorId.name}</p>
                  </div>
                  <span className={`badge ml-auto ${vendorId.isOpen ? 'badge-success' : 'bg-gray-100 text-gray-500'}`}>
                    {vendorId.isOpen ? 'Open' : 'Closed'}
                  </span>
                </div>
              )}

              {/* Price */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <span className="text-3xl font-black text-secondary">₹{price}</span>
                  <span className="text-muted text-sm ml-1">per item</span>
                </div>
                <span className={`badge ${isVeg ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                  {isVeg ? '🌿 Veg' : '🍖 Non-Veg'}
                </span>
              </div>

              {/* Quantity + Add to Cart */}
              <div className="flex items-center gap-4">
                {/* Quantity */}
                <div className="flex items-center gap-3 bg-background rounded-xl px-4 py-2.5">
                  <button
                    onClick={() => setQty((q) => Math.max(1, q - 1))}
                    className="text-secondary hover:text-primary transition-colors"
                  >
                    <FiMinus />
                  </button>
                  <span className="font-bold text-secondary w-5 text-center">{qty}</span>
                  <button
                    onClick={() => setQty((q) => q + 1)}
                    className="text-secondary hover:text-primary transition-colors"
                  >
                    <FiPlus />
                  </button>
                </div>

                {/* Add to Cart */}
                <button
                  id={`add-to-cart-detail-${id}`}
                  onClick={handleAddToCart}
                  className="btn-primary flex-1 flex items-center justify-center gap-2"
                >
                  <FiShoppingCart />
                  Add to Cart — ₹{price * qty}
                </button>
              </div>

              {cartItem && (
                <p className="text-xs text-muted text-center mt-3">
                  ✓ {cartItem.quantity} item(s) already in your cart
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FoodDetails;
