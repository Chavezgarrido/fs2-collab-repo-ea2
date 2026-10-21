import React from 'react';
import { NavLink } from 'react-router-dom';
import { usePlayer } from '../../context/PlayerContext';
import { searchItunes } from '../../services/itunesApi';

export default function Sidebar() {
  const { loadAndPlayTrack } = usePlayer();

  const handlePlaylistClick = async (genre) => {
    const tracks = await searchItunes(genre, 15);
    if (tracks.length > 0) {
      loadAndPlayTrack(0, tracks);
    }
  };

  return (
    <aside className="w-100 h-100 border-end border-dark-subtle d-flex flex-column justify-content-between p-3 bg-pulse-sidebar overflow-hidden">
      <div className="d-flex flex-column gap-3 overflow-y-auto pe-1">
        <div className="d-flex align-items-center gap-2 mb-2">
          <span
            className="badge rounded-0 p-2 d-flex align-items-center justify-content-center"
            style={{ backgroundColor: 'var(--purple-accent)', width: '32px', height: '32px' }}
          >
            <i className="bi bi-activity text-white fs-6"></i>
          </span>
          <span className="fw-bold fs-5 text-white tracking-wide">Pulse</span>
        </div>

        <nav>
          <ul className="nav flex-column gap-1">
            <li>
              <NavLink
                to="/"
                end
                className={({ isActive }) =>
                  `nav-link nav-link-pulse d-flex align-items-center gap-3 ${isActive ? 'active' : ''}`
                }
              >
                <i className="bi bi-house-door-fill fs-5"></i> Inicio
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/search?q=Rock+Alternativo"
                className={({ isActive }) =>
                  `nav-link nav-link-pulse d-flex align-items-center gap-3 ${isActive ? 'active' : ''}`
                }
              >
                <i className="bi bi-compass fs-5"></i> Explorar
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/podcasts"
                className={({ isActive }) =>
                  `nav-link nav-link-pulse d-flex align-items-center gap-3 ${isActive ? 'active' : ''}`
                }
              >
                <i className="bi bi-broadcast fs-5"></i> Radio
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/library"
                className={({ isActive }) =>
                  `nav-link nav-link-pulse d-flex align-items-center gap-3 ${isActive ? 'active' : ''}`
                }
              >
                <i className="bi bi-collection-play fs-5"></i> Tu biblioteca
              </NavLink>
            </li>
          </ul>
        </nav>

        <div className="mt-2">
          <div className="d-flex justify-content-between align-items-center text-muted-pulse mb-2">
            <span className="sidebar-heading">TU BIBLIOTECA</span>
            <i className="bi bi-plus-lg fs-6 cursor-pointer"></i>
          </div>
          <ul className="list-unstyled d-flex flex-column gap-2 text-muted-pulse ps-1 mb-0">
            <li>
              <NavLink
                to="/library"
                className="d-flex align-items-center gap-3 sidebar-item text-decoration-none"
              >
                <i className="bi bi-heart"></i> Tus Me Gusta
              </NavLink>
            </li>
            <li className="d-flex align-items-center gap-3 sidebar-item">
              <i className="bi bi-text-paragraph"></i> Playlists
            </li>
            <li className="d-flex align-items-center gap-3 sidebar-item">
              <i className="bi bi-disc"></i> Álbumes
            </li>
            <li className="d-flex align-items-center gap-3 sidebar-item">
              <i className="bi bi-person"></i> Artistas
            </li>
            <li className="d-flex align-items-center gap-3 sidebar-item">
              <i className="bi bi-download"></i> Descargas
            </li>
          </ul>
        </div>

        <div className="mt-2">
          <div className="d-flex justify-content-between align-items-center text-muted-pulse mb-2">
            <span className="sidebar-heading">PLAYLISTS</span>
          </div>
          <ul className="list-unstyled d-flex flex-column gap-3 ps-1 mb-0">
            <li
              className="sidebar-playlist-item cursor-pointer"
              onClick={() => handlePlaylistClick('Classic Rock Legends')}
            >
              <span className="text-white fw-semibold d-block text-truncate">Classic Rock Legends</span>
              <span className="text-muted-pulse extra-small d-block">85 canciones</span>
            </li>
            <li
              className="sidebar-playlist-item cursor-pointer"
              onClick={() => handlePlaylistClick('Pop Hits Definitive')}
            >
              <span className="text-white-50 d-block text-truncate">Pop Hits Definitive</span>
              <span className="text-muted-pulse extra-small d-block">110 canciones</span>
            </li>
            <li
              className="sidebar-playlist-item cursor-pointer"
              onClick={() => handlePlaylistClick('Pop Rock Anthems')}
            >
              <span className="text-white-50 d-block text-truncate">Pop Rock Anthems</span>
              <span className="text-muted-pulse extra-small d-block">64 canciones</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="pt-3 border-top border-dark-subtle mt-auto">
        <button className="btn btn-link text-decoration-none text-white p-0 d-flex align-items-center gap-2 sidebar-item w-100">
          <span
            className="border border-secondary rounded-0 d-flex align-items-center justify-content-center"
            style={{ width: '26px', height: '26px' }}
          >
            <i className="bi bi-plus text-white fs-6"></i>
          </span>
          <span className="fw-semibold" style={{ fontSize: '0.8rem' }}>
            Nueva playlist
          </span>
        </button>
      </div>
    </aside>
  );
}