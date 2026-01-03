import path from "path";
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  // Charge .env, .env.local, etc.
  const env = loadEnv(mode, ".", "");

  return {
    plugins: [react()],

    // ✅ IMPORTANT pour un domaine custom (www.kongoscience.com)
    base: "/",

    // Ton server local (optionnel)
    server: {
      port: 3000,
      host: "0.0.0.0",
    },

    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"), // mieux: pointe vers src
      },
    },

    /**
     * ✅ On n'injecte PAS de clé secrète dans le navigateur.
     * Si tu veux quand même activer/masquer le chat, on expose seulement un flag.
     */
    define: {
      __GEMINI_ENABLED__: JSON.stringify(Boolean(env.GEMINI_API_KEY)),
    },
  };
});
