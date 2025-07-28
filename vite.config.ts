import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import tsConfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  server: {
    port: 3000,
  },
  plugins: [
    react(),
    tsConfigPaths({
      projects: ["./tsconfig.json"],
    }),
    tanstackStart({
      customViteReactPlugin: true,
    }),
  ],
  esbuild: {
    // Allow TypeScript files to be imported with .ts/.tsx extensions
    loader: "tsx",
  },
  resolve: {
    // Ensure Vite resolves .ts/.tsx extensions properly
    extensions: [".ts", ".tsx", ".js", ".jsx", ".json"],
  },
  // Add SSR configuration for better React 19 compatibility
  ssr: {
    noExternal: ["@tanstack/react-query", "@tanstack/react-router"],
  },
});
