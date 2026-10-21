import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { searchGlobalData } from '../services/itunesApi';
import { usePlayer } from '../context/PlayerContext';
import TrackRow from '../components/common/TrackRow';

export default function Search() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const navigate = useNavigate();
  const { loadAndPlayTrack } = usePlayer();

  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);

  useEffect(() => {
    let isMounted = true;
    if (!query.trim()) return;

    const fetchResults = async () => {
      setLoading(true);
      const res = await searchGlobalData(query);
      if (isMounted) {
        setData(res);
        setLoading(false);
      }
    };

    fetchResults();
    return () => {
      isMounted = false;
    };
  }, [query]);

  const handlePlaySong = (index) => {
    if (data?.canciones?.length > 0) {
      loadAndPlayTrack(index, data.canciones);
    }
  };

  const handleSelectArtist = (artist) => {
    navigate(`/artist/${encodeURIComponent(artist.nombre)}`, {
      state: { photo: artist.foto, genre: artist.genero }
    });
  };

  return (
    <>
      <div className="d-flex align-items-center justify-content-between mb-4">
        <div>
          <span className="text-uppercase fw-bold extra-small text-muted-pulse mb-1 d-block" style={{ letterSpacing: '1px' }}>
            Explorador
          </span>
          <h3 className="text-white fw-bold fs-4 fs-md-3">Resultados para "{query}"</h3>
        </div>
        <Link to="/" className="btn btn-outline-secondary text-white rounded-0 px-3 btn-sm">
          <i className="bi bi-arrow-left me-1"></i> Volver al Inicio
        </Link>
      </div>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-light mb-3" role="status"></div>
          <p className="text-muted-pulse">Buscando resultados para "{query}"...</p>
        </div>
      ) : !data || data.canciones.length === 0 ? (
        <div className="d-flex flex-column align-items-center justify-content-center py-5 text-center my-5">
          <h4 className="text-white fw-bold mb-2">No se encontraron resultados para "{query}"</h4>
          <p className="text-muted-pulse extra-small">Intenta con otro término o nombre de banda.</p>
        </div>
      ) : (
        <>
          {/* Bloque Artistas */}
          {data.artistas.length > 0 && (
            <section className="mb-4 mb-md-5">
              <h5 className="text-white fw-bold mb-3">Bandas y Artistas</h5>
              <div className="row row-cols-2 row-cols-sm-3 row-cols-md-4 g-2 g-md-3">
                {data.artistas.map((art) => (
                  <div key={art.nombre} className="col">
                    <div
                      className="song-card h-100 p-3 cursor-pointer"
                      onClick={() => handleSelectArtist(art)}
                    >
                      <img
                        src={art.foto}
                        className="img-fluid rounded-circle mb-2 mx-auto d-block object-fit-cover shadow"
                        style={{ width: '90px', height: '90px' }}
                        alt={art.nombre}
                      />
                      <h6 className="text-white fw-bold mb-1 text-center text-truncate">{art.nombre}</h6>
                      <span className="text-muted-pulse extra-small d-block text-center text-uppercase">
                        {art.genero}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Bloque Canciones */}
          <section className="mb-4 mb-md-5">
            <h5 className="text-white fw-bold mb-3">Canciones</h5>
            <div className="table-responsive">
              <table className="table table-dark table-borderless align-middle mb-0" style={{ backgroundColor: 'transparent' }}>
                <thead>
                  <tr className="text-muted-pulse extra-small border-bottom border-dark-subtle">
                    <th scope="col" style={{ width: '40px' }}>#</th>
                    <th scope="col">TÍTULO</th>
                    <th scope="col" className="d-none d-sm-table-cell">ÁLBUM</th>
                    <th scope="col" className="text-end" style={{ width: '80px' }}><i className="bi bi-clock"></i></th>
                  </tr>
                </thead>
                <tbody>
                  {data.canciones.map((track, idx) => (
                    <TrackRow
                      key={track.id || idx}
                      track={track}
                      index={idx}
                      onPlay={() => handlePlaySong(idx)}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Bloque Álbumes */}
          {data.albumes.length > 0 && (
            <section className="mb-4">
              <h5 className="text-white fw-bold mb-3">Álbumes y Compilaciones</h5>
              <div className="row row-cols-2 row-cols-md-4 g-2 g-md-3">
                {data.albumes.map((alb) => (
                  <div key={alb.titulo} className="col">
                    <div
                      className="song-card h-100 position-relative cursor-pointer"
                      onClick={() => {
                        navigate(`/search?q=${encodeURIComponent(alb.titulo)}`);
                      }}
                    >
                      <img src={alb.caratula} className="img-fluid mb-2 w-100 object-fit-cover" alt={alb.titulo} />
                      <span className="play-btn-overlay">
                        <i className="bi bi-play-fill fs-5"></i>
                      </span>
                      <h6 className="text-white fw-bold mb-0 text-truncate">{alb.titulo}</h6>
                      <span className="text-muted-pulse extra-small d-block text-truncate">{alb.artista}</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </>
      )}
    </>
  );
}