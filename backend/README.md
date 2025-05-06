# Backend

This is the backend service for the **G18-HaveASeat** project.

---

## Installation

### **Ensure Corepack is Enabled**
Since Node.js **16+** comes with **Corepack**, enable it to manage package versions automatically:

```sh
corepack enable
corepack use pnpm@latest
```

### **Install Dependencies**

```sh
pnpm install
```

---

## Environment Setup

### **Create a `.env` File**
Copy the example environment file and configure it as needed:

```sh
cp .env.example .env
```

Make sure to fill in the required environment variables in the `.env` file.

### **Generate Prisma Client**
Run the following command to generate the Prisma client:

```sh
pnpm prisma:generate
```

---

## Running the Backend

### **Development Mode**
Start the backend in watch mode:

```sh
pnpm dev
```

### **Build the Backend**
Transpile TypeScript to JavaScript:

```sh
pnpm build
```

### **Run Prisma Studio**
To explore and manage your database:

```sh
pnpm prisma:studio
```

---

## Database Migrations

If you're working with Prisma and need to apply database migrations, use:

```sh
pnpm prisma migrate dev
```

For production deployments:

```sh
pnpm prisma migrate deploy
```

---

## Available Endpoints

| Method | Route                                | Description                                                    |
|--------|--------------------------------------|----------------------------------------------------------------|
| GET    | `/`                                  | Retrieve API status or welcome message.                        |
| GET    | `/merchant/:id`                      | Get detailed information about a specific merchant.            |
| GET    | `/review/:id`                        | Retrieve a specific review by its ID.                          |
| GET    | `/search`                            | Search for merchants or listings based on filters or keywords. |
| POST   | `/authentication/refresh`            | Refresh an expired or soon-to-expire authentication token.     |
| POST   | `/authentication/signin`             | Authenticate a user and return access credentials.             |
| POST   | `/authentication/signup`             | Register a new user account.                                   |
| GET    | `/merchant`                          | Retrieve a user owned merchant profile.                        |
| POST   | `/merchant`                          | Create a new merchant profile.                                 |
| POST   | `/merchant/:id/reservation`          | Make a reservation for a specific merchant.                    |
| GET    | `/merchant/:id/reservations`         | Get all reservations for a specific merchant.                  |
| POST   | `/merchant/:id/review`               | Submit a review for a specific merchant.                       |
| GET    | `/merchant/:id/settings/display`     | Get display settings for a specific merchant.                  |
| PATCH  | `/merchant/:id/settings/display`     | Update display settings for a specific merchant.               |
| GET    | `/merchant/:id/settings`             | Retrieve all settings for a specific merchant.                 |
| GET    | `/merchant/:id/settings/overview`    | Get overview settings for a specific merchant.                 |
| PATCH  | `/merchant/:id/settings/overview`    | Update overview settings for a specific merchant.              |
| GET    | `/merchant/:id/settings/reservation` | Get reservation-related settings for a specific merchant.      |
| PATCH  | `/merchant/:id/settings/reservation` | Update reservation settings for a specific merchant.           |
| GET    | `/reports`                           | Retrieve a list of all reports (admin-level access).           |
| GET    | `/reports/:id/ignore`                | Ignore and Delete a specific report (admin-level access).      |
| DELETE | `/reservation/:id`                   | Cancel or delete a specific reservation.                       |
| PATCH  | `/reservation/:id`                   | Update a specific reservation.                                 |
| GET    | `/reservation/:id`                   | Retrieve details of a specific reservation.                    |
| DELETE | `/review/:id`                        | Delete a specific review.                                      |
| POST   | `/review/:id/report`                 | Report a review for inappropriate content.                     |
| POST   | `/review/:id/reply`                  | Post a reply to a specific review.                             |
| GET    | `/user/favourite`                    | Get a list of the user's favorite merchants or items.          |
| GET    | `/user/reservations`                 | Retrieve all reservations made by the current user.            |
| GET    | `/user`                              | Get the current user's profile information.                    |
| PATCH  | `/user/settings`                     | Update user account settings (e.g., profile info).             |
| PATCH  | `/user/settings/security`            | Update user security settings (e.g., password).                |
| GET    | `/users`                             | Retrieve a list of all users (admin-level access).             |
| GET    | `/users/:id`                         | Get profile information for a specific user.                   |
| PATCH  | `/users/:id`                         | Update information for a specific user.                        |
