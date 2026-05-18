import path from "path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    minify: true,
    cssMinify: true,
  },
  server: {
    host: true, // allows access from external hosts
    port: 5173, // keep your Vite port
    cors: true, // allow cross-origin requests
    allowedHosts: [
      "l2vl5st5-5173.inc1.devtunnels.ms",
      "5d133c495126.ngrok-free.app",
    ],
  },
});
