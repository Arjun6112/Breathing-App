import { useState, useEffect } from "react";
import "./App.css";
import BreathingCircle from "./components/BreathingCircle";
import ControlPanel from "./components/ControlPanel";
import AudioPlayer from "./components/AudioPlayer";
import ThemeToggle from "./components/ThemeToggle";
import "./index.css"; // Ensure CSS is properly imported

function App() {
  const [isBreathing, setIsBreathing] = useState(false);
  const [breathDuration, setBreathDuration] = useState(8); // seconds per breath cycle
  const [inhaleRatio, setInhaleRatio] = useState(0.4); // 40% inhale, 60% exhale
  const [holdAfterInhale, setHoldAfterInhale] = useState(0); // seconds to hold after inhale
  const [holdAfterExhale, setHoldAfterExhale] = useState(0); // seconds to hold after exhale
  const [stars, setStars] = useState([]);

  // Generate star background
  useEffect(() => {
    const generateStars = () => {
      const newStars = [];
      for (let i = 0; i < 100; i++) {
        newStars.push({
          id: i,
          top: Math.random() * 100,
          left: Math.random() * 100,
          size: Math.random() * 2 + 1,
          opacity: Math.random() * 0.6 + 0.1,
          animationDuration: Math.random() * 3 + 2,
        });
      }
      setStars(newStars);
    };

    generateStars();
  }, []);

  // Add animated background elements for themes
  const [lightElements, setLightElements] = useState([]);
  const [darkElements, setDarkElements] = useState([]);

  // Generate theme-specific background elements
  useEffect(() => {
    // Generate light theme elements (light green)
    const newLightElements = [];
    for (let i = 0; i < 15; i++) {
      newLightElements.push({
        id: `light-${i}`,
        top: Math.random() * 100,
        left: Math.random() * 100,
        size: Math.random() * 80 + 40,
        opacity: Math.random() * 0.1 + 0.02,
        blur: Math.random() * 40 + 30,
        animationDuration: Math.random() * 80 + 40,
      });
    }
    setLightElements(newLightElements);

    // Generate dark theme elements (warm yellow)
    const newDarkElements = [];
    for (let i = 0; i < 15; i++) {
      newDarkElements.push({
        id: `dark-${i}`,
        top: Math.random() * 100,
        left: Math.random() * 100,
        size: Math.random() * 80 + 40,
        opacity: Math.random() * 0.08 + 0.02,
        blur: Math.random() * 40 + 30,
        animationDuration: Math.random() * 80 + 40,
      });
    }
    setDarkElements(newDarkElements);
  }, []);

  return (
    <div className="app-container">
      <div className="theme-background">
        {lightElements.map((element) => (
          <div
            key={element.id}
            className="light-element"
            style={{
              top: `${element.top}%`,
              left: `${element.left}%`,
              width: `${element.size}px`,
              height: `${element.size}px`,
              opacity: element.opacity,
              filter: `blur(${element.blur}px)`,
              animation: `float ${element.animationDuration}s infinite alternate ease-in-out`,
            }}
          />
        ))}
        {darkElements.map((element) => (
          <div
            key={element.id}
            className="dark-element"
            style={{
              top: `${element.top}%`,
              left: `${element.left}%`,
              width: `${element.size}px`,
              height: `${element.size}px`,
              opacity: element.opacity,
              filter: `blur(${element.blur}px)`,
              animation: `float ${element.animationDuration}s infinite alternate ease-in-out`,
            }}
          />
        ))}
      </div>

      <div className="stars">
        {stars.map((star) => (
          <div
            key={star.id}
            className="star"
            style={{
              top: `${star.top}%`,
              left: `${star.left}%`,
              width: `${star.size}px`,
              height: `${star.size}px`,
              opacity: star.opacity,
              animation: `twinkle ${star.animationDuration}s infinite alternate`,
            }}
          />
        ))}
      </div>

      <ThemeToggle />
      <AudioPlayer />

      <header className="app-header">
        <h1>Mindful Breathing</h1>
        <p className="app-description">
          A simple tool to help you practice breathing techniques for relaxation
          and stress relief.
        </p>
      </header>

      <div className="breathing-section">
        <BreathingCircle
          isBreathing={isBreathing}
          breathDuration={breathDuration}
          inhaleRatio={inhaleRatio}
          holdAfterInhale={holdAfterInhale}
          holdAfterExhale={holdAfterExhale}
        />
      </div>

      {/* Control panel with explicit inline styles for positioning */}
      <div
        className="control-panel-section"
        style={{
          position: "fixed",
          bottom: "1.5rem",
          right: "1.5rem",
          left: "auto",
          maxWidth: "320px",
          zIndex: 10,
        }}
      >
        <ControlPanel
          isBreathing={isBreathing}
          setIsBreathing={setIsBreathing}
          breathDuration={breathDuration}
          setBreathDuration={setBreathDuration}
          inhaleRatio={inhaleRatio}
          setInhaleRatio={setInhaleRatio}
          holdAfterInhale={holdAfterInhale}
          setHoldAfterInhale={setHoldAfterInhale}
          holdAfterExhale={holdAfterExhale}
          setHoldAfterExhale={setHoldAfterExhale}
        />
      </div>
    </div>
  );
}

export default App;
