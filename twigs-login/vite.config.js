import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/echo-dashboard/',
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        survey_builder: resolve(__dirname, 'survey_builder.html'),
      },
    },
  },
})
