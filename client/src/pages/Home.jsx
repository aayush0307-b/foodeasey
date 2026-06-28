import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import SearchBar from '../components/SearchBar';
import CategoryCard, { CATEGORIES } from '../components/CategoryCard';
import FoodCard from '../components/FoodCard';
import VendorCard from '../components/VendorCard';
import foodService from '../services/foodService';
import vendorService from '../services/vendorService';
import { FiArrowRight, FiTruck, FiShield, FiClock } from 'react-icons/fi';
import { MdOutlineLocalOffer } from 'react-icons/md';

const Home = () => {
  const [popularFoods, setPopularFoods] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [foods, vendorList] = await Promise.all([
          foodService.getPopularFoods(),
          vendorService.getVendors(),
        ]);
        setPopularFoods(foods);
        setVendors(vendorList);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredFoods =
    activeCategory === 'All'
      ? popularFoods
      : popularFoods.filter((f) => f.category === activeCategory);

  const features = [
    { icon: FiTruck, title: 'Fast Delivery', desc: '30-45 min average delivery time' },
    { icon: FiShield, title: 'Safe & Hygienic', desc: 'All vendors are quality certified' },
    { icon: FiClock, title: '24/7 Support', desc: 'Always here to help you' },
  ];

  return (
    <div>
      {/* ===== HERO ===== */}
      <section className="hero-bg min-h-[85vh] flex items-center relative overflow-hidden">
        <div className="page-container relative z-10 py-20 md:py-0">
          <div className="max-w-3xl mx-auto text-center">
            {/* Pill badge */}
            <div className="inline-flex items-center gap-2 bg-primary/20 border border-primary/30 px-4 py-2 rounded-full text-primary text-sm font-medium mb-6 animate-fade-in">
              <MdOutlineLocalOffer className="text-base" />
              🎉 Free delivery on your first order!
            </div>

            <h1 className="text-4xl md:text-6xl font-black text-white leading-tight mb-6 animate-slide-up">
              Delicious Food,{' '}
              <span className="gradient-text">Delivered Fast</span> to You
            </h1>
            <p className="text-gray-400 text-lg md:text-xl mb-10 animate-fade-in leading-relaxed">
              Discover top restaurants and order from 500+ dishes. Fresh meals delivered to your door in under 45 minutes.
            </p>

            {/* Search */}
            <div className="animate-slide-up">
              <SearchBar
                placeholder="Search for food, restaurants..."
                className="max-w-2xl mx-auto"
              />
            </div>

            {/* Stats */}
            <div className="flex items-center justify-center gap-8 md:gap-12 mt-10 animate-fade-in">
              {[
                { value: '500+', label: 'Menu Items' },
                { value: '50+', label: 'Restaurants' },
                { value: '4.8★', label: 'App Rating' },
              ].map(({ value, label }) => (
                <div key={label} className="text-center">
                  <div className="text-2xl md:text-3xl font-black text-white">{value}</div>
                  <div className="text-gray-400 text-xs md:text-sm">{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Floating food emojis */}
        <div className="absolute top-20 left-10 text-5xl animate-float opacity-30 hidden md:block">🍔</div>
        <div className="absolute top-40 right-20 text-4xl animate-float opacity-20 hidden md:block" style={{ animationDelay: '1s' }}>🍕</div>
        <div className="absolute bottom-20 left-1/4 text-3xl animate-float opacity-25 hidden md:block" style={{ animationDelay: '2s' }}>🍜</div>
        <div className="absolute bottom-32 right-10 text-5xl animate-float opacity-20 hidden md:block" style={{ animationDelay: '0.5s' }}>🍛</div>
      </section>

      {/* ===== FEATURES ===== */}
      <section className="py-10 bg-white">
        <div className="page-container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex items-center gap-4 p-5 rounded-2xl bg-background hover:bg-primary/5 transition-colors duration-200">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Icon className="text-primary text-xl" />
                </div>
                <div>
                  <h3 className="font-semibold text-secondary">{title}</h3>
                  <p className="text-muted text-sm">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CATEGORIES ===== */}
      <section className="py-10 md:py-14">
        <div className="page-container">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="section-title">What's on your mind?</h2>
              <p className="section-subtitle">Browse by category</p>
            </div>
          </div>
          <div className="flex gap-3 overflow-x-auto hide-scrollbar pb-2">
            {CATEGORIES.map((cat) => (
              <CategoryCard
                key={cat.label}
                category={cat}
                isActive={activeCategory === cat.label}
                onClick={setActiveCategory}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ===== POPULAR FOODS ===== */}
      <section className="py-4 md:py-8">
        <div className="page-container">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="section-title">Popular Foods</h2>
              <p className="section-subtitle">Most loved by our customers</p>
            </div>
            <Link to="/vendors" className="text-primary text-sm font-semibold flex items-center gap-1 hover:gap-2 transition-all duration-200">
              See All <FiArrowRight />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="skeleton h-72 rounded-2xl" />
              ))}
            </div>
          ) : filteredFoods.length === 0 ? (
            <div className="text-center py-16 text-muted">
              <span className="text-5xl block mb-3">🍽️</span>
              <p className="font-medium">No items in this category</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {filteredFoods.slice(0, 8).map((food) => (
                <FoodCard key={food._id} food={food} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ===== SPECIAL OFFERS BANNER ===== */}
      <section className="py-10 md:py-14">
        <div className="page-container">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary to-orange-400 p-8 md:p-12 text-white">
            <div className="relative z-10 max-w-lg">
              <span className="badge bg-white/20 text-white text-xs mb-4">Limited Time Offer</span>
              <h2 className="text-2xl md:text-4xl font-black mb-3">
                🎁 Get 30% OFF on your first order!
              </h2>
              <p className="text-white/80 mb-6 text-sm md:text-base">
                Use code <span className="font-bold bg-white/20 px-2 py-0.5 rounded-lg">FOODEASEY30</span> at checkout.
                Valid for new users only.
              </p>
              <Link to="/vendors" className="inline-flex items-center gap-2 bg-white text-primary font-bold px-6 py-3 rounded-xl hover:bg-opacity-90 transition-all duration-200 active:scale-95">
                Order Now <FiArrowRight />
              </Link>
            </div>

            {/* Decorative circles */}
            <div className="absolute -right-10 -top-10 w-48 h-48 bg-white/10 rounded-full" />
            <div className="absolute -right-5 -bottom-10 w-64 h-64 bg-white/5 rounded-full" />
            <div className="absolute right-20 top-5 text-6xl opacity-30 animate-float">🍔</div>
            <div className="absolute right-40 bottom-5 text-5xl opacity-20 animate-float" style={{ animationDelay: '1s' }}>🍕</div>
          </div>
        </div>
      </section>

      {/* ===== TOP VENDORS ===== */}
      <section className="py-4 md:py-10 pb-14">
        <div className="page-container">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="section-title">Top Restaurants</h2>
              <p className="section-subtitle">Highly rated near you</p>
            </div>
            <Link to="/vendors" className="text-primary text-sm font-semibold flex items-center gap-1 hover:gap-2 transition-all duration-200">
              View All <FiArrowRight />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="skeleton h-64 rounded-2xl" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {vendors.slice(0, 6).map((vendor) => (
                <VendorCard key={vendor._id} vendor={vendor} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;
