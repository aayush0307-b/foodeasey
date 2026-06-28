# 🍔 FoodEasey — Full-Stack Food Delivery App

A professional food delivery application built with the MERN stack, inspired by Zomato and Swiggy.

## ✨ Features

- ✅ JWT Authentication (HttpOnly Cookies)
- ✅ Register / Login / Logout
- ✅ Browse Restaurants & Food Items
- ✅ Food Details with Add-to-Cart
- ✅ Cart with Quantity Management
- ✅ Order Placement & Tracking
- ✅ User Profile Management
- ✅ Vendor Dashboard (for vendors)
- ✅ Role-Based Access (user / vendor / admin)
- ✅ Responsive Design (Mobile-first)
- ✅ Real-time Toast Notifications

## 🛠 Tech Stack

| Layer | Tech |
|---|---|
| Frontend | React 18 (Vite), Tailwind CSS v3, React Router DOM v6, Axios |
| Backend | Node.js, Express.js, Mongoose |
| Database | MongoDB Atlas |
| Auth | JWT (HttpOnly Cookies) |

## 📂 Project Structure

```
foodeasey/
├── client/          # React frontend (Vite)
│   └── src/
│       ├── components/  # Navbar, Footer, FoodCard, etc.
│       ├── context/     # AuthContext, CartContext
│       ├── pages/       # All page components
│       ├── services/    # API service layer (Axios)
│       ├── layouts/     # MainLayout
│       └── routes/      # AppRoutes
└── server/          # Node.js backend
    ├── config/      # DB & JWT config
    ├── controllers/ # Route logic
    ├── middleware/  # Auth & error handlers
    ├── models/      # Mongoose models
    ├── routes/      # Express routes
    └── utils/       # Helpers
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MongoDB Atlas account (or local MongoDB)

### 1. Clone & Setup

```bash
git clone <repo-url>
cd foodeasey
```

### 2. Server Setup

```bash
cd server
cp .env.example .env
# Edit .env and set your MONGO_URI
npm install
```

### 3. Client Setup

```bash
cd client
npm install
```

### 4. Add MongoDB Atlas URI

Open `server/.env` and replace:
```
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/foodeasey
```

### 5. Seed Database (Optional but Recommended)

```bash
cd server
npm run seed
```

This creates:
- 6 demo restaurants
- 26+ food items
- 3 test accounts

### 6. Run the App

**Terminal 1 — Server:**
```bash
cd server
npm run dev
```

**Terminal 2 — Client:**
```bash
cd client
npm run dev
```

Visit: **http://localhost:5173**

## 🔐 Test Accounts

| Role | Email | Password |
|---|---|---|
| User | user@foodeasey.com | password123 |
| Vendor | vendor@foodeasey.com | password123 |
| Admin | admin@foodeasey.com | admin123 |

## 📡 API Endpoints

### Auth
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/register` | Public | Register user |
| POST | `/api/auth/login` | Public | Login |
| POST | `/api/auth/logout` | Protected | Logout |
| GET | `/api/auth/me` | Protected | Get current user |
| PUT | `/api/auth/profile` | Protected | Update profile |

### Vendors
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/vendors` | Public | List all vendors |
| GET | `/api/vendors/:id` | Public | Get vendor + foods |
| GET | `/api/vendors/my-vendor` | Vendor | Get own vendor |
| POST | `/api/vendors` | Admin | Create vendor |
| PUT | `/api/vendors/:id` | Vendor/Admin | Update vendor |

### Foods
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/foods` | Public | List foods (filterable) |
| GET | `/api/foods/popular` | Public | Top rated foods |
| GET | `/api/foods/:id` | Public | Food details |
| POST | `/api/foods` | Vendor/Admin | Add food |
| PUT | `/api/foods/:id` | Vendor/Admin | Update food |
| DELETE | `/api/foods/:id` | Vendor/Admin | Delete food |

### Orders
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/orders` | User | Place order |
| GET | `/api/orders/my-orders` | User | My orders |
| GET | `/api/orders/:id` | User | Order details |
| PUT | `/api/orders/:id/status` | Vendor/Admin | Update status |
| PUT | `/api/orders/:id/cancel` | User | Cancel order |

## 🎨 Design System

- **Primary Color:** `#FF5A5F` (Coral Red)
- **Font:** Poppins (Google Fonts)
- **Border Radius:** 16px
- **Shadow:** Layered card shadows

## 📱 Pages

| Page | Route | Protected |
|---|---|---|
| Home | `/` | No |
| Vendors | `/vendors` | No |
| Food Details | `/food/:id` | No |
| Login | `/login` | No |
| Register | `/register` | No |
| Cart | `/cart` | Yes |
| Orders | `/orders` | Yes |
| Profile | `/profile` | Yes |
| Vendor Dashboard | `/vendor-dashboard` | Vendor/Admin |

## 🗺 Roadmap

- [ ] Google OAuth Login
- [ ] Live Order Tracking (Socket.io)
- [ ] Payment Gateway (Razorpay)
- [ ] Customer Reviews & Ratings
- [ ] Push Notifications
- [ ] Admin Panel
- [ ] AI Food Recommendations

---

Built with ❤️ by the FoodEasey team
