import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";

// Initialize theme based on saved preference or system default
const initializeTheme = () => {
  const savedTheme = localStorage.getItem("breathing-app-theme");
  if (savedTheme) {
    document.documentElement.setAttribute("data-theme", savedTheme);
  } else {
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    document.documentElement.setAttribute(
      "data-theme",
      prefersDark ? "dark" : "light"
    );
  }
};

// Call theme initialization
initializeTheme();

// Preload streaming audio files
const preloadStreamingAudio = () => {
  const audioStreams = [
    "https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0c6ff1bfd.mp3?filename=mindfulness-relaxation-amp-meditation-music-148162.mp3",
    "https://cdn.pixabay.com/download/audio/2022/03/15/audio_db272979e4.mp3?filename=ocean-waves-112906.mp3",
  ];

  // Only preload the first two tracks to save bandwidth
  audioStreams.forEach((url) => {
    try {
      const audio = new Audio();
      audio.preload = "metadata"; // Only load metadata to save bandwidth
      audio.src = url;
    } catch (e) {
      console.log("Audio preload error:", e);
    }
  });
};

// Call preload function
preloadStreamingAudio();

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// index.html
