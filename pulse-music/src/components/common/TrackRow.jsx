import React from 'react';
import { usePlayer } from '../../context/PlayerContext';
import { formatSeconds } from '../../services/itunesApi';

export default function TrackRow({ track, index, onPlay }) {
  const { currentTrack, isPlaying } = usePlayer();
  const isCurrent = currentTrack && currentTrack.id === track.id;

  return (
    <tr className="track-row cursor-pointer" onClick={onPlay}>
      <td className="text-muted-pulse" style={{ width: '40px' }}>
        {isCurrent && isPlaying ? (
          <i className="bi bi-volume-up-fill text-pulse-accent"></i>
        ) : (
          index + 1
        )}
      </td>
      <td>
        <div className="d-flex align-items-center gap-2">
          <img
            src={track.caratulaMini}
            width="36"
            height="36"
            className="object-fit-cover rounded-0"
            alt={track.titulo}
          />
          <div className="text-truncate" style={{ maxWidth: '220px' }}>
            <span
              className={`d-block fw-semibold text-truncate track-title ${
                isCurrent ? 'text-pulse-accent' : 'text-white'
              }`}
            >
              {track.titulo}
            </span>
            <span className="d-block text-muted-pulse extra-small text-truncate">
              {track.artista}
            </span>
          </div>
        </div>
      </td>
      <td
        className="text-muted-pulse text-truncate d-none d-sm-table-cell"
        style={{ maxWidth: '180px' }}
      >
        {track.album}
      </td>
      <td className="text-end text-muted-pulse extra-small" style={{ width: '80px' }}>
        {formatSeconds(track.duracionRealSegundos)}
      </td>
    </tr>
  );
}