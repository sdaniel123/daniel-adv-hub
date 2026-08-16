'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Users, 
  Briefcase, 
  CheckSquare, 
  Gavel, 
  Calendar, 
  FileText, 
  FolderKanban, 
  Grid, 
  BarChart3, 
  Settings, 
  LogOut 
} from 'lucide-react';

const menuItems = [
  { label: 'Painel', href: '/', icon: LayoutDashboard },
  { label: 'Clientes', href: '/clientes', icon: Users },
  { label: 'Processos', href: '/processos', icon: Briefcase },
  { label: 'Tarefas', href: '/prazos', icon: CheckSquare },
  { label: 'Audiências', href: '/agenda', icon: Gavel },
  { label: 'Agenda', href: '/agenda', icon: Calendar },
  { label: 'Publicações', href: '/documentos', icon: FileText },
  { label: 'Modelos', href: '/documentos', icon: FolderKanban },
  { label: 'Aplicações', href: '/financeiro', icon: Grid },
  { label: 'Relatórios', href: '/relatorios', icon: BarChart3 },
  { label: 'Gestão', href: '/perfil', icon: Settings },
];

export default function Sidebar({ isOpen, onClose }) {
  const pathname = usePathname();

  return (
    <aside className={`sidebar-main ${isOpen ? 'open' : ''}`}>
      <div>
        {/* Brand Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '4px 8px 20px 8px', marginBottom: '8px' }}>
          <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: '#3B82F6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, color: '#FFFFFF', fontSize: '1.1rem', fontFamily: 'var(--font-serif)' }}>
            D
          </div>
          <div>
            <h2 style={{ color: '#FFFFFF', fontSize: '0.92rem', fontWeight: 800, fontFamily: 'var(--font-serif)', letterSpacing: '0.3px', lineHeight: 1.1 }}>
              DANIEL ADV HUB
            </h2>
            <span style={{ color: '#64748B', fontSize: '0.68rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.8px' }}>
              Advocacia Executiva
            </span>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.label}
                href={item.href}
                onClick={onClose}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '9px 14px',
                  borderRadius: '10px',
                  color: isActive ? '#070A12' : '#94A3B8',
                  backgroundColor: isActive ? '#FFFFFF' : 'transparent',
                  fontWeight: isActive ? 700 : 500,
                  fontSize: '0.88rem',
                  textDecoration: 'none',
                  transition: 'all 0.15s ease'
                }}
              >
                <Icon size={17} color={isActive ? '#070A12' : '#94A3B8'} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer Profile & Exit */}
      <div style={{ borderTop: '1px solid #1B263B', paddingTop: '14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <p style={{ color: '#FFFFFF', fontSize: '0.82rem', fontWeight: 700, lineHeight: 1.2 }}>
            Coordenador do Sistema
          </p>
          <p style={{ color: '#64748B', fontSize: '0.72rem' }}>
            Administrador
          </p>
        </div>
        <Link
          href="/login"
          title="Sair do sistema"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '6px',
            borderRadius: '6px',
            color: '#94A3B8',
            textDecoration: 'none',
            transition: 'color 0.15s ease'
          }}
        >
          <LogOut size={16} />
        </Link>
      </div>
    </aside>
  );
}
