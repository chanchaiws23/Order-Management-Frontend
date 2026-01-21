# Order Management System - Frontend

A modern, secure, and user-friendly frontend application for an Order Management System with role-based UI separation.

## Features

- 🛍️ Customer Interface: Product browsing, cart, checkout, order tracking
- 👨‍💼 Admin Dashboard: Complete management interface with role-based access
- 🔐 Secure Authentication: JWT with refresh tokens
- 📱 Responsive Design: Mobile-first approach
- ⚡ Performance Optimized: Next.js 14+ with App Router
- 🎨 Modern UI: TailwindCSS + shadcn/ui

## Tech Stack

- **Framework:** Next.js 14+ with App Router
- **Language:** TypeScript
- **Styling:** TailwindCSS + shadcn/ui
- **State Management:** Zustand + TanStack Query
- **Form Handling:** React Hook Form + Zod
- **Icons:** Lucide React
- **Animations:** Framer Motion

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

3. Copy `.env.example` to `.env.local` and configure:

```bash
cp .env.example .env.local
```

4. Run the development server:

```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
├── app/                    # Next.js App Router
│   ├── (auth)/            # Authentication pages
│   ├── (customer)/        # Customer interface
│   └── (admin)/           # Admin dashboard
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   ├── customer/         # Customer components
│   ├── admin/            # Admin components
│   └── shared/           # Shared components
├── lib/                   # Utilities and configurations
│   ├── api/              # API client and endpoints
│   ├── hooks/            # Custom React hooks
│   ├── stores/           # Zustand stores
│   └── utils/            # Helper functions
└── types/                 # TypeScript type definitions
```

## User Roles

1. **CUSTOMER** - Regular users (shopping, orders, reviews)
2. **STAFF** - Staff members (read access)
3. **MANAGER** - Managers (+ write access)
4. **ADMIN** - Administrators (+ delete, user management)
5. **SUPER_ADMIN** - Super administrators (all permissions)

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## License

Private - All rights reserved
