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
          <Menu size={24} color="#FFFFFF" />
        </button>
        <Link href="/" className="office-logo">
          DANIEL ADV HUB
        </Link>
      </div>

      <div className="navbar-center">
        <div className="search-bar-container">
          <Search size={18} className="search-icon" color="#FFFFFF" />
          <input
            type="text"
            className="search-input"
            placeholder="Pesquisar..."
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
          <Bell size={20} color="#FFFFFF" />
        </button>

        <button
          type="button"
          className="nav-icon-btn"
          aria-label="Configurações"
        >
          <Settings size={20} color="#FFFFFF" />
        </button>

        <button
          type="button"
          className="nav-icon-btn"
          onClick={onToggleTheme}
          aria-label="Alternar tema claro e escuro"
        >
          {isDarkMode ? (
            <Sun size={20} color="#FFFFFF" />
          ) : (
            <Moon size={20} color="#FFFFFF" />
          )}
        </button>

        <button
          type="button"
          className="profile-avatar-btn"
          onClick={onOpenProfile}
          aria-label="Perfil do usuário"
        >
          <User size={20} color="#000000" />
        </button>
      </div>
    </header>
  );
}
