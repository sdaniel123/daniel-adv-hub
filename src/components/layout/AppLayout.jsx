'use client';

import React, { useState, useEffect } from 'react';
import TopNavbar from './TopNavbar';
import SidebarDrawer from './SidebarDrawer';

export default function AppLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setIsDarkMode(true);
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      setIsDarkMode(false);
      document.documentElement.removeAttribute('data-theme');
    }
  }, []);

  const handleToggleTheme = () => {
    const nextDark = !isDarkMode;
    setIsDarkMode(nextDark);
    if (nextDark) {
      document.documentElement.setAttribute('data-theme', 'dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
      localStorage.setItem('theme', 'light');
    }
  };

  const handleLogout = () => {
    alert('Sessão encerrada com sucesso.');
  };

  return (
    <div>
      <TopNavbar
        onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)}
        isDarkMode={isDarkMode}
        onToggleTheme={handleToggleTheme}
        onOpenProfile={() => setShowProfileModal(true)}
      />

      <SidebarDrawer
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        onLogout={handleLogout}
      />

      <main className="main-content-wrapper">
        {children}
      </main>

      {showProfileModal && (
        <div
          className="sidebar-overlay open"
          onClick={() => setShowProfileModal(false)}
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <div
            className="card-popup"
            onClick={(e) => e.stopPropagation()}
            style={{ width: '90%', maxWidth: '420px', margin: 0, textAlign: 'center' }}
          >
            <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'center' }}>
              <img
                src="/images/logo-monogram.png"
                alt="Símbolo Daniel Simões Advocacia"
                style={{
                  height: '64px',
                  width: 'auto',
                  filter: isDarkMode ? 'brightness(0) invert(1)' : 'none',
                  objectFit: 'contain'
                }}
              />
            </div>

            <h2 style={{ fontFamily: 'var(--font-raleway)', marginBottom: '4px', fontWeight: 800 }}>
              Daniel Simões
            </h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--color-success)', fontWeight: 700, textTransform: 'uppercase', marginBottom: '16px' }}>
              Advocacia & Consultoria
            </p>

            <div style={{ textAlign: 'left', borderTop: '1px solid var(--card-border)', paddingTop: '14px', marginBottom: '20px' }}>
              <p style={{ marginBottom: '8px', fontSize: '0.9rem' }}>
                <strong>Advogado Titular:</strong> Dr. Daniel Simões
              </p>
              <p style={{ fontSize: '0.9rem' }}>
                <strong>OAB:</strong> 000.000/UF
              </p>
            </div>

            <button
              type="button"
              className="logout-btn"
              onClick={() => setShowProfileModal(false)}
              style={{ backgroundColor: 'var(--color-black)', color: 'var(--color-white)' }}
            >
              Fechar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
