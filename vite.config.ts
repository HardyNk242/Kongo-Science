import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  // Charge les variables d'environnement
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react()],

    // 1. Force la racine pour éviter les bugs de liens
    base: '/',

    // 2. Dit explicitement à Vercel de créer le dossier "dist"
    build: {
      outDir: 'dist',
    },

    // 3. Configuration pour Gemini (si utilisé)
    define: {
      __GEMINI_ENABLED__: JSON.stringify(Boolean(env.GEMINI_API_KEY)),
    },
  };
});