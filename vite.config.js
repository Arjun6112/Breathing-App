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
          // Separate audio files into their own chunk
          audio: [
            "src/assets/audio/calm-meditation.mp3",
            "src/assets/audio/gentle-ocean.mp3",
            "src/assets/audio/forest-ambience.mp3",
          ],
        },
      },
    },
  },
});
