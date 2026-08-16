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
        bottom: '24px',
        right: '24px',
        zIndex: 200,
        display: 'flex',
        alignItems: 'center',
        gap: '14px',
        padding: '16px 20px',
        borderRadius: '12px',
        backgroundColor: 'var(--card-bg)',
        border: `1px solid ${isSuccess ? '#3774FF' : '#F93D4A'}`,
        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
        color: 'var(--text-page)',
        animation: 'slideInToast 0.3s ease',
        maxWidth: '380px'
      }}
    >
      <div style={{ padding: '6px', borderRadius: '8px', backgroundColor: isSuccess ? 'rgba(55, 116, 255, 0.1)' : 'rgba(249, 61, 74, 0.1)' }}>
        {isSuccess ? (
          <CheckCircle2 size={20} color="#3774FF" />
        ) : (
          <AlertCircle size={20} color="#F93D4A" />
        )}
      </div>

      <div style={{ flex: 1 }}>
        <p style={{ fontWeight: 700, fontSize: '0.9rem' }}>
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
        <X size={16} />
      </button>
    </div>
  );
}
