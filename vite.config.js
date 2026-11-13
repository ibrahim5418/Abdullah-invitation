import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // Own port so it never clashes with other local projects on 5173.
  server: { host: true, port: 5180, strictPort: true },
})
