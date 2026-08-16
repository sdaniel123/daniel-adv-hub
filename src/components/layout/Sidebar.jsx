'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Users, FileText, CheckSquare, Calendar, Folder, DollarSign, UserCheck, LogOut, Shield } from 'lucide-react';

const menuItems = [
  { label: 'Painel Geral', href: '/', icon: LayoutDashboard },
  { label: 'Clientes', href: '/clientes', icon: Users },
  { label: 'Processos', href: '/processos', icon: FileText },
  { label: 'Tarefas & Prazos', href: '/prazos', icon: CheckSquare },
  { label: 'Agenda', href: '/agenda', icon: Calendar },
  { label: 'Documentos', href: '/documentos', icon: Folder },
  { label: 'Financeiro', href: '/financeiro', icon: DollarSign },
  { label: 'Meu Perfil', href: '/perfil', icon: UserCheck },
];

export default function Sidebar({ isOpen, onClose }) {
  const pathname = usePathname();

  return (
    <aside className={`sidebar-main ${isOpen ? 'open' : ''}`}>
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '0 8px 24px 8px', borderBottom: '1px solid rgba(255,255,255,0.1)', marginBottom: '20px' }}>
          <img
            src="/images/logo-monogram.png"
            alt="Daniel Simões"
            style={{ height: '36px', width: 'auto', filter: 'brightness(0) invert(1)' }}
          />
          <div>
            <h2 style={{ color: '#FFFFFF', fontSize: '1rem', fontWeight: 800, fontFamily: 'var(--font-display)', letterSpacing: '0.5px' }}>
              DANIEL SIMÕES
            </h2>
            <span style={{ color: '#D4AF37', fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>
              Advocacia & Hub
            </span>
          </div>
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '11px 14px',
                  borderRadius: '10px',
                  color: isActive ? '#FFFFFF' : '#94A3B8',
                  backgroundColor: isActive ? '#4F46E5' : 'transparent',
                  fontWeight: isActive ? 700 : 500,
                  fontSize: '0.9rem',
                  textDecoration: 'none',
                  transition: 'all 0.15s ease'
                }}
              >
                <Icon size={18} color={isActive ? '#FFFFFF' : '#94A3B8'} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '16px' }}>
        <Link
          href="/login"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '10px 14px',
            borderRadius: '10px',
            color: '#F43F5E',
            backgroundColor: 'rgba(244, 63, 94, 0.1)',
            fontWeight: 600,
            fontSize: '0.88rem',
            textDecoration: 'none'
          }}
        >
          <LogOut size={16} />
          <span>Sair da Conta</span>
        </Link>
      </div>
    </aside>
  );
}
