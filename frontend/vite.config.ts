import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    proxy: {
      "/api/search-papers": {
        target: process.env.VITE_SEARCH_API_URL,
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path, // 경로 그대로 유지
      },
      "/api": {
        target: process.env.VITE_DEV_API_URL,
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/api/, "/api"),
      },
    },
  },
});
