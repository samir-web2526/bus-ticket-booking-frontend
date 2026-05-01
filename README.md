# 🚌 BusHub — Online Bus Ticket Booking System

BusHub is a full-stack bus ticket booking platform that allows passengers to search for bus schedules, book seats, and make payments online. Operators can manage their buses and schedules, while admins oversee the entire platform.

---

## 🌐 Live URLs

| Service | URL |
|--------|-----|
| Frontend | https://bus-ticket-booking-frontend-six.vercel.app |
| Backend API | https://bus-ticket-booking-backend-six.vercel.app |

---

## ✨ Features

### 👤 Passenger
- Search bus schedules by route, date, and bus type
- View available seats and pricing
- Book tickets and make payments via Stripe
- View booking history and ticket details

### 🚍 Operator
- Register and manage their own buses
- Create and manage schedules for their buses
- View bookings for their schedules

### 🛡️ Admin
- Manage all users, operators, buses, routes, and schedules
- Full platform oversight and control

### 🔒 General
- JWT-based authentication with HTTP-only cookies
- Role-based access control (ADMIN, OPERATOR, PASSENGER)
- Fully responsive UI for mobile and desktop
- Real-time schedule filtering and search
- Automatic schedule expiry (past schedules hidden from public)

---

## 🛠️ Technologies Used

### Frontend
| Technology | Purpose |
|-----------|---------|
| Next.js 14 (App Router) | React framework with server-side rendering |
| TypeScript | Type safety |
| Tailwind CSS | Utility-first styling |
| shadcn/ui | UI component library |
| Framer Motion | Animations |
| React Hook Form | Form management |
| Zod | Schema validation |
| Sonner | Toast notifications |
| Stripe.js | Payment integration |

### Backend
| Technology | Purpose |
|-----------|---------|
| Node.js | Runtime environment |
| Express.js | Web framework |
| TypeScript | Type safety |
| Prisma ORM | Database ORM |
| PostgreSQL | Relational database |
| JWT | Authentication tokens |
| Stripe | Payment processing |
| Zod | Request validation |
| node-cron | Scheduled tasks |

---

## 🗂️ Project Structure

```
frontend/
├── app/                    # Next.js App Router pages
│   ├── (CommonLayout)/     # Public pages (Home, Find Buses, Routes)
│   ├── (DashboardLayout)/  # Protected dashboard pages
│   │   ├── admin/
│   │   ├── operator/
│   │   └── passenger/
│   └── (AuthLayout)/       # Login, Register pages
├── src/
│   ├── components/         # Reusable UI components
│   └── services/           # API service functions

backend/
├── src/
│   ├── app/
│   │   ├── modules/        # Feature modules
│   │   │   ├── auth/
│   │   │   ├── user/
│   │   │   ├── bus/
│   │   │   ├── route/
│   │   │   ├── schedule/
│   │   │   └── booking/
│   │   ├── middlewares/
│   │   └── utils/
│   └── prisma/
│       └── schema.prisma   # Database schema
```

---

## ⚙️ Setup Instructions

### Prerequisites
- Node.js v18+
- PostgreSQL database
- Stripe account (for payments)

---

### 🔧 Backend Setup

```bash
# 1. Clone the repository
git clone <backend-repo-url>
cd backend

# 2. Install dependencies
npm install

# 3. Create environment file
cp .env.example .env
```

Fill in your `.env`:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/bushub"
JWT_ACCESS_SECRET="your_access_secret"
JWT_REFRESH_SECRET="your_refresh_secret"
JWT_ACCESS_EXPIRES_IN="15m"
JWT_REFRESH_EXPIRES_IN="7d"
STRIPE_SECRET_KEY="sk_test_..."
CLIENT_URL="http://localhost:3000"
PORT=5000
```

```bash
# 4. Run Prisma migrations
npx prisma migrate dev

# 5. Start development server
npm run dev
```

---

### 💻 Frontend Setup

```bash
# 1. Clone the repository
git clone <frontend-repo-url>
cd frontend

# 2. Install dependencies
npm install

# 3. Create environment file
cp .env.example .env.local
```

Fill in your `.env.local`:
```env
NEXT_PUBLIC_BACKEND_URL="http://localhost:5000"
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."
```

```bash
# 4. Start development server
npm run dev
```

App will be running at `http://localhost:3000`

---

## 🔐 Default Roles

| Role | Access |
|------|--------|
| `ADMIN` | Full platform control |
| `OPERATOR` | Manage own buses & schedules |
| `PASSENGER` | Search, book, and pay for tickets |

---

## 📡 API Overview

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/auth/register` | Register a new user |
| POST | `/api/v1/auth/login` | Login and get tokens |
| GET | `/api/v1/buses` | Get all buses |
| GET | `/api/v1/buses/my` | Get operator's own buses |
| POST | `/api/v1/buses` | Create a new bus |
| GET | `/api/v1/routes` | Get all routes (with schedules) |
| GET | `/api/v1/routes/dropdown` | Get all routes for dropdown |
| POST | `/api/v1/routes` | Create a new route |
| GET | `/api/v1/schedules` | Search schedules |
| POST | `/api/v1/schedules` | Create a schedule |
| POST | `/api/v1/bookings` | Create a booking |
| GET | `/api/v1/bookings/my` | Get passenger's bookings |

---

## 🚀 Deployment

Both frontend and backend are deployed on **Vercel**.

### Backend deployment notes
- PostgreSQL is hosted on a cloud provider (e.g., Neon, Supabase, or Railway)
- Environment variables are configured in Vercel dashboard
- Prisma generates client at build time via `postinstall` script

### Frontend deployment notes
- All environment variables are set in Vercel dashboard
- `NEXT_PUBLIC_BACKEND_URL` points to the deployed backend URL

---

## 👨‍💻 Author

Developed as part of a full-stack web development assignment.

---

## 📄 License

This project is for educational purposes only.
