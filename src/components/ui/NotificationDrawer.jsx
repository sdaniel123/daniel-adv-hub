'use client';

import React, { useState } from 'react';
import { Bell, Check, Trash2, X, AlertCircle, FileText, Calendar } from 'lucide-react';

const initialNotifications = [
  { id: '1', title: 'Prazo Fatal Hoje', desc: 'Protocolar contestação no processo nº 1042345-12.2026', time: 'Há 25 minutos', unread: true, type: 'danger' },
  { id: '2', title: 'Audiência Designada', desc: 'TRT-2 confirmou audiência para amanhã às 14:00', time: 'Há 2 horas', unread: true, type: 'primary' },
  { id: '3', title: 'Novo Cliente Cadastrado', desc: 'Ficha de Tech Solutions Ltda preenchida', time: 'Há 5 horas', unread: true, type: 'success' },
  { id: '4', title: 'Modelo Atualizado', desc: 'Procuração Ad Judicia 2026 adicionada aos modelos', time: 'Ontem', unread: false, type: 'muted' },
];

export default function NotificationDrawer({ isOpen, onClose }) {
  const [notifications, setNotifications] = useState(initialNotifications);

  const markAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, unread: false })));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        right: 0,
        width: '380px',
        height: '100vh',
        backgroundColor: 'var(--bg-card)',
        borderLeft: '1px solid var(--border-light)',
        boxShadow: 'var(--shadow-lg)',
        zIndex: 150,
        display: 'flex',
        flexDirection: 'column',
        animation: 'slideInToast 0.25s ease-out'
      }}
    >
      <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border-light)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Bell size={20} color="var(--primary)" />
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', fontWeight: 700 }}>
            Central de Notificações
          </h3>
        </div>
        <button type="button" onClick={onClose} style={{ color: 'var(--text-muted)' }}>
          <X size={18} />
        </button>
      </div>

      <div style={{ padding: '12px 24px', borderBottom: '1px solid var(--border-light)', display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
        <button type="button" onClick={markAllRead} style={{ color: 'var(--primary)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
          <Check size={14} /> Marcar lidas
        </button>
        <button type="button" onClick={clearAll} style={{ color: 'var(--danger)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
          <Trash2 size={14} /> Limpar todas
        </button>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '16px 24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {notifications.length === 0 ? (
          <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '40px' }}>
            Nenhuma notificação recente.
          </p>
        ) : (
          notifications.map((n) => (
            <div
              key={n.id}
              style={{
                padding: '14px',
                borderRadius: '12px',
                backgroundColor: n.unread ? 'var(--primary-light)' : 'var(--bg-main)',
                border: '1px solid var(--border-light)',
                display: 'flex',
                gap: '12px'
              }}
            >
              <div style={{ paddingTop: '2px' }}>
                {n.type === 'danger' && <AlertCircle size={18} color="var(--danger)" />}
                {n.type === 'primary' && <Calendar size={18} color="var(--primary)" />}
                {n.type === 'success' && <FileText size={18} color="var(--success)" />}
                {n.type === 'muted' && <Bell size={18} color="var(--text-muted)" />}
              </div>

              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2px' }}>
                  <h4 style={{ fontSize: '0.88rem', fontWeight: 700 }}>{n.title}</h4>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{n.time}</span>
                </div>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>{n.desc}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
