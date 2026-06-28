import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import VendorCard from '../components/VendorCard';
import SearchBar from '../components/SearchBar';
import vendorService from '../services/vendorService';
import { FiFilter, FiMapPin } from 'react-icons/fi';

const CUISINE_FILTERS = ['All', 'Burgers', 'Pizza', 'Biryani', 'Chinese', 'South Indian', 'Desserts', 'Drinks'];

const Vendors = () => {
  const [searchParams] = useSearchParams();
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [activeFilter, setActiveFilter] = useState(searchParams.get('category') || 'All');
  const [showOpenOnly, setShowOpenOnly] = useState(false);

  const fetchVendors = async (query = '', openOnly = false) => {
    setLoading(true);
    try {
      const params = {};
      if (query) params.search = query;
      if (openOnly) params.isOpen = true;
      const data = await vendorService.getVendors(params);
      setVendors(data);
    } catch {
      setVendors([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVendors(searchQuery, showOpenOnly);
  }, [showOpenOnly]);

  const handleSearch = (q) => {
    setSearchQuery(q);
    fetchVendors(q, showOpenOnly);
  };

  const filteredVendors = vendors.filter((v) => {
    if (activeFilter === 'All') return true;
    return v.cuisineTypes?.some((c) => c.toLowerCase().includes(activeFilter.toLowerCase()));
  });

  return (
    <div className="py-8 md:py-10">
      <div className="page-container">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-muted text-sm mb-2">
            <FiMapPin className="text-primary" />
            <span>Mumbai, Maharashtra</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-secondary mb-2">
            Restaurants Near You
          </h1>
          <p className="text-muted">
            {loading ? 'Finding restaurants...' : `${filteredVendors.length} restaurants available`}
          </p>
        </div>

        {/* Search */}
        <SearchBar
          placeholder="Search restaurants..."
          onSearch={handleSearch}
          className="mb-6"
        />

        {/* Filters */}
        <div className="flex items-center gap-3 mb-6 flex-wrap">
          {/* Open Only toggle */}
          <button
            onClick={() => setShowOpenOnly(!showOpenOnly)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium border-2 transition-all duration-200 ${
              showOpenOnly
                ? 'border-primary bg-primary text-white'
                : 'border-border text-secondary hover:border-primary hover:text-primary'
            }`}
          >
            <FiFilter className="text-sm" />
            Open Now
          </button>

          {/* Cuisine filters */}
          {CUISINE_FILTERS.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-4 py-2 rounded-xl text-sm font-medium border-2 transition-all duration-200 ${
                activeFilter === filter
                  ? 'border-primary bg-primary text-white'
                  : 'border-border text-secondary hover:border-primary hover:text-primary'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* Vendors Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="skeleton h-64 rounded-2xl" />
            ))}
          </div>
        ) : filteredVendors.length === 0 ? (
          <div className="text-center py-20">
            <span className="text-7xl block mb-4">🏪</span>
            <h3 className="text-xl font-bold text-secondary mb-2">No Restaurants Found</h3>
            <p className="text-muted">Try a different search or filter</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredVendors.map((vendor) => (
              <VendorCard key={vendor._id} vendor={vendor} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Vendors;
