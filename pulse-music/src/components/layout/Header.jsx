import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function Header() {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      const q = query.trim();
      if (q.length > 0) {
        navigate(`/search?q=${encodeURIComponent(q)}`);
      }
    }
  };

  return (
    <header className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-4">
      <div className="input-group" style={{ maxWidth: '460px', flexGrow: 1 }}>
        <span className="input-group-text search-input border-end-0 text-muted-pulse rounded-0">
          <i className="bi bi-search"></i>
        </span>
        <input
          type="text"
          className="form-control search-input border-start-0 rounded-0"
          placeholder="Buscar canciones o artistas..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
        />
      </div>

      <div className="d-flex align-items-center gap-2">
        {user ? (
          <Link
            to="/profile"
            className="d-flex align-items-center gap-2 px-3 py-1 rounded-0 border border-dark-subtle text-decoration-none"
            style={{ backgroundColor: 'var(--bg-card)' }}
            title="Ver Perfil y Suscripción"
          >
            <i className="bi bi-person-circle fs-5" style={{ color: 'var(--purple-accent)' }}></i>
            <span className="text-white extra-small fw-semibold text-truncate" style={{ maxWidth: '140px' }}>
              Hola, {user.name}
            </span>
          </Link>
        ) : (
          <Link
            to="/login"
            className="btn btn-outline-secondary text-white btn-sm rounded-0 px-3 extra-small fw-semibold"
          >
            <i className="bi bi-box-arrow-in-right me-1"></i> Entrar
          </Link>
        )}
      </div>
    </header>
  );
}