# ✦ BOOKIFY — Premium Hotel Booking Platform v2.0

A full-stack, production-ready hotel booking platform with luxury UI design, real-time analytics dashboard, and dynamic data throughout.

---

## 🚀 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, React Router v6, Recharts |
| Backend | Node.js, Express.js (ESM) |
| Database | MongoDB + Mongoose |
| Auth | JWT + HTTP-only Cookies |
| Payments | Stripe Checkout |
| Email | Nodemailer (SMTP) |
| Upload | Multer (local) / Cloudinary-ready |
| Security | Helmet, CORS, Rate Limiting, bcrypt |

---

## 📁 Project Structure

```
bookify_pro/
├── backend/
│   ├── config/          # DB, Multer, Nodemailer
│   ├── controllers/     # Business logic
│   ├── middlewares/     # Auth, error handler
│   ├── models/          # Mongoose schemas
│   ├── routes/          # API routes
│   ├── uploads/         # Uploaded images
│   ├── utils/           # Helpers
│   ├── index.js         # Entry point
│   └── .env.example     # Environment template
└── frontend/
    ├── src/
    │   ├── components/  # Navbar, Footer, Cards
    │   ├── context/     # Auth + App context
    │   ├── pages/       # All pages
    │   │   └── owner/   # Owner dashboard pages
    │   └── utils/       # Axios instance
    └── index.html
```

---

## ⚙️ Setup & Installation

### 1. Clone and install dependencies

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 2. Configure environment

```bash
cd backend
cp .env.example .env
# Edit .env with your values:
# - MONGO_URI=mongodb://localhost:27017/bookify
# - JWT_SECRET=your_secret_key
# - SMTP credentials (for booking confirmation emails)
# - STRIPE keys (for online payments)
```

### 3. Start development servers

```bash
# Terminal 1 — Backend
cd backend
npm run dev       # runs on http://localhost:4000

# Terminal 2 — Frontend
cd frontend
npm run dev       # runs on http://localhost:5173
```

---

## ✨ Features

### Guest (User)
- 🔐 Signup / Login with JWT auth & validation
- 🏨 Browse hotels with filter, sort, search
- 🛏 View room details with image gallery
- 📅 Real-time availability checking
- ✅ Book rooms with date picker & guest count
- 💳 Pay via Stripe or at hotel
- 📧 Booking confirmation email (auto-sent)
- 📋 My Bookings page — cancel bookings
- ♡ Wishlist — save favourite rooms
- ★ Loyalty Points — earn on every booking
- 👤 Edit profile & avatar

### Owner
- 🏨 Register & manage hotels
- 🛏 Add & manage rooms with image upload
- 📊 **Rich analytics dashboard** — revenue charts, booking pie, hotel comparison bar chart
- 📋 Manage all bookings — confirm / cancel
- 🔄 Toggle room availability

### Unique Features
- ✦ **Loyalty Points System** — earn 1pt per $10 booked, tiers: Bronze/Silver/Gold
- 📊 **6-month revenue area chart** with gradient
- 🥧 **Booking status doughnut pie chart**
- 📊 **Revenue by hotel bar chart**
- ⚡ **Real-time availability check** before booking
- 💰 **Price breakdown** — shows per-night × nights = total
- 🔒 **Rate limiting** — 200 req/15min per IP
- 🛡 **Helmet security headers**
- 🎨 **Password strength indicator** on signup
- 📱 **Fully responsive** — mobile, tablet, desktop

---

## 🔑 API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/user/signup | Register user/owner |
| POST | /api/user/login | Login |
| POST | /api/user/logout | Logout |
| GET | /api/user/me | Get current user |
| PUT | /api/user/profile | Update profile |
| POST | /api/user/wishlist/:roomId | Toggle wishlist |

### Hotels
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/hotel/all | Get all hotels (with filters) |
| GET | /api/hotel/:id | Get hotel + rooms |
| POST | /api/hotel/register | Register hotel (owner) |
| PUT | /api/hotel/:id | Update hotel (owner) |
| DELETE | /api/hotel/:id | Delete hotel (owner) |

### Rooms
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/room/all | Get all rooms |
| GET | /api/room/:id | Get room detail |
| POST | /api/room/add | Add room (owner) |
| PUT | /api/room/:id | Update room (owner) |
| DELETE | /api/room/:id | Delete room (owner) |

### Bookings
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/bookings/check-availability | Check room availability |
| POST | /api/bookings/book | Book a room |
| GET | /api/bookings/user | User's bookings |
| GET | /api/bookings/hotel | Owner's hotel bookings |
| GET | /api/bookings/dashboard | Owner analytics |
| PATCH | /api/bookings/:id/cancel | Cancel booking |
| PATCH | /api/bookings/:id/status | Update status (owner) |
| POST | /api/bookings/stripe-payment | Stripe checkout |

---

## 🎨 Design System

- **Primary Font**: Cormorant Garamond (serif — luxury display)
- **Body Font**: DM Sans (clean, modern)
- **Gold Accent**: `#c9a84c` — premium brand color
- **Dark Theme**: `#08090d` base — deep black with blue undertones
- **Animated Hero**: Particle effects, grid animation, smooth transitions
- **CSS Modules**: Scoped styling, zero conflicts

---

## 📬 Contact

Built with ❤️ — Bookify v2.0 | Premium Hotel Booking Platform
