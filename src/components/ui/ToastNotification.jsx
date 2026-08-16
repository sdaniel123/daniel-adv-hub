'use client';

import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, X } from 'lucide-react';

export default function ToastNotification({ message, type = 'success', onClose }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      if (onClose) onClose();
    }, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  if (!message) return null;

  const isSuccess = type === 'success';

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '28px',
        right: '28px',
        zIndex: 200,
        display: 'flex',
        alignItems: 'center',
        gap: '14px',
        padding: '16px 22px',
        borderRadius: '16px',
        backgroundColor: 'var(--card-bg)',
        backdropFilter: 'blur(16px) saturate(180%)',
        WebkitBackdropFilter: 'blur(16px) saturate(180%)',
        border: `1px solid ${isSuccess ? 'rgba(55, 116, 255, 0.4)' : 'rgba(249, 61, 74, 0.4)'}`,
        boxShadow: isSuccess
          ? '0 12px 35px -5px rgba(55, 116, 255, 0.25), 0 4px 15px rgba(0,0,0,0.1)'
          : '0 12px 35px -5px rgba(249, 61, 74, 0.25), 0 4px 15px rgba(0,0,0,0.1)',
        color: 'var(--text-page)',
        animation: 'slideInToast 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
        maxWidth: '380px'
      }}
    >
      <div style={{ padding: '8px', borderRadius: '12px', backgroundColor: isSuccess ? 'rgba(55, 116, 255, 0.15)' : 'rgba(249, 61, 74, 0.15)' }}>
        {isSuccess ? (
          <CheckCircle2 size={22} color="#3774FF" />
        ) : (
          <AlertCircle size={22} color="#F93D4A" />
        )}
      </div>

      <div style={{ flex: 1 }}>
        <p style={{ fontWeight: 700, fontSize: '0.92rem' }}>
          {isSuccess ? 'Sucesso' : 'Atenção'}
        </p>
        <p style={{ fontSize: '0.85rem', opacity: 0.85, marginTop: '2px' }}>
          {message}
        </p>
      </div>

      <button
        type="button"
        onClick={onClose}
        style={{ color: 'var(--text-page)', opacity: 0.6, cursor: 'pointer', padding: '4px' }}
        aria-label="Fechar notificação"
      >
        <X size={18} />
      </button>
    </div>
  );
}
