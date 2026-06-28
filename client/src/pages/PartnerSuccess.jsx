import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiCheckCircle, FiClock, FiMail, FiArrowRight, FiHome } from 'react-icons/fi';
import { HiOutlineSparkles } from 'react-icons/hi';

const steps = [
  { icon: '📋', label: 'Registration Received', done: true },
  { icon: '🔍', label: 'Under Review (1-2 business days)', done: false },
  { icon: '✅', label: 'Account Activated', done: false },
];

const PartnerSuccess = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-secondary-dark to-[#0f2d1a] flex items-center justify-center px-4 py-16 relative overflow-hidden">
      {/* Background blobs */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-green-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-lg w-full relative z-10 text-center">
        {/* Animated checkmark */}
        <div className="flex justify-center mb-8">
          <div className="relative">
            <div className="w-28 h-28 bg-green-500/20 rounded-full flex items-center justify-center animate-pulse-primary">
              <div className="w-20 h-20 bg-green-500/30 rounded-full flex items-center justify-center">
                <div className="w-14 h-14 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full flex items-center justify-center shadow-xl shadow-green-500/40 animate-scale-in">
                  <FiCheckCircle className="text-white text-3xl" />
                </div>
              </div>
            </div>
            {/* Floating sparkles */}
            <HiOutlineSparkles className="absolute -top-2 -right-2 text-yellow-400 text-xl animate-float" />
            <HiOutlineSparkles className="absolute -bottom-1 -left-3 text-green-400 text-sm animate-float" style={{ animationDelay: '1s' }} />
          </div>
        </div>

        {/* Heading */}
        <h1 className="text-3xl md:text-4xl font-black text-white mb-3 leading-tight">
          Registration Submitted
          <span className="block text-green-400 mt-1">Successfully! 🎉</span>
        </h1>

        {/* Message card */}
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 p-6 mb-6 text-left shadow-2xl">
          <div className="flex items-start gap-3 mb-4">
            <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
              <FiMail className="text-blue-400" />
            </div>
            <p className="text-white/80 text-sm leading-relaxed">
              Your registration has been submitted successfully. Our team will review your business details and activate your account within <strong className="text-white">1-2 business days</strong>.
            </p>
          </div>

          {/* Timeline */}
          <div className="space-y-3 mt-4">
            {steps.map((s, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm flex-shrink-0 ${
                  s.done ? 'bg-green-500 shadow-md shadow-green-500/30' : 'bg-white/10 border border-white/20'
                }`}>
                  {s.done ? '✓' : s.icon}
                </div>
                <span className={`text-sm font-medium ${s.done ? 'text-green-400' : 'text-white/50'}`}>
                  {s.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* What happens next */}
        <div className="bg-white/5 rounded-2xl border border-white/10 p-4 mb-8 text-left">
          <p className="text-white/60 text-xs font-semibold uppercase tracking-wide mb-3 flex items-center gap-1.5">
            <FiClock className="text-primary" /> What happens next?
          </p>
          <ul className="space-y-2">
            {[
              'Our team verifies your business documents',
              'We may call on your registered mobile number',
              'Once approved, you\'ll receive a confirmation email',
              'Log in to access your full partner dashboard',
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-white/60 text-xs">
                <span className="text-primary font-bold mt-0.5">{i + 1}.</span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            to="/login"
            className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-primary to-orange-500 text-white font-bold py-3 px-6 rounded-xl shadow-lg shadow-primary/30 hover:shadow-primary/50 active:scale-95 transition-all duration-200"
          >
            Sign In to Dashboard <FiArrowRight />
          </Link>
          <Link
            to="/"
            className="flex-1 flex items-center justify-center gap-2 bg-white/10 backdrop-blur-md text-white font-semibold py-3 px-6 rounded-xl border border-white/20 hover:bg-white/20 active:scale-95 transition-all duration-200"
          >
            <FiHome /> Go to Home
          </Link>
        </div>

        <p className="text-white/30 text-xs mt-6">
          Questions? Contact us at{' '}
          <a href="mailto:partner@foodeasey.com" className="text-primary hover:underline">
            partner@foodeasey.com
          </a>
        </p>
      </div>
    </div>
  );
};

export default PartnerSuccess;
