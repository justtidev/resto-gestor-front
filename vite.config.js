import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
   server: {
    host: '0.0.0.0', // <-- ESTO ES CLAVE
    port: 5173,      // <-- Asegurate que el puerto sea el correcto


    strictPort: true, // <-- Si el puerto no está disponible, Vite fallará en lugar de buscar otro
    cors: true, // <-- Permite CORS
    
    proxy: {
      '/socket.io':{
        target: process.env.VITE_API_URL || 'http://localhost:3000',
        ws: true,
         },
         '/api': {
    target: process.env.VITE_API_URL || 'http://localhost:3000',
    changeOrigin: true,
    secure: false,
  }
    }
  },
   optimizeDeps: {
    exclude: ['lucide-react'],
  },
})
