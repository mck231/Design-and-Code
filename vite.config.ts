import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import svgr from 'vite-plugin-svgr';
import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite"; // Import Tailwind CSS Vite plugin

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    reactRouter(),
    tailwindcss(), // Add Tailwind CSS plugin
    tsconfigPaths(),
    svgr(),    
  ],
  server: {
    port: 3000
  }
});
