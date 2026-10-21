import React from 'react';
import { Link } from 'react-router-dom';
import { usePlayer } from '../context/PlayerContext';
import TrackRow from '../components/common/TrackRow';

export default function Library() {
  const { likedSongs, loadAndPlayTrack } = usePlayer();

  return (
    <>
      <div className="d-flex align-items-center justify-content-end mb-4">
        <Link to="/" className="btn btn-outline-secondary text-white rounded-0 px-3 btn-sm">
          <i className="bi bi-arrow-left me-1"></i> Volver al Inicio
        </Link>
      </div>

      <section
        className="p-4 mb-4 rounded-0 position-relative overflow-hidden text-white"
        style={{
          background: 'linear-gradient(135deg, #2e122b 0%, #160815 100%)',
          border: '1px solid #361c32',
        }}
      >
        <h2 className="fw-bold display-6 mb-1">Tus Me Gusta</h2>
        <span className="text-muted-pulse extra-small">{likedSongs.length} canciones guardadas</span>
      </section>

      <section className="mb-4">
        <div className="table-responsive">
          <table
            className="table table-dark table-borderless align-middle mb-0"
            style={{ backgroundColor: 'transparent' }}
          >
            <thead>
              <tr className="text-muted-pulse extra-small border-bottom border-dark-subtle">
                <th scope="col" style={{ width: '40px' }}>#</th>
                <th scope="col">TÍTULO</th>
                <th scope="col" className="d-none d-sm-table-cell">ÁLBUM</th>
                <th scope="col" className="text-end" style={{ width: '80px' }}>
                  <i className="bi bi-clock"></i>
                </th>
              </tr>
            </thead>
            <tbody>
              {likedSongs.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-center py-5 text-muted-pulse">
                    Aún no tienes canciones en "Tus Me Gusta". Haz clic en el corazón mientras escuchas una pista para guardarla aquí.
                  </td>
                </tr>
              ) : (
                likedSongs.map((track, idx) => (
                  <TrackRow
                    key={track.id || idx}
                    track={track}
                    index={idx}
                    onPlay={() => loadAndPlayTrack(idx, likedSongs)}
                  />
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}