import { useState } from "react";
import "./ControlPanel.css";

const ControlPanel = ({
  isBreathing,
  setIsBreathing,
  breathDuration,
  setBreathDuration,
  inhaleRatio,
  setInhaleRatio,
  holdAfterInhale,
  setHoldAfterInhale,
  holdAfterExhale,
  setHoldAfterExhale,
}) => {
  const [activePreset, setActivePreset] = useState(null);
  const [showCustomSettings, setShowCustomSettings] = useState(false);

  const toggleBreathing = () => {
    setIsBreathing(!isBreathing);
  };

  const toggleCustomSettings = () => {
    setShowCustomSettings(!showCustomSettings);
  };

  const handleBreathDurationChange = (e) => {
    setBreathDuration(Number(e.target.value));
    setActivePreset(null);
  };

  const handleInhaleRatioChange = (e) => {
    setInhaleRatio(Number(e.target.value));
    setActivePreset(null);
  };

  const handleHoldAfterInhaleChange = (e) => {
    setHoldAfterInhale(Number(e.target.value));
    setActivePreset(null);
  };

  const handleHoldAfterExhaleChange = (e) => {
    setHoldAfterExhale(Number(e.target.value));
    setActivePreset(null);
  };

  // Predefined breathing techniques
  const applyPreset = (preset) => {
    setActivePreset(preset);

    switch (preset) {
      case "box":
        // Box breathing (4-4-4-4)
        setBreathDuration(16);
        setInhaleRatio(0.25);
        setHoldAfterInhale(4);
        setHoldAfterExhale(4);
        break;
      case "478":
        // 4-7-8 breathing
        setBreathDuration(19);
        setInhaleRatio(4 / 19);
        setHoldAfterInhale(7);
        setHoldAfterExhale(0);
        break;
      case "calm":
        // Calming breath
        setBreathDuration(10);
        setInhaleRatio(0.4);
        setHoldAfterInhale(0);
        setHoldAfterExhale(0);
        break;
      default:
        break;
    }
  };

  return (
    <div className="control-panel">
      <button className="toggle-button" onClick={toggleBreathing}>
        {isBreathing ? "Pause" : "Start Breathing"}
      </button>

      <div>
        <h3 className="section-title">Breathing Techniques</h3>
        <div className="preset-buttons">
          <button
            className={`preset-button ${
              activePreset === "box" ? "active" : ""
            }`}
            onClick={() => applyPreset("box")}
          >
            Box Breathing
          </button>
          <button
            className={`preset-button ${
              activePreset === "478" ? "active" : ""
            }`}
            onClick={() => applyPreset("478")}
          >
            4-7-8 Technique
          </button>
          <button
            className={`preset-button ${
              activePreset === "calm" ? "active" : ""
            }`}
            onClick={() => applyPreset("calm")}
          >
            Calming Breath
          </button>
        </div>
      </div>

      <div className="section-divider"></div>

      <div className="collapsible-section">
        <button
          className={`collapse-toggle ${showCustomSettings ? "open" : ""}`}
          onClick={toggleCustomSettings}
          aria-expanded={showCustomSettings}
        >
          <h3 className="section-title">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="12" cy="12" r="3"></circle>
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
            </svg>
            Custom Settings
            <span className="toggle-icon">
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  d={showCustomSettings ? "M18 15l-6-6-6 6" : "M6 9l6 6 6-6"}
                ></path>
              </svg>
            </span>
          </h3>
        </button>

        <div
          className={`settings-container ${
            showCustomSettings ? "expanded" : ""
          }`}
        >
          <div className="settings">
            <div className="setting">
              <div className="setting-header">
                <label>Breath Cycle Duration</label>
                <span className="setting-value">{breathDuration}s</span>
              </div>
              <input
                type="range"
                min="4"
                max="20"
                step="1"
                value={breathDuration}
                onChange={handleBreathDurationChange}
              />
            </div>

            <div className="setting">
              <div className="setting-header">
                <label>Inhale Ratio</label>
                <span className="setting-value">
                  {Math.round(inhaleRatio * 100)}%
                </span>
              </div>
              <input
                type="range"
                min="0.2"
                max="0.8"
                step="0.05"
                value={inhaleRatio}
                onChange={handleInhaleRatioChange}
              />
            </div>

            <div className="setting">
              <div className="setting-header">
                <label>Hold After Inhale</label>
                <span className="setting-value">{holdAfterInhale}s</span>
              </div>
              <input
                type="range"
                min="0"
                max="10"
                step="1"
                value={holdAfterInhale}
                onChange={handleHoldAfterInhaleChange}
              />
            </div>

            <div className="setting">
              <div className="setting-header">
                <label>Hold After Exhale</label>
                <span className="setting-value">{holdAfterExhale}s</span>
              </div>
              <input
                type="range"
                min="0"
                max="10"
                step="1"
                value={holdAfterExhale}
                onChange={handleHoldAfterExhaleChange}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ControlPanel;
