import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  assetsInclude: ['**/*.glb'],
  build: {
    // Pisahkan vendor library ke chunk terpisah agar initial load lebih ringan
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          three: ['three', '@react-three/fiber', '@react-three/drei', '@react-three/rapier'],
          gsap: ['gsap'],
          meshline: ['meshline'],
        },
      },
    },
  },
});
