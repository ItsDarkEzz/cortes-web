import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";
import { metaImagesPlugin } from "./vite-plugin-meta-images";

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    metaImagesPlugin(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets"),
    },
  },
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist"),
    emptyOutDir: true,
    // Optimize chunks
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom'],
          'vendor-motion': ['framer-motion'],
          'vendor-ui': ['@radix-ui/react-accordion', '@radix-ui/react-dialog', '@radix-ui/react-tooltip'],
        },
      },
    },
    // Minification
    minify: 'esbuild',
  },
  server: {
    port: 5000,
    host: true,
    allowedHosts: ["thecortes.ru", "www.thecortes.ru"],
    // Оптимизация для dev
    warmup: {
      clientFiles: [
        "./src/pages/LandingPage.tsx",
        "./src/components/cortes/Hero.tsx",
      ],
    },
  },
  optimizeDeps: {
    // Pre-bundle heavy dependencies
    include: [
      "react",
      "react-dom",
      "framer-motion",
      "wouter",
      "@tanstack/react-query",
    ],
  },
});
