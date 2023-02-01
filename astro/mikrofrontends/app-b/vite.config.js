import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { rollupImportMapPlugin } from "rollup-plugin-import-map";
import { resolve } from "path";
import importmap from "./importmap.json";

export default ({ command }) => ({
  plugins: [
    react(),
    {
      ...rollupImportMapPlugin(importmap),
      enforce: "pre",
      apply: "build",
    },
  ],
  build: {
    rollupOptions: {
      input: resolve(__dirname, "src/Mikrofrontend.jsx"),
      preserveEntrySignatures: "exports-only",
      output: {
        entryFileNames: "bundle.js",
        format: "esm",
      },
    },
  },
});
