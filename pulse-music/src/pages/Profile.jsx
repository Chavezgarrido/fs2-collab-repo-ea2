import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Profile() {
  const { user, isPremium, setPremiumStatus, logout } = useAuth();
  const [showCheckout, setShowCheckout] = useState(false);
  const navigate = useNavigate();

  const handleToggleSubscription = () => {
    if (isPremium) {
      if (
        window.confirm(
          '¿Estás seguro de que deseas cancelar tu suscripción Pulse Premium? Perderás el acceso al audio Lossless y descargas al finalizar el período actual.'
        )
      ) {
        setPremiumStatus(false);
        alert('Tu suscripción ha sido cancelada exitosamente.');
      }
    } else {
      setShowCheckout(true);
    }
  };

  const handleProcessPayment = (e) => {
    e.preventDefault();
    setPremiumStatus(true);
    setShowCheckout(false);
    alert('¡Pago procesado con éxito! Bienvenido a Pulse Premium.');
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      <div className="d-flex align-items-center justify-content-between mb-4">
        <h4 className="text-white fw-bold mb-0">Mi Cuenta</h4>
        <div className="d-flex gap-2">
          {user && (
            <button className="btn btn-outline-danger btn-sm rounded-0 px-3" onClick={handleLogout}>
              <i className="bi bi-box-arrow-right me-1"></i> Cerrar Sesión
            </button>
          )}
          <Link to="/" className="btn btn-outline-secondary text-white rounded-0 px-3 btn-sm">
            <i className="bi bi-arrow-left me-1"></i> Volver al Inicio
          </Link>
        </div>
      </div>

      {/* Tarjeta de Usuario */}
      <section
        className="p-4 mb-4 rounded-0 position-relative overflow-hidden text-white"
        style={{
          background: 'linear-gradient(135deg, #1d122e 0%, #0c0816 100%)',
          border: '1px solid #231c36',
        }}
      >
        <div className="d-flex flex-column flex-sm-row align-items-center gap-4">
          <div
            className="rounded-circle d-flex align-items-center justify-content-center fs-1 text-white fw-bold shadow flex-shrink-0"
            style={{ width: '80px', height: '80px', backgroundColor: 'var(--purple-accent)' }}
          >
            {(user?.name || 'U').charAt(0).toUpperCase()}
          </div>
          <div className="text-center text-sm-start flex-grow-1">
            <h2 className="fw-bold mb-1">{user?.name || 'Invitado de Pulse'}</h2>
            <p className="text-muted-pulse mb-2">{user?.email || 'Sin correo asociado'}</p>
            <div className="d-flex flex-wrap justify-content-center justify-content-sm-start align-items-center gap-2">
              <span
                className={`badge rounded-0 px-2 py-1 text-uppercase extra-small ${
                  isPremium ? 'bg-success' : 'bg-secondary'
                }`}
              >
                {isPremium ? '✨ Miembro Pulse Premium Activo' : 'Cuenta Pulse Free'}
              </span>
              <span className="text-muted-pulse extra-small">• Miembro desde Marzo 2026</span>
            </div>
          </div>
        </div>
      </section>

      {/* Planes de Membresía */}
      <section className="mb-5">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="text-white fw-bold mb-0">Planes y Membresías Pulse</h5>
          <span className="text-muted-pulse extra-small">Facturación segura en pesos chilenos (CLP)</span>
        </div>

        <div className="row row-cols-1 row-cols-md-2 g-3 mb-4">
          {/* Plan Free */}
          <div className="col">
            <div
              className="card h-100 bg-card border border-dark-subtle rounded-0 p-4 text-white"
              style={{ backgroundColor: 'var(--bg-card)' }}
            >
              <span className="text-uppercase fw-bold extra-small text-muted-pulse mb-1">
                Experiencia Estándar
              </span>
              <h4 className="fw-bold mb-2">Pulse Free</h4>
              <p className="text-muted-pulse extra-small mb-3">
                Disfruta de música con anuncios ocasionales y funciones esenciales.
              </p>
              <ul className="text-muted-pulse extra-small ps-3 mb-4 d-flex flex-column gap-2">
                <li>Reproducción con breves anuncios</li>
                <li>Calidad de sonido estándar (128 kbps)</li>
                <li>Saltos de pista limitados a 6 por hora</li>
                <li>Acceso completo a radios y podcasts</li>
              </ul>
              <h3 className="fw-bold mb-4">
                $0 <span className="fs-6 text-muted-pulse fw-normal">/ mes</span>
              </h3>
              <button className="btn btn-outline-light rounded-0 w-100 mt-auto" disabled={!isPremium}>
                {!isPremium ? 'Tu Plan Actual' : 'Cambiar a Free'}
              </button>
            </div>
          </div>

          {/* Plan Premium */}
          <div className="col">
            <div
              className="card h-100 bg-card border rounded-0 p-4 text-white"
              style={{
                backgroundColor: 'var(--bg-card)',
                borderColor: 'var(--purple-accent)',
              }}
            >
              <span className="text-uppercase fw-bold extra-small mb-1" style={{ color: 'var(--purple-accent)' }}>
                Máxima Calidad Sin Límites
              </span>
              <h4 className="fw-bold mb-2">Pulse Premium</h4>
              <p className="text-white-50 extra-small mb-3">
                Música en alta fidelidad sin interrupciones y descargas ilimitadas.
              </p>
              <ul className="text-white-50 extra-small ps-3 mb-4 d-flex flex-column gap-2">
                <li><strong className="text-white">Cero anuncios</strong> musicales o comerciales</li>
                <li><strong className="text-white">Audio Lossless</strong> de alta fidelidad</li>
                <li><strong className="text-white">Descargas offline</strong> ilimitadas en tus dispositivos</li>
                <li><strong className="text-white">Saltos infinitos</strong> y reproducción libre</li>
                {isPremium && <li className="text-success">Renovación automática activa</li>}
              </ul>
              <h3 className="fw-bold mb-4">
                $4.990 <span className="fs-6 text-muted-pulse fw-normal">/ mes</span>
              </h3>
              <button
                className="btn text-white fw-bold rounded-0 w-100 mt-auto"
                style={{ backgroundColor: 'var(--purple-accent)' }}
                onClick={handleToggleSubscription}
              >
                {isPremium ? 'Administrar o Cancelar Suscripción' : 'Suscribirme a Pulse Premium'}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Pasarela de Pago */}
      {showCheckout && (
        <div
          className="p-4 rounded-0 mb-5 text-white"
          style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--purple-accent)' }}
        >
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5 className="fw-bold mb-0">
              <i className="bi bi-shield-lock-fill me-2" style={{ color: 'var(--purple-accent)' }}></i>
              Pasarela de Pago Segura - Pulse Premium
            </h5>
            <button className="btn btn-sm btn-outline-secondary text-white rounded-0" onClick={() => setShowCheckout(false)}>
              <i className="bi bi-x-lg"></i>
            </button>
          </div>

          <form onSubmit={handleProcessPayment}>
            <div className="row g-3 mb-4">
              <div className="col-md-6">
                <label className="p-3 border border-secondary cursor-pointer d-flex align-items-center gap-3 w-100 h-100">
                  <input type="radio" name="payment-method" defaultChecked />
                  <div>
                    <span className="d-block fw-bold text-white">Tarjeta de Crédito / Débito</span>
                    <span className="text-muted-pulse extra-small">Visa, Mastercard, Redcompra</span>
                  </div>
                </label>
              </div>
              <div className="col-md-6">
                <label className="p-3 border border-secondary cursor-pointer d-flex align-items-center gap-3 w-100 h-100">
                  <input type="radio" name="payment-method" />
                  <div>
                    <span className="d-block fw-bold text-white">Mercado Pago / PayPal</span>
                    <span className="text-muted-pulse extra-small">Pago rápido y seguro online</span>
                  </div>
                </label>
              </div>
            </div>

            <div className="mb-3">
              <label className="form-label text-muted-pulse extra-small">Número de Tarjeta (Simulado)</label>
              <input type="text" className="form-control search-input rounded-0" defaultValue="4532 8810 9921 4410" required />
            </div>
            <div className="row g-2 mb-4">
              <div className="col-6">
                <label className="form-label text-muted-pulse extra-small">Expiración</label>
                <input type="text" className="form-control search-input rounded-0" defaultValue="08/28" required />
              </div>
              <div className="col-6">
                <label className="form-label text-muted-pulse extra-small">CVV</label>
                <input type="password" className="form-control search-input rounded-0" defaultValue="382" required />
              </div>
            </div>

            <button
              type="submit"
              className="btn text-white fw-bold rounded-0 w-100 py-2.5"
              style={{ backgroundColor: 'var(--purple-accent)' }}
            >
              Autorizar Cobro de $4.990 / mes e Iniciar Suscripción
            </button>
          </form>
        </div>
      )}
    </>
  );
}