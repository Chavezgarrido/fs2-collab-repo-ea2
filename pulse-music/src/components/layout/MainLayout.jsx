import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import Player from '../player/Player';

export default function MainLayout() {
  return (
    <div className="vh-100 bg-black p-0 overflow-hidden d-flex">
      {/* Columna 1: Sidebar */}
      <div id="aside-container" className="h-100" style={{ width: '250px', flexShrink: 0 }}>
        <Sidebar />
      </div>

      {/* Columna 2: Contenido Central */}
      <main className="flex-grow-1 h-100 p-4 overflow-y-auto">
        <Header />
        <Outlet />
      </main>

      {/* Columna 3: Reproductor */}
      <div id="player-test-container" className="h-100" style={{ width: '320px', flexShrink: 0 }}>
        <Player />
      </div>
    </div>
  );
}