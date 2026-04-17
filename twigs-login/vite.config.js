import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// https://vite.dev/config/
export default defineConfig(({ command }) => ({
  plugins: [react()],
  // Dev at /survey_builder.html; production build keeps the dashboard subpath.
  base: command === 'serve' ? '/' : '/echo-dashboard/',
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        survey_builder: resolve(__dirname, 'survey_builder.html'),
      },
    },
  },
}))
