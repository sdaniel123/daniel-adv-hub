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
            style={{ width: '90%', maxWidth: '400px', margin: 0 }}
          >
            <h2 style={{ fontFamily: 'var(--font-raleway)', marginBottom: '16px' }}>
              Perfil do Usuário
            </h2>
            <p style={{ marginBottom: '12px', fontSize: '0.95rem' }}>
              <strong>Advogado:</strong> Dr. Daniel
            </p>
            <p style={{ marginBottom: '20px', fontSize: '0.95rem' }}>
              <strong>OAB:</strong> 000.000/UF
            </p>
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
