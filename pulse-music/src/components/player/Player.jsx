import React from 'react';
import { usePlayer } from '../../context/PlayerContext';
import { formatSeconds } from '../../services/itunesApi';

export default function Player() {
  const {
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
  } = usePlayer();

  const isFavorite = currentTrack && likedSongs.some((s) => s.id === currentTrack.id);
  const progressPercent = duration ? (currentTime / duration) * 100 : 0;

  // Cola de canciones (siguientes 5 temas)
  const queueStart = currentIndex + 1;
  const queueEnd = Math.min(queueStart + 5, playlist.length);
  const queueTracks = playlist.slice(queueStart, queueEnd);

  return (
    <aside id="player-aside" className="pulse-player-container">
      {/* 1. MINI PLAYER (Visible en móviles según las media queries) */}
      <div
        className="pulse-mini-player cursor-pointer"
        id="mobile-expand-trigger"
        onClick={() => setIsFullscreen(true)}
      >
        <div className="pulse-mini-left" id="mini-track-info-area">
          <img
            src={
              currentTrack?.caratulaMini ||
              "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 24 24' fill='%23231c36'><rect width='24' height='24' fill='%230e0b16'/><circle cx='12' cy='12' r='8' fill='%231a1528'/><circle cx='12' cy='12' r='3' fill='%230e0b16'/></svg>"
            }
            id="mini-cover"
            alt={currentTrack?.titulo || 'Sin reproducir'}
          />
          <div className="pulse-mini-info">
            <span className="pulse-mini-title" id="mini-title">
              {currentTrack?.titulo || 'No se está reproduciendo nada'}
            </span>
            <span className="pulse-mini-artist" id="mini-artist">
              {currentTrack?.artista || 'Elige una pista para comenzar'}
            </span>
          </div>
        </div>

        <div className="pulse-mini-controls">
          <button
            className="pulse-btn-icon"
            type="button"
            aria-label="Favorito"
            onClick={(e) => {
              e.stopPropagation();
              toggleLike();
            }}
          >
            <i
              className={`bi ${isFavorite ? 'bi-heart-fill' : 'bi-heart'}`}
              style={{ color: isFavorite ? 'var(--purple-accent)' : '' }}
            ></i>
          </button>
          <button
            className="pulse-btn-icon"
            type="button"
            aria-label="Reproducir"
            onClick={(e) => {
              e.stopPropagation();
              togglePlay();
            }}
          >
            <i className={`bi ${isPlaying ? 'bi-pause-fill' : 'bi-play-fill'}`}></i>
          </button>
        </div>

        <div className="pulse-mini-progress-bar">
          <div
            className="pulse-mini-progress-fill"
            id="mini-progress-fill"
            style={{ width: `${progressPercent}%` }}
          ></div>
        </div>
      </div>

      {/* 2. FULL PLAYER (Desktop y Pantalla Completa Móvil) */}
      <div
        className="pulse-full-player position-relative"
        id="sp-full-player"
        style={{ paddingBottom: '70px' }}
      >
        <div className="pulse-full-header">
          <button
            className="pulse-btn-icon"
            id="btn-close-fullscreen"
            type="button"
            aria-label="Minimizar"
            onClick={() => setIsFullscreen(false)}
          >
            <i className="bi bi-chevron-down fs-4"></i>
          </button>
          <div className="text-center text-truncate px-2">
            <span className="pulse-tag">REPRODUCIENDO EN PULSE</span>
            <span className="pulse-subtag d-block text-truncate" id="full-header-title">
              {currentTrack?.album || currentTrack?.titulo || 'En espera'}
            </span>
          </div>
          <button className="pulse-btn-icon" type="button">
            <i className="bi bi-three-dots-vertical fs-5"></i>
          </button>
        </div>

        <div className="pulse-full-cover-wrapper">
          <img
            src={
              currentTrack?.caratula ||
              "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='600' height='600' viewBox='0 0 24 24' fill='%23231c36'><rect width='24' height='24' fill='%230e0b16'/><circle cx='12' cy='12' r='9' fill='%231a1528'/><circle cx='12' cy='12' r='3' fill='%230e0b16'/><circle cx='12' cy='12' r='1' fill='%23b26bff'/></svg>"
            }
            id="current-cover"
            alt={currentTrack?.titulo || 'Sin reproducir'}
          />
        </div>

        <div className="pulse-full-info-row">
          <div className="pulse-full-meta text-truncate">
            <h4 className="pulse-full-title text-truncate mb-0" id="current-title">
              {currentTrack?.titulo || 'No hay música en reproducción'}
            </h4>
            <span className="pulse-full-artist text-truncate" id="current-artist">
              {currentTrack?.artista || 'Elige una canción para comenzar'}
            </span>
          </div>
          <button
            className="pulse-btn-icon"
            id="btn-favorite"
            type="button"
            aria-label="Favorito"
            onClick={() => toggleLike()}
          >
            <i
              className={`bi ${isFavorite ? 'bi-heart-fill' : 'bi-heart'} fs-4`}
              style={{ color: isFavorite ? 'var(--purple-accent)' : '' }}
            ></i>
          </button>
        </div>

        {/* Timeline */}
        <div className="pulse-full-timeline">
          <input
            type="range"
            className="form-range player-range w-100"
            id="playback-bar"
            min="0"
            max="100"
            value={progressPercent || 0}
            onChange={(e) => seek(Number(e.target.value))}
          />
          <div className="d-flex justify-content-between text-muted-pulse extra-small mt-1">
            <span id="time-current">{formatSeconds(currentTime)}</span>
            <span id="time-total">
              {formatSeconds(currentTrack?.duracionRealSegundos || duration || 0)}
            </span>
          </div>
        </div>

        {/* Controles Principales */}
        <div className="pulse-full-controls">
          <button className="pulse-btn-icon" id="btn-shuffle" type="button" aria-label="Aleatorio">
            <i className="bi bi-shuffle fs-5"></i>
          </button>
          <button
            className="pulse-btn-icon"
            id="btn-prev"
            type="button"
            aria-label="Anterior"
            onClick={prevTrack}
          >
            <i className="bi bi-skip-start-fill fs-2"></i>
          </button>
          <button
            className="pulse-btn-play-big"
            id="btn-play-main"
            type="button"
            aria-label="Play / Pausa"
            onClick={togglePlay}
          >
            <i
              className={`bi ${isPlaying ? 'bi-pause-fill' : 'bi-play-fill'} text-black`}
            ></i>
          </button>
          <button
            className="pulse-btn-icon"
            id="btn-next"
            type="button"
            aria-label="Siguiente"
            onClick={nextTrack}
          >
            <i className="bi bi-skip-end-fill fs-2"></i>
          </button>
          <button className="pulse-btn-icon" id="btn-repeat" type="button" aria-label="Repetir">
            <i className="bi bi-repeat fs-5"></i>
          </button>
        </div>

        {/* Control de Volumen */}
        <div className="pulse-full-volume-row">
          <button
            className="pulse-btn-icon"
            id="btn-volume-toggle"
            type="button"
            aria-label="Silenciar"
            onClick={toggleMute}
          >
            <i
              className={`bi ${
                isMuted || volume === 0
                  ? 'bi-volume-mute-fill'
                  : volume < 50
                  ? 'bi-volume-down-fill'
                  : 'bi-volume-up-fill'
              }`}
            ></i>
          </button>
          <input
            type="range"
            className="form-range player-range flex-grow-1"
            id="volume-bar"
            min="0"
            max="100"
            value={isMuted ? 0 : volume}
            onChange={(e) => changeVolume(Number(e.target.value))}
          />
        </div>

        {/* Cola de Reproducción */}
        <section className="queue-section border-top border-dark-subtle pt-3 mt-3 d-none d-lg-block">
          <span
            className="text-white fw-semibold extra-small d-block mb-2"
            style={{ letterSpacing: '0.5px' }}
          >
            SIGUIENTE EN COLA
          </span>
          <div className="d-flex flex-column gap-1" id="queue-list-container">
            {queueTracks.length === 0 ? (
              <p className="text-muted-pulse extra-small py-2 text-center">
                {playlist.length === 0 ? 'Fila vacía' : 'No hay más canciones'}
              </p>
            ) : (
              queueTracks.map((track, offset) => {
                const realIndex = queueStart + offset;
                return (
                  <div
                    key={track.id || realIndex}
                    className="d-flex align-items-center gap-2 p-1 cursor-pointer track-row"
                    style={{ borderRadius: '4px' }}
                    onClick={() => loadAndPlayTrack(realIndex)}
                  >
                    <img
                      src={track.caratulaMini}
                      width="32"
                      height="32"
                      className="object-fit-cover rounded-0"
                      alt={track.titulo}
                    />
                    <div className="overflow-hidden" style={{ lineHeight: 1.2, flexGrow: 1 }}>
                      <span className="d-block text-white extra-small fw-semibold text-truncate">
                        {track.titulo}
                      </span>
                      <span className="d-block text-muted-pulse" style={{ fontSize: '0.65rem' }}>
                        {track.artista}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </section>
      </div>
    </aside>
  );
}