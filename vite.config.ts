import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
//TEST
export default defineConfig({
  plugins: [react()],
  base: "/"
})
