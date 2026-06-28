import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiUser, FiMail, FiPhone, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';
import { FcGoogle } from 'react-icons/fc';
import { HiOutlineSparkles } from 'react-icons/hi';
import toast from 'react-hot-toast';

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirmPassword: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) {
      toast.error('Please fill all required fields');
      return;
    }
    if (form.password !== form.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    if (form.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    setLoading(true);
    try {
      const { confirmPassword, ...registerData } = form;
      await register(registerData);
      navigate('/');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    { id: 'register-name', icon: FiUser, name: 'name', placeholder: 'Full name', type: 'text', required: true },
    { id: 'register-email', icon: FiMail, name: 'email', placeholder: 'Email address', type: 'email', required: true },
    { id: 'register-phone', icon: FiPhone, name: 'phone', placeholder: 'Phone number (optional)', type: 'tel', required: false },
  ];

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left panel */}
      <div className="hidden lg:flex flex-1 hero-bg items-center justify-center relative overflow-hidden">
        <div className="text-center z-10 p-12">
          <div className="text-7xl mb-6 animate-float">🎉</div>
          <h2 className="text-3xl font-black text-white mb-3">
            Join thousands of<br />happy food lovers!
          </h2>
          <p className="text-gray-400 max-w-xs mx-auto">
            Sign up and get exclusive offers, free delivery on first order, and more.
          </p>
          <div className="mt-8 grid grid-cols-2 gap-3 max-w-xs mx-auto">
            {['🍔 500+ Dishes', '⚡ Fast Delivery', '🛡️ Safe Payments', '⭐ Top Rated'].map((item) => (
              <div key={item} className="bg-white/10 rounded-xl py-2 px-3 text-white text-sm font-medium">
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12 overflow-y-auto">
        <div className="w-full max-w-md">
          <Link to="/" className="flex items-center gap-2 mb-8">
            <div className="w-9 h-9 bg-gradient-primary rounded-xl flex items-center justify-center shadow-primary">
              <HiOutlineSparkles className="text-white text-lg" />
            </div>
            <span className="text-xl font-bold">
              <span className="text-secondary">Food</span>
              <span className="gradient-text">Easey</span>
            </span>
          </Link>

          <h1 className="text-3xl font-black text-secondary mb-2">Create account 🚀</h1>
          <p className="text-muted mb-8">Join FoodEasey and start ordering today!</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {fields.map(({ id, icon: Icon, name, placeholder, type, required }) => (
              <div key={name} className="relative">
                <Icon className="absolute left-4 top-1/2 -translate-y-1/2 text-muted text-base" />
                <input
                  id={id}
                  type={type}
                  name={name}
                  value={form[name]}
                  onChange={handleChange}
                  placeholder={placeholder}
                  required={required}
                  className="input-field pl-11"
                />
              </div>
            ))}

            {/* Password */}
            <div className="relative">
              <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-muted text-base" />
              <input
                id="register-password"
                type={showPass ? 'text' : 'password'}
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Password (min 6 chars)"
                required
                className="input-field pl-11 pr-11"
              />
              <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted hover:text-primary">
                {showPass ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>

            {/* Confirm Password */}
            <div className="relative">
              <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-muted text-base" />
              <input
                id="register-confirm-password"
                type="password"
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm password"
                required
                className="input-field pl-11"
              />
            </div>

            {/* Password strength hint */}
            {form.password && (
              <div className="flex gap-1">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                      form.password.length > i * 3
                        ? form.password.length >= 10
                          ? 'bg-success'
                          : form.password.length >= 7
                          ? 'bg-warning'
                          : 'bg-error'
                        : 'bg-border'
                    }`}
                  />
                ))}
              </div>
            )}

            <button
              id="register-submit"
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3.5 text-base flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Creating account...
                </>
              ) : (
                'Create Account'
              )}
            </button>

            <div className="flex items-center gap-3 my-2">
              <div className="flex-1 h-px bg-border" />
              <span className="text-muted text-sm">or</span>
              <div className="flex-1 h-px bg-border" />
            </div>

            <button
              type="button"
              onClick={() => toast('Google Login coming soon! 🚀')}
              className="w-full flex items-center justify-center gap-3 border-2 border-border rounded-xl py-3 hover:border-primary/30 hover:bg-gray-50 transition-all duration-200 font-medium text-secondary"
            >
              <FcGoogle className="text-xl" />
              Sign up with Google
            </button>
          </form>

          <p className="text-center text-sm text-muted mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-primary font-semibold hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
