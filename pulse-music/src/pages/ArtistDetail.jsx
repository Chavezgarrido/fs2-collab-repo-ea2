import React, { useEffect, useState } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import { searchSongsByArtist, searchItunes } from '../services/itunesApi';
import { usePlayer } from '../context/PlayerContext';
import TrackRow from '../components/common/TrackRow';

export default function ArtistDetail() {
  const { name } = useParams();
  const location = useLocation();
  const { loadAndPlayTrack } = usePlayer();

  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(true);

  const initialPhoto = location.state?.photo || '';
  const initialGenre = location.state?.genre || 'Banda / Artista';

  useEffect(() => {
    let isMounted = true;
    const fetchArtistData = async () => {
      setLoading(true);
      let res = await searchSongsByArtist(name, 35);
      if (!res || res.length === 0) {
        res = await searchItunes(name, 25);
      }
      if (isMounted) {
        setTracks(res);
        setLoading(false);
      }
    };

    fetchArtistData();
    return () => {
      isMounted = false;
    };
  }, [name]);

  const bannerPhoto = initialPhoto || (tracks[0] ? tracks[0].caratula : '');

  return (
    <>
      <div className="d-flex align-items-center justify-content-end mb-4">
        <Link to="/" className="btn btn-outline-secondary text-white rounded-0 px-3 btn-sm">
          <i className="bi bi-arrow-left me-1"></i> Volver al Inicio
        </Link>
      </div>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-light mb-3" role="status"></div>
          <p className="text-muted-pulse">Filtrando discografía de {name}...</p>
        </div>
      ) : (
        <>
          {/* Banner del Artista */}
          <section
            className="p-3 p-md-4 mb-4 rounded-0 d-flex flex-column flex-sm-row align-items-center gap-3 gap-md-4"
            style={{
              background: 'linear-gradient(135deg, #1d122e 0%, #0c0816 100%)',
              border: '1px solid #231c36',
            }}
          >
            {bannerPhoto && (
              <img
                src={bannerPhoto}
                className="rounded-circle object-fit-cover shadow-lg border border-secondary flex-shrink-0"
                style={{ width: '120px', height: '120px' }}
                alt={name}
              />
            )}
            <div className="text-center text-sm-start">
              <span className="text-uppercase fw-bold extra-small text-muted-pulse mb-1 d-block">
                Banda / Artista Verificado
              </span>
              <h1 className="text-white fw-bold fs-2 fs-md-1 mb-2">{name}</h1>
              <p className="text-muted-pulse extra-small mb-3 text-uppercase">
                {initialGenre} • {tracks.length} temas disponibles
              </p>
              <button
                className="btn text-white fw-bold px-4 py-2 rounded-0 d-inline-flex align-items-center gap-2"
                style={{ backgroundColor: 'var(--purple-accent)' }}
                onClick={() => {
                  if (tracks.length > 0) loadAndPlayTrack(0, tracks);
                }}
              >
                <i className="bi bi-play-fill fs-5"></i> Reproducir Todo
              </button>
            </div>
          </section>

          {/* Tabla de temas */}
          <section className="mb-4">
            <h5 className="text-white fw-bold mb-3">Canciones de {name}</h5>
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
                  {tracks.map((track, idx) => (
                    <TrackRow
                      key={track.id || idx}
                      track={track}
                      index={idx}
                      onPlay={() => loadAndPlayTrack(idx, tracks)}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </>
      )}
    </>
  );
}