# 📘 FoodEasey — Complete Developer Guide

> A deep-dive technical reference for every function, file, tool, flow, and design decision in the FoodEasey MERN food delivery application.

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Tech Stack & Why Each Was Chosen](#2-tech-stack--why-each-was-chosen)
3. [Complete Folder Structure](#3-complete-folder-structure)
4. [Environment Variables](#4-environment-variables)
5. [Backend — Server Deep Dive](#5-backend--server-deep-dive)
6. [Frontend — Client Deep Dive](#6-frontend--client-deep-dive)
7. [Application Flows](#7-application-flows)
8. [API Reference](#8-api-reference)
9. [Database Schema Reference](#9-database-schema-reference)
10. [Key Compatibility Notes](#10-key-compatibility-notes)
11. [How to Extend the App](#11-how-to-extend-the-app)

---

## 1. Project Overview

**FoodEasey** is a full-stack food delivery MVP inspired by Zomato and Swiggy. It allows:

- **Users** — Browse restaurants, search food, add to cart, place and track orders, manage profile
- **Vendors** — Manage their restaurant menu and incoming orders via a dashboard
- **Admins** — Full access to create vendors and manage the platform

### Architecture Pattern

```
Browser (React SPA)
      │
      │  HTTP requests (Axios, withCredentials: true)
      ▼
Express REST API (Node.js)
      │
      ├── JWT in HttpOnly Cookie (auth)
      │
      ▼
MongoDB Atlas (Mongoose ODM)
```

---

## 2. Tech Stack & Why Each Was Chosen

| Technology       | Version | Role             | Reason                                  |
| ---------------- | ------- | ---------------- | --------------------------------------- |
| React 18         | ^18     | UI Framework     | Component model, hooks, fast re-renders |
| Vite             | ^8      | Build tool       | Instant dev server, fast HMR            |
| Tailwind CSS     | v3      | Styling          | Utility-first, no CSS file maintenance  |
| React Router DOM | v6      | Client routing   | Declarative routes, nested layouts      |
| Axios            | latest  | HTTP client      | Interceptors, withCredentials support   |
| react-hot-toast  | latest  | Notifications    | Lightweight, beautiful toasts           |
| react-icons      | latest  | Icon library     | Feather + Material icons                |
| Node.js          | 18+     | Runtime          | Non-blocking I/O, npm ecosystem         |
| Express          | v5      | Web framework    | Minimal, native async support in v5     |
| Mongoose         | v9      | ODM              | Schema validation, middleware hooks     |
| MongoDB Atlas    | cloud   | Database         | Managed cloud MongoDB                   |
| jsonwebtoken     | ^9      | JWT signing      | Industry standard auth tokens           |
| bcryptjs         | ^3      | Password hashing | Pure-JS bcrypt, no native deps          |
| cookie-parser    | latest  | Cookie reading   | Read HttpOnly cookies in Express        |
| cors             | latest  | CORS policy      | Allow cross-origin requests from React  |
| dotenv/dotenvx   | latest  | Env management   | Loads .env variables                    |

---

## 3. Complete Folder Structure

```
foodeasey/
│
├── client/                          # React frontend (Vite)
│   ├── index.html                   # HTML shell — loads Poppins font, sets meta
│   ├── .env                         # VITE_API_URL=http://localhost:5000/api
│   ├── tailwind.config.js           # Full design system tokens
│   ├── postcss.config.js            # PostCSS for Tailwind
│   └── src/
│       ├── main.jsx                 # React root — mounts all providers
│       ├── App.jsx                  # Root component — renders AppRoutes
│       ├── index.css                # Global CSS + Tailwind directives
│       │
│       ├── context/
│       │   ├── AuthContext.jsx      # Global auth state (user, login, logout)
│       │   └── CartContext.jsx      # Cart state (items, total, localStorage)
│       │
│       ├── services/
│       │   ├── api.js               # Axios base instance (withCredentials)
│       │   ├── authService.js       # Auth API calls
│       │   ├── foodService.js       # Food API calls
│       │   ├── vendorService.js     # Vendor API calls
│       │   └── orderService.js      # Order API calls
│       │
│       ├── routes/
│       │   └── AppRoutes.jsx        # All React Router v6 routes + guards
│       │
│       ├── layouts/
│       │   └── MainLayout.jsx       # Navbar + Outlet + Footer wrapper
│       │
│       ├── components/
│       │   ├── Navbar.jsx           # Top navigation bar
│       │   ├── Footer.jsx           # Site footer
│       │   ├── FoodCard.jsx         # Food item display card
│       │   ├── VendorCard.jsx       # Restaurant display card
│       │   ├── CategoryCard.jsx     # Cuisine category pill
│       │   ├── SearchBar.jsx        # Debounced search input
│       │   └── ProtectedRoute.jsx   # Auth guard component
│       │
│       └── pages/
│           ├── Home.jsx             # Landing page
│           ├── Login.jsx            # Login form
│           ├── Register.jsx         # Registration form
│           ├── Vendors.jsx          # Restaurant listing with filters
│           ├── FoodDetails.jsx      # Full food detail + add to cart
│           ├── Cart.jsx             # Cart + checkout
│           ├── Orders.jsx           # Order history
│           ├── Profile.jsx          # User profile
│           ├── VendorDashboard.jsx  # Vendor-only dashboard
│           └── NotFound.jsx         # 404 page
│
└── server/                          # Node.js backend (Express)
    ├── server.js                    # Entry: connects DB, starts server
    ├── app.js                       # Express app setup + routes
    ├── seed.js                      # Database seeder
    ├── .env                         # Environment variables
    ├── .env.example                 # Template
    │
    ├── config/
    │   ├── db.js                    # Mongoose connection
    │   └── jwt.js                   # JWT sign + verify helpers
    │
    ├── models/
    │   ├── User.js                  # User schema
    │   ├── Vendor.js                # Vendor schema
    │   ├── Food.js                  # Food schema
    │   └── Order.js                 # Order schema
    │
    ├── middleware/
    │   ├── authMiddleware.js        # protect + authorize
    │   └── errorMiddleware.js       # Global error handler
    │
    ├── controllers/
    │   ├── authController.js        # register/login/logout/me/update
    │   ├── vendorController.js      # vendor CRUD
    │   ├── foodController.js        # food CRUD + filters
    │   └── orderController.js       # place/list/status/cancel
    │
    ├── routes/
    │   ├── authRoutes.js            # /api/auth/*
    │   ├── vendorRoutes.js          # /api/vendors/*
    │   ├── foodRoutes.js            # /api/foods/*
    │   └── orderRoutes.js           # /api/orders/*
    │
    └── utils/
        ├── generateToken.js         # Creates JWT + sets HttpOnly cookie
        └── sendResponse.js          # Standardised JSON response helper
```

---

## 4. Environment Variables

### server/.env

```
PORT=5000
MONGO_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/foodeasey
JWT_SECRET=your_super_secret_key
JWT_EXPIRE=7d
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

### client/.env

```
VITE_API_URL=http://localhost:5000/api
```

---

## 5. Backend — Server Deep Dive

### 5.1 Entry Point: server.js + app.js

**server.js** — Process start:

```
1. require('dotenv').config() — loads .env
2. const app = require('./app')
3. connectDB() — connect MongoDB
4. On success → app.listen(PORT)
```

**app.js** — Express configuration:

```
1. cors({ origin: CLIENT_URL, credentials: true })
2. express.json() — parse JSON bodies
3. express.urlencoded() — parse form data
4. cookieParser() — parse cookies from headers
5. Mount routes:
   /api/auth     → authRoutes
   /api/vendors  → vendorRoutes
   /api/foods    → foodRoutes
   /api/orders   → orderRoutes
   /api/health   → health check
6. 404 handler
7. errorMiddleware (global error handler)
```

---

### 5.2 config/db.js

```javascript
// Connects Mongoose to MongoDB Atlas
const conn = await mongoose.connect(process.env.MONGO_URI);
// Logs which cluster host was connected
// On failure: logs error, process.exit(1) — fatal
```

---

### 5.3 config/jwt.js

| Function           | What it does                                                             |
| ------------------ | ------------------------------------------------------------------------ |
| signToken(id)      | jwt.sign({ id }, JWT_SECRET, { expiresIn: '7d' }) — creates signed token |
| verifyToken(token) | jwt.verify(token, JWT_SECRET) — decodes and validates, throws if expired |

---

### 5.4 Mongoose Models

#### models/User.js

```
Fields:
  name       String   required, trimmed
  email      String   required, unique, lowercase
  phone      String   optional
  password   String   required, min 6, select:false
  role       String   enum ['user','vendor','admin'], default 'user'
  address    Object   { street, city, state, pincode }
  avatar     String   default ''
  timestamps: createdAt, updatedAt

Pre-save hook (async, NO next param — Mongoose 8 style):
  if (!this.isModified('password')) return   // skip if password unchanged
  salt = await bcrypt.genSalt(12)
  this.password = await bcrypt.hash(password, salt)

Instance method — matchPassword(entered):
  return bcrypt.compare(entered, this.password)
  // Returns true/false — used in login controller
```

> WHY select:false on password?
> Mongoose never returns password in queries by default.
> Only login controller adds .select('+password') explicitly.

#### models/Vendor.js

```
Fields:
  name, description
  location: { address, city, coordinates: { lat, lng } }
  image, coverImage    (Unsplash URLs)
  rating (0-5), totalRatings
  isOpen (Boolean, default true)
  deliveryTime  ("30-45 min")
  minOrder      (minimum ₹ amount)
  cuisineTypes  [String]
  ownerId       ObjectId → User
  timestamps
```

#### models/Food.js

```
Fields:
  name, description
  price     Number, required, min 0
  image     Unsplash URL
  category  enum of 13 cuisine types
  vendorId  ObjectId → Vendor (required)
  rating (0-5), totalRatings
  isAvailable Boolean (default true)
  isVeg       Boolean (default false)
  preparationTime String
  tags        [String] e.g. ['bestseller','spicy']
  timestamps
```

#### models/Order.js

```
Embedded orderItemSchema:
  foodId    ObjectId → Food
  name      String (price/name SNAPSHOT at order time)
  price     Number (snapshot)
  quantity  Number, min 1
  image     String (snapshot)

Main Order fields:
  userId         ObjectId → User (required)
  vendorId       ObjectId → Vendor
  items          [orderItemSchema]
  totalAmount    Number
  status         enum: pending|confirmed|preparing|out_for_delivery|delivered|cancelled
  paymentStatus  enum: pending|paid|failed|refunded
  paymentMethod  enum: cod|online
  deliveryAddress { street, city, state, pincode }
  estimatedDelivery String
  timestamps
```

> WHY embed items?
> Price/name can change over time. Embedding creates a permanent
> historical snapshot — old orders always show what was actually paid.

---

### 5.5 Middleware

#### authMiddleware.js — protect

```
async (req, res, next) =>
  1. token = req.cookies?.token
  2. if no token → 401 + next(Error)
  3. decoded = verifyToken(token) — jwt.verify()
  4. req.user = User.findById(decoded.id).select('-password')
  5. if no user → 401
  6. next() — proceed to controller
```

#### authMiddleware.js — authorize(...roles)

```
Returns middleware:
  if req.user.role NOT IN roles → 403
  else → next()

Usage:
  protect, authorize('admin')           → admin only
  protect, authorize('vendor','admin')  → vendor or admin
```

#### errorMiddleware.js

```
4-param Express error handler (err, req, res, next):

Mongoose CastError (bad ObjectId) → 404 "Resource not found"
MongoDB code 11000 (duplicate)   → 400 "Email already exists"
Mongoose ValidationError          → 400 with all messages joined

Falls back to res.statusCode or 500

NODE_ENV=development → includes err.stack in response
NODE_ENV=production  → stack omitted
```

---

### 5.6 Controllers

All follow this pattern (Express 5 compatible):

```javascript
const action = async (req, res, next) => {
  try {
    // validate → DB operation → sendResponse
  } catch (err) {
    next(err); // → errorMiddleware
  }
};
```

#### authController.js

| Function      | What it does                                                                   |
| ------------- | ------------------------------------------------------------------------------ |
| register      | validate → check duplicate email → User.create() → generateToken() → send user |
| login         | find user +password → matchPassword() → generateToken() → send user            |
| logout        | res.cookie('token', '', { expires: new Date(0) }) — clears cookie              |
| getMe         | User.findById(req.user.\_id) → return user                                     |
| updateProfile | find user → update fields → user.save() → return updated                       |

#### vendorController.js

| Function      | What it does                                                        |
| ------------- | ------------------------------------------------------------------- |
| getVendors    | query with search(regex), isOpen, city → Vendor.find().sort(rating) |
| getVendorById | Vendor.findById() + Food.find({vendorId}) → { vendor, foods }       |
| createVendor  | Vendor.create({ ...body, ownerId: req.user.\_id })                  |
| updateVendor  | Vendor.findByIdAndUpdate(id, body, {new:true, runValidators})       |
| getMyVendor   | Vendor.findOne({ ownerId: req.user.\_id }) + its foods              |

#### foodController.js

| Function         | What it does                                                       |
| ---------------- | ------------------------------------------------------------------ |
| getFoods         | Multi-filter: search regex, category, vendorId, isVeg, price range |
| getPopularFoods  | isAvailable:true, sort rating+totalRatings, limit 10               |
| getFoodById      | Food.findById().populate('vendorId')                               |
| getFoodsByVendor | Food.find({ vendorId, isAvailable:true })                          |
| createFood       | Food.create(req.body)                                              |
| updateFood       | Food.findByIdAndUpdate(id, body, {new:true})                       |
| deleteFood       | Food.findByIdAndDelete(id)                                         |

#### orderController.js

| Function          | What it does                                                 |
| ----------------- | ------------------------------------------------------------ |
| placeOrder        | validate items → Order.create({ userId: req.user.\_id, ...}) |
| getMyOrders       | Order.find({ userId }).populate('vendorId').sort(-createdAt) |
| getOrderById      | findById, check ownership, populate userId+vendorId          |
| updateOrderStatus | findByIdAndUpdate({ status })                                |
| getVendorOrders   | Order.find({ vendorId }).populate('userId')                  |
| cancelOrder       | find → check status==='pending' → set cancelled → save       |

---

### 5.7 Routes

#### authRoutes.js

```
POST   /api/auth/register       → register        (public)
POST   /api/auth/login          → login           (public)
POST   /api/auth/logout         → logout          (protect)
GET    /api/auth/me             → getMe           (protect)
PUT    /api/auth/profile        → updateProfile   (protect)
```

#### vendorRoutes.js

```
GET    /api/vendors             → getVendors      (public)
GET    /api/vendors/my-vendor   → getMyVendor     (protect, vendor/admin)
GET    /api/vendors/:id         → getVendorById   (public)
POST   /api/vendors             → createVendor    (protect, admin)
PUT    /api/vendors/:id         → updateVendor    (protect, vendor/admin)

NOTE: /my-vendor MUST be before /:id — otherwise Express
      treats "my-vendor" as an ObjectId param → CastError
```

#### foodRoutes.js

```
GET    /api/foods               → getFoods        (public)
GET    /api/foods/popular       → getPopularFoods (public)
GET    /api/foods/vendor/:id    → getFoodsByVendor(public)
GET    /api/foods/:id           → getFoodById     (public)
POST   /api/foods               → createFood      (protect, vendor/admin)
PUT    /api/foods/:id           → updateFood      (protect, vendor/admin)
DELETE /api/foods/:id           → deleteFood      (protect, vendor/admin)
```

#### orderRoutes.js

```
POST   /api/orders              → placeOrder      (protect)
GET    /api/orders/my-orders    → getMyOrders     (protect)
GET    /api/orders/vendor-orders→ getVendorOrders (protect, vendor/admin)
GET    /api/orders/:id          → getOrderById    (protect)
PUT    /api/orders/:id/status   → updateStatus    (protect, vendor/admin)
PUT    /api/orders/:id/cancel   → cancelOrder     (protect)
```

---

### 5.8 Utilities

#### utils/generateToken.js

```javascript
generateToken(res, userId);
// 1. token = jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: '7d' })
// 2. res.cookie('token', token, {
//      httpOnly: true,     ← JS cannot read → XSS protection
//      secure: true,       ← HTTPS only in production
//      sameSite: 'strict', ← CSRF protection
//      maxAge: 7 days
//    })
// Called by: register, login
```

#### utils/sendResponse.js

```javascript
sendResponse(res, statusCode, success, message, data);
// Always returns: { success, message, data? }
// data is omitted if null
// Ensures every API endpoint has the same response shape
```

---

### 5.9 Seeder: seed.js

```
Run: cd server && npm run seed

What it does:
  1. connectDB()
  2. deleteMany on User, Vendor, Food (clean slate)
  3. Creates 3 users (user/vendor/admin)
  4. Creates 6 vendors (Burger Lab, Pizza Paradise, Biryani House,
                         Dragon Palace, South Spice, Sweet Cravings)
  5. Creates 26 food items (4-5 per vendor, realistic data + Unsplash images)

Test credentials after seeding:
  user@foodeasey.com    / password123  (role: user)
  vendor@foodeasey.com  / password123  (role: vendor)
  admin@foodeasey.com   / admin123     (role: admin)
```

---

## 6. Frontend — Client Deep Dive

### 6.1 Entry Point: main.jsx + App.jsx

**main.jsx** — Provider nesting order (outermost → innermost):

```
<BrowserRouter>         ← Enables React Router
  <AuthProvider>        ← Global auth state
    <CartProvider>      ← Global cart state
      <App />           ← Routes
      <Toaster />       ← Toast notifications (top-right)
```

**App.jsx** — Simply renders AppRoutes. Kept minimal on purpose.

---

### 6.2 Tailwind Design System (tailwind.config.js)

#### Colors

```
primary.DEFAULT  #FF5A5F   Coral Red — brand color
secondary        #1F2937   Dark blue-gray — text, nav
background       #F9FAFB   Off-white page background
muted            #6B7280   Gray — subtitles, placeholders
border           #E5E7EB   Light gray borders
success          #10B981   Green — Open badge, Delivered status
warning          #F59E0B   Amber — Preparing, Vendor role
error            #EF4444   Red — Cancelled, delete
```

#### Custom Shadows

```
card:         0 4px 20px rgba(0,0,0,0.08)         default card
card-hover:   0 8px 40px rgba(0,0,0,0.14)         elevated on hover
primary:      0 4px 20px rgba(255,90,95,0.35)     coral glow on buttons
```

#### Animations

```
float:     translateY 0 → -10px → 0 (food emojis)
fade-in:   opacity 0 → 1
slide-up:  opacity+translateY(20px) → 0,1
slide-down:opacity+translateY(-10px) → 0,1
scale-in:  scale(0.95) → scale(1)
```

#### Font

```
Poppins from Google Fonts
Weights: 300, 400, 500, 600, 700, 800, 900
Loaded in index.html <head> via preconnect + stylesheet links
```

---

### 6.3 Global CSS Classes (index.css)

Defined in @layer components — usable as Tailwind classes:

| Class                                | Description                               |
| ------------------------------------ | ----------------------------------------- |
| .btn-primary                         | Coral filled button with glow shadow      |
| .btn-outline                         | Border button, fills on hover             |
| .btn-ghost                           | Transparent button with hover bg          |
| .card                                | White rounded-2xl with shadow-card        |
| .input-field                         | Styled input with focus ring              |
| .badge                               | Small inline pill                         |
| .badge-primary/success/warning/error | Colored badge variants                    |
| .section-title                       | Large bold section heading                |
| .gradient-text                       | Coral-to-orange gradient on text          |
| .page-container                      | max-w-7xl mx-auto px-4 — content wrapper  |
| .hero-bg                             | Dark gradient background for hero section |
| .skeleton                            | Animated gray loading placeholder         |
| .hide-scrollbar                      | Hides scrollbar (for category row)        |
| .glass                               | backdrop-blur frosted glass effect        |

---

### 6.4 Context Providers

#### AuthContext.jsx

```
State:
  user    → null | UserObject
  loading → Boolean (true while checking auth on first load)

On mount (useEffect[]):
  → authService.getMe() → POST /api/auth/me (sends cookie automatically)
  → Success → sets user
  → Failure → user = null
  → Sets loading = false

Exposed via useAuth() hook:
  user          Current user object or null
  loading       True while initial auth check is pending
  register(data) → authService.register → setUser → toast
  login(data)    → authService.login → setUser → toast
  logout()       → authService.logout → setUser(null) → toast
  updateUser(d)  → merges d into user state (after profile edit)

Usage in any component:
  const { user, login, logout } = useAuth()
```

#### CartContext.jsx

```
State:
  cartItems → Array of { ...food, quantity: N }

Persistence:
  localStorage key: 'foodeasey_cart'
  Initializer: JSON.parse(localStorage.getItem(...)) || []
  useEffect: saves cartItems to localStorage on every change

Exposed via useCart() hook:
  cartItems       Full array of cart items
  addToCart(food) Adds or increments quantity
  removeFromCart(id) Removes item
  updateQuantity(id, qty) Updates qty (removes if qty <= 0)
  clearCart()     Empties state + localStorage
  cartCount       sum of all quantities (for badge)
  cartTotal       sum of (price × qty) (for display)
  vendorId        cartItems[0].vendorId (for order placement)

Key behaviour of addToCart:
  if food._id in cartItems → increment quantity
  else → push { ...food, quantity: 1 }
```

---

### 6.5 Service Layer (Axios)

#### services/api.js — Base Instance

```javascript
axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true    // ← CRITICAL: sends cookies cross-origin
})

Response interceptor:
  Success → return response
  Error   → throw new Error(response.data.message)
  All service functions get clean Error objects with server messages
```

WHY withCredentials: true?
JWT lives in HttpOnly cookie. Browser only sends cookies
cross-origin when withCredentials is true AND server CORS
has credentials:true + specific origin (not '\*').

#### Service Files — All return res.data.data

| File             | Key Functions                                                                                |
| ---------------- | -------------------------------------------------------------------------------------------- |
| authService.js   | register, login, logout, getMe, updateProfile                                                |
| foodService.js   | getFoods, getPopularFoods, getFoodById, getFoodsByVendor, createFood, updateFood, deleteFood |
| vendorService.js | getVendors, getVendorById, getMyVendor, createVendor, updateVendor                           |
| orderService.js  | placeOrder, getMyOrders, getOrderById, updateOrderStatus, cancelOrder, getVendorOrders       |

---

### 6.6 Routing: AppRoutes.jsx

```
All routes nested inside MainLayout (shares Navbar + Footer)

Public routes:
  /              → Home
  /login         → Login
  /register      → Register
  /vendors       → Vendors
  /vendors/:id   → Vendors (same component, reads useParams)
  /food/:id      → FoodDetails

Protected (must be logged in — ProtectedRoute):
  /cart          → Cart
  /orders        → Orders
  /profile       → Profile

Role-protected (vendor or admin):
  /vendor-dashboard → VendorDashboard

404:
  *              → NotFound
```

---

### 6.7 Layout: MainLayout.jsx

```
<div className="min-h-screen flex flex-col bg-background">
  <Navbar />
  <main className="flex-1 pt-16 page-enter">
    <Outlet />   ← React Router renders the matched page here
  </main>
  {showFooter && <Footer />}   ← Hidden on /cart
</div>

page-enter: CSS animation fadeIn 0.3s — every page fades in on navigation
pt-16: padding-top matches fixed Navbar height
```

---

### 6.8 Components

#### Navbar.jsx

```
State:
  mobileOpen  → mobile hamburger menu open/closed
  profileOpen → profile dropdown open/closed
  scrolled    → true after window.scrollY > 10 (adds shadow)

Effects:
  Scroll listener → setScrolled (cleaned up on unmount)
  Click outside   → closes profileOpen (via dropdownRef)

Features:
  NavLink with isActive prop → active tab styling
  Cart badge → cartCount from useCart (hides when 0)
  Profile avatar → first letter of user.name
  Role badge in dropdown (user/vendor/admin with colors)
  Vendor role → shows Dashboard link
  Login/Signup buttons when no user
  Mobile hamburger → slides down nav links
```

#### FoodCard.jsx

```
Props: food object

Key features:
  Image hover: group-hover:scale-110 (CSS transform)
  Veg dot: green border+dot if isVeg, red if not
  Bestseller badge: shows if tags.includes('bestseller')
  Category badge: visible only on hover (opacity-0 → opacity-100)
  Name: Link to /food/:id
  Add button: addToCart({ ...food, vendorId: vendorId?._id || vendorId })
  Note: vendorId can be ObjectId string OR populated object, both handled
  id: "add-to-cart-${_id}" for testing
```

#### VendorCard.jsx

```
Props: vendor object

Wrapped in Link to /vendors/:id

Open/Closed badge: green "● Open" or dark "● Closed"
Closed overlay: semi-transparent white div + "Currently Closed" pill
Cuisine tags: first 2 shown as white badges
Rating: green bg box with filled star icon
Meta row: deliveryTime, minOrder, city (separated by icons)
```

#### CategoryCard.jsx

```
Props: category { label, emoji, color }, isActive, onClick

Active state: bg-primary text-white shadow-primary scale-105
Default state: bg-white shadow-card hover:-translate-y-1

CATEGORIES export (12 items):
  All, Biryani, Pizza, Burgers, Chinese, South Indian,
  Desserts, Drinks, Momos, Salads, Sandwiches, Healthy
```

#### SearchBar.jsx

```
Props: placeholder, onSearch (callback), className

Debounce:
  debounceTimer = useRef(null)
  onChange → setQuery → clearTimeout → setTimeout(400ms) → onSearch(val)
  Prevents API call on every keystroke

Submit: navigate('/vendors?search=' + encodeURIComponent(query))
Clear: clears query, calls onSearch(''), refocuses input
Focused state: ring-2 ring-primary/30 on container
id: "search-input"
```

#### ProtectedRoute.jsx

```
Props: children, allowedRoles (optional)

Logic flow:
  loading=true  → full page spinner (prevents auth flash)
  user=null     → Navigate to /login with state.from=current location
  !role allowed → Navigate to /
  else          → render children

Login stores 'from' location:
  After login, navigate(location.state.from.pathname)
  User is redirected back to where they were going
```

---

### 6.9 Pages

#### Home.jsx

```
Data: Promise.all([getPopularFoods(), getVendors()]) on mount

Sections:
  1. Hero
     - Dark gradient background (hero-bg class with pseudo-elements)
     - Free delivery pill badge
     - h1 with gradient-text span
     - SearchBar centered (max-w-2xl)
     - 3 stat numbers: 500+ dishes, 50+ restaurants, 4.8★ rating
     - Floating food emojis (animate-float, staggered animationDelay)

  2. Features row (3 cards)
     - Fast Delivery, Safe & Hygienic, 24/7 Support

  3. Categories row
     - Horizontal scrollable, hide-scrollbar
     - activeCategory state → filters popularFoods
     - onClick setActiveCategory(label)

  4. Popular Foods grid
     - 4 columns on desktop, 2 on tablet, 1 on mobile
     - Shows up to 8 items
     - Skeleton loading (8 gray boxes while loading)
     - Empty state if filtered result is empty

  5. Special Offers banner
     - Coral gradient bg
     - Promo code FOODEASEY30
     - Decorative circles + floating emojis

  6. Top Vendors grid
     - 3 columns, up to 6 vendors
     - Skeleton loading (3 boxes)
```

#### Login.jsx

```
Split layout (hidden on mobile):
  Left panel: dark hero bg + floating food + benefit text
  Right panel: form

Form state: { email, password }, showPass, loading

On submit:
  1. Validate both fields
  2. login(form) from AuthContext
  3. Success → navigate(location.state.from || '/')
  4. Error → toast.error(err.message)

Demo hint box shows test credentials
Google button → toast('coming soon')
```

#### Register.jsx

```
Form state: { name, email, phone, password, confirmPassword }

Validation (client-side before API):
  name + email + password required
  password === confirmPassword
  password.length >= 6

Password strength indicator:
  4 divs with conditional bg color:
  length < 7   → bg-error (red)
  length 7-9   → bg-warning (amber)
  length >= 10 → bg-success (green)

On submit: strips confirmPassword → calls register(data) → navigate('/')
```

#### Vendors.jsx

```
State: vendors, loading, searchQuery, activeFilter, showOpenOnly

Data fetching:
  fetchVendors(query, openOnly) builds params: { search, isOpen }
  Called: on mount + when showOpenOnly toggles

Client-side filter:
  filteredVendors = vendors.filter(v =>
    activeFilter==='All' || v.cuisineTypes includes activeFilter)

Initial URL params (from Home page navigation):
  useSearchParams → reads ?search= and ?category= from URL
```

#### FoodDetails.jsx

```
State: food, loading, qty (default 1)

Fetches: foodService.getFoodById(id) where id = useParams().id

Quantity selector:
  FiMinus → Math.max(1, qty-1)
  FiPlus  → qty+1

Add to Cart button:
  Loop qty times → addToCart({ ...food, vendorId: vendorId?._id })
  Normalizes vendorId to string (might be populated object)

Cart indicator:
  cartItem = cartItems.find(i => i._id === id)
  Shows "X item(s) already in your cart"

Stats row: rating, prep time, delivery time from populated vendorId
Vendor box: vendor name, open/closed badge
```

#### Cart.jsx

```
Computed values:
  deliveryFee = cartTotal > 300 ? 0 : 40    (free delivery promotion)
  taxes = Math.round(cartTotal * 0.05)       (5% GST)
  grandTotal = cartTotal + deliveryFee + taxes

State: placing (bool), paymentMethod ('cod'|'online')

Empty state: illustration + "Start Ordering" link

Line items:
  Image, name, category, price
  Qty controls: FiMinus / number / FiPlus
  Item total = price × quantity
  FiTrash2 → removeFromCart

Checkout flow:
  1. if !user → navigate to /login with from={/cart}
  2. Build orderData from cartItems + totals + user.address
  3. orderService.placeOrder(orderData)
  4. clearCart()
  5. navigate('/orders')
  6. toast success
```

#### Orders.jsx

```
Fetches: orderService.getMyOrders() on mount

Tabs:
  current → status NOT IN ['delivered','cancelled']
  past    → status IN ['delivered','cancelled']

STATUS_CONFIG object:
  pending          → label, badge-warning, FiClock icon
  confirmed        → badge-primary, FiCheckCircle
  preparing        → badge-warning, MdOutlineRestaurant
  out_for_delivery → badge-primary, FiTruck
  delivered        → badge-success, FiCheckCircle
  cancelled        → badge-error, FiXCircle

OrderCard (defined in same file):
  Order ID: last 8 chars of _id toUpperCase
  Items: image + name + qty × price
  Footer: timestamp, vendor name, payment method, total
```

#### Profile.jsx

```
State: editing, loading, form { name, phone, address }
Form pre-filled from useAuth().user on render

Inline editing:
  editing=false → read-only text display
  editing=true  → input fields replace text

handleChange: checks if field name is in address fields
  → updates form.address[name]
  else → updates form[name]

Save: authService.updateProfile(form) → updateUser(result) from AuthContext
Email: read-only (cannot change for security)

Address form: 2-column grid with street spanning full width
Logout: AuthContext logout() → navigate('/')
```

#### VendorDashboard.jsx

```
Access: allowedRoles=['vendor','admin'] in ProtectedRoute

Data on mount:
  getMyVendor() → { vendor, foods }
  getVendorOrders(vendor._id)

Stats row (4 cards):
  Total orders, Menu items, Revenue (sum of totalAmount), Pending orders

3 tabs:
  Overview → vendor info grid (name, location, rating, deliveryTime, etc.)

  Menu → food cards with:
    image, name, category, veg/non-veg, price, delete button
    "Add Item" button → toggles showFoodForm state
    Add form: name, price, description, imageURL, category select, veg checkbox
    Submit → foodService.createFood({ ...newFood, vendorId: vendor._id })
    Adds to local foods state (no re-fetch needed)

  Orders → list of orders with:
    order ID, customer name+phone, total
    status badge + status <select> dropdown
    onChange → orderService.updateOrderStatus() → updates local state
```

#### NotFound.jsx

```
Centered layout:
  "404" text in border color (acts as watermark)
  Floating 🍽️ emoji overlaid in center
  "Oops! Page Not Found" heading
  Two buttons: Back to Home + Browse Restaurants
  Row of 5 food emojis with staggered animationDelay for float effect
```

---

## 7. Application Flows

### 7.1 Authentication Flow

```
REGISTER:
  User submits form → Register.jsx
    → AuthContext.register(formData)
      → authService.register() → POST /api/auth/register
        → [Server] User.create() → bcrypt pre-save hook hashes password
        → [Server] generateToken(res, user._id):
            jwt.sign({ id }) → stored in HttpOnly cookie
        → [Server] sendResponse(201, true, 'Registration successful', userData)
      → AuthContext.setUser(userData)
      → toast.success()
  navigate('/')

LOGIN: Same but POST /api/auth/login
  → matchPassword(entered) via bcrypt.compare()

PERSISTENT AUTH (on page load/refresh):
  AuthProvider mounts → useEffect runs authService.getMe()
  Browser sends cookie automatically (withCredentials: true)
  [Server] protect middleware: read cookie → verifyToken → findUser → req.user
  AuthContext.setUser(response.data)
  loading = false → app knows you're logged in

LOGOUT:
  authService.logout() → POST /api/auth/logout
  [Server] res.cookie('token', '', { expires: new Date(0) })  ← deletes cookie
  AuthContext.setUser(null)
  Cookie gone → next request has no auth
```

---

### 7.2 Cart Flow

```
addToCart(food) called from FoodCard or FoodDetails
  → CartContext checks if food._id already in cartItems
    YES → .map() to increment quantity (immutable update)
    NO  → spread: [...prev, { ...food, quantity: 1 }]
  → toast.success()

useEffect on cartItems change:
  localStorage.setItem('foodeasey_cart', JSON.stringify(cartItems))

Navbar badge updates reactively (cartCount from CartContext)

On page reload:
  useState lazy initializer runs:
    JSON.parse(localStorage.getItem('foodeasey_cart')) || []
  Cart restored without any API call
```

---

### 7.3 Order Placement Flow

```
Cart.jsx — user clicks "Place Order"
  → if !user → navigate('/login', { state: { from: '/cart' } })
  → Build orderData:
      items: cartItems.map(i => ({ foodId: i._id, name, price, quantity, image }))
      totalAmount: grandTotal
      vendorId: cartItems[0].vendorId
      paymentMethod: 'cod' or 'online'
      deliveryAddress: user.address || default address
  → orderService.placeOrder(orderData) → POST /api/orders
    [Server] protect middleware validates JWT cookie
    [Server] Order.create({ userId: req.user._id, ...orderData })
    Items are embedded (permanent price snapshot)
    Returns created order
  → clearCart() → state = [], localStorage removed
  → navigate('/orders')
  → toast.success('🎉 Order placed!')

On Orders page:
  status starts: 'pending'
  Vendor changes status via dashboard
  User can cancel if still 'pending' → PUT /api/orders/:id/cancel
    [Server] checks status === 'pending', else 400 error
```

---

### 7.4 Vendor Dashboard Flow

```
Login as vendor → Navbar shows Dashboard link
Navigate to /vendor-dashboard
ProtectedRoute: checks allowedRoles=['vendor','admin']

VendorDashboard mounts:
  getMyVendor() → GET /api/vendors/my-vendor
    [Server] Vendor.findOne({ ownerId: req.user._id }) + Food.find({ vendorId })
  getVendorOrders(vendor._id) → GET /api/orders/vendor-orders?vendorId=...
    [Server] Order.find({ vendorId }).populate('userId')

Dashboard features:
  Add food: foodService.createFood({ ...form, vendorId: vendor._id })
    → Food.create() → prepended to local foods state

  Delete food: foodService.deleteFood(id)
    → Food.findByIdAndDelete() → filtered from local foods state

  Update order status: select onChange → updateOrderStatus(orderId, status)
    → Order.findByIdAndUpdate({ status }) → updates local orders state
```

---

## 8. API Reference

All responses: `{ success: Boolean, message: String, data?: any }`

### Auth

```
POST /api/auth/register
Body: { name, email, password, phone? }
201: { data: { _id, name, email, role, avatar } }  + sets cookie
400: "Email already registered" | "Please provide name, email and password"

POST /api/auth/login
Body: { email, password }
200: { data: { _id, name, email, role, avatar, address } }  + sets cookie
401: "Invalid email or password"

POST /api/auth/logout      (cookie required)
200: "Logged out successfully"

GET /api/auth/me           (cookie required)
200: { data: full User object }

PUT /api/auth/profile      (cookie required)
Body: { name?, phone?, avatar?, address?, password? }
200: { data: updated User object }
```

### Vendors

```
GET /api/vendors
Query: search?, isOpen?, city?
200: { data: [Vendor, ...] }

GET /api/vendors/my-vendor   (cookie: vendor/admin)
200: { data: { vendor: Vendor, foods: [Food, ...] } }

GET /api/vendors/:id
200: { data: { vendor: Vendor, foods: [Food, ...] } }
404: "Vendor not found"

POST /api/vendors            (cookie: admin)
Body: Vendor fields
201: { data: Vendor }

PUT /api/vendors/:id         (cookie: vendor/admin)
Body: Vendor fields to update
200: { data: updated Vendor }
```

### Foods

```
GET /api/foods
Query: search?, category?, vendorId?, isVeg?, minPrice?, maxPrice?
200: { data: [Food (with vendorId populated), ...] }

GET /api/foods/popular
200: { data: [top 10 Food objects] }

GET /api/foods/vendor/:vendorId
200: { data: [Food, ...] }

GET /api/foods/:id
200: { data: Food (with vendorId populated: name,location,rating,isOpen,deliveryTime) }
404: "Food not found"

POST /api/foods             (cookie: vendor/admin)
Body: { name, price, category, vendorId, description?, image?, isVeg?, tags? }
201: { data: Food }

PUT /api/foods/:id          (cookie: vendor/admin)
200: { data: updated Food }

DELETE /api/foods/:id       (cookie: vendor/admin)
200: { message: "Food deleted" }
```

### Orders

```
POST /api/orders            (cookie: any user)
Body: {
  items: [{ foodId, name, price, quantity, image }],
  totalAmount,
  vendorId?,
  paymentMethod: 'cod'|'online',
  deliveryAddress: { street, city, state, pincode }
}
201: { data: Order }
400: "No items in order"

GET /api/orders/my-orders   (cookie: any user)
200: { data: [Order (vendorId populated)] }

GET /api/orders/vendor-orders (cookie: vendor/admin)
Query: vendorId
200: { data: [Order (userId populated)] }

GET /api/orders/:id         (cookie: owner | vendor | admin)
200: { data: Order }
403: "Not authorized to view this order"

PUT /api/orders/:id/status  (cookie: vendor/admin)
Body: { status: 'confirmed'|'preparing'|'out_for_delivery'|'delivered'|'cancelled' }
200: { data: updated Order }

PUT /api/orders/:id/cancel  (cookie: any user)
200: { data: cancelled Order }
400: "Cannot cancel order that has already been confirmed"
```

---

## 9. Database Schema Reference

```
┌─────────────┐       ┌──────────────┐       ┌──────────────┐
│    User     │       │    Vendor    │       │     Food     │
├─────────────┤       ├──────────────┤       ├──────────────┤
│ _id         │──┐    │ _id          │◄──────│ vendorId(ref)│
│ name        │  │    │ ownerId ─────┘──►User│ _id          │
│ email       │  │    │ name         │       │ name         │
│ phone       │  │    │ description  │       │ description  │
│ password(*) │  │    │ location     │       │ price        │
│ role        │  │    │ image        │       │ image        │
│ address     │  │    │ rating       │       │ category     │
│ avatar      │  │    │ isOpen       │       │ rating       │
│ timestamps  │  │    │ deliveryTime │       │ isAvailable  │
└─────────────┘  │    │ minOrder     │       │ isVeg        │
                 │    │ cuisineTypes │       │ tags         │
                 │    └──────────────┘       └──────────────┘
                 │           │
                 │           │
                 ▼           ▼
        ┌─────────────────────────────────────┐
        │               Order                 │
        ├─────────────────────────────────────┤
        │ _id                                 │
        │ userId    ──────────────────► User  │
        │ vendorId  ────────────────► Vendor  │
        │ items[]  (EMBEDDED SNAPSHOT)        │
        │   └─ foodId, name, price,           │
        │        quantity, image              │
        │ totalAmount                         │
        │ status (6 states)                   │
        │ paymentStatus, paymentMethod        │
        │ deliveryAddress                     │
        │ timestamps                          │
        └─────────────────────────────────────┘

(*) password: select:false — excluded from all queries by default
```

---

## 10. Key Compatibility Notes

### Express 5 + express-async-handler — INCOMPATIBLE

```
Problem:
  express-async-handler wraps route functions and calls next(err) internally.
  Express 5's new router engine passes arguments differently,
  causing "next is not a function" error.

Fix:
  REMOVED express-async-handler from all controllers and middleware.
  Express 5 handles async functions natively.
  Pattern used:
    async (req, res, next) => {
      try { ... }
      catch (err) { next(err); }
    }
```

### Mongoose 8 Pre-Save Hook + Express 5 — next param clash

```
Problem:
  async function(next) in Mongoose pre-save hook.
  Mongoose 8 uses Kareem library for hooks which passes its own 'next'.
  When errors bubble up through Kareem → Express, the 'next' variable
  gets reassigned, causing "next is not a function" at runtime.

Fix:
  Changed pre-save hook from:
    userSchema.pre('save', async function(next) { ... next(); })
  To:
    userSchema.pre('save', async function() { ... })
  Mongoose 8 supports async pre-hooks without calling next().
```

### CORS + HttpOnly Cookies

```
Problem:
  withCredentials:true in Axios + cors({ origin: '*' }) does not work.
  Browsers block cookies on wildcard CORS origins.

Fix:
  cors({ origin: 'http://localhost:5173', credentials: true })
  Must be a specific origin string, not '*'
```

### Express Route Order

```
Problem:
  GET /api/vendors/:id defined before GET /api/vendors/my-vendor
  Express matches "my-vendor" as an ObjectId string → CastError

Fix:
  Define specific string routes BEFORE parameterized routes:
  router.get('/my-vendor', ...)  ← FIRST
  router.get('/:id', ...)        ← SECOND
```

---

## 11. How to Extend the App

### Add a new API endpoint

```
1. Add async function to relevant controller (try/catch + next(err))
2. Add route in routes file with protect/authorize if needed
3. Add function in client/src/services/relevantService.js
4. Call from page/component
```

### Add a new page

```
1. Create client/src/pages/NewPage.jsx
2. Import and add Route in AppRoutes.jsx
3. Add NavLink in Navbar.jsx if needed
4. Wrap in ProtectedRoute if auth required
```

### Add Google OAuth

```
Server:
  npm install passport passport-google-oauth20
  Create server/config/passport.js
  Add GET /api/auth/google and /api/auth/google/callback routes
  On success: generateToken(res, user._id) → redirect to client

Client:
  Replace Google button with <a href="http://localhost:5000/api/auth/google">
  Server redirects back to client with cookie set
```

### Add Real-time Order Tracking (Socket.io)

```
Server:
  npm install socket.io
  const io = new Server(httpServer, { cors: {...} })
  In updateOrderStatus controller: io.emit('order:updated', { orderId, status })

Client:
  npm install socket.io-client
  In Orders.jsx: socket.on('order:updated', ({ orderId, status }) => {
    setOrders(prev => prev.map(o => o._id===orderId ? {...o, status} : o))
  })
```

### Add Razorpay Payments

```
Server:
  npm install razorpay
  POST /api/payments/create-order → Razorpay.orders.create({ amount, currency })
  POST /api/payments/verify → validateSignature(razorpay_payment_id, ...)

Client (Cart.jsx):
  if paymentMethod === 'online':
    1. POST /api/payments/create-order → get razorpayOrderId
    2. Open Razorpay checkout modal with key + orderId
    3. On success → POST /api/payments/verify → then placeOrder
```

### Add Food Reviews

```
Add to Food model:
  reviews: [{ userId (ref), rating (1-5), comment, createdAt }]

New controller function:
  addReview: async (req, res, next) => {
    food.reviews.push({ userId: req.user._id, ...req.body })
    food.rating = average of all reviews
    await food.save()
  }

Route: POST /api/foods/:id/review (protect)

Frontend: Review form in FoodDetails.jsx (shown only after delivery)
```

---

## Quick Reference Card

### Start Development

```bash
# Terminal 1
cd /Users/mac/Documents/Foodeasey/server
npm run dev

# Terminal 2
cd /Users/mac/Documents/Foodeasey/client
npm run dev
```

### Seed Database

```bash
cd server && npm run seed
```

### Test Accounts

| Role   | Email                | Password    |
| ------ | -------------------- | ----------- |
| User   | user@foodeasey.com   | password123 |
| Vendor | vendor@foodeasey.com | password123 |
| Admin  | admin@foodeasey.com  | admin123    |

### Key URLs

| Service  | URL                              |
| -------- | -------------------------------- |
| Frontend | http://localhost:5173            |
| Backend  | http://localhost:5000            |
| Health   | http://localhost:5000/api/health |

---

_FoodEasey Developer Guide — v2.0_
