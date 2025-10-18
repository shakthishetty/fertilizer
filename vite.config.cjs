// vite.config.cjs
const { defineConfig } = require("vite");
const react = require("@vitejs/plugin-react");

const path = require("path");

module.exports = defineConfig({
  plugins: [
    react(),
    // Note: Replit plugins removed for deployment
  ],
  resolve: {
    alias: {
      "@": path.resolve("client/src"),
      "@shared": path.resolve("shared"),
      "@assets": path.resolve("attached_assets"),
    },
  },
  root: path.resolve("client"),
  build: {
    outDir: path.resolve("client/dist"),
    emptyOutDir: true,
  },
  server: {
    fs: {
      strict: true,
      deny: ["**/.*"],
    },
    proxy: {
      "/api": {
        target: "http://localhost:3000",
        changeOrigin: true,
      },
    },
  },
});
