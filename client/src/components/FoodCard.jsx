import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { FiStar, FiPlus, FiClock } from 'react-icons/fi';

const FoodCard = ({ food }) => {
  const { addToCart } = useCart();
  const { _id, name, description, price, image, category, rating, isVeg, vendorId, preparationTime, tags } = food;

  return (
    <div className="card overflow-hidden group cursor-pointer hover:-translate-y-1 transition-all duration-300">
      {/* Image */}
      <div className="relative overflow-hidden h-48">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800';
          }}
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-card opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Veg/NonVeg dot */}
        <div className="absolute top-3 left-3">
          <div className={`w-5 h-5 rounded border-2 flex items-center justify-center bg-white ${isVeg ? 'border-green-600' : 'border-red-600'}`}>
            <div className={`w-2.5 h-2.5 rounded-full ${isVeg ? 'bg-green-600' : 'bg-red-600'}`} />
          </div>
        </div>

        {/* Tags */}
        {tags && tags.includes('bestseller') && (
          <div className="absolute top-3 right-3">
            <span className="badge bg-yellow-400 text-yellow-900 text-xs font-semibold px-2 py-0.5 rounded-full">
              ⭐ Bestseller
            </span>
          </div>
        )}

        {/* Category */}
        <div className="absolute bottom-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <span className="badge bg-white/90 text-secondary text-xs">{category}</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <Link to={`/food/${_id}`}>
          <h3 className="font-semibold text-secondary text-base mb-1 hover:text-primary transition-colors line-clamp-1">
            {name}
          </h3>
        </Link>
        <p className="text-muted text-sm mb-3 line-clamp-2 leading-relaxed">{description}</p>

        {/* Meta */}
        <div className="flex items-center gap-3 mb-3 text-xs text-muted">
          <span className="flex items-center gap-1">
            <FiStar className="text-yellow-400 fill-yellow-400" />
            <span className="font-medium text-secondary">{rating?.toFixed(1)}</span>
          </span>
          <span className="flex items-center gap-1">
            <FiClock className="text-primary" />
            {preparationTime}
          </span>
        </div>

        {/* Price + Add */}
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xl font-bold text-secondary">₹{price}</span>
          </div>
          <button
            id={`add-to-cart-${_id}`}
            onClick={() => addToCart({ ...food, vendorId: vendorId?._id || vendorId })}
            className="flex items-center gap-1.5 bg-primary/10 text-primary hover:bg-primary hover:text-white font-semibold text-sm px-4 py-2 rounded-xl transition-all duration-200 active:scale-95"
          >
            <FiPlus className="text-base" />
            Add
          </button>
        </div>
      </div>
    </div>
  );
};

export default FoodCard;
