# G18 - Have A Seat 🍽️

A modern reservation platform that connects diners with their favorite establishments. Built with React and Node.js, Have A Seat simplifies the dining experience by enabling seamless table reservations and merchant management.

**"Book It. Sip It. Love It."**

## Features

### For Diners
- **Smart Search & Discovery** - Find places by location, cuisine, rating, and availability
- **Favorites & Reviews** - Save favorite places and share dining experiences
- **Reservation Management** - View, modify, and cancel bookings from your account

### For Merchants
- **Complete Business Profile** - Showcase your place with photos, menus, and details
- **Reservation Dashboard** - Manage bookings, track occupancy, and handle walk-ins
- **Zone Management** - Configure seating areas and floor plans for optimal service
- **Customer Insights** - Monitor reviews, ratings, and booking patterns

### For Administrators
- **User Management** - Oversee platform users and merchant accounts
- **Content Moderation** - Review and manage reported content

## Architecture

This is a monorepo containing two main applications:

```
📦 G18-HaveASeat/
├── 🎨 frontend/     # React SPA with Vite
├── 🔧 backend/      # Node.js API with Hono
```

### Tech Stack

**Frontend:**
- **Vite + React 19** - Lightning-fast development and modern React features
- **Tailwind CSS** - Utility-first styling with custom design system
- **Radix UI** - Accessible, unstyled UI components
- **Shadcn UI** - UI Library based on Radix UI components
- **Zustand** - Lightweight state management
- **React Hook Form** - Performant form handling with validation
- **React Router** - Client-side routing

**Backend:**
-  **Hono.js** - Fast, lightweight web framework for Edge
- ️ **Prisma + SQLite** - Type-safe database access and migrations
-  **JWT Authentication** - Secure user sessions with HTTP-only cookies
-  **File Upload** - Image handling for place galleries
-  **Cron Jobs** - Automated reservation status updates
-  **Advanced Search** - Full-text search with filters and sorting

**Development:**
- **PNPM Workspaces** - Efficient monorepo package management
-  **Turbo** - High-performance build system
- **ESLint + Prettier** - Code quality and formatting

## Quick Start

### Prerequisites
- **Node.js 22+** (LTS recommended)
- **PNPM 9+** (package manager)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/CSC105-2024/G18-HaveASeat.git
   cd G18-HaveASeat
   ```

2. **Enable Corepack for package manager consistency**
   ```bash
   corepack enable
   corepack use pnpm@latest
   ```

3. **Install all dependencies**
   ```bash
   pnpm install
   ```

4. **Set up environment variables**
   ```bash
   # Backend configuration
   cp backend/.env.example backend/.env
   
   # Frontend configuration  
   cp frontend/.env.example frontend/.env
   ```

5. **Initialize the database**
   ```bash
   cd backend
   pnpm prisma:generate
   pnpm prisma:init
   ```

6. **Start development servers**
   ```bash
   # Run both frontend and backend
   pnpm dev
   
   # Or run individually
   pnpm dev:frontend  # Frontend only (http://localhost:5173)
   pnpm dev:backend   # Backend only (http://localhost:3000)
   ```

## Detailed Installation

- **Frontend** : *[View complete Installation Steps](./frontend/README.md#development-setup)*
- **Backend** : *[View complete Installation Steps](./backend/README.md#development-setup)*

### Database Schema

Key entities in our system:
- **Users** - Diners and place owners
- **Merchants** - Place profiles and settings
- **Reservations** - Booking records with status tracking
- **Reviews** - Customer feedback and ratings
- **Seats** - Table and seating area management

## API Endpoints

*[View complete API documentation](./backend/README.md#api-endpoints)*

## Deployment

### Environment Variables

**Backend (.env)**
```env
DATABASE_URL="file:./production.db"
JWT_SECRET="your-super-secure-secret-key"
PORT=3000
NODE_ENV="production"
```

**Frontend (.env)**
```env
VITE_API_URL="http://localhost:3000"
```

### Manual Deployment
```bash
# Build frontend
cd frontend && pnpm build

# Build backend  
cd backend && pnpm build

# Start production server
cd backend && pnpm start
```

## 👥 Team

**G18 Development Team:**
- **Theerawat Patthawee** ([@ttwrpz](https://github.com/ttwrpz)) - Fullstack
- **Karnsinee Phophutaraksa** ([@Tienkarnsinee](https://github.com/Tienkarnsinee)) - Backend & UX/UI
- **Jirapon Thipbodee** ([@Jirapon-Thipbodee](https://github.com/Jirapon-Thipbodee)) - Former Developer
- **Chotiwet Wisitworanat** ([@Sunthewhat](https://github.com/Sunthewhat)) - Mentor
- **Thanatat Wongabut** ([@thanatat-wong](https://github.com/thanatat-wong)) - Mentor

---

Made with ❤️ by the G18 Team | **Have A Seat - Book It. Sip It. Love It.**
