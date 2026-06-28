import { Link } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';

const NotFound = () => {
  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <div className="text-center max-w-md mx-auto px-4">
        {/* Animated 404 */}
        <div className="relative mb-6">
          <span className="text-[120px] font-black text-border leading-none select-none">404</span>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-6xl animate-float">🍽️</span>
          </div>
        </div>

        <h1 className="text-2xl md:text-3xl font-black text-secondary mb-3">
          Oops! Page Not Found
        </h1>
        <p className="text-muted mb-8 leading-relaxed">
          Looks like this page is missing from our menu. It might have been moved, deleted, or never existed.
        </p>

        <div className="flex items-center justify-center gap-3 flex-wrap">
          <Link to="/" className="btn-primary flex items-center gap-2">
            <FiArrowLeft /> Back to Home
          </Link>
          <Link to="/vendors" className="btn-outline">
            Browse Restaurants
          </Link>
        </div>

        {/* Decorative food emojis */}
        <div className="flex justify-center gap-4 mt-8 text-2xl opacity-40">
          {['🍕', '🍔', '🍜', '🍛', '🍣'].map((e, i) => (
            <span
              key={i}
              className="animate-float"
              style={{ animationDelay: `${i * 0.3}s` }}
            >
              {e}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NotFound;
