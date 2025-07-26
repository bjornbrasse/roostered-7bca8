import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import { defineConfig } from "vite";
import tsConfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  server: {
    port: 3000,
  },
  plugins: [
    tsConfigPaths({
      projects: ["./tsconfig.json"],
    }),
    tanstackStart(),
  ],
  esbuild: {
    // Allow TypeScript files to be imported with .ts/.tsx extensions
    loader: "tsx",
  },
  resolve: {
    // Ensure Vite resolves .ts/.tsx extensions properly
    extensions: [".ts", ".tsx", ".js", ".jsx", ".json"],
  },
});
