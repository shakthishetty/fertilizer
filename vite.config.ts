// ...existing code...
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
// removed problematic top-level import of runtimeErrorOverlay
// import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";

export default defineConfig(async () => {
  // start with core plugins only
  const plugins: any[] = [react()];

  // load replit dev-only plugins only when in the REPL dev environment
  if (process.env.NODE_ENV !== "production" && process.env.REPL_ID !== undefined) {
    try {
      const cartographer = await import("@replit/vite-plugin-cartographer").then((m: any) => m.cartographer());
      const devBanner = await import("@replit/vite-plugin-dev-banner").then((m: any) => m.devBanner());
      // dynamic import runtime error overlay only in the REPL environment
      const runtimeErrorOverlay = await import("@replit/vite-plugin-runtime-error-modal").then((m: any) =>
        typeof m.default === "function" ? m.default() : (m.default ?? m)
      );
      plugins.push(cartographer, devBanner, runtimeErrorOverlay);
    } catch (err) {
      // ignore if any replit plugins are ESM-only / unavailable during CI/build
      // (prevents Vercel/esbuild from failing)
      // console.debug("Skipping replit dev plugins:", err);
    }
  }

  return {
    plugins,
    resolve: {
      alias: {
        "@": path.resolve(process.cwd(), "client", "src"),
        "@shared": path.resolve(process.cwd(), "shared"),
        "@assets": path.resolve(process.cwd(), "attached_assets"),
      },
    },
    root: path.resolve(process.cwd(), "client"),
    build: {
      outDir: path.resolve(process.cwd(), "client/dist"),
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
  };
});
