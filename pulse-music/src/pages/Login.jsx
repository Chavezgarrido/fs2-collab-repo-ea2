import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password) {
      setError('Por favor, completa todos los campos.');
      return;
    }

    try {
      login(email, password);
      navigate('/');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="bg-black text-white vh-100 d-flex align-items-center justify-content-center m-0 p-3">
      <div className="auth-card">
        <div className="text-center mb-4">
          <div
            className="rounded-0 p-2 d-inline-flex align-items-center justify-content-center mb-3 shadow"
            style={{ backgroundColor: 'var(--purple-accent)', width: 48, height: 48 }}
          >
            <i className="bi bi-activity text-white fs-4"></i>
          </div>
          <h1 className="fw-bold fs-3 text-white mb-1" style={{ letterSpacing: '0.05rem' }}>
            Pulse
          </h1>
          <p className="text-muted-pulse extra-small">Inicia sesión para disfrutar de tu música</p>
        </div>

        {error && (
          <div className="alert alert-danger py-2 small rounded-0" role="alert">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label text-muted-pulse extra-small fw-bold text-uppercase">
              Correo electrónico
            </label>
            <div className="input-group">
              <span className="input-group-text search-input border-end-0 text-muted-pulse rounded-0">
                <i className="bi bi-envelope"></i>
              </span>
              <input
                type="email"
                className="form-control search-input border-start-0 rounded-0"
                placeholder="nombre@ejemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="form-label text-muted-pulse extra-small fw-bold text-uppercase">
              Contraseña
            </label>
            <div className="input-group">
              <span className="input-group-text search-input border-end-0 text-muted-pulse rounded-0">
                <i className="bi bi-lock"></i>
              </span>
              <input
                type="password"
                className="form-control search-input border-start-0 rounded-0"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button type="submit" className="btn text-white fw-bold w-100 py-2 btn-pulse-primary shadow-sm">
            Entrar a Pulse
          </button>
        </form>

        <div className="text-center mt-4">
          <span className="text-muted-pulse extra-small">
            ¿No tienes cuenta?{' '}
            <Link to="/register" className="text-white text-decoration-none fw-semibold">
              Regístrate gratis
            </Link>
          </span>
        </div>
      </div>
    </div>
  );
}