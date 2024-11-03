import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import eslintPlugin from "vite-plugin-eslint";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    eslintPlugin({
      emitWarning: true, // Ensure warnings are emitted
      emitError: false, // Optional: Prevent errors from blocking the build
    }),
  ],
});
