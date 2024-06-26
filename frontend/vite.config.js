import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // port: 3000,
    // used proxy to get rid of the CORS errors
    proxy: {
      "/api": {
        // target: "http://localhost:5000",
        target: "https://thread-clone-api.onrender.com",
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
