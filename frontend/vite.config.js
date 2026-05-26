import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const apiUrl = process.env.VITE_API_URL || 'https://deskflow-6.onrender.com';

export default defineConfig({
  plugins: [react()],
  server: { port: 5173 },
  define: {
    'import.meta.env.VITE_API_URL': JSON.stringify(apiUrl),
  },
});
