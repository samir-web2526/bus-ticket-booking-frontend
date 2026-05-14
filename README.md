# BusHub Frontend

A modern, full-stack bus ticket booking platform designed to streamline the travel experience for passengers, provide powerful management tools for operators, and ensure seamless platform oversight for administrators.

---

## 📖 Table of Contents

- [About The Project](#about-the-project)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation & Setup](#installation--setup)
- [Environment Variables](#environment-variables)
- [Folder Structure](#folder-structure)
- [Dependencies](#dependencies)
- [Live Demo](#live-demo)
- [Contact](#contact)

---

## About The Project

BusHub is an intuitive bus ticket booking system that allows passengers to seamlessly search for schedules, book tickets, and make secure payments. The platform includes role-based dashboards, route and bus management for operators, administrative oversight features, and a modern responsive UI for an enhanced user experience across all devices.

---

## Features

- Role-based dashboards for Admin, Operator, and Passenger
- Advanced bus schedule search and discovery system with filtering
- Secure JWT-based authentication
- Fully responsive modern UI with sleek animations
- Form handling and robust validation
- Secure payment integration via Stripe
- Protected routes and intuitive navigation
- Real-time bus and route management

---

## Tech Stack

### Frontend
- Next.js 16
- React 19
- TypeScript
- Tailwind CSS v4

### UI & Libraries
- Shadcn UI
- Radix UI
- Lucide React
- Remixicon
- Framer Motion

### Form & Validation
- React Hook Form
- Zod

---

## Installation & Setup

### Clone the repository

```bash
git clone https://github.com/samir-web2526/bus-ticket-booking-frontend.git
```

### Navigate to the project folder

```bash
cd bus-ticket-booking-frontend
```

### Install dependencies

```bash
npm install
```

### Setup environment variables

Create a `.env` file in the root directory and add the following:

```env
# App URL
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# Backend API
NEXT_PUBLIC_BACKEND_URL="http://localhost:5000"
```

### Run the development server

```bash
npm run dev
```

---

## Environment Variables

| Variable Name              | Description                     |
| -------------------------- | ------------------------------- |
| NEXT_PUBLIC_APP_URL        | Frontend application base URL   |
| NEXT_PUBLIC_BACKEND_URL    | Backend API base URL            |

---

## Folder Structure

```plaintext
bus-ticket-booking-frontend/
│
├── src/
│   ├── app/                 # Next.js App Router pages & layouts
│   ├── components/          # Reusable UI components & pages
│   ├── context/             # Global React contexts
│   ├── hooks/               # Custom React hooks
│   └── services/            # API service functions
│
├── public/                  # Static assets
├── package.json             # Dependencies and scripts
└── next.config.ts           # Next.js configuration
```

---

## Dependencies

```json
"dependencies": {
    "@hookform/resolvers": "^5.2.2",
    "@remixicon/react": "^4.9.0",
    "autoprefixer": "^10.5.0",
    "class-variance-authority": "^0.7.1",
    "clsx": "^2.1.1",
    "framer-motion": "^12.38.0",
    "jsonwebtoken": "^9.0.3",
    "jwt-decode": "^4.0.0",
    "lucide-react": "^1.11.0",
    "next": "16.1.7",
    "next-themes": "^0.4.6",
    "radix-ui": "^1.4.3",
    "react": "^19.2.4",
    "react-dom": "^19.2.4",
    "react-hook-form": "^7.72.1",
    "shadcn": "^4.1.1",
    "sonner": "^2.0.7",
    "tailwind-merge": "^3.5.0",
    "tw-animate-css": "^1.4.0"
}
```

---

## Live Demo

🔗 Live Site: https://bus-ticket-booking-frontend-six.vercel.app/

---

## Contact

- Portfolio: https://portfolio-kappa-weld-92.vercel.app/
- Email: baishnabsamir26@gmail.com
