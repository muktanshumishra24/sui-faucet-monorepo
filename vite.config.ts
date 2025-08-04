import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [tailwindcss(), react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://sui-token-faucet-distribution-production.up.railway.app',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/api/, '')
      }
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'terser',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          dappKit: ['@mysten/dapp-kit'],
          icons: ['@phosphor-icons/react']
        }
      }
    }
  },
  optimizeDeps: {
    include: ['react', 'react-dom', '@mysten/dapp-kit', '@phosphor-icons/react']
  }
})
