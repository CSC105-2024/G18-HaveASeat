# Have A Seat - Backend API

A high-performance REST API powering the Have A Seat reservation platform. Built with modern Node.js technologies for scalability and reliability.

## Stack

- **Hono.js** - Ultra-fast web framework for Edge runtime
- **Prisma** - Next-generation ORM with type safety
- **SQLite** - Lightweight, serverless database (production-ready)
- **JWT Authentication** - Secure token-based authentication
- **File Upload** - Image handling with validation
- **Cron Jobs** - Automated reservation status updates
- **Input Validation** - Zod schema validation
- **Database Migrations** - Version-controlled schema changes

## 📦 Project Structure

```
backend/
├── 📁 prisma/           # Database schema and migrations
│   ├── schema.prisma    # Database schema definition
│   └── generated/       # Generated Prisma client
├── 📁 src/
│   ├── 📁 routes/       # API route handlers (file-based routing)
│   │   ├── authentication/ # Auth endpoints
│   │   ├── merchant/    # Merchant management
│   │   ├── reservation/ # Booking system  
│   │   ├── review/      # Rating and reviews
│   │   └── user/        # User management
│   ├── 📁 middlewares/  # Custom middleware functions
│   ├── 📁 models/       # Database models and queries
│   ├── 📁 lib/          # Utility functions
│   ├── 📁 types/        # TypeScript type definitions
│   └── index.ts         # Application entry point
├── 📁 uploads/          # File upload directory
├── 📄 .env.example      # Environment variables template
└── 📄 package.json
```

## Key Features

### Authentication & Authorization
- **JWT-based Authentication** - Secure, stateless authentication
- **HTTP-only Cookies** - XSS protection with secure cookie storage
- **Role-based Access Control** - User, Merchant, and Admin roles
- **Session Management** - Automatic token refresh and cleanup

### Merchant Management
- **Multistep Setup** - Guided merchant profile creation
- **Image Gallery** - Multiple image upload with compression
- **Floor Plan Management** - Seating layout configuration
- **Operating Hours** - Flexible schedule management

### Reservation System
- **Smart Booking** - Conflict detection and availability checks
- **Multiple Reservation Types** - Online bookings and walk-ins
- **Status Tracking** - Automated status updates (Pending → Checked-in → Completed)
- **Cancellation Handling** - Flexible cancellation policies
- **Automated Cleanup** - Cron jobs for status management

### Review & Rating System
- **User Reviews** - Customer feedback with ratings
- **Merchant Replies** - Merchant owner responses
- **Content Moderation** - Report system for inappropriate content
- **Average Rating Calculation** - Real-time rating aggregation

## Development Setup

### Prerequisites
- **Node.js 22+** (LTS recommended)
- **PNPM 9+** (package manager)

### Installation

1. **Navigate to backend directory**
   ```bash
   cd backend
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
   # Database Configuration
   DATABASE_URL="file:./dev.db"
   
   # Server Configuration  
   PORT=3000
   NODE_ENV="development"
   
   # Security
   JWT_SECRET="your-super-secure-secret-key-change-this-in-production"
   ```

5. **Initialize database**
   ```bash
   # Generate Prisma client
   pnpm prisma:generate
   
   # Run initial migration
   pnpm prisma:init
   
   # (Optional) Open Prisma Studio
   pnpm prisma:studio
   ```

6. **Start development server**
   ```bash
   pnpm dev
   ```

   The API will be available at `http://localhost:3000`

## API Endpoints

### General
| Method | Route | Description                          |
|--------|-------|--------------------------------------|
| `GET`  | `/`   | API health check and welcome message |

### Authentication
| Method   | Route                     | Description                                |
|----------|---------------------------|--------------------------------------------|
| `POST`   | `/authentication/sign-in` | User login with email and password         |
| `POST`   | `/authentication/sign-up` | User registration with profile information |
| `DELETE` | `/authentication/session` | User logout and session cleanup            |

### Merchant Management
| Method | Route                  | Description                                            |
|--------|------------------------|--------------------------------------------------------|
| `GET`  | `/merchant`            | Browse featured merchants and homepage data            |
| `GET`  | `/merchant/search`     | Search merchants with filters (location, rating, etc.) |
| `GET`  | `/merchant/:id`        | Get detailed merchant profile (public view)            |
| `POST` | `/merchant/create`     | Create new merchant account (authenticated users)      |
| `GET`  | `/merchant/:id/status` | Check merchant setup completion status                 |

### Merchant Settings
| Method  | Route                                | Description                                                 |
|---------|--------------------------------------|-------------------------------------------------------------|
| `GET`   | `/merchant/:id/settings`             | Get complete merchant settings (owner/admin)                |
| `GET`   | `/merchant/:id/settings/overview`    | Get basic merchant information                              |
| `PATCH` | `/merchant/:id/settings/overview`    | Update merchant details (name, description, hours, address) |
| `GET`   | `/merchant/:id/settings/display`     | Get merchant images and banner                              |
| `PATCH` | `/merchant/:id/settings/display`     | Upload/update merchant photos and banner                    |
| `GET`   | `/merchant/:id/settings/reservation` | Get seating zones and floor plan                            |
| `PATCH` | `/merchant/:id/settings/reservation` | Update floor plan and seating configuration                 |

### Reservation System
| Method  | Route                        | Description                                            |
|---------|------------------------------|--------------------------------------------------------|
| `POST`  | `/reservation`               | Create new reservation (online or walk-in)             |
| `GET`   | `/reservation/list`          | Get user's reservations or merchant's bookings         |
| `GET`   | `/reservation/:id`           | Get specific reservation details                       |
| `PATCH` | `/reservation/:id`           | Update reservation status (check-in, complete, cancel) |
| `PUT`   | `/reservation/:id`           | Full reservation update (merchant owners)              |
| `GET`   | `/merchant/:id/reservations` | Get all reservations for a merchant                    |

### Reviews & Ratings
| Method   | Route                | Description                                          |
|----------|----------------------|------------------------------------------------------|
| `GET`    | `/reviews`           | Browse reviews with filters (merchant, user, rating) |
| `POST`   | `/review`            | Submit merchant review with rating                   |
| `GET`    | `/review/:id`        | Get specific review with replies                     |
| `DELETE` | `/review/:id`        | Delete review (author/merchant owner/admin)          |
| `POST`   | `/review/:id/reply`  | Merchant owner reply to review                       |
| `POST`   | `/review/:id/report` | Report inappropriate review content                  |

### User Management
| Method | Route                     | Description                                  |
|--------|---------------------------|----------------------------------------------|
| `GET`  | `/user`                   | Get current user profile and merchant status |
| `PUT`  | `/user/settings`          | Update user profile information              |
| `POST` | `/user/settings/security` | Change user password                         |
| `GET`  | `/user/merchant`          | Check if user owns a merchant                |
| `GET`  | `/user/reservations`      | Get user's upcoming and past reservations    |

### User Favorites
| Method   | Route                    | Description                                  |
|----------|--------------------------|----------------------------------------------|
| `GET`    | `/user/favourites`       | Get user's favorite merchants list           |
| `POST`   | `/user/favourites`       | Add merchant to favorites                    |
| `DELETE` | `/user/favourites`       | Remove merchant from favorites               |
| `POST`   | `/user/favourites/check` | Check favorite status for multiple merchants |

### Admin - User Management
| Method   | Route                 | Description                            |
|----------|-----------------------|----------------------------------------|
| `GET`    | `/users`              | Get all users list (admin only)        |
| `GET`    | `/users/:id`          | Get specific user profile (admin only) |
| `PUT`    | `/users/:id`          | Update user information (admin only)   |
| `DELETE` | `/users/:id`          | Delete user account (admin only)       |
| `POST`   | `/users/:id/security` | Change user password (admin only)      |

### Admin - Content Moderation
| Method   | Route                 | Description                                     |
|----------|-----------------------|-------------------------------------------------|
| `GET`    | `/reports`            | Get all pending content reports (admin only)    |
| `PATCH`  | `/reports/:id/ignore` | Mark report as ignored (admin only)             |
| `DELETE` | `/reports/:id`        | Delete reported content and report (admin only) |

## Database Schema

### Core Entities

**Users**
```prisma
model User {
  id           String         @id @default(uuid())
  email        String         @unique
  name         String
  phoneNumber  String?
  birthday     DateTime
  password     String
  isAdmin      Boolean        @default(false)
  createdAt    DateTime       @default(now())
  merchant     Merchant[]     @relation("MerchantBars")
  favourites   Merchant[]     @relation("UserFavourites")
  reservations Reservation[]
  reviews      Review[]
}
```

**Merchants**
```prisma
model Merchant {
  id           String           @id @default(uuid())
  name         String
  phone        String
  address      MerchantAddress?
  openHours    Json
  description  String?
  ownerId      String
  owner        User             @relation(fields: [ownerId], references: [id])
  bannerImage  String?
  promoImages  MerchantImage[]
  floorPlan    String?
  seats        Seat[]
  reviews      Review[]
  createdAt    DateTime         @default(now())
  favouritedBy User[]           @relation("UserFavourites")
}
```

**Reservations**
```prisma
model Reservation {
  id              String            @id @default(uuid())
  userId          String?
  user            User?             @relation(fields: [userId], references: [id])
  customerName    String?
  customerPhone   String?
  reservationType ReservationType   // WALK_IN | ONLINE
  seatId          String
  seat            Seat              @relation(fields: [seatId], references: [id])
  startTime       DateTime
  endTime         DateTime
  numberOfGuests  Int
  numberOfTables  Int
  note            String?
  status          ReservationStatus @default(PENDING)
  createdAt       DateTime          @default(now())
}

enum ReservationStatus {
  COMPLETED
  CANCELLED
  NO_SHOW
  PENDING
  CHECKED_IN
}
```

**Reviews & Ratings**
```prisma
model Review {
  id          String         @id @default(uuid())
  userId      String
  user        User           @relation(fields: [userId], references: [id])
  merchantId  String
  merchant    Merchant       @relation(fields: [merchantId], references: [id])
  rating      Int            // 1-5 stars
  description String
  createdAt   DateTime       @default(now())
  replies     ReviewReply[]
  reports     ReviewReport[]
}
```

## Highlighted Features

### File Upload System
```javascript
// Image validation and processing
const validateImage = (file) => {
  const maxSize = 2 * 1024 * 1024; // 2MB
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
  
  return file.size <= maxSize && allowedTypes.includes(file.type);
};

// Upload handler
export const uploadFile = async (file) => {
  const filename = `${uuidv4()}.${file.name.split('.').pop()}`;
  const filepath = join('./uploads', filename);
  
  await writeFile(filepath, Buffer.from(await file.arrayBuffer()));
  return `/uploads/${filename}`;
};
```

### Automated Reservation Management
```javascript
// Cron job for reservation status updates
const reservationCleanupJob = new CronJob("*/5 * * * *", async () => {
  const prisma = getPrisma();
  
  // Update expired reservations
  await updateReservationStatuses(prisma);
  
  // Check current active reservations
  await checkCurrentReservations(prisma);
});

// Status update logic
export async function updateReservationStatuses(prisma) {
  const now = new Date();
  
  const reservationsToUpdate = await prisma.reservation.findMany({
    where: {
      status: "PENDING",
      OR: [
        { endTime: { lt: now } }, // Past end time
        { 
          startTime: { lt: new Date(now.getTime() - 30 * 60 * 1000) },
          status: "PENDING"
        } // 30 minutes past start time
      ]
    }
  });
  
  for (const reservation of reservationsToUpdate) {
    const newStatus = reservation.endTime < now ? "COMPLETED" : "NO_SHOW";
    
    await prisma.$transaction([
      prisma.reservation.update({
        where: { id: reservation.id },
        data: { status: newStatus }
      }),
      prisma.seat.update({
        where: { id: reservation.seatId },
        data: { isAvailable: true }
      })
    ]);
  }
}
```

### Authentication Middleware
```javascript
export const authMiddleware = async (c, next) => {
  const token = getCookie(c, 'auth_token');
  
  if (!token) {
    return c.json({ error: "Authentication required" }, 401);
  }
  
  try {
    const payload = await verify(token, JWT_SECRET);
    const user = await UserModel.findById(payload.id);
    
    if (!user) {
      return c.json({ error: "User not found" }, 401);
    }
    
    c.set('user', user);
    await next();
  } catch (error) {
    return c.json({ error: "Unauthorized" }, 401);
  }
};
```

### File-based Routing System
```javascript
// Automatic route registration based on file structure
export function loadRoutes(app) {
  const routesDir = path.join(process.cwd(), "src", "routes");
  walkRoutes(app, routesDir, "");
}

function parseRoutePath(filePath) {
  let routePath = filePath.replace(/\.ts$/, "");
  
  // Extract HTTP method from filename
  const methodMatch = routePath.match(/\.(get|post|put|delete|patch)$/);
  const method = methodMatch ? methodMatch[1] : null;
  
  // Convert [param] to :param
  routePath = routePath.replace(/\[([^\]]+)\]/g, ":$1");
  
  // Handle index routes
  if (routePath.endsWith("/index")) {
    routePath = routePath.replace(/\/index$/, "");
  }
  
  return { routePath, method };
}
```

## Available Scripts

```bash
# Development
pnpm dev              # Start development server with hot reload
pnpm build            # Build TypeScript to JavaScript

# Database Management
pnpm prisma:generate  # Generate Prisma client from schema
pnpm prisma:init      # Run initial database migration
pnpm prisma:migrate   # Run new database migrations
pnpm prisma:studio    # Open Prisma Studio (database GUI)
```

## Deployment

### Environment Configuration
```bash
# Production .env
DATABASE_URL="file:./production.db"
JWT_SECRET="your-super-secure-secret-key"
PORT=3000
NODE_ENV="production"
```

---

Built with Hono.js and ❤️ by the G18 Team