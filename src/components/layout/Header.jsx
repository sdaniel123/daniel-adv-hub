'use client';

import React from 'react';
import Link from 'next/link';
import { Search, Bell, Moon, Sun, User, Command } from 'lucide-react';

export default function Header({ isDarkMode, onToggleTheme, onToggleNotifications, unreadCount = 3 }) {
  return (
    <header className="header-main">
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div style={{ position: 'relative', width: '340px', display: 'flex', alignItems: 'center' }}>
          <Search size={15} style={{ position: 'absolute', left: '14px', color: 'var(--text-muted)' }} />
          <input
            type="text"
            placeholder="Pesquisar clientes, processos, prazos..."
            className="search-input-dark"
          />
          <span style={{ position: 'absolute', right: '12px', fontSize: '0.7rem', fontWeight: 600, color: 'var(--text-muted)', backgroundColor: '#162035', padding: '2px 6px', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '2px' }}>
            <Command size={10} /> K
          </span>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <button
          type="button"
          onClick={onToggleNotifications}
          style={{ position: 'relative', padding: '8px', borderRadius: '50%', color: 'var(--text-main)' }}
          aria-label="Central de notificações"
        >
          <Bell size={19} />
          {unreadCount > 0 && (
            <span style={{ position: 'absolute', top: '4px', right: '4px', width: '16px', height: '16px', borderRadius: '50%', backgroundColor: '#EF4444', color: '#FFFFFF', fontSize: '0.68rem', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
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
          {isDarkMode ? <Sun size={19} color="#F59E0B" /> : <Moon size={19} />}
        </button>

        <Link href="/perfil" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none', color: 'var(--text-main)' }}>
          <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: '#131D33', border: '1px solid var(--border-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#3B82F6' }}>
            <User size={18} />
          </div>
          <div style={{ textAlign: 'left' }}>
            <p style={{ fontSize: '0.85rem', fontWeight: 700, lineHeight: 1.2 }}>Dr. Daniel Simões</p>
            <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>OAB 000.000/UF</p>
          </div>
        </Link>
      </div>
    </header>
  );
}
