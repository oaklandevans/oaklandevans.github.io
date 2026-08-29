import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import { writeFileSync } from 'fs'

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'create-nojekyll',
      closeBundle() {
        writeFileSync('dist/.nojekyll', '')
      }
    }
  ],
  base: '/',
  build: {
    outDir: 'dist'
  },
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setupTests.ts']
  }
})

