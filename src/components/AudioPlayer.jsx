import { useState, useRef, useEffect } from "react";
import "./AudioPlayer.css";

const AudioPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const audioRef = useRef(null);

  // List of relaxing music tracks from online streaming sources
  const tracks = [
    {
      name: "Calm Meditation",
      src: "https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0c6ff1bfd.mp3?filename=mindfulness-relaxation-amp-meditation-music-148162.mp3"
    },
    {
      name: "Ocean Waves",
      src: "https://cdn.pixabay.com/download/audio/2022/03/15/audio_db272979e4.mp3?filename=ocean-waves-112906.mp3"
    },
    {
      name: "Peaceful Ambient",
      src: "https://cdn.pixabay.com/download/audio/2022/04/27/audio_43b6b521c9.mp3?filename=relaxing-mountains-rivers-streams-running-water-118752.mp3"
    },
    {
      name: "Deep Meditation",
      src: "https://cdn.pixabay.com/download/audio/2022/03/18/audio_c3b4d42931.mp3?filename=relax-music-7738.mp3"
    }
  ];

  // Handle play/pause toggle
  const togglePlay = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(error => {
        console.log("Playback error:", error);
        // Autoplay was prevented, show a visual cue to the user
      });
    }
    setIsPlaying(!isPlaying);
  };

  // Add loading state
  const [isLoading, setIsLoading] = useState(false);

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

  // Update audio src when track changes and handle loading events
  useEffect(() => {
    if (audioRef.current) {
      setIsLoading(true);
      audioRef.current.src = tracks[currentTrackIndex].src;
      
      const handleCanPlay = () => {
        setIsLoading(false);
        if (isPlaying) {
          audioRef.current.play().catch(e => {
            console.log("Playback error after track change:", e);
            setIsPlaying(false);
          });
        }
      };
      
      audioRef.current.addEventListener("canplay", handleCanPlay);
      
      return () => {
        if (audioRef.current) {
          audioRef.current.removeEventListener("canplay", handleCanPlay);
        }
      };
    }
  }, [currentTrackIndex, isPlaying]);

  // Set volume to a comfortable level
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = 0.4; // 40% volume
    }
  }, []);

  return (
    <div className="audio-player">
      <audio ref={audioRef} preload="auto"></audio>
      
      <div className="audio-controls">
        <button className="track-button prev-button" onClick={() => changeTrack("prev")} aria-label="Previous track">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polygon points="19 20 9 12 19 4 19 20"></polygon>
            <line x1="5" y1="19" x2="5" y2="5"></line>
          </svg>
        </button>
        
        <button className="play-button" onClick={togglePlay} aria-label={isPlaying ? "Pause" : "Play"}>
          {isLoading ? (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="loading-icon">
              <circle cx="12" cy="12" r="10"></circle>
              <path d="M12 6v6l4 2"></path>
            </svg>
          ) : isPlaying ? (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="6" y="4" width="4" height="16"></rect>
              <rect x="14" y="4" width="4" height="16"></rect>
            </svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polygon points="5 3 19 12 5 21 5 3"></polygon>
            </svg>
          )}
        </button>
        
        <button className="track-button next-button" onClick={() => changeTrack("next")} aria-label="Next track">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polygon points="5 4 15 12 5 20 5 4"></polygon>
            <line x1="19" y1="5" x2="19" y2="19"></line>
          </svg>
        </button>
      </div>
      
      <div className="track-info">
        <span className="track-name">{tracks[currentTrackIndex].name}</span>
        <span className="attribution">from Pixabay</span>
      </div>
    </div>
  );
};

export default AudioPlayer;
