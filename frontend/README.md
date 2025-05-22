# Have A Seat - Frontend

The modern React frontend for Have A Seat reservation platform. Built with cutting-edge technologies for optimal performance and user experience.

## Tech Stack

- **Vite** - Next-generation frontend build tool
- **React 19** - Latest React with concurrent features
- **Tailwind CSS** - Utility-first CSS framework
- **Radix UI** - Accessible, unstyled UI components
- **Shadcn UI** - UI Library based on Radix UI components
- **React Hook Form** - Performant form handling
- **Zustand** - Lightweight state management
- **React Router** - Declarative routing

## Project Structure

```
frontend/
├── 📁 public/           # Static assets
├── 📁 src/
│   ├── 📁 components/   # Reusable UI components
│   │   ├── ui/          # Base UI components (Radix + Tailwind)
│   │   ├── layout/      # Layout components (Header, Sidebar, etc.)
│   │   ├── merchant/    # Merchant-specific components
│   │   ├── reservation/ # Booking-related components
│   │   └── review/      # Review and rating components
│   ├── 📁 pages/        # Route components
│   ├── 📁 hooks/        # Custom React hooks
│   ├── 📁 store/        # Zustand stores
│   ├── 📁 lib/          # Utilities and helpers
│   ├── 📁 overlay/      # Modal and overlay components
│   ├── 📁 providers/    # Context providers
│   └── 📁 constants/    # App constants
├── 📄 components.json   # shadcn/ui configuration
├── 📄 tailwind.config.js
└── 📄 vite.config.js
```

## Development Setup

### Prerequisites
- **Node.js 22+** (LTS recommended)
- **PNPM 9+** (package manager)

### Installation

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Enable Corepack**
   ```bash
   corepack enable
   corepack use pnpm@latest
   ```

3. **Install dependencies**
   ```bash
   pnpm install
   ```

4. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```

   Configure your `.env` file:
   ```env
   # API Configuration
   VITE_API_URL="http://localhost:3000"
   ```

5. **Start development server**
   ```bash
   pnpm dev
   ```

   The application will be available at `http://localhost:5173`

## State Management

### Zustand Stores

**Authentication Store**
```javascript
// /src/store/auth.js
export const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  signIn: (credentials) => { /* ... */ },
  signOut: () => { /* ... */ },
}))
```

**Favorites Store**
```javascript
// /src/store/favorites.js
export const useFavoritesStore = create((set) => ({
  favorites: new Set(),
  addFavorite: (merchantId) => { /* ... */ },
  removeFavorite: (merchantId) => { /* ... */ },
}))
```

### Context Providers
- **AuthProvider** - User authentication state
- **MerchantProvider** - Restaurant owner context
- **ModalProvider** - Global modal management

## Available Scripts

```bash
# Development
pnpm dev              # Start development server (http://localhost:5173)
pnpm dev --host       # Expose to network (for mobile testing)

# Building
pnpm build            # Build for production
pnpm preview          # Preview production build locally
```

---

Made with React and ❤️ by the G18 Team