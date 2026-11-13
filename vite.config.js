import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Proxy /img/* → lh3.googleusercontent.com/d/* supaya browser memuat
// gambar Drive lewat origin yang sama (tanpa hotlink lintas situs).
const driveProxy = {
  '/img': {
    target: 'https://lh3.googleusercontent.com',
    changeOrigin: true,
    secure: true,
    rewrite: (path) => path.replace(/^\/img/, '/d'),
  },
};

export default defineConfig({
  plugins: [react()],
  assetsInclude: ['**/*.glb'],
  server: { proxy: driveProxy },
  preview: { proxy: driveProxy },
  build: {
    // Komponen berat (three.js/WebGL) sudah di-lazy-load via React.lazy di src/main.jsx,
    // jadi Vite otomatis mengeluarkannya ke async chunk — tidak menghalangi first paint.
    chunkSizeWarningLimit: 3600,
  },
});
