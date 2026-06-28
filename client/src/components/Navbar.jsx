import { useState, useRef, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import {
  FiShoppingCart, FiUser, FiMenu, FiX, FiLogOut,
  FiPackage, FiChevronDown, FiHome, FiGrid
} from 'react-icons/fi';
import { HiOutlineSparkles } from 'react-icons/hi';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await logout();
    setProfileOpen(false);
    navigate('/');
  };

  const navLinks = [
    { to: '/', label: 'Home', icon: FiHome },
    { to: '/vendors', label: 'Vendors', icon: FiGrid },
    { to: '/orders', label: 'Orders', icon: FiPackage },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-white shadow-navbar' : 'bg-white/95 backdrop-blur-md'
      }`}
    >
      <div className="page-container">
        <div className="flex items-center justify-between h-16 md:h-18">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 bg-gradient-primary rounded-xl flex items-center justify-center shadow-primary group-hover:shadow-primary-hover transition-all duration-300 group-hover:scale-105">
              <HiOutlineSparkles className="text-white text-lg" />
            </div>
            <span className="text-xl font-bold">
              <span className="text-secondary">Food</span>
              <span className="gradient-text">Easey</span>
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `nav-link px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive ? 'text-primary bg-primary/5' : 'text-secondary-light hover:text-primary hover:bg-gray-50'
                  }`
                }
              >
                {label}
              </NavLink>
            ))}
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-2">
            {/* Cart */}
            <Link
              to="/cart"
              id="cart-icon"
              className="relative p-2.5 rounded-xl hover:bg-gray-100 transition-all duration-200 group"
            >
              <FiShoppingCart className="text-xl text-secondary-light group-hover:text-primary transition-colors" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-white text-xs font-bold rounded-full flex items-center justify-center animate-scale-in">
                  {cartCount > 9 ? '9+' : cartCount}
                </span>
              )}
            </Link>

            {/* Auth */}
            {user ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  id="profile-menu-btn"
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-2 p-1.5 pr-3 rounded-xl hover:bg-gray-100 transition-all duration-200"
                >
                  <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center text-white font-semibold text-sm">
                    {user.name?.charAt(0).toUpperCase()}
                  </div>
                  <span className="hidden md:block text-sm font-medium text-secondary max-w-[100px] truncate">
                    {user.name?.split(' ')[0]}
                  </span>
                  <FiChevronDown
                    className={`text-muted text-sm transition-transform duration-200 ${profileOpen ? 'rotate-180' : ''}`}
                  />
                </button>

                {/* Dropdown */}
                {profileOpen && (
                  <div className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-card-hover border border-border overflow-hidden animate-slide-down">
                    <div className="px-4 py-3 border-b border-border">
                      <p className="font-semibold text-secondary text-sm truncate">{user.name}</p>
                      <p className="text-xs text-muted truncate">{user.email}</p>
                      <span className={`badge mt-1 ${user.role === 'vendor' ? 'badge-warning' : user.role === 'admin' ? 'badge-error' : 'badge-primary'}`}>
                        {user.role}
                      </span>
                    </div>
                    <div className="py-1">
                      <Link
                        to="/profile"
                        onClick={() => setProfileOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-secondary hover:bg-gray-50 transition-colors"
                      >
                        <FiUser className="text-primary" /> Profile
                      </Link>
                      <Link
                        to="/orders"
                        onClick={() => setProfileOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-secondary hover:bg-gray-50 transition-colors"
                      >
                        <FiPackage className="text-primary" /> My Orders
                      </Link>
                      {(user.role === 'vendor' || user.role === 'admin') && (
                        <Link
                          to="/partner/dashboard"
                          onClick={() => setProfileOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-secondary hover:bg-gray-50 transition-colors"
                        >
                          <FiGrid className="text-primary" /> Partner Dashboard
                        </Link>
                      )}
                      {user.role === 'admin' && (
                        <Link
                          to="/admin"
                          onClick={() => setProfileOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-secondary hover:bg-gray-50 transition-colors"
                        >
                          <HiOutlineSparkles className="text-primary" /> Admin Panel
                        </Link>
                      )}
                    </div>
                    <div className="border-t border-border py-1">
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-error hover:bg-red-50 transition-colors"
                      >
                        <FiLogOut /> Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login" className="btn-ghost text-sm hidden md:block">
                  Login
                </Link>
                <Link
                  to="/partner/register"
                  className="hidden md:flex items-center gap-1.5 text-sm font-semibold px-4 py-2 rounded-xl border-2 border-primary text-primary hover:bg-primary hover:text-white transition-all duration-200"
                >
                  🤝 Become a Partner
                </Link>
                <Link to="/register" className="btn-primary text-sm py-2 px-4">
                  Sign Up
                </Link>
              </div>
            )}

            {/* Mobile Menu Toggle */}
            <button
              id="mobile-menu-btn"
              className="md:hidden p-2 rounded-xl hover:bg-gray-100"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <FiX className="text-xl" /> : <FiMenu className="text-xl" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="md:hidden pb-4 border-t border-border animate-slide-down">
            <div className="flex flex-col gap-1 pt-3">
              {navLinks.map(({ to, label, icon: Icon }) => (
                <NavLink
                  key={to}
                  to={to}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                      isActive ? 'bg-primary/10 text-primary' : 'text-secondary hover:bg-gray-50'
                    }`
                  }
                >
                  <Icon /> {label}
                </NavLink>
              ))}
              {!user && (
                <>
                  <Link
                    to="/login"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-secondary hover:bg-gray-50"
                  >
                    <FiUser /> Login
                  </Link>
                  <Link
                    to="/partner/register"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-primary bg-primary/5 hover:bg-primary/10"
                  >
                    🤝 Become a Partner
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
