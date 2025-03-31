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

## Switching Between Package Managers

If you need to change package managers, first remove existing dependencies:

```sh
rm -rf node_modules pnpm-lock.yaml package-lock.json yarn.lock bun.lockb
```

Then, reinstall using your preferred package manager.

