import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: parseInt(process.env.VITE_PORT || "3000", 10),
    allowedHosts: ["*"],
    proxy: {
      "/socket.io": {
        target: process.env.VITE_BACKEND_URL || "http://localhost:3333",
        ws: true,
        changeOrigin: true,
      },
    },
  },
});
