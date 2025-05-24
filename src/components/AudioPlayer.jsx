import { useState, useRef, useEffect } from "react";
import "./AudioPlayer.css";

// Import audio files directly from assets
import calmMeditationTrack from "../assets/audio/breath-of-life_10-minutes-320859.mp3";
import gentleOceanTrack from "../assets/audio/echoes-of-earth-ambient-atmospheric-marimbas-345054.mp3";
import forestAmbienceTrack from "../assets/audio/inner-peace-339640.mp3";

const AudioPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(true); // Changed to true for autoplay
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const audioRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const [expanded, setExpanded] = useState(false);

  // List of audio tracks from assets with SVG icons instead of emojis
  const tracks = [
    {
      name: "Breath of Life",
      src: calmMeditationTrack,
      icon: (
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M18 8h1a4 4 0 0 1 0 8h-1"></path>
          <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"></path>
          <line x1="6" y1="1" x2="6" y2="4"></line>
          <line x1="10" y1="1" x2="10" y2="4"></line>
          <line x1="14" y1="1" x2="14" y2="4"></line>
        </svg>
      ),
    },
    {
      name: "Echoes of Earth",
      src: gentleOceanTrack,
      icon: (
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M2 12h20"></path>
          <path d="M4 8h.01M8 8h.01M12 8h.01M16 8h.01M20 8h.01M4 16h.01M8 16h.01M12 16h.01M16 16h.01M20 16h.01"></path>
          <path d="M6 4v4M10 4v8M14 4v4M18 4v8M6 16v4M10 16v4M14 16v4M18 16v4"></path>
        </svg>
      ),
    },
    {
      name: "Inner Peace",
      src: forestAmbienceTrack,
      icon: (
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
        </svg>
      ),
    },
  ];

  // Toggle expanded panel
  const toggleExpand = () => {
    setExpanded(!expanded);
  };

  // Handle play/pause toggle - Fixed version
  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
        console.log(
          "Audio paused, current time:",
          audioRef.current.currentTime
        );
      } else {
        audioRef.current.play().catch((error) => {
          console.log("Playback error:", error);
          setIsPlaying(false);
        });
        setIsPlaying(true);
      }
    }
  };

  // Select specific track
  const selectTrack = (index) => {
    if (index === currentTrackIndex) {
      togglePlay(); // Toggle play/pause if clicking current track
    } else {
      setCurrentTrackIndex(index);
      setIsLoading(true);
      // Will start playing automatically once loaded due to useEffect
    }
  };

  // Handle track change
  const changeTrack = (direction) => {
    let newIndex = currentTrackIndex;
    if (direction === "next") {
      newIndex = (currentTrackIndex + 1) % tracks.length;
    } else {
      newIndex = (currentTrackIndex - 1 + tracks.length) % tracks.length;
    }
    setCurrentTrackIndex(newIndex);
    setIsLoading(true);
  };

  // Handle track ending
  useEffect(() => {
    const handleTrackEnd = () => {
      changeTrack("next"); // Play next track when current one ends
    };

    const audioElement = audioRef.current;
    audioElement.addEventListener("ended", handleTrackEnd);

    return () => {
      audioElement.removeEventListener("ended", handleTrackEnd);
    };
  }, [currentTrackIndex]);

  // Update audio src when track changes - Fixed to sync with state
  useEffect(() => {
    if (audioRef.current) {
      setIsLoading(true);
      audioRef.current.src = tracks[currentTrackIndex].src;

      const handleCanPlay = () => {
        setIsLoading(false);
        // Don't auto-play here, let user control it
      };

      const handleLoadedData = () => {
        setIsLoading(false);
      };

      audioRef.current.addEventListener("canplay", handleCanPlay);
      audioRef.current.addEventListener("loadeddata", handleLoadedData);

      // Handle error if file is missing
      const handleError = () => {
        console.error(
          `Error loading audio file: ${tracks[currentTrackIndex].src}`
        );
        setIsLoading(false);
        changeTrack("next"); // Try the next track if this one fails
      };

      audioRef.current.addEventListener("error", handleError);

      return () => {
        if (audioRef.current) {
          audioRef.current.removeEventListener("canplay", handleCanPlay);
          audioRef.current.removeEventListener("loadeddata", handleLoadedData);
          audioRef.current.removeEventListener("error", handleError);
        }
      };
    }
  }, [currentTrackIndex]);

  // Set volume to a comfortable level
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = 0.4; // 40% volume
    }
  }, []);

  // Auto-play when component mounts
  useEffect(() => {
    const playAudio = async () => {
      try {
        // Wait until audio can play through
        await audioRef.current.play();
        setIsPlaying(true);
      } catch (error) {
        // Handle autoplay restrictions
        console.log("Autoplay prevented:", error);
        setIsPlaying(false);
      }
    };

    if (audioRef.current) {
      playAudio();
    }
  }, []);

  return (
    <div className={`audio-player ${expanded ? "expanded" : ""}`}>
      <audio ref={audioRef} preload="auto"></audio>

      <div className="audio-header" onClick={toggleExpand}>
        <button
          className="play-button main-play-button"
          onClick={(e) => {
            e.stopPropagation();
            togglePlay();
          }}
          aria-label={isPlaying ? "Pause" : "Play"}
          style={{
            backgroundColor: "var(--primary)",
            position: "relative",
            zIndex: 5,
          }}
        >
          {isLoading ? (
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2.5"
              className="loading-icon"
              style={{ display: "block" }}
            >
              <circle cx="12" cy="12" r="10"></circle>
              <path d="M12 6v6l4 2"></path>
            </svg>
          ) : isPlaying ? (
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="3"
              style={{ display: "block" }}
            >
              <rect x="6" y="4" width="4" height="16"></rect>
              <rect x="14" y="4" width="4" height="16"></rect>
            </svg>
          ) : (
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="3"
              style={{ display: "block" }}
            >
              <polygon points="5 3 19 12 5 21 5 3"></polygon>
            </svg>
          )}
        </button>

        <div className="current-track-info">
          <span className="now-playing">Now Playing</span>
          <span className="track-name">{tracks[currentTrackIndex].name}</span>
        </div>

        <button
          className="expand-button"
          onClick={toggleExpand}
          aria-label="Expand track list"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            {expanded ? (
              <polyline points="18 15 12 9 6 15"></polyline>
            ) : (
              <polyline points="6 9 12 15 18 9"></polyline>
            )}
          </svg>
        </button>
      </div>

      <div className="track-list">
        {tracks.map((track, index) => (
          <div
            key={index}
            className={`track-item ${
              currentTrackIndex === index ? "active" : ""
            }`}
            onClick={() => selectTrack(index)}
          >
            <div className="track-icon">{track.icon}</div>
            <div className="track-details">
              <div className="track-name">{track.name}</div>
            </div>
            {currentTrackIndex === index && (
              <div className="track-status">
                {isPlaying ? (
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <rect x="6" y="4" width="4" height="16"></rect>
                    <rect x="14" y="4" width="4" height="16"></rect>
                  </svg>
                ) : (
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <polygon points="5 3 19 12 5 21 5 3"></polygon>
                  </svg>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AudioPlayer;
