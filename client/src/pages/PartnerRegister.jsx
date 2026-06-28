import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import partnerService from '../services/partnerService';
import toast from 'react-hot-toast';
import {
  FiUser, FiMail, FiPhone, FiMapPin, FiClock, FiImage,
  FiChevronRight, FiChevronLeft, FiCheck, FiEye, FiEyeOff,
  FiNavigation, FiUpload, FiInfo
} from 'react-icons/fi';
import { MdOutlineRestaurant, MdOutlineStorefront } from 'react-icons/md';
import { HiOutlineSparkles } from 'react-icons/hi';

const FOOD_CATEGORIES = [
  { value: 'Fast Food', emoji: '🍔' },
  { value: 'Chinese', emoji: '🥡' },
  { value: 'South Indian', emoji: '🥘' },
  { value: 'North Indian', emoji: '🍛' },
  { value: 'Chaat', emoji: '🥙' },
  { value: 'Bakery', emoji: '🥐' },
  { value: 'Beverages', emoji: '🧃' },
  { value: 'Desserts', emoji: '🍰' },
  { value: 'Other', emoji: '🍽️' },
];

const STEPS = [
  { id: 1, title: 'Partner Type', icon: '🏪', desc: 'Choose your business type' },
  { id: 2, title: 'Basic Info', icon: '👤', desc: 'Owner & contact details' },
  { id: 3, title: 'Business Details', icon: '📋', desc: 'Description & address' },
  { id: 4, title: 'Location & Images', icon: '📍', desc: 'Map & photos' },
  { id: 5, title: 'Timing & More', icon: '⏰', desc: 'Hours & verification' },
];

const initialForm = {
  partnerType: '',
  ownerName: '',
  businessName: '',
  mobileNumber: '',
  whatsappNumber: '',
  email: '',
  password: '',
  confirmPassword: '',
  businessDescription: '',
  foodCategories: [],
  shopAddress: '',
  city: '',
  state: '',
  pincode: '',
  latitude: '',
  longitude: '',
  logoImage: '',
  coverImage: '',
  galleryImages: '',
  openingTime: '09:00',
  closingTime: '22:00',
  govtIdProof: '',
  gstNumber: '',
  fssaiLicense: '',
  avgPrepTime: 20,
  deliveryRadius: 5,
  isVegOnly: false,
};

const PartnerRegister = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [locating, setLocating] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  }, []);

  const toggleCategory = (cat) => {
    setForm((prev) => ({
      ...prev,
      foodCategories: prev.foodCategories.includes(cat)
        ? prev.foodCategories.filter((c) => c !== cat)
        : [...prev.foodCategories, cat],
    }));
  };

  const useCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast.error('Geolocation is not supported by your browser');
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setForm((prev) => ({
          ...prev,
          latitude: pos.coords.latitude.toFixed(6),
          longitude: pos.coords.longitude.toFixed(6),
        }));
        setLocating(false);
        toast.success('Location captured successfully!');
      },
      () => {
        setLocating(false);
        toast.error('Could not get your location. Please enter coordinates manually.');
      }
    );
  };

  const validateStep = () => {
    const newErrors = {};
    if (step === 1 && !form.partnerType) newErrors.partnerType = 'Please select a partner type';
    if (step === 2) {
      if (!form.ownerName.trim()) newErrors.ownerName = 'Owner name is required';
      if (!form.businessName.trim()) newErrors.businessName = 'Business name is required';
      if (!form.mobileNumber.trim()) newErrors.mobileNumber = 'Mobile number is required';
      if (!form.email.trim()) newErrors.email = 'Email is required';
      if (!form.password) newErrors.password = 'Password is required';
      if (form.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
      if (form.password !== form.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    }
    if (step === 3) {
      if (!form.shopAddress.trim()) newErrors.shopAddress = 'Address is required';
      if (!form.city.trim()) newErrors.city = 'City is required';
      if (!form.state.trim()) newErrors.state = 'State is required';
      if (!form.pincode.trim()) newErrors.pincode = 'Pincode is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep()) setStep((s) => s + 1);
  };

  const handleBack = () => setStep((s) => s - 1);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        ...form,
        galleryImages: form.galleryImages
          ? form.galleryImages.split(',').map((s) => s.trim()).filter(Boolean)
          : [],
        latitude: form.latitude ? parseFloat(form.latitude) : undefined,
        longitude: form.longitude ? parseFloat(form.longitude) : undefined,
        avgPrepTime: Number(form.avgPrepTime),
        deliveryRadius: Number(form.deliveryRadius),
      };
      delete payload.confirmPassword;

      await partnerService.register(payload);
      navigate('/partner/success');
    } catch (err) {
      toast.error(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const inputClass = (field) =>
    `w-full border ${errors[field] ? 'border-red-400 bg-red-50' : 'border-border'} rounded-xl px-4 py-3 text-secondary placeholder-muted focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all duration-200 bg-white text-sm`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-secondary-dark to-[#2d1a1b] py-10 px-4 relative overflow-hidden">
      {/* Background orbs */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-2xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md text-white px-4 py-2 rounded-full text-sm font-medium mb-4 border border-white/20">
            <HiOutlineSparkles className="text-primary" /> Partner with FoodEasey
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-white mb-2">
            Register Your Business
          </h1>
          <p className="text-white/60 text-sm">
            Join hundreds of vendors serving thousands of happy customers
          </p>
        </div>

        {/* Step Progress Bar */}
        <div className="flex items-center justify-between mb-8 px-2">
          {STEPS.map((s, i) => (
            <div key={s.id} className="flex items-center flex-1">
              <div className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                    step > s.id
                      ? 'bg-green-500 text-white shadow-lg shadow-green-500/30'
                      : step === s.id
                      ? 'bg-primary text-white shadow-lg shadow-primary/40 scale-110'
                      : 'bg-white/10 text-white/40 border border-white/20'
                  }`}
                >
                  {step > s.id ? <FiCheck /> : <span>{s.emoji}</span>}
                </div>
                <span className={`text-xs mt-1 hidden sm:block font-medium transition-colors ${step === s.id ? 'text-white' : 'text-white/40'}`}>
                  {s.title}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <div className={`flex-1 h-0.5 mx-2 rounded-full transition-all duration-500 ${step > s.id ? 'bg-green-500' : 'bg-white/15'}`} />
              )}
            </div>
          ))}
        </div>

        {/* Form Card */}
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-primary/20 to-orange-500/10 px-6 py-4 border-b border-white/10">
            <h2 className="text-white font-bold text-lg">{STEPS[step - 1].title}</h2>
            <p className="text-white/60 text-xs">{STEPS[step - 1].desc}</p>
          </div>

          <form onSubmit={step === 5 ? handleSubmit : (e) => { e.preventDefault(); handleNext(); }}>
            <div className="p-6 space-y-4 animate-fade-in">

              {/* ── STEP 1: Partner Type ── */}
              {step === 1 && (
                <div className="space-y-4">
                  <p className="text-white/80 text-sm text-center">Select the type of business you want to register</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[
                      {
                        value: 'vendor',
                        icon: <MdOutlineStorefront className="text-4xl" />,
                        label: 'Street Food Vendor',
                        desc: 'Carts, stalls, roadside eateries, dhabas',
                        color: 'from-orange-500 to-amber-500',
                        emoji: '🛒',
                      },
                      {
                        value: 'restaurant',
                        icon: <MdOutlineRestaurant className="text-4xl" />,
                        label: 'Restaurant',
                        desc: 'Dine-in, takeaway, cloud kitchens',
                        color: 'from-primary to-rose-500',
                        emoji: '🍽️',
                      },
                    ].map((type) => (
                      <button
                        key={type.value}
                        type="button"
                        onClick={() => setForm((p) => ({ ...p, partnerType: type.value }))}
                        className={`relative p-6 rounded-2xl border-2 transition-all duration-300 text-left group ${
                          form.partnerType === type.value
                            ? 'border-primary bg-primary/20 shadow-lg shadow-primary/20'
                            : 'border-white/20 bg-white/5 hover:border-white/40 hover:bg-white/10'
                        }`}
                      >
                        {form.partnerType === type.value && (
                          <div className="absolute top-3 right-3 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                            <FiCheck className="text-white text-xs" />
                          </div>
                        )}
                        <div className={`text-5xl mb-3`}>{type.emoji}</div>
                        <div className={`inline-flex p-2 rounded-xl bg-gradient-to-br ${type.color} text-white mb-3`}>
                          {type.icon}
                        </div>
                        <h3 className="text-white font-bold text-lg">{type.label}</h3>
                        <p className="text-white/50 text-sm mt-1">{type.desc}</p>
                      </button>
                    ))}
                  </div>
                  {errors.partnerType && <p className="text-red-400 text-xs text-center">{errors.partnerType}</p>}
                </div>
              )}

              {/* ── STEP 2: Basic Info ── */}
              {step === 2 && (
                <div className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-white/70 text-xs font-medium block mb-1">Owner Full Name *</label>
                      <div className="relative">
                        <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-muted text-sm" />
                        <input name="ownerName" value={form.ownerName} onChange={handleChange}
                          placeholder="Ravi Kumar" className={`${inputClass('ownerName')} pl-9`} />
                      </div>
                      {errors.ownerName && <p className="text-red-400 text-xs mt-0.5">{errors.ownerName}</p>}
                    </div>
                    <div>
                      <label className="text-white/70 text-xs font-medium block mb-1">Business Name *</label>
                      <div className="relative">
                        <MdOutlineRestaurant className="absolute left-3 top-1/2 -translate-y-1/2 text-muted text-sm" />
                        <input name="businessName" value={form.businessName} onChange={handleChange}
                          placeholder="Ravi's Kitchen" className={`${inputClass('businessName')} pl-9`} />
                      </div>
                      {errors.businessName && <p className="text-red-400 text-xs mt-0.5">{errors.businessName}</p>}
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-white/70 text-xs font-medium block mb-1">Mobile Number *</label>
                      <div className="relative">
                        <FiPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-muted text-sm" />
                        <input name="mobileNumber" value={form.mobileNumber} onChange={handleChange}
                          placeholder="+91 98765 43210" className={`${inputClass('mobileNumber')} pl-9`} />
                      </div>
                      {errors.mobileNumber && <p className="text-red-400 text-xs mt-0.5">{errors.mobileNumber}</p>}
                    </div>
                    <div>
                      <label className="text-white/70 text-xs font-medium block mb-1">WhatsApp Number</label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-green-400 text-sm font-bold">📱</span>
                        <input name="whatsappNumber" value={form.whatsappNumber} onChange={handleChange}
                          placeholder="+91 98765 43210" className={`${inputClass('whatsappNumber')} pl-9`} />
                      </div>
                      <p className="text-white/30 text-xs mt-0.5">For order notifications</p>
                    </div>
                  </div>
                  <div>
                    <label className="text-white/70 text-xs font-medium block mb-1">Email Address *</label>
                    <div className="relative">
                      <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted text-sm" />
                      <input type="email" name="email" value={form.email} onChange={handleChange}
                        placeholder="partner@example.com" className={`${inputClass('email')} pl-9`} />
                    </div>
                    {errors.email && <p className="text-red-400 text-xs mt-0.5">{errors.email}</p>}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-white/70 text-xs font-medium block mb-1">Password *</label>
                      <div className="relative">
                        <input type={showPassword ? 'text' : 'password'} name="password" value={form.password} onChange={handleChange}
                          placeholder="Min 6 characters" className={`${inputClass('password')} pr-10`} />
                        <button type="button" onClick={() => setShowPassword((v) => !v)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-secondary">
                          {showPassword ? <FiEyeOff /> : <FiEye />}
                        </button>
                      </div>
                      {errors.password && <p className="text-red-400 text-xs mt-0.5">{errors.password}</p>}
                    </div>
                    <div>
                      <label className="text-white/70 text-xs font-medium block mb-1">Confirm Password *</label>
                      <div className="relative">
                        <input type={showConfirmPassword ? 'text' : 'password'} name="confirmPassword" value={form.confirmPassword} onChange={handleChange}
                          placeholder="Re-enter password" className={`${inputClass('confirmPassword')} pr-10`} />
                        <button type="button" onClick={() => setShowConfirmPassword((v) => !v)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-secondary">
                          {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
                        </button>
                      </div>
                      {errors.confirmPassword && <p className="text-red-400 text-xs mt-0.5">{errors.confirmPassword}</p>}
                    </div>
                  </div>
                </div>
              )}

              {/* ── STEP 3: Business Details + Address ── */}
              {step === 3 && (
                <div className="space-y-4">
                  <div>
                    <label className="text-white/70 text-xs font-medium block mb-1">Business Description</label>
                    <textarea name="businessDescription" value={form.businessDescription} onChange={handleChange}
                      placeholder="Tell customers what makes your food special..." rows={3}
                      className={`${inputClass('businessDescription')} resize-none`} />
                  </div>

                  <div>
                    <label className="text-white/70 text-xs font-medium block mb-2">Food Categories (select all that apply)</label>
                    <div className="grid grid-cols-3 gap-2">
                      {FOOD_CATEGORIES.map(({ value, emoji }) => (
                        <button
                          key={value} type="button" onClick={() => toggleCategory(value)}
                          className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium transition-all duration-200 border ${
                            form.foodCategories.includes(value)
                              ? 'bg-primary text-white border-primary shadow-primary shadow-md'
                              : 'bg-white/5 text-white/70 border-white/20 hover:border-white/40'
                          }`}
                        >
                          <span>{emoji}</span> {value}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="pt-2 border-t border-white/10">
                    <label className="text-white/70 text-xs font-medium block mb-2">📍 Address Information</label>
                    <div className="space-y-3">
                      <div>
                        <div className="relative">
                          <FiMapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-muted text-sm" />
                          <input name="shopAddress" value={form.shopAddress} onChange={handleChange}
                            placeholder="Shop / Building / Street Address *" className={`${inputClass('shopAddress')} pl-9`} />
                        </div>
                        {errors.shopAddress && <p className="text-red-400 text-xs mt-0.5">{errors.shopAddress}</p>}
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <input name="city" value={form.city} onChange={handleChange}
                            placeholder="City *" className={inputClass('city')} />
                          {errors.city && <p className="text-red-400 text-xs mt-0.5">{errors.city}</p>}
                        </div>
                        <div>
                          <input name="state" value={form.state} onChange={handleChange}
                            placeholder="State *" className={inputClass('state')} />
                          {errors.state && <p className="text-red-400 text-xs mt-0.5">{errors.state}</p>}
                        </div>
                      </div>
                      <input name="pincode" value={form.pincode} onChange={handleChange}
                        placeholder="Pincode *" className={inputClass('pincode')} />
                      {errors.pincode && <p className="text-red-400 text-xs mt-0.5">{errors.pincode}</p>}
                    </div>
                  </div>
                </div>
              )}

              {/* ── STEP 4: Location + Images ── */}
              {step === 4 && (
                <div className="space-y-4">
                  {/* Location */}
                  <div>
                    <label className="text-white/70 text-xs font-medium block mb-2">📍 Precise Location (for map display)</label>
                    <button
                      type="button" onClick={useCurrentLocation} disabled={locating}
                      className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-3 rounded-xl transition-all duration-200 active:scale-95 disabled:opacity-60 mb-3"
                    >
                      <FiNavigation className={locating ? 'animate-spin' : ''} />
                      {locating ? 'Getting Location...' : 'Use Current Location (GPS)'}
                    </button>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-white/50 text-xs block mb-1">Latitude</label>
                        <input name="latitude" value={form.latitude} onChange={handleChange}
                          placeholder="19.0760" className={inputClass('latitude')} />
                      </div>
                      <div>
                        <label className="text-white/50 text-xs block mb-1">Longitude</label>
                        <input name="longitude" value={form.longitude} onChange={handleChange}
                          placeholder="72.8777" className={inputClass('longitude')} />
                      </div>
                    </div>
                    {form.latitude && form.longitude && (
                      <div className="mt-2 p-3 bg-green-500/10 border border-green-500/30 rounded-xl flex items-center gap-2">
                        <FiCheck className="text-green-400" />
                        <span className="text-green-400 text-xs font-medium">
                          Location set: {form.latitude}, {form.longitude}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Images */}
                  <div className="pt-2 border-t border-white/10 space-y-3">
                    <label className="text-white/70 text-xs font-medium flex items-center gap-1.5">
                      <FiImage /> Business Images (paste image URLs)
                    </label>
                    <div>
                      <label className="text-white/50 text-xs block mb-1">Logo Image URL</label>
                      <div className="flex gap-2">
                        <input name="logoImage" value={form.logoImage} onChange={handleChange}
                          placeholder="https://example.com/logo.jpg" className={`${inputClass('logoImage')} flex-1`} />
                        {form.logoImage && (
                          <img src={form.logoImage} alt="logo preview" className="w-10 h-10 rounded-lg object-cover border border-border flex-shrink-0"
                            onError={(e) => { e.target.style.display = 'none'; }} />
                        )}
                      </div>
                    </div>
                    <div>
                      <label className="text-white/50 text-xs block mb-1">Cover Banner Image URL</label>
                      <div className="flex gap-2">
                        <input name="coverImage" value={form.coverImage} onChange={handleChange}
                          placeholder="https://example.com/cover.jpg" className={`${inputClass('coverImage')} flex-1`} />
                        {form.coverImage && (
                          <img src={form.coverImage} alt="cover preview" className="w-10 h-10 rounded-lg object-cover border border-border flex-shrink-0"
                            onError={(e) => { e.target.style.display = 'none'; }} />
                        )}
                      </div>
                    </div>
                    <div>
                      <label className="text-white/50 text-xs block mb-1">Shop Gallery Images (comma-separated URLs)</label>
                      <textarea name="galleryImages" value={form.galleryImages} onChange={handleChange}
                        placeholder="https://example.com/shop1.jpg, https://example.com/shop2.jpg"
                        rows={2} className={`${inputClass('galleryImages')} resize-none`} />
                      <p className="text-white/30 text-xs mt-0.5">Separate multiple URLs with commas</p>
                    </div>
                  </div>
                </div>
              )}

              {/* ── STEP 5: Timing + Verification + Additional ── */}
              {step === 5 && (
                <div className="space-y-4">
                  {/* Business Hours */}
                  <div>
                    <label className="text-white/70 text-xs font-medium flex items-center gap-1.5 mb-2">
                      <FiClock /> Business Hours
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-white/50 text-xs block mb-1">Opening Time</label>
                        <input type="time" name="openingTime" value={form.openingTime} onChange={handleChange}
                          className={inputClass('openingTime')} />
                      </div>
                      <div>
                        <label className="text-white/50 text-xs block mb-1">Closing Time</label>
                        <input type="time" name="closingTime" value={form.closingTime} onChange={handleChange}
                          className={inputClass('closingTime')} />
                      </div>
                    </div>
                  </div>

                  {/* Verification Documents */}
                  <div className="border-t border-white/10 pt-4">
                    <label className="text-white/70 text-xs font-medium flex items-center gap-1.5 mb-2">
                      <FiInfo /> Verification Documents (Optional)
                    </label>
                    {form.partnerType === 'vendor' ? (
                      <div>
                        <label className="text-white/50 text-xs block mb-1">Government ID Proof (Aadhaar / PAN / Voter ID)</label>
                        <input name="govtIdProof" value={form.govtIdProof} onChange={handleChange}
                          placeholder="ID number or paste document URL" className={inputClass('govtIdProof')} />
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <div>
                          <label className="text-white/50 text-xs block mb-1">GST Number (optional)</label>
                          <input name="gstNumber" value={form.gstNumber} onChange={handleChange}
                            placeholder="22AAAAA0000A1Z5" className={inputClass('gstNumber')} />
                        </div>
                        <div>
                          <label className="text-white/50 text-xs block mb-1">FSSAI License Number (optional)</label>
                          <input name="fssaiLicense" value={form.fssaiLicense} onChange={handleChange}
                            placeholder="10-digit FSSAI number" className={inputClass('fssaiLicense')} />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Additional Info */}
                  <div className="border-t border-white/10 pt-4 space-y-3">
                    <label className="text-white/70 text-xs font-medium block">Additional Settings</label>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-white/50 text-xs block mb-1">Avg Prep Time (minutes)</label>
                        <input type="number" min="5" max="120" name="avgPrepTime" value={form.avgPrepTime} onChange={handleChange}
                          className={inputClass('avgPrepTime')} />
                      </div>
                      <div>
                        <label className="text-white/50 text-xs block mb-1">Delivery Radius (km)</label>
                        <input type="number" min="1" max="50" name="deliveryRadius" value={form.deliveryRadius} onChange={handleChange}
                          className={inputClass('deliveryRadius')} />
                      </div>
                    </div>
                    <label className="flex items-center gap-3 cursor-pointer select-none group">
                      <div
                        onClick={() => setForm((p) => ({ ...p, isVegOnly: !p.isVegOnly }))}
                        className={`relative w-12 h-6 rounded-full transition-colors duration-300 flex-shrink-0 ${
                          form.isVegOnly ? 'bg-green-500' : 'bg-white/20'
                        }`}
                      >
                        <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-300 ${
                          form.isVegOnly ? 'translate-x-6' : 'translate-x-0'
                        }`} />
                      </div>
                      <div>
                        <span className="text-white/80 text-sm font-medium group-hover:text-white transition-colors">
                          🌿 Vegetarian Only
                        </span>
                        <p className="text-white/30 text-xs">All menu items are vegetarian</p>
                      </div>
                    </label>
                  </div>

                  {/* Summary mini-preview */}
                  <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
                    <p className="text-white/70 text-xs font-semibold mb-2">📋 Registration Summary</p>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div><span className="text-white/40">Type: </span><span className="text-white font-medium capitalize">{form.partnerType}</span></div>
                      <div><span className="text-white/40">Owner: </span><span className="text-white font-medium">{form.ownerName}</span></div>
                      <div><span className="text-white/40">Business: </span><span className="text-white font-medium">{form.businessName}</span></div>
                      <div><span className="text-white/40">City: </span><span className="text-white font-medium">{form.city}</span></div>
                      <div className="col-span-2"><span className="text-white/40">Categories: </span><span className="text-white font-medium">{form.foodCategories.join(', ') || 'None selected'}</span></div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Navigation Buttons */}
            <div className="px-6 pb-6 flex items-center justify-between gap-4">
              {step > 1 ? (
                <button type="button" onClick={handleBack}
                  className="flex items-center gap-2 text-white/70 hover:text-white font-medium px-4 py-2.5 rounded-xl border border-white/20 hover:border-white/40 transition-all duration-200">
                  <FiChevronLeft /> Back
                </button>
              ) : (
                <div />
              )}

              {step < 5 ? (
                <button type="submit"
                  className="flex items-center gap-2 bg-gradient-to-r from-primary to-orange-500 hover:from-primary-600 hover:to-orange-600 text-white font-bold px-6 py-2.5 rounded-xl shadow-lg shadow-primary/30 active:scale-95 transition-all duration-200 ml-auto">
                  Continue <FiChevronRight />
                </button>
              ) : (
                <button type="submit" disabled={loading}
                  className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold px-8 py-2.5 rounded-xl shadow-lg shadow-green-500/30 active:scale-95 transition-all duration-200 ml-auto disabled:opacity-60">
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <FiCheck /> Submit Registration
                    </>
                  )}
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Footer note */}
        <p className="text-center text-white/30 text-xs mt-6">
          Already a partner?{' '}
          <a href="/login" className="text-primary hover:text-orange-400 transition-colors font-medium">
            Sign in here
          </a>
        </p>
      </div>
    </div>
  );
};

export default PartnerRegister;
