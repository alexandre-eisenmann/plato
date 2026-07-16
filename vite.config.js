import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/plato/',
  plugins: [react()],
  test: {
    environment: 'node',
  },
})
