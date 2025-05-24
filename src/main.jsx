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

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// index.html
