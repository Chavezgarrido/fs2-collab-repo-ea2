import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!name.trim() || !email.trim() || !password || !confirmPassword) {
      setError('Por favor, completa todos los campos.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Ingresa un correo electrónico válido.');
      return;
    }

    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    try {
      register(name.trim(), email.trim(), password);
      navigate('/login');
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
          <p className="text-muted-pulse extra-small">Crea tu cuenta y empieza a escuchar música sin límites</p>
        </div>

        {error && (
          <div className="alert alert-danger py-2 small rounded-0" role="alert">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <div className="mb-3">
            <label className="form-label text-muted-pulse extra-small fw-bold text-uppercase">
              Nombre completo
            </label>
            <div className="input-group">
              <span className="input-group-text search-input border-end-0 text-muted-pulse rounded-0">
                <i className="bi bi-person"></i>
              </span>
              <input
                type="text"
                className="form-control search-input border-start-0 rounded-0"
                placeholder="Tu nombre"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          </div>

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

          <div className="mb-3">
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
                placeholder="Mínimo 6 caracteres"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="form-label text-muted-pulse extra-small fw-bold text-uppercase">
              Confirmar contraseña
            </label>
            <div className="input-group">
              <span className="input-group-text search-input border-end-0 text-muted-pulse rounded-0">
                <i className="bi bi-shield-check"></i>
              </span>
              <input
                type="password"
                className="form-control search-input border-start-0 rounded-0"
                placeholder="Repite tu contraseña"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button type="submit" className="btn text-white fw-bold w-100 py-2 btn-pulse-primary shadow-sm">
            Crear cuenta
          </button>
        </form>

        <div className="text-center mt-4">
          <span className="text-muted-pulse extra-small">
            ¿Ya tienes cuenta?{' '}
            <Link to="/login" className="text-white text-decoration-none fw-semibold">
              Inicia sesión
            </Link>
          </span>
        </div>
      </div>
    </div>
  );
}