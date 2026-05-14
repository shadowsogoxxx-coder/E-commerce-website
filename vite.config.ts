import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
  },
  plugins: [
    react(),
    mode === "development" && componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    dedupe: ["react", "react-dom", "react/jsx-runtime", "react/jsx-dev-runtime"],
  },
  // Add this build section below
build: {
    // 1. Increase the limit so the warning disappears
    chunkSizeWarningLimit: 1000, 
    rollupOptions: {
      output: {
        // 2. Force specific heavy libraries into their own files
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          utils: ['lucide-react', 'clsx', 'tailwind-merge'],
        },
      },
    },
  },
}));
