import React, { createContext, useContext, useState, useRef, useEffect } from 'react';

const PlayerContext = createContext(null);

export const PlayerProvider = ({ children }) => {
  const audioRef = useRef(new Audio());
  const [playlist, setPlaylist] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(70);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Carga inicial de favoritos desde localStorage
  const [likedSongs, setLikedSongs] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('pulse_liked_songs') || '[]');
    } catch {
      return [];
    }
  });

  const currentTrack = currentIndex >= 0 && playlist[currentIndex] ? playlist[currentIndex] : null;

  // Sincronizar eventos nativos del elemento Audio
  useEffect(() => {
    const audio = audioRef.current;

    const onTimeUpdate = () => setCurrentTime(audio.currentTime);
    const onLoadedMetadata = () => setDuration(audio.duration || 0);
    const onEnded = () => nextTrack();

    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('loadedmetadata', onLoadedMetadata);
    audio.addEventListener('ended', onEnded);

    return () => {
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('loadedmetadata', onLoadedMetadata);
      audio.removeEventListener('ended', onEnded);
    };
  }, [playlist, currentIndex]);

  // Cargar pista e iniciar reproducción
  const loadAndPlayTrack = (index, newPlaylist = null) => {
    const activeList = newPlaylist || playlist;
    if (!activeList || activeList.length === 0) return;

    let targetIdx = index;
    if (targetIdx < 0) targetIdx = activeList.length - 1;
    if (targetIdx >= activeList.length) targetIdx = 0;

    if (newPlaylist) setPlaylist(newPlaylist);
    setCurrentIndex(targetIdx);

    const track = activeList[targetIdx];
    const audio = audioRef.current;
    audio.src = track.audio;
    audio
      .play()
      .then(() => setIsPlaying(true))
      .catch((err) => console.error('Error al reproducir audio:', err));
  };

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!currentTrack) {
      if (playlist.length > 0) loadAndPlayTrack(0);
      return;
    }
    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio
        .play()
        .then(() => setIsPlaying(true))
        .catch((err) => console.error('Error al reproducir audio:', err));
    }
  };

  const nextTrack = () => {
    if (playlist.length === 0) return;
    loadAndPlayTrack(currentIndex + 1);
  };

  const prevTrack = () => {
    if (playlist.length === 0) return;
    loadAndPlayTrack(currentIndex - 1);
  };

  const seek = (percentage) => {
    const audio = audioRef.current;
    if (audio.duration) {
      audio.currentTime = (percentage / 100) * audio.duration;
      setCurrentTime(audio.currentTime);
    }
  };

  const changeVolume = (val) => {
    setVolume(val);
    audioRef.current.volume = val / 100;
    if (isMuted && val > 0) setIsMuted(false);
  };

  const toggleMute = () => {
    if (isMuted) {
      audioRef.current.volume = volume / 100;
      setIsMuted(false);
    } else {
      audioRef.current.volume = 0;
      setIsMuted(true);
    }
  };

  const toggleLike = (trackToToggle) => {
    const target = trackToToggle || currentTrack;
    if (!target) return;

    setLikedSongs((prev) => {
      const exists = prev.some((t) => t.id === target.id);
      const updated = exists ? prev.filter((t) => t.id !== target.id) : [...prev, target];
      localStorage.setItem('pulse_liked_songs', JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <PlayerContext.Provider
      value={{
        currentTrack,
        playlist,
        currentIndex,
        isPlaying,
        currentTime,
        duration,
        volume,
        isMuted,
        isFullscreen,
        likedSongs,
        setIsFullscreen,
        loadAndPlayTrack,
        togglePlay,
        nextTrack,
        prevTrack,
        seek,
        changeVolume,
        toggleMute,
        toggleLike,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
};

export const usePlayer = () => {
  const context = useContext(PlayerContext);
  if (!context) throw new Error('usePlayer debe usarse dentro de un PlayerProvider');
  return context;
};