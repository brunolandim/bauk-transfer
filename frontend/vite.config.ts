import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [vue(), tailwindcss()],
  server: {
    proxy: {
      '/auth': 'http://localhost:3000',
      '/accounts': 'http://localhost:3000',
      '/transactions': 'http://localhost:3000',
    },
  },
})
