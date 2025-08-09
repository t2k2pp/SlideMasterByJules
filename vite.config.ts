import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // Production build optimization
    target: 'esnext',
    minify: 'esbuild',
    rollupOptions: {
      output: {
        // Code splitting strategy
        manualChunks: {
          'ai-providers': ['@google/genai', 'openai', '@anthropic-ai/sdk'],
          'export-libs': ['jspdf', 'pptxgenjs', 'html-to-image'],
          'ui-components': ['react-moveable', 'lucide-react'],
          'utils': ['jszip', 'file-saver']
        }
      }
    },
    // Bundle size analysis
    reportCompressedSize: true,
    chunkSizeWarningLimit: 1000
  },

  // Dev server optimization
  server: {
    hmr: {
      overlay: false // Disable error overlay
    }
  },

  // Pre-bundle dependencies
  optimizeDeps: {
    include: [
      'react', 'react-dom',
      '@google/genai',
      'react-moveable',
      'jspdf', 'pptxgenjs'
    ]
  }
})
