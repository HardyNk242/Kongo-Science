import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    plugins: [react()],
    
    // ✅ Indispensable pour que les liens fonctionnent
    base: "/",
    
    build: {
      outDir: "dist",
    },

    define: {
      __GEMINI_ENABLED__: JSON.stringify(Boolean(env.GEMINI_API_KEY)),
    },
  };
});