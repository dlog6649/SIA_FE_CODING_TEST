import path from "path"

import react from "@vitejs/plugin-react"
import unoCSS from "unocss/vite"
import { defineConfig } from "vite"

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: 5173,
    open: true,
  },
  plugins: [react(), unoCSS()],
  resolve: {
    alias: [{ find: "@src", replacement: path.resolve(__dirname, "src") }],
  },
})
