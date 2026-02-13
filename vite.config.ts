import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    plugins: [react()],

    // ✅ CRUCIAL : On force la racine absolue pour que les liens /library/id marchent
    base: "/", 
    
    // ✅ CRUCIAL : On s'assure que Vercel trouve le bon dossier
    build: {
      outDir: "dist",
    },

    // On garde votre configuration Gemini mais sans utiliser "path" qui bug
    define: {
      __GEMINI_ENABLED__: JSON.stringify(Boolean(env.GEMINI_API_KEY)),
    },
  };
});