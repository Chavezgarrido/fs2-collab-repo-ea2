import React, { useEffect, useState } from 'react';
import { usePlayer } from '../context/PlayerContext';
import { searchItunes } from '../services/itunesApi';
import TrackRow from '../components/common/TrackRow';

const QUICK_CARDS = [
  {
    title: 'Classic Rock',
    img: 'https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?auto=format&fit=crop&w=120&q=80',
    term: 'Classic Rock',
  },
  {
    title: 'Pop Hits',
    img: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=120&q=80',
    term: 'Pop Hits',
  },
  {
    title: 'Pop Rock',
    img: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=120&q=80',
    term: 'Pop Rock',
  },
];

const GENRES = [
  {
    title: 'Rock Clásico',
    subtitle: 'Queen, AC/DC & más',
    img: 'https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?auto=format&fit=crop&w=400&q=80',
    term: 'Classic Rock',
  },
  {
    title: 'Pop Hits',
    subtitle: 'Los temas más sonados',
    img: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=400&q=80',
    term: 'Pop Hits',
  },
  {
    title: 'Pop Rock Anthems',
    subtitle: 'Guitarras & melodías',
    img: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=400&q=80',
    term: 'Pop Rock',
  },
  {
    title: '80s Smash Hits',
    subtitle: 'Sintetizadores y energía',
    img: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=400&q=80',
    term: '80s Smash Hits',
  },
];

export default function Home() {
  const { playlist, loadAndPlayTrack } = usePlayer();
  const [loading, setLoading] = useState(false);

  // Carga inicial equivalente a cargarGenero('Billboard Hot 100', 15, false)
  useEffect(() => {
    let isMounted = true;
    const fetchInitial = async () => {
      setLoading(true);
      const tracks = await searchItunes('Billboard Hot 100', 15);
      if (isMounted) {
        if (tracks.length > 0) {
          loadAndPlayTrack(0, tracks);
        }
        setLoading(false);
      }
    };

    if (playlist.length === 0) {
      fetchInitial();
    }
    return () => {
      isMounted = false;
    };
  }, []);

  const handleSelectGenre = async (term) => {
    setLoading(true);
    const tracks = await searchItunes(term, 15);
    if (tracks.length > 0) {
      loadAndPlayTrack(0, tracks);
    }
    setLoading(false);
  };

  return (
    <>
      {/* Hero Banner */}
      <section
        className="p-4 mb-4 rounded-0 position-relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #1d122e 0%, #0c0816 100%)',
          border: '1px solid #231c36',
        }}
      >
        <span
          className="text-uppercase fw-bold extra-small text-muted-pulse mb-1 d-block"
          style={{ letterSpacing: '1px' }}
        >
          Álbum Recomendado
        </span>
        <h2 className="text-white fw-bold display-6 mb-1">Pop Rock Essentials</h2>
        <p className="text-white-50 mb-3" style={{ maxWidth: '540px' }}>
          Riffs electrizantes, ganchos pop inolvidables y las bandas que llenaron estadios.
        </p>
        <div className="d-flex align-items-center gap-3">
          <button
            className="btn text-white fw-bold px-4 py-2 rounded-0 d-flex align-items-center gap-2"
            style={{ backgroundColor: 'var(--purple-accent)' }}
            onClick={() => handleSelectGenre('Pop Rock Essentials')}
          >
            <i className="bi bi-play-fill fs-5"></i> Reproducir Selección
          </button>
        </div>
      </section>

      {/* Quick Cards */}
      <section className="mb-4">
        <div className="row row-cols-1 row-cols-md-3 g-2">
          {QUICK_CARDS.map((card) => (
            <div key={card.title} className="col">
              <div
                className="quick-card d-flex align-items-center p-2 rounded-0 cursor-pointer"
                onClick={() => handleSelectGenre(card.term)}
              >
                <img
                  src={card.img}
                  className="me-3 object-fit-cover"
                  width="48"
                  height="48"
                  alt={card.title}
                />
                <span className="text-white fw-semibold text-truncate">{card.title}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Grid de Géneros */}
      <section className="mb-5">
        <header className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="text-white fw-bold mb-0">Tus géneros favoritos</h5>
        </header>
        <div className="row row-cols-1 row-cols-sm-2 row-cols-md-4 g-3">
          {GENRES.map((g) => (
            <div key={g.title} className="col">
              <div
                className="song-card h-100 position-relative cursor-pointer"
                onClick={() => handleSelectGenre(g.term)}
              >
                <img src={g.img} className="img-fluid mb-2 w-100 object-fit-cover" alt={g.title} />
                <span className="play-btn-overlay">
                  <i className="bi bi-play-fill fs-5"></i>
                </span>
                <h6 className="text-white fw-bold mb-0 text-truncate">{g.title}</h6>
                <span className="text-muted-pulse extra-small">{g.subtitle}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Tabla de Canciones */}
      <section className="mb-4">
        <header className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="text-white fw-bold mb-0">Pistas disponibles</h5>
        </header>
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
                    Cargando canciones...
                  </td>
                </tr>
              ) : playlist.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-center py-4 text-muted-pulse">
                    No hay pistas cargadas.
                  </td>
                </tr>
              ) : (
                playlist.map((track, idx) => (
                  <TrackRow
                    key={track.id || idx}
                    track={track}
                    index={idx}
                    onPlay={() => loadAndPlayTrack(idx)}
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