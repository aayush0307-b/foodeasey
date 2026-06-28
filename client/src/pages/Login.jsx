import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';
import { FcGoogle } from 'react-icons/fc';
import { HiOutlineSparkles } from 'react-icons/hi';
import toast from 'react-hot-toast';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  const [form, setForm] = useState({ email: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      toast.error('Please fill in all fields');
      return;
    }
    setLoading(true);
    try {
      await login(form);
      navigate(from, { replace: true });
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left — Illustration */}
      <div className="hidden lg:flex flex-1 hero-bg items-center justify-center relative overflow-hidden">
        <div className="text-center z-10 p-12">
          <div className="text-8xl mb-6 animate-float">🍔</div>
          <h2 className="text-3xl font-black text-white mb-3">
            Good food is just<br />a few clicks away
          </h2>
          <p className="text-gray-400 max-w-xs mx-auto">
            Log in and enjoy fast delivery from your favourite restaurants.
          </p>
          <div className="flex gap-4 justify-center mt-8 text-4xl">
            <span className="animate-float" style={{ animationDelay: '0.5s' }}>🍕</span>
            <span className="animate-float" style={{ animationDelay: '1s' }}>🍜</span>
            <span className="animate-float" style={{ animationDelay: '1.5s' }}>🍣</span>
          </div>
        </div>
        <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-primary/10 rounded-full" />
        <div className="absolute -top-10 -left-10 w-48 h-48 bg-primary/5 rounded-full" />
      </div>

      {/* Right — Form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 mb-8">
            <div className="w-9 h-9 bg-gradient-primary rounded-xl flex items-center justify-center shadow-primary">
              <HiOutlineSparkles className="text-white text-lg" />
            </div>
            <span className="text-xl font-bold">
              <span className="text-secondary">Food</span>
              <span className="gradient-text">Easey</span>
            </span>
          </Link>

          <h1 className="text-3xl font-black text-secondary mb-2">Welcome back! 👋</h1>
          <p className="text-muted mb-8">Sign in to continue ordering delicious food</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div className="relative">
              <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-muted text-base" />
              <input
                id="login-email"
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Email address"
                className="input-field pl-11"
                required
              />
            </div>

            {/* Password */}
            <div className="relative">
              <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-muted text-base" />
              <input
                id="login-password"
                type={showPass ? 'text' : 'password'}
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Password"
                className="input-field pl-11 pr-11"
                required
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted hover:text-primary transition-colors"
              >
                {showPass ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>

            {/* Demo hint */}
            <div className="p-3 bg-blue-50 border border-blue-100 rounded-xl text-xs text-blue-700">
              <strong>Demo:</strong> user@foodeasey.com / password123
            </div>

            {/* Submit */}
            <button
              id="login-submit"
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3.5 text-base flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </button>

            {/* Divider */}
            <div className="flex items-center gap-3 my-2">
              <div className="flex-1 h-px bg-border" />
              <span className="text-muted text-sm">or continue with</span>
              <div className="flex-1 h-px bg-border" />
            </div>

            {/* Google Login */}
            <button
              type="button"
              onClick={() => toast('Google Login coming soon! 🚀')}
              className="w-full flex items-center justify-center gap-3 border-2 border-border rounded-xl py-3 hover:border-primary/30 hover:bg-gray-50 transition-all duration-200 font-medium text-secondary"
            >
              <FcGoogle className="text-xl" />
              Continue with Google
            </button>
          </form>

          <p className="text-center text-sm text-muted mt-6">
            Don't have an account?{' '}
            <Link to="/register" className="text-primary font-semibold hover:underline">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
