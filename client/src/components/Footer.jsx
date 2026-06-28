import { Link } from 'react-router-dom';
import { FiInstagram, FiTwitter, FiFacebook, FiYoutube } from 'react-icons/fi';
import { HiOutlineSparkles } from 'react-icons/hi';
import { MdOutlineEmail, MdOutlinePhone, MdOutlineLocationOn } from 'react-icons/md';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { to: '/', label: 'Home' },
    { to: '/vendors', label: 'Restaurants' },
    { to: '/orders', label: 'Track Order' },
    { to: '/profile', label: 'My Account' },
  ];

  const categories = ['Biryani', 'Pizza', 'Burgers', 'Chinese', 'South Indian', 'Desserts'];

  const socialLinks = [
    { icon: FiInstagram, href: '#', label: 'Instagram' },
    { icon: FiTwitter, href: '#', label: 'Twitter' },
    { icon: FiFacebook, href: '#', label: 'Facebook' },
    { icon: FiYoutube, href: '#', label: 'YouTube' },
  ];

  return (
    <footer className="bg-secondary text-white">
      {/* Main Footer */}
      <div className="page-container py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 bg-gradient-primary rounded-xl flex items-center justify-center shadow-primary">
                <HiOutlineSparkles className="text-white text-lg" />
              </div>
              <span className="text-xl font-bold text-white">
                Food<span className="text-primary">Easey</span>
              </span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed mb-5">
              Delicious food delivered to your doorstep. Fast, fresh, and always on time.
            </p>
            {/* Social */}
            <div className="flex items-center gap-3">
              {socialLinks.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-9 h-9 bg-white/10 rounded-lg flex items-center justify-center hover:bg-primary transition-all duration-200 hover:scale-110"
                >
                  <Icon className="text-sm" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-white mb-4">Quick Links</h3>
            <ul className="space-y-2.5">
              {quickLinks.map(({ to, label }) => (
                <li key={to}>
                  <Link
                    to={to}
                    className="text-gray-400 text-sm hover:text-primary transition-colors duration-200"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="font-semibold text-white mb-4">Categories</h3>
            <ul className="space-y-2.5">
              {categories.map((cat) => (
                <li key={cat}>
                  <Link
                    to={`/vendors?category=${cat}`}
                    className="text-gray-400 text-sm hover:text-primary transition-colors duration-200"
                  >
                    {cat}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-white mb-4">Contact</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <MdOutlineLocationOn className="text-primary text-lg mt-0.5 flex-shrink-0" />
                <span className="text-gray-400 text-sm">12, Food Street, Mumbai, Maharashtra 400001</span>
              </li>
              <li className="flex items-center gap-3">
                <MdOutlinePhone className="text-primary text-lg flex-shrink-0" />
                <a href="tel:+918001234567" className="text-gray-400 text-sm hover:text-primary transition-colors">
                  +91 800-123-4567
                </a>
              </li>
              <li className="flex items-center gap-3">
                <MdOutlineEmail className="text-primary text-lg flex-shrink-0" />
                <a href="mailto:hello@foodeasey.com" className="text-gray-400 text-sm hover:text-primary transition-colors">
                  hello@foodeasey.com
                </a>
              </li>
            </ul>

            {/* App Download CTA */}
            <div className="mt-5 p-3 bg-white/5 rounded-xl border border-white/10">
              <p className="text-xs text-gray-400 mb-2">Download our app</p>
              <div className="flex gap-2">
                <button className="flex-1 text-xs py-1.5 bg-white/10 hover:bg-primary rounded-lg transition-colors duration-200 font-medium">
                  App Store
                </button>
                <button className="flex-1 text-xs py-1.5 bg-white/10 hover:bg-primary rounded-lg transition-colors duration-200 font-medium">
                  Play Store
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="page-container py-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-gray-500 text-xs">
            © {currentYear} FoodEasey. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <a href="#" className="text-gray-500 text-xs hover:text-primary transition-colors">Privacy Policy</a>
            <a href="#" className="text-gray-500 text-xs hover:text-primary transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
