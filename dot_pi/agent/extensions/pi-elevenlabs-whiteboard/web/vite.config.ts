import path from "node:path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// The hub server (extension/hub) serves the built SPA from "/" and exposes
// /api, /ws and /v1 on the same origin. In dev we proxy those to the hub so
// `vite dev` behaves identically to the embedded production build.
const HUB_TARGET = process.env.PIWB_HUB_URL || "http://127.0.0.1:8848";

export default defineConfig({
  base: "/",
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@shared": path.resolve(__dirname, "../shared"),
    },
  },
  build: {
    outDir: "dist",
    emptyOutDir: true,
    sourcemap: false,
    chunkSizeWarningLimit: 2500,
  },
  server: {
    port: 5273,
    proxy: {
      "/api": { target: HUB_TARGET, changeOrigin: true },
      "/v1": { target: HUB_TARGET, changeOrigin: true },
      "/render": { target: HUB_TARGET, changeOrigin: true },
      "/ws": { target: HUB_TARGET, ws: true, changeOrigin: true },
    },
  },
});
