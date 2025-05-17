import { useState, useEffect, useRef } from "react";
import "./BreathingCircle.css";

const BreathingCircle = ({
  isBreathing,
  breathDuration,
  inhaleRatio,
  holdAfterInhale,
  holdAfterExhale,
}) => {
  const [breathingPhase, setBreathingPhase] = useState("ready");
  const [message, setMessage] = useState("Get ready...");
  const [phaseCount, setPhaseCount] = useState(0);
  const [particles, setParticles] = useState([]);
  const circleRef = useRef(null);
  const timerRef = useRef(null);
  const cycleCountRef = useRef(0);
  const particlesContainerRef = useRef(null);

  // Calculate time for each phase in milliseconds
  const inhaleDuration = breathDuration * inhaleRatio * 1000;
  const holdInhaleDuration = holdAfterInhale * 1000;
  const exhaleDuration =
    (breathDuration -
      breathDuration * inhaleRatio -
      holdAfterInhale -
      holdAfterExhale) *
    1000;
  const holdExhaleDuration = holdAfterExhale * 1000;

  // Generate subtle particles
  const generateParticles = (count, phase) => {
    // Use fewer particles for better performance
    const actualCount = Math.min(count, 8);
    const newParticles = [];

    for (let i = 0; i < actualCount; i++) {
      const randomX = Math.random() * 2 - 1; // -1 to 1
      const randomY = Math.random() * 2 - 1; // -1 to 1
      const size = Math.random() * 4 + 2; // 2px to 6px
      const opacity = Math.random() * 0.3 + 0.2; // 0.2 to 0.5
      const duration = Math.random() * 2 + 1.5; // 1.5s to 3.5s
      const delay = Math.random() * 0.5; // 0s to 0.5s

      newParticles.push({
        id: Date.now() + i,
        size,
        x: 50 + randomX * 30, // position within circle
        y: 50 + randomY * 30,
        opacity,
        randomX,
        randomY,
        duration,
        delay,
        phase,
      });
    }

    setParticles((prev) => [...prev, ...newParticles]);

    // Clean up older particles
    setTimeout(() => {
      setParticles((prev) => prev.filter((p) => p.phase !== phase));
    }, breathDuration * 1000);
  };

  // Reset the breathing cycle
  const resetBreathingCycle = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    setBreathingPhase("ready");
    setMessage("Ready");
    cycleCountRef.current = 0;
    setPhaseCount(0);
    setParticles([]);
  };

  // Start a new breath cycle
  const startBreathCycle = () => {
    setBreathingPhase("inhale");
    setMessage("Inhale");
    generateParticles(6, "inhale");

    // Schedule the hold after inhale
    timerRef.current = setTimeout(() => {
      setBreathingPhase("hold-inhale");
      setMessage("Hold");
      generateParticles(3, "hold-inhale");

      // Schedule the exhale
      timerRef.current = setTimeout(() => {
        setBreathingPhase("exhale");
        setMessage("Exhale");
        generateParticles(6, "exhale");

        // Schedule the hold after exhale
        timerRef.current = setTimeout(() => {
          if (holdAfterExhale > 0) {
            setBreathingPhase("hold-exhale");
            setMessage("Hold");
            generateParticles(2, "hold-exhale");

            // Schedule the next cycle
            timerRef.current = setTimeout(() => {
              cycleCountRef.current++;
              setPhaseCount(cycleCountRef.current);
              startBreathCycle();
            }, holdExhaleDuration);
          } else {
            // If no hold after exhale, go directly to next cycle
            cycleCountRef.current++;
            setPhaseCount(cycleCountRef.current);
            startBreathCycle();
          }
        }, exhaleDuration);
      }, holdInhaleDuration);
    }, inhaleDuration);
  };

  // Effect for handling breathing state changes
  useEffect(() => {
    if (isBreathing) {
      startBreathCycle();
    } else {
      resetBreathingCycle();
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [
    isBreathing,
    breathDuration,
    inhaleRatio,
    holdAfterInhale,
    holdAfterExhale,
  ]);

  // Get the CSS class for the current breathing phase
  const getPhaseClass = () => {
    switch (breathingPhase) {
      case "inhale":
        return "scale-inhale";
      case "hold-inhale":
        return "scale-hold-inhale";
      case "exhale":
        return "scale-exhale";
      case "hold-exhale":
        return "scale-hold-exhale";
      default:
        return "scale-base";
    }
  };

  return (
    <div className="breathing-container">
      <div
        ref={circleRef}
        className={`breathing-circle ${getPhaseClass()}`}
        data-phase={breathingPhase}
        style={{
          "--inhale-duration": `${breathDuration * inhaleRatio}s`,
          "--exhale-duration": `${
            breathDuration -
            breathDuration * inhaleRatio -
            holdAfterInhale -
            holdAfterExhale
          }s`,
          "--hold-after-inhale": `${holdAfterInhale}s`,
          "--hold-after-exhale": `${holdAfterExhale}s`,
        }}
      >
        <div className="particles-container" ref={particlesContainerRef}>
          {particles.map((particle) => (
            <div
              key={particle.id}
              className="particle"
              style={{
                width: `${particle.size}px`,
                height: `${particle.size}px`,
                left: `${particle.x}%`,
                top: `${particle.y}%`,
                opacity: particle.opacity,
                animation:
                  particle.phase === "inhale" ||
                  particle.phase === "hold-inhale"
                    ? `float-up ${particle.duration}s ease-out ${particle.delay}s forwards`
                    : `float-out ${particle.duration}s ease-out ${particle.delay}s forwards`,
                "--random-x": particle.randomX,
                "--random-y": particle.randomY,
              }}
            />
          ))}
        </div>
        <div className="inner-circle">
          <div className="message">{message}</div>
          {isBreathing && phaseCount > 0 && (
            <div className="phase-count">Breath {phaseCount}</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BreathingCircle;
