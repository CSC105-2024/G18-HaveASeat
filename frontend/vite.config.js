import * as path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import Pages from "vite-plugin-pages";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/** @type {import("vite").UserConfig} */
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    Pages({
      dirs: "./src/pages",
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    extensions: [".js", ".ts", ".jsx", ".tsx", ".json"],
  },
  server: {
    historyApiFallback: true,
  },
  optimizeDeps: {
    rollupOptions: {
      jsx: "react-jsx"
    },
  }
});
