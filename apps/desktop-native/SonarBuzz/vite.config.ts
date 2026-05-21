import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

import path from "path";


const host = process.env.TAURI_DEV_HOST;

// https://vite.dev/config/
export default defineConfig(async () => ({
  plugins: [react()],
  resolve: {
    alias: [
      { find: "shared", replacement: path.resolve(process.cwd(), "../../../packages/shared") },
      { find: "react-native", replacement: "/mock-rn.ts" },
      { find: /^zustand\/middleware$/, replacement: path.resolve(process.cwd(), "node_modules/zustand/esm/middleware.mjs") },
      { find: /^zustand$/, replacement: path.resolve(process.cwd(), "node_modules/zustand/esm/index.mjs") }
    ]
  },

  // Vite options tailored for Tauri development and only applied in `tauri dev` or `tauri build`
  //
  // 1. prevent Vite from obscuring rust errors
  clearScreen: false,
  // 2. tauri expects a fixed port, fail if that port is not available
  server: {
    port: 1420,
    strictPort: true,
    host: host || false,
    hmr: host
      ? {
        protocol: "ws",
        host,
        port: 1421,
      }
      : undefined,
    watch: {
      // 3. tell Vite to ignore watching `src-tauri`
      ignored: ["**/src-tauri/**"],
    },
    proxy: {
      '/tidal-auth': {
        target: 'https://auth.tidal.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/tidal-auth/, '')
      },
      '/tidal-api': {
        target: 'https://api.tidal.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/tidal-api/, '')
      },
      '/tidal-openapi': {
        target: 'https://openapi.tidal.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/tidal-openapi/, '')
      }
    }
  },
}));
