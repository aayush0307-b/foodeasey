import { Link } from 'react-router-dom';
import { FiStar, FiClock, FiMapPin } from 'react-icons/fi';
import { MdOutlineDeliveryDining } from 'react-icons/md';

const VendorCard = ({ vendor }) => {
  const { _id, name, description, image, rating, location, isOpen, deliveryTime, minOrder, cuisineTypes } = vendor;

  return (
    <Link to={`/vendors/${_id}`} className="block">
      <div className={`card overflow-hidden group hover:-translate-y-1 transition-all duration-300 ${!isOpen ? 'opacity-80' : ''}`}>
        {/* Image */}
        <div className="relative overflow-hidden h-48">
          <img
            src={image}
            alt={name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            onError={(e) => {
              e.target.src = 'https://images.unsplash.com/photo-1514190051997-0f6f39ca5cde?w=800';
            }}
          />
          <div className="absolute inset-0 bg-gradient-card" />

          {/* Open/Closed Badge */}
          <div className="absolute top-3 right-3">
            <span
              className={`badge font-semibold text-xs px-3 py-1 ${
                isOpen
                  ? 'bg-success/90 text-white'
                  : 'bg-gray-800/80 text-white'
              }`}
            >
              {isOpen ? '● Open' : '● Closed'}
            </span>
          </div>

          {/* Cuisine Types */}
          <div className="absolute bottom-3 left-3 flex gap-1.5 flex-wrap">
            {cuisineTypes?.slice(0, 2).map((cuisine) => (
              <span key={cuisine} className="badge bg-white/90 text-secondary text-xs">
                {cuisine}
              </span>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          <div className="flex items-start justify-between mb-1">
            <h3 className="font-bold text-secondary text-base group-hover:text-primary transition-colors line-clamp-1">
              {name}
            </h3>
            {/* Rating */}
            <div className="flex items-center gap-1 bg-success/10 text-success px-2 py-0.5 rounded-lg text-sm font-semibold flex-shrink-0 ml-2">
              <FiStar className="fill-success text-xs" />
              {rating?.toFixed(1)}
            </div>
          </div>

          <p className="text-muted text-sm mb-3 line-clamp-1">{description}</p>

          {/* Meta */}
          <div className="flex items-center gap-4 text-xs text-muted border-t border-border pt-3">
            <span className="flex items-center gap-1">
              <FiClock className="text-primary" />
              {deliveryTime}
            </span>
            <span className="flex items-center gap-1">
              <MdOutlineDeliveryDining className="text-primary text-sm" />
              Min ₹{minOrder}
            </span>
            {location?.city && (
              <span className="flex items-center gap-1">
                <FiMapPin className="text-primary" />
                {location.city}
              </span>
            )}
          </div>
        </div>

        {/* Closed overlay */}
        {!isOpen && (
          <div className="absolute inset-0 bg-white/60 flex items-center justify-center rounded-2xl">
            <span className="bg-gray-800 text-white font-semibold px-4 py-2 rounded-xl text-sm">
              Currently Closed
            </span>
          </div>
        )}
      </div>
    </Link>
  );
};

export default VendorCard;
