import { useState, useEffect } from "react";
import "./App.css";
import BreathingCircle from "./components/BreathingCircle";
import ControlPanel from "./components/ControlPanel";
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

  return (
    <div className="app-container">
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

      <div className="control-panel-section">
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
