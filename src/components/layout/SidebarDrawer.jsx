'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Users, FileText, Calendar, Folder, DollarSign, LogOut, X } from 'lucide-react';

const navItems = [
  { label: 'Painel Geral', href: '/', icon: LayoutDashboard },
  { label: 'Clientes', href: '/clientes', icon: Users },
  { label: 'Processos', href: '/processos', icon: FileText },
  { label: 'Prazos & Agenda', href: '/prazos', icon: Calendar },
  { label: 'Documentos', href: '/documentos', icon: Folder },
  { label: 'Financeiro', href: '/financeiro', icon: DollarSign },
];

export default function SidebarDrawer({ isOpen, onClose, onLogout }) {
  const pathname = usePathname();

  return (
    <>
      <div
        className={`sidebar-overlay ${isOpen ? 'open' : ''}`}
        onClick={onClose}
        aria-hidden="true"
      />

      <aside className={`sidebar-drawer ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-top">
          <div className="sidebar-header">
            <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
              <img
                src="/images/logo-vertical.png"
                alt="Daniel Simões Advocacia"
                style={{
                  height: '48px',
                  width: 'auto',
                  filter: 'brightness(0) invert(1)',
                  objectFit: 'contain'
                }}
              />
              <button
                type="button"
                className="menu-trigger-btn"
                onClick={onClose}
                aria-label="Fechar menu"
              >
                <X size={20} color="#FFFFFF" />
              </button>
            </div>
            <span style={{ fontSize: '0.78rem', color: '#C5A059', fontWeight: 600, letterSpacing: '0.8px', textTransform: 'uppercase' }}>
              Hub de Gestão Jurídica
            </span>
          </div>

          <nav>
            <ul className="sidebar-nav-list">
              {navItems.map((item) => {
                const IconComponent = item.icon;
                const isActive = pathname === item.href;

                return (
                  <li key={item.href} className="sidebar-nav-item">
                    <Link
                      href={item.href}
                      className={`sidebar-nav-link ${isActive ? 'active' : ''}`}
                      onClick={() => {
                        if (!isActive) {
                          onClose();
                        }
                      }}
                      tabIndex={isActive ? -1 : 0}
                      aria-disabled={isActive}
                    >
                      <IconComponent size={18} color={isActive ? '#C5A059' : '#FFFFFF'} />
                      <span>{item.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>

        <div className="sidebar-bottom">
          <button
            type="button"
            className="logout-btn"
            onClick={() => {
              onClose();
              if (onLogout) onLogout();
            }}
          >
            <LogOut size={16} color="#FFFFFF" />
            <span>Sair</span>
          </button>
        </div>
      </aside>
    </>
  );
}
