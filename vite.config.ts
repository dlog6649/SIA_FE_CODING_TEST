import path from "path"

import React from "@vitejs/plugin-react"
import { defineConfig } from "vite"

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: 5173,
  },
  plugins: [React()],
  resolve: {
    alias: [{ find: "@src", replacement: path.resolve(__dirname, "src") }],
  },
})
