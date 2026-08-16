'use client';

import React from 'react';
import Link from 'next/link';
import { Menu, Search, Bell, Settings, Moon, Sun, User } from 'lucide-react';

export default function TopNavbar({ onToggleSidebar, isDarkMode, onToggleTheme, onOpenProfile }) {
  return (
    <header className="top-navbar">
      <div className="navbar-left">
        <button
          type="button"
          className="menu-trigger-btn"
          onClick={onToggleSidebar}
          aria-label="Abrir menu de navegação"
        >
          <Menu size={22} color="#FFFFFF" />
        </button>
        <Link href="/" className="office-logo">
          <img
            src="/images/logo-horizontal.png"
            alt="Daniel Simões Advocacia"
            style={{
              height: '36px',
              width: 'auto',
              filter: 'brightness(0) invert(1)',
              objectFit: 'contain'
            }}
          />
        </Link>
      </div>

      <div className="navbar-center">
        <div className="search-bar-container">
          <Search size={16} className="search-icon" />
          <input
            type="text"
            className="search-input"
            placeholder="Pesquisar no sistema..."
            aria-label="Barra de pesquisa do sistema"
          />
        </div>
      </div>

      <div className="navbar-right">
        <button
          type="button"
          className="nav-icon-btn"
          aria-label="Notificações"
        >
          <Bell size={19} color="#FFFFFF" />
        </button>

        <button
          type="button"
          className="nav-icon-btn"
          aria-label="Configurações"
        >
          <Settings size={19} color="#FFFFFF" />
        </button>

        <button
          type="button"
          className="nav-icon-btn"
          onClick={onToggleTheme}
          aria-label="Alternar tema claro e escuro"
        >
          {isDarkMode ? (
            <Sun size={19} color="#C5A059" />
          ) : (
            <Moon size={19} color="#FFFFFF" />
          )}
        </button>

        <button
          type="button"
          className="profile-avatar-btn"
          onClick={onOpenProfile}
          aria-label="Perfil do usuário"
        >
          <User size={19} color="#C5A059" />
        </button>
      </div>
    </header>
  );
}
