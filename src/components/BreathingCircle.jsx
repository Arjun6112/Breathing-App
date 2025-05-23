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
  const [ripples, setRipples] = useState([]);
  const [sparkles, setSparkles] = useState([]);
  const circleRef = useRef(null);
  const timerRef = useRef(null);
  const cycleCountRef = useRef(0);
  const particlesContainerRef = useRef(null);
  const sparkleIntervalRef = useRef(null);

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

  // Create a ripple effect with more dynamic ripples
  const createRipple = (event) => {
    if (!circleRef.current) return;

    const circle = circleRef.current;
    const rect = circle.getBoundingClientRect();

    // Get click position relative to the circle
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    // Calculate position as percentage
    const posX = (x / rect.width) * 100;
    const posY = (y / rect.height) * 100;

    // Calculate distance from center for ripple intensity
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const distanceFromCenter = Math.sqrt(
      Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2)
    );
    const maxDistance = Math.sqrt(
      Math.pow(rect.width / 2, 2) + Math.pow(rect.height / 2, 2)
    );
    const intensity = 1 - (distanceFromCenter / maxDistance) * 0.5; // Higher intensity closer to center

    // Add new ripple with intensity
    const newRipple = {
      id: Date.now(),
      x: posX,
      y: posY,
      intensity: intensity,
    };

    setRipples((prev) => [...prev, newRipple]);

    // Remove ripple after animation completes
    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== newRipple.id));
    }, 1500);
  };

  // Generate random sparkles
  const generateSparkles = () => {
    const newSparkles = [];
    const sparkleCount = Math.floor(Math.random() * 3) + 1; // 1-3 sparkles at a time

    for (let i = 0; i < sparkleCount; i++) {
      // Calculate position on the circle's edge
      const angle = Math.random() * 2 * Math.PI;
      const radius = 140; // Circle radius
      const offsetX = Math.cos(angle) * radius;
      const offsetY = Math.sin(angle) * radius;

      newSparkles.push({
        id: Date.now() + i,
        left: 50 + (offsetX / radius) * 50, // Convert to percentage
        top: 50 + (offsetY / radius) * 50, // Convert to percentage
        duration: Math.random() * 2 + 2, // 2-4 seconds
        delay: Math.random() * 0.5, // 0-0.5 second delay
        opacity: Math.random() * 0.4 + 0.6, // 0.6-1.0 opacity
      });
    }

    setSparkles((prev) => [...prev, ...newSparkles]);

    // Remove old sparkles
    setTimeout(() => {
      setSparkles((prev) =>
        prev.filter((s) => !newSparkles.some((ns) => ns.id === s.id))
      );
    }, 4000);
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

  // Set up sparkle interval
  useEffect(() => {
    if (isBreathing) {
      // Generate initial sparkles
      generateSparkles();

      // Set up interval for new sparkles
      sparkleIntervalRef.current = setInterval(generateSparkles, 700);
    } else {
      // Clear interval when not breathing
      if (sparkleIntervalRef.current) {
        clearInterval(sparkleIntervalRef.current);
        sparkleIntervalRef.current = null;
      }
    }

    return () => {
      if (sparkleIntervalRef.current) {
        clearInterval(sparkleIntervalRef.current);
      }
    };
  }, [isBreathing]);

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
        onClick={createRipple}
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
        {/* Wavy border element */}
        <div className="wavy-border"></div>

        {/* Additional wave layers */}
        <div className="wave-layer1"></div>
        <div className="wave-layer2"></div>
        <div className="wave-layer3"></div>

        {/* Glowing edge effect */}
        <div className="glow-edge"></div>

        {/* Water surface effect */}
        <div className="water-surface"></div>

        {/* Magical sparkles */}
        <div className="sparkles">
          {sparkles.map((sparkle) => (
            <div
              key={sparkle.id}
              className="sparkle"
              style={{
                left: `${sparkle.left}%`,
                top: `${sparkle.top}%`,
                "--sparkle-duration": `${sparkle.duration}s`,
                "--sparkle-delay": `${sparkle.delay}s`,
                "--sparkle-opacity": sparkle.opacity,
              }}
            />
          ))}
        </div>

        {/* Ripple effects */}
        {ripples.map((ripple) => (
          <div
            key={ripple.id}
            className="ripple"
            style={{
              left: `${ripple.x}%`,
              top: `${ripple.y}%`,
              "--ripple-intensity": ripple.intensity,
            }}
          />
        ))}

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
