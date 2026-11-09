import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  assetsInclude: ['**/*.glb'],
  build: {
    // Komponen berat (three.js/WebGL) sudah di-lazy-load via React.lazy di src/main.jsx,
    // jadi Vite otomatis mengeluarkannya ke async chunk — tidak menghalangi first paint.
    chunkSizeWarningLimit: 3600,
  },
});
