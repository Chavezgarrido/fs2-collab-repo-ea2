import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { searchItunes } from '../services/itunesApi';
import { usePlayer } from '../context/PlayerContext';
import TrackRow from '../components/common/TrackRow';

export default function Podcasts() {
  const [episodes, setEpisodes] = useState([]);
  const [loading, setLoading] = useState(true);
  const { loadAndPlayTrack } = usePlayer();

  useEffect(() => {
    let isMounted = true;
    const fetchPodcasts = async () => {
      setLoading(true);
      const res = await searchItunes('Music Interview', 15);
      if (isMounted) {
        setEpisodes(res);
        setLoading(false);
      }
    };

    fetchPodcasts();
    return () => {
      isMounted = false;
    };
  }, []);

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
          background: 'linear-gradient(135deg, #121d2e 0%, #080d16 100%)',
          border: '1px solid #1c2536',
        }}
      >
        <h2 className="fw-bold display-6 mb-1">Podcasts y Charlas</h2>
        <p className="text-white-50 extra-small mb-0">Entrevistas exclusivas, historias de la música y programas especiales.</p>
      </section>

      <section className="mb-4">
        <h5 className="text-white fw-bold mb-3">Episodios Disponibles</h5>
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
              {loading ? (
                <tr>
                  <td colSpan="4" className="text-center py-4 text-muted-pulse">
                    Cargando programas de radio y podcasts...
                  </td>
                </tr>
              ) : (
                episodes.map((track, idx) => (
                  <TrackRow
                    key={track.id || idx}
                    track={track}
                    index={idx}
                    onPlay={() => loadAndPlayTrack(idx, episodes)}
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