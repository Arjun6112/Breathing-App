import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  assetsInclude: ["**/*.mp3"], // Ensure MP3 files are handled as assets
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Separate audio files into their own chunk - updated with correct filenames
          audio: [
            "src/assets/audio/breath-of-life_10-minutes-320859.mp3",
            "src/assets/audio/echoes-of-earth-ambient-atmospheric-marimbas-345054.mp3",
            "src/assets/audio/inner-peace-339640.mp3",
          ],
        },
      },
    },
  },
});
