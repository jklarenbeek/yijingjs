import { defineConfig } from 'vite'
import { resolve } from 'path';
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'

const __dirname = import.meta.dirname;

const minifyHtml = () => {
  return {
    name: 'html-transform',
    transformIndexHtml(html) {
      return html
        .replace(/\s+/g, ' ')
        .replace(/> </g, '><')
        .replace(/\s*([{}])\s*/g, '$1')
        .replace(/\s*([:;])\s*/g, '$1');
    }
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    minifyHtml(),
  ],
  base: '/yijingjs/',
  resolve: {
    alias: {
      '@yijingjs/core': resolve(__dirname, './packages/core/src/yijing.js'),
      '@yijingjs/yijing': resolve(__dirname, './packages/core/src/yijing.js'),
      '@yijingjs/wuxing': resolve(__dirname, './packages/core/src/wuxing.js'),
      '@yijingjs/bagua': resolve(__dirname, './packages/core/src/bagua.js'),
      '@yijingjs/tools': resolve(__dirname, './packages/core/src/tools.js')
    }
  },
  server: {
    port: 5173,
    open: true,
    cors: true
  },
  build: {
    sourcemap: true,
    outDir: 'dist',
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        app: resolve(__dirname, 'app.html')
      },
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'framer-motion'],
          dnd: ['@dnd-kit/core', '@dnd-kit/sortable', '@dnd-kit/utilities'],
          ui: ['lucide-react', 'clsx', 'tailwind-merge']
        }
      }
    }
  },
  // Better for debugging
  define: {
    'process.env': {}
  },
  esbuild: {
    keepNames: true
  }
})
