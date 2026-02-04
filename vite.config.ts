import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      server: {
        port: 5173,
        host: '0.0.0.0',
        strictPort: false,
      },
      build: {
        outDir: 'dist',
        sourcemap: mode === 'development',
        minify: 'terser',
        terserOptions: {
          compress: {
            drop_console: mode === 'production',
          },
        },
        rollupOptions: {
          output: {
            manualChunks: {
              vendor: ['react', 'react-dom'],
            },
          },
        },
      },
      plugins: [react()],
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY || ""),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY || ""),
        'process.env.VITE_API_BASE_URL': JSON.stringify(env.VITE_API_BASE_URL || ""),
      }, 
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
