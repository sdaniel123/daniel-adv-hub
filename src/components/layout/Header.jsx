'use client';

import React from 'react';
import Link from 'next/link';
import { Menu, Search, Bell, Moon, Sun, User, Command } from 'lucide-react';

export default function Header({ onToggleSidebar, isDarkMode, onToggleTheme, onToggleNotifications, unreadCount = 3 }) {
  return (
    <header className="header-main">
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <button
          type="button"
          onClick={onToggleSidebar}
          style={{ padding: '6px', borderRadius: '8px', color: 'var(--text-main)' }}
          aria-label="Alternar barra lateral"
        >
          <Menu size={20} />
        </button>

        <div style={{ position: 'relative', width: '320px', display: 'flex', alignItems: 'center' }}>
          <Search size={16} style={{ position: 'absolute', left: '14px', color: 'var(--text-muted)' }} />
          <input
            type="text"
            placeholder="Pesquisar clientes, processos, documentos..."
            style={{
              width: '100%',
              padding: '9px 40px 9px 40px',
              borderRadius: '20px',
              border: '1px solid var(--border-light)',
              backgroundColor: 'var(--bg-main)',
              color: 'var(--text-main)',
              fontSize: '0.85rem',
              outline: 'none'
            }}
          />
          <span style={{ position: 'absolute', right: '12px', fontSize: '0.72rem', fontWeight: 600, color: 'var(--text-muted)', backgroundColor: 'var(--border-light)', padding: '2px 6px', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '2px' }}>
            <Command size={10} /> K
          </span>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
        <button
          type="button"
          onClick={onToggleNotifications}
          style={{ position: 'relative', padding: '8px', borderRadius: '50%', color: 'var(--text-main)' }}
          aria-label="Central de notificações"
        >
          <Bell size={20} />
          {unreadCount > 0 && (
            <span style={{ position: 'absolute', top: '4px', right: '4px', width: '18px', height: '18px', borderRadius: '50%', backgroundColor: '#F43F5E', color: '#FFFFFF', fontSize: '0.7rem', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {unreadCount}
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={onToggleTheme}
          style={{ padding: '8px', borderRadius: '50%', color: 'var(--text-main)' }}
          aria-label="Alternar tema"
        >
          {isDarkMode ? <Sun size={20} color="#F59E0B" /> : <Moon size={20} />}
        </button>

        <Link href="/perfil" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none', color: 'var(--text-main)' }}>
          <div style={{ width: '38px', height: '38px', borderRadius: '50%', backgroundColor: 'var(--primary-light)', border: '2px solid var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
            <User size={20} />
          </div>
          <div style={{ textAlign: 'left', display: 'none', smDisplay: 'block' }}>
            <p style={{ fontSize: '0.88rem', fontWeight: 700, lineHeight: 1.2 }}>Dr. Daniel Simões</p>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>OAB 000.000/UF</p>
          </div>
        </Link>
      </div>
    </header>
  );
}
