import path from "path"

import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: 5173,
  },
  plugins: [react()],
  resolve: {
    alias: [{ find: "@src", replacement: path.resolve(__dirname, "src") }],
  },
})
