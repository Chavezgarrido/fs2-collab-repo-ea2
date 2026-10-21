import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const active = localStorage.getItem('pulse_active_user');
      return active ? JSON.parse(active) : null;
    } catch {
      return null;
    }
  });

  const [isPremium, setIsPremium] = useState(() => {
    return localStorage.getItem('pulse_premium') === 'true';
  });

  const login = (email, password) => {
    const users = JSON.parse(localStorage.getItem('pulse_users') || '[]');
    const found = users.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );

    if (!found) {
      throw new Error('Correo electrónico o contraseña incorrectos.');
    }

    const userData = { name: found.name, email: found.email };
    localStorage.setItem('pulse_logged', 'true');
    localStorage.setItem('pulse_active_user', JSON.stringify(userData));
    setUser(userData);
  };

  const register = (name, email, password) => {
    const users = JSON.parse(localStorage.getItem('pulse_users') || '[]');
    const exists = users.some((u) => u.email.toLowerCase() === email.toLowerCase());

    if (exists) {
      throw new Error('Este correo electrónico ya está registrado.');
    }

    const newUser = { name, email, password };
    users.push(newUser);
    localStorage.setItem('pulse_users', JSON.stringify(users));
  };

  const logout = () => {
    localStorage.removeItem('pulse_logged');
    localStorage.removeItem('pulse_active_user');
    setUser(null);
  };

  const setPremiumStatus = (status) => {
    localStorage.setItem('pulse_premium', String(status));
    setIsPremium(status);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isPremium,
        login,
        register,
        logout,
        setPremiumStatus,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth debe usarse dentro de un AuthProvider');
  return context;
};