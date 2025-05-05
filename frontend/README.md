# Frontend

This is the frontend service for the **G18-HaveASeat** project.

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

---

## Running the Frontend

### **Development Mode**
Start the frontend in development mode:

```sh
pnpm dev
```

### **Build the Frontend**
Generate an optimized production build:

```sh
pnpm build
```

### **Preview Production Build**
Serve the built frontend locally:

```sh
pnpm preview
```

---

## Linting and Code Formatting

### **Run ESLint**
To check for code style issues:

```sh
pnpm lint
```

