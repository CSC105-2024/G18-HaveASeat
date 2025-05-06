# G18-HaveASeat

## Project Structure

This project is divided into two main parts: **frontend** and **backend**. Each part has its own dependencies, setup instructions, and documentation located in `README.md`.

---

## Installation

### **Ensure Corepack is Enabled**
Since Node.js **16+** comes with **Corepack**, you should enable it to manage package versions automatically:
```sh
corepack enable
corepack use pnpm@latest
```

#### **Using `pnpm` (Recommended)**
```sh
pnpm install
```

---

## Running the Project

### **Run Both Frontend & Backend**
```sh
pnpm --filter frontend run dev & pnpm --filter backend run dev
```

---

### **Run Frontend Only**
```sh
pnpm --filter frontend run dev  # pnpm
```

### **Run Backend Only**
```sh
pnpm --filter backend run dev  # pnpm
```
