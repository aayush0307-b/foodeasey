import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import adminService from '../services/adminService';
import toast from 'react-hot-toast';
import {
  FiGrid, FiUsers, FiCheckCircle, FiXCircle, FiClock,
  FiSearch, FiEye, FiTrash2, FiChevronRight, FiMenu,
  FiRefreshCw, FiPackage, FiDollarSign, FiAlertCircle,
  FiX, FiCheck, FiFilter, FiMapPin, FiPhone, FiMail,
  FiCalendar, FiStar, FiList
} from 'react-icons/fi';
import { MdOutlineRestaurant, MdOutlineStorefront } from 'react-icons/md';
import { HiOutlineSparkles } from 'react-icons/hi';

// ─── Constants ────────────────────────────────────────────────
const STATUS_CONFIG = {
  pending:  { label: 'Pending',  color: 'bg-yellow-100 text-yellow-700 border-yellow-200', dot: 'bg-yellow-400', icon: FiClock },
  active:   { label: 'Active',   color: 'bg-green-100 text-green-700 border-green-200',   dot: 'bg-green-500',  icon: FiCheckCircle },
  rejected: { label: 'Rejected', color: 'bg-red-100 text-red-700 border-red-200',         dot: 'bg-red-500',    icon: FiXCircle },
};

const NAV = [
  { id: 'overview',  label: 'Overview',       icon: FiGrid },
  { id: 'partners',  label: 'Partner Approvals', icon: FiUsers, badge: true },
  { id: 'users',     label: 'All Users',      icon: FiUsers },
];

// ─── Sub-components ───────────────────────────────────────────

const StatCard = ({ label, value, icon: Icon, color, sub }) => (
  <div className="card p-5">
    <div className={`w-11 h-11 rounded-2xl flex items-center justify-center mb-3 ${color}`}>
      <Icon className="text-xl" />
    </div>
    <p className="text-2xl font-black text-secondary">{value}</p>
    <p className="text-muted text-xs mt-0.5">{label}</p>
    {sub !== undefined && <p className="text-xs font-semibold text-yellow-600 mt-1">⏳ {sub} pending</p>}
  </div>
);

const StatusBadge = ({ status }) => {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.pending;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${cfg.color}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
      {cfg.label}
    </span>
  );
};

// ─── Reject Modal ─────────────────────────────────────────────
const RejectModal = ({ partner, onClose, onConfirm }) => {
  const [reason, setReason] = useState('');
  const REASONS = [
    'Incomplete documentation',
    'Invalid business address',
    'Duplicate registration',
    'Does not meet quality standards',
    'Invalid government ID',
    'Fake business information',
  ];
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md animate-scale-in">
        <div className="p-6 border-b border-border">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-secondary flex items-center gap-2">
              <FiXCircle className="text-error" /> Reject Partner
            </h3>
            <button onClick={onClose} className="p-1 rounded-lg hover:bg-gray-100"><FiX className="text-muted" /></button>
          </div>
          <p className="text-muted text-sm mt-1">Rejecting: <strong className="text-secondary">{partner?.name}</strong></p>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="text-xs text-muted font-medium block mb-2">Select a reason (optional)</label>
            <div className="flex flex-wrap gap-2 mb-3">
              {REASONS.map((r) => (
                <button
                  key={r} type="button" onClick={() => setReason(r)}
                  className={`text-xs px-3 py-1.5 rounded-lg border transition-all ${reason === r ? 'border-error bg-red-50 text-error font-semibold' : 'border-border text-muted hover:border-secondary'}`}
                >
                  {r}
                </button>
              ))}
            </div>
            <textarea
              value={reason} onChange={(e) => setReason(e.target.value)}
              placeholder="Or type a custom reason..."
              rows={3}
              className="input-field resize-none text-sm"
            />
          </div>
          <div className="flex gap-3">
            <button onClick={onClose} className="flex-1 btn-outline text-sm py-2.5">Cancel</button>
            <button
              onClick={() => onConfirm(reason)}
              className="flex-1 bg-error hover:bg-red-600 text-white font-bold py-2.5 rounded-xl transition-all active:scale-95 flex items-center justify-center gap-2 text-sm"
            >
              <FiXCircle /> Reject Partner
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Partner Detail Modal ─────────────────────────────────────
const PartnerDetailModal = ({ data, onClose, onApprove, onReject }) => {
  if (!data) return null;
  const { partner, foods, orders } = data;
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-scale-in">
        {/* Header */}
        <div className="sticky top-0 bg-white rounded-t-3xl px-6 py-4 border-b border-border flex items-center justify-between z-10">
          <div className="flex items-center gap-3">
            {partner.logoImage ? (
              <img src={partner.logoImage} alt="logo" className="w-10 h-10 rounded-xl object-cover" onError={(e) => { e.target.style.display='none'; }} />
            ) : (
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-orange-500 rounded-xl flex items-center justify-center">
                {partner.partnerType === 'vendor' ? <MdOutlineStorefront className="text-white" /> : <MdOutlineRestaurant className="text-white" />}
              </div>
            )}
            <div>
              <h3 className="font-bold text-secondary">{partner.name}</h3>
              <StatusBadge status={partner.status} />
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-gray-100"><FiX /></button>
        </div>

        <div className="p-6 space-y-5">
          {/* Partner details grid */}
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              { label: 'Owner Name', value: partner.ownerName },
              { label: 'Business Type', value: partner.partnerType === 'vendor' ? '🛒 Street Food Vendor' : '🍽️ Restaurant' },
              { label: 'Email', value: partner.email, icon: FiMail },
              { label: 'Mobile', value: partner.mobileNumber, icon: FiPhone },
              { label: 'WhatsApp', value: partner.whatsappNumber ? `📱 ${partner.whatsappNumber}` : '—' },
              { label: 'City', value: partner.location?.city, icon: FiMapPin },
              { label: 'State', value: partner.location?.state },
              { label: 'Pincode', value: partner.location?.pincode },
              { label: 'Opening Hours', value: `${partner.openingTime || '—'} – ${partner.closingTime || '—'}`, icon: FiClock },
              { label: 'Avg Prep Time', value: partner.avgPrepTime ? `${partner.avgPrepTime} min` : '—' },
              { label: 'Delivery Radius', value: partner.deliveryRadius ? `${partner.deliveryRadius} km` : '—' },
              { label: 'Veg Only', value: partner.isVegOnly ? '✅ Yes' : '❌ No' },
            ].map(({ label, value }) => (
              <div key={label} className="bg-background rounded-xl p-3">
                <p className="text-muted text-xs mb-0.5">{label}</p>
                <p className="text-secondary text-sm font-semibold">{value || '—'}</p>
              </div>
            ))}
          </div>

          {/* Address */}
          {partner.location?.address && (
            <div className="bg-background rounded-xl p-3">
              <p className="text-muted text-xs mb-0.5">Shop Address</p>
              <p className="text-secondary text-sm font-semibold">{partner.location.address}</p>
            </div>
          )}

          {/* Description */}
          {partner.description && (
            <div className="bg-background rounded-xl p-3">
              <p className="text-muted text-xs mb-1">Business Description</p>
              <p className="text-secondary text-sm">{partner.description}</p>
            </div>
          )}

          {/* Food categories */}
          {partner.foodCategories?.length > 0 && (
            <div>
              <p className="text-muted text-xs mb-2">Food Categories</p>
              <div className="flex flex-wrap gap-2">
                {partner.foodCategories.map((c) => (
                  <span key={c} className="badge badge-primary text-xs">{c}</span>
                ))}
              </div>
            </div>
          )}

          {/* Verification docs */}
          {(partner.gstNumber || partner.fssaiLicense || partner.govtIdProof) && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
              <p className="text-yellow-800 font-semibold text-xs mb-2">📋 Verification Documents</p>
              {partner.gstNumber && <p className="text-yellow-700 text-xs">GST: {partner.gstNumber}</p>}
              {partner.fssaiLicense && <p className="text-yellow-700 text-xs">FSSAI: {partner.fssaiLicense}</p>}
              {partner.govtIdProof && <p className="text-yellow-700 text-xs">Govt ID: {partner.govtIdProof}</p>}
            </div>
          )}

          {/* Coordinates */}
          {partner.location?.coordinates?.lat && (
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 flex items-center gap-2">
              <FiMapPin className="text-blue-500" />
              <p className="text-blue-700 text-xs">
                Location: {partner.location.coordinates.lat}, {partner.location.coordinates.lng}
              </p>
            </div>
          )}

          {/* Cover image preview */}
          {partner.coverImage && (
            <div>
              <p className="text-muted text-xs mb-2">Cover Banner</p>
              <img src={partner.coverImage} alt="cover" className="w-full h-32 object-cover rounded-2xl"
                onError={(e) => { e.target.style.display='none'; }} />
            </div>
          )}

          {/* Registered on */}
          <div className="flex items-center gap-2 text-muted text-xs">
            <FiCalendar />
            Registered on {new Date(partner.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
          </div>
        </div>

        {/* Action buttons (only for pending) */}
        {partner.status === 'pending' && (
          <div className="sticky bottom-0 bg-white rounded-b-3xl px-6 py-4 border-t border-border flex gap-3">
            <button
              onClick={() => onReject(partner)}
              className="flex-1 flex items-center justify-center gap-2 bg-red-50 hover:bg-red-100 text-error border border-red-200 font-bold py-3 rounded-xl transition-all text-sm"
            >
              <FiXCircle /> Reject
            </button>
            <button
              onClick={() => onApprove(partner._id)}
              className="flex-1 flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-green-500/30 active:scale-95 text-sm"
            >
              <FiCheckCircle /> Approve Partner
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// ─── Main Admin Panel ─────────────────────────────────────────
const AdminPanel = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [stats, setStats] = useState(null);
  const [partners, setPartners] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [search, setSearch] = useState('');

  // Modals
  const [detailData, setDetailData] = useState(null);
  const [rejectTarget, setRejectTarget] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);

  const loadStats = useCallback(async () => {
    try {
      const data = await adminService.getStats();
      setStats(data);
    } catch { /* silently handle */ }
  }, []);

  const loadPartners = useCallback(async () => {
    try {
      const data = await adminService.getAllPartners({ status: statusFilter, partnerType: typeFilter, search });
      setPartners(data);
    } catch (err) {
      toast.error('Failed to load partners');
    }
  }, [statusFilter, typeFilter, search]);

  const loadUsers = useCallback(async () => {
    try {
      const data = await adminService.getAllUsers();
      setUsers(data);
    } catch { /* silently handle */ }
  }, []);

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      await Promise.all([loadStats(), loadPartners(), loadUsers()]);
      setLoading(false);
    };
    init();
  }, []);

  useEffect(() => {
    if (activeTab === 'partners') loadPartners();
  }, [statusFilter, typeFilter, search, activeTab]);

  // Open detail modal
  const openDetail = async (id) => {
    setDetailLoading(true);
    try {
      const data = await adminService.getPartnerById(id);
      setDetailData(data);
    } catch (err) {
      toast.error('Could not load partner details');
    } finally {
      setDetailLoading(false);
    }
  };

  // Approve
  const handleApprove = async (id) => {
    try {
      await adminService.approvePartner(id);
      toast.success('✅ Partner approved! Their account is now active.');
      setDetailData(null);
      await Promise.all([loadPartners(), loadStats()]);
    } catch (err) {
      toast.error(err.message);
    }
  };

  // Reject
  const handleRejectConfirm = async (reason) => {
    if (!rejectTarget) return;
    try {
      await adminService.rejectPartner(rejectTarget._id, reason);
      toast.success('Partner rejected.');
      setRejectTarget(null);
      setDetailData(null);
      await Promise.all([loadPartners(), loadStats()]);
    } catch (err) {
      toast.error(err.message);
    }
  };

  // Delete
  const handleDelete = async (id) => {
    if (!window.confirm('Permanently delete this partner record?')) return;
    try {
      await adminService.deletePartner(id);
      toast.success('Partner deleted');
      setPartners((p) => p.filter((v) => v._id !== id));
      await loadStats();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const pendingCount = partners.filter((p) => p.status === 'pending').length;

  if (loading) {
    return (
      <div className="flex h-[calc(100vh-64px)] bg-background">
        <div className="w-60 bg-white border-r border-border" />
        <div className="flex-1 p-8 grid grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => <div key={i} className="skeleton h-24 rounded-2xl" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-64px)] bg-background overflow-hidden">
      {/* ── Sidebar ── */}
      <aside className={`fixed md:static inset-y-0 left-0 z-40 w-60 bg-secondary-dark flex flex-col transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
        <div className="p-5 border-b border-white/10">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 bg-gradient-to-br from-primary to-orange-500 rounded-xl flex items-center justify-center">
              <HiOutlineSparkles className="text-white" />
            </div>
            <div>
              <p className="text-white font-bold text-sm">FoodEasey</p>
              <p className="text-white/40 text-xs">Admin Panel</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 py-4">
          {NAV.map(({ id, label, icon: Icon, badge }) => (
            <button
              key={id}
              onClick={() => { setActiveTab(id); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-5 py-3 text-sm font-medium transition-all duration-200 group ${activeTab === id ? 'bg-primary text-white' : 'text-white/60 hover:bg-white/5 hover:text-white'}`}
            >
              <Icon className={`text-base flex-shrink-0 ${activeTab === id ? 'text-white' : 'text-white/40 group-hover:text-white/70'}`} />
              <span className="flex-1">{label}</span>
              {badge && pendingCount > 0 && (
                <span className="bg-yellow-400 text-yellow-900 text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                  {pendingCount}
                </span>
              )}
              {activeTab === id && <FiChevronRight className="text-white/60" />}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-white/10">
          <p className="text-white/30 text-xs">Logged in as</p>
          <p className="text-white/70 text-xs font-semibold truncate">{user?.email}</p>
        </div>
      </aside>

      {sidebarOpen && <div className="fixed inset-0 bg-black/50 z-30 md:hidden" onClick={() => setSidebarOpen(false)} />}

      {/* ── Main ── */}
      <main className="flex-1 overflow-y-auto">
        {/* Topbar */}
        <div className="sticky top-0 z-20 bg-white border-b border-border px-4 md:px-6 h-14 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(true)} className="md:hidden p-2 rounded-lg hover:bg-gray-100">
              <FiMenu className="text-secondary" />
            </button>
            <h2 className="font-bold text-secondary">{NAV.find((n) => n.id === activeTab)?.label}</h2>
          </div>
          <button onClick={() => Promise.all([loadStats(), loadPartners(), loadUsers()])}
            className="p-2 rounded-xl hover:bg-gray-100 text-muted hover:text-secondary transition-colors">
            <FiRefreshCw className="text-sm" />
          </button>
        </div>

        <div className="p-4 md:p-6 space-y-6">

          {/* ══ OVERVIEW ══ */}
          {activeTab === 'overview' && stats && (
            <div className="space-y-6 animate-fade-in">
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                <StatCard label="Total Partners" value={stats.totalVendors} icon={MdOutlineRestaurant} color="bg-primary/10 text-primary" sub={stats.pendingVendors} />
                <StatCard label="Total Users" value={stats.totalUsers} icon={FiUsers} color="bg-blue-100 text-blue-600" />
                <StatCard label="Total Orders" value={stats.totalOrders} icon={FiPackage} color="bg-purple-100 text-purple-600" />
                <StatCard label="Menu Items" value={stats.totalFoods} icon={FiList} color="bg-orange-100 text-orange-600" />
                <StatCard label="Total Revenue" value={`₹${(stats.totalRevenue || 0).toLocaleString()}`} icon={FiDollarSign} color="bg-green-100 text-green-600" />
                <div className="card p-5 flex flex-col justify-center items-center cursor-pointer hover:shadow-card-hover transition-all"
                  onClick={() => setActiveTab('partners')}>
                  <div className="w-11 h-11 rounded-2xl bg-yellow-100 flex items-center justify-center mb-3">
                    <FiClock className="text-yellow-600 text-xl" />
                  </div>
                  <p className="text-2xl font-black text-yellow-600">{stats.pendingVendors}</p>
                  <p className="text-muted text-xs mt-0.5">Awaiting Approval</p>
                  <span className="text-primary text-xs font-semibold mt-2">Review now →</span>
                </div>
              </div>

              {/* Pending partners preview */}
              {stats.pendingVendors > 0 && (
                <div className="card p-5">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-secondary flex items-center gap-2">
                      <FiAlertCircle className="text-yellow-500" /> Needs Your Attention
                    </h3>
                    <button onClick={() => { setStatusFilter('pending'); setActiveTab('partners'); }}
                      className="text-primary text-sm font-semibold hover:underline">
                      Review all {stats.pendingVendors} →
                    </button>
                  </div>
                  <p className="text-muted text-sm">
                    <strong className="text-yellow-600">{stats.pendingVendors} partner registration{stats.pendingVendors > 1 ? 's' : ''}</strong> {stats.pendingVendors > 1 ? 'are' : 'is'} waiting for your review. Go to <strong>Partner Approvals</strong> to approve or reject them.
                  </p>
                  <button
                    onClick={() => { setStatusFilter('pending'); setActiveTab('partners'); }}
                    className="mt-4 btn-primary text-sm py-2 px-5 flex items-center gap-2 w-fit"
                  >
                    <FiCheckCircle /> Review Pending Partners
                  </button>
                </div>
              )}

              {/* How approval works */}
              <div className="card p-5">
                <h3 className="font-bold text-secondary mb-4 flex items-center gap-2">
                  <HiOutlineSparkles className="text-primary" /> How Partner Approval Works
                </h3>
                <div className="grid sm:grid-cols-3 gap-4">
                  {[
                    { step: '1', icon: '📝', title: 'Partner Registers', desc: 'Vendor/Restaurant fills the registration form. Status is set to "Pending".' },
                    { step: '2', icon: '🔍', title: 'Admin Reviews', desc: 'You review their details, documents, and location in the Partner Approvals tab.' },
                    { step: '3', icon: '✅', title: 'Approve or Reject', desc: 'Approve → Status becomes "Active", partner can access the dashboard. Reject → partner is notified with a reason.' },
                  ].map(({ step, icon, title, desc }) => (
                    <div key={step} className="flex gap-3">
                      <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold text-sm flex-shrink-0 mt-0.5">
                        {step}
                      </div>
                      <div>
                        <div className="text-xl mb-1">{icon}</div>
                        <p className="font-semibold text-secondary text-sm">{title}</p>
                        <p className="text-muted text-xs mt-0.5">{desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ══ PARTNER APPROVALS ══ */}
          {activeTab === 'partners' && (
            <div className="space-y-4 animate-fade-in">
              {/* Filters */}
              <div className="card p-4 flex flex-wrap gap-3 items-center">
                {/* Search */}
                <div className="relative flex-1 min-w-48">
                  <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-muted text-sm" />
                  <input
                    value={search} onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search by name, email, city..."
                    className="input-field pl-9 text-sm py-2"
                  />
                </div>
                {/* Status filter */}
                <div className="flex gap-1 bg-background rounded-xl p-1">
                  {['all', 'pending', 'active', 'rejected'].map((s) => (
                    <button
                      key={s} onClick={() => setStatusFilter(s)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${statusFilter === s ? 'bg-white text-secondary shadow-sm' : 'text-muted hover:text-secondary'}`}
                    >
                      {s} {s !== 'all' && `(${partners.filter((p) => p.status === s).length})`}
                    </button>
                  ))}
                </div>
                {/* Type filter */}
                <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}
                  className="text-sm border border-border rounded-xl px-3 py-2 text-secondary bg-white focus:outline-none focus:border-primary">
                  <option value="all">All Types</option>
                  <option value="vendor">Street Food Vendor</option>
                  <option value="restaurant">Restaurant</option>
                </select>
              </div>

              {/* Status summary chips */}
              <div className="flex flex-wrap gap-3">
                {['pending', 'active', 'rejected'].map((s) => {
                  const count = partners.filter((p) => p.status === s).length;
                  const cfg = STATUS_CONFIG[s];
                  return (
                    <div key={s} className={`flex items-center gap-2 px-4 py-2 rounded-xl border ${cfg.color}`}>
                      <span className={`w-2 h-2 rounded-full ${cfg.dot}`} />
                      <span className="text-xs font-semibold capitalize">{s}: {count}</span>
                    </div>
                  );
                })}
              </div>

              {/* Partners list */}
              {partners.length === 0 ? (
                <div className="text-center py-20 text-muted">
                  <span className="text-5xl block mb-3">🏪</span>
                  <p className="font-medium text-secondary">No partners found</p>
                  <p className="text-sm">Try adjusting your filters</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {partners.map((partner) => (
                    <div key={partner._id} className="card p-4 md:p-5 hover:shadow-card-hover transition-all">
                      <div className="flex items-start gap-4">
                        {/* Logo */}
                        <div className="flex-shrink-0">
                          {partner.logoImage ? (
                            <img src={partner.logoImage} alt="logo" className="w-12 h-12 rounded-xl object-cover"
                              onError={(e) => { e.target.style.display='none'; e.target.nextSibling.style.display='flex'; }} />
                          ) : null}
                          <div className={`w-12 h-12 bg-gradient-to-br from-primary to-orange-500 rounded-xl flex items-center justify-center ${partner.logoImage ? 'hidden' : 'flex'}`}>
                            {partner.partnerType === 'vendor' ? <MdOutlineStorefront className="text-white text-xl" /> : <MdOutlineRestaurant className="text-white text-xl" />}
                          </div>
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 flex-wrap">
                            <div>
                              <h4 className="font-bold text-secondary">{partner.name}</h4>
                              <p className="text-muted text-xs mt-0.5">
                                <span className="font-medium text-secondary-light">{partner.ownerName}</span>
                                {partner.location?.city && ` • 📍 ${partner.location.city}, ${partner.location.state || ''}`}
                              </p>
                            </div>
                            <StatusBadge status={partner.status} />
                          </div>

                          <div className="flex flex-wrap gap-3 mt-2 text-xs text-muted">
                            {partner.email && <span className="flex items-center gap-1"><FiMail className="text-xs" /> {partner.email}</span>}
                            {partner.mobileNumber && <span className="flex items-center gap-1"><FiPhone className="text-xs" /> {partner.mobileNumber}</span>}
                            <span className="capitalize">{partner.partnerType === 'vendor' ? '🛒 Street Food' : '🍽️ Restaurant'}</span>
                            <span className="flex items-center gap-1"><FiCalendar className="text-xs" /> {new Date(partner.createdAt).toLocaleDateString('en-IN')}</span>
                          </div>

                          {partner.foodCategories?.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-2">
                              {partner.foodCategories.slice(0, 4).map((c) => (
                                <span key={c} className="badge badge-primary text-xs py-0.5 px-2">{c}</span>
                              ))}
                              {partner.foodCategories.length > 4 && <span className="text-muted text-xs">+{partner.foodCategories.length - 4} more</span>}
                            </div>
                          )}

                          {partner.status === 'rejected' && partner.rejectionReason && (
                            <div className="mt-2 text-xs text-red-600 bg-red-50 px-3 py-1.5 rounded-lg">
                              ❌ Rejected: {partner.rejectionReason}
                            </div>
                          )}
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col gap-2 flex-shrink-0">
                          <button
                            onClick={() => openDetail(partner._id)}
                            disabled={detailLoading}
                            className="flex items-center gap-1.5 text-xs font-semibold text-primary bg-primary/10 hover:bg-primary/20 px-3 py-1.5 rounded-lg transition-all"
                          >
                            <FiEye className="text-sm" /> View
                          </button>

                          {partner.status === 'pending' && (
                            <>
                              <button
                                onClick={() => handleApprove(partner._id)}
                                className="flex items-center gap-1.5 text-xs font-semibold text-green-700 bg-green-100 hover:bg-green-200 px-3 py-1.5 rounded-lg transition-all"
                              >
                                <FiCheck className="text-sm" /> Approve
                              </button>
                              <button
                                onClick={() => setRejectTarget(partner)}
                                className="flex items-center gap-1.5 text-xs font-semibold text-error bg-red-100 hover:bg-red-200 px-3 py-1.5 rounded-lg transition-all"
                              >
                                <FiX className="text-sm" /> Reject
                              </button>
                            </>
                          )}

                          {partner.status === 'rejected' && (
                            <button
                              onClick={() => handleApprove(partner._id)}
                              className="flex items-center gap-1.5 text-xs font-semibold text-green-700 bg-green-100 hover:bg-green-200 px-3 py-1.5 rounded-lg transition-all"
                            >
                              <FiCheck /> Approve Now
                            </button>
                          )}

                          <button
                            onClick={() => handleDelete(partner._id)}
                            className="flex items-center gap-1.5 text-xs font-semibold text-muted hover:text-error hover:bg-red-50 px-3 py-1.5 rounded-lg transition-all"
                          >
                            <FiTrash2 className="text-sm" /> Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ══ ALL USERS ══ */}
          {activeTab === 'users' && (
            <div className="space-y-4 animate-fade-in">
              <div className="grid grid-cols-3 gap-4 mb-2">
                {['user', 'vendor', 'admin'].map((role) => (
                  <div key={role} className="card p-4 text-center">
                    <p className="text-2xl font-black text-secondary">{users.filter((u) => u.role === role).length}</p>
                    <p className="text-muted text-xs capitalize">{role}s</p>
                  </div>
                ))}
              </div>

              <div className="space-y-2">
                {users.map((u) => (
                  <div key={u._id} className="card p-4 flex items-center gap-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-primary to-orange-500 rounded-xl flex items-center justify-center text-white font-bold flex-shrink-0">
                      {u.name?.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-secondary text-sm">{u.name}</p>
                      <p className="text-muted text-xs">{u.email}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <span className={`badge text-xs capitalize ${u.role === 'vendor' ? 'badge-warning' : u.role === 'admin' ? 'badge-error' : 'badge-primary'}`}>
                        {u.role}
                      </span>
                      <p className="text-muted text-xs mt-1">{new Date(u.createdAt).toLocaleDateString('en-IN')}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </main>

      {/* ── Modals ── */}
      {detailData && (
        <PartnerDetailModal
          data={detailData}
          onClose={() => setDetailData(null)}
          onApprove={handleApprove}
          onReject={(partner) => { setRejectTarget(partner); setDetailData(null); }}
        />
      )}

      {rejectTarget && (
        <RejectModal
          partner={rejectTarget}
          onClose={() => setRejectTarget(null)}
          onConfirm={handleRejectConfirm}
        />
      )}
    </div>
  );
};

export default AdminPanel;
