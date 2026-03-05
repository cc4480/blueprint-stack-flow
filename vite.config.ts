
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

export default defineConfig(({ mode }) => ({
  server: {
    port: 8080,
    host: "::",
  },
  plugins: [
    react(),
    mode === 'development' && componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./client/src"),
    },
  },
  optimizeDeps: {
    esbuildOptions: {
      plugins: [
        {
          name: "resolve-at-alias",
          setup(build) {
            build.onResolve({ filter: /^@\// }, (args) => ({
              path: path.resolve(__dirname, "client/src", args.path.slice(2)),
            }));
          },
        },
      ],
    },
  },
  root: ".",
  build: {
    outDir: "dist",
    rollupOptions: {
      input: {
        main: "index.html",
      },
    },
  },
}));
