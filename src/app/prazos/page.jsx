'use client';

import React from 'react';
import { Calendar, Plus } from 'lucide-react';

export default function PrazosPage() {
  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
        <div>
          <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-error)', textTransform: 'uppercase', letterSpacing: '1px' }}>
            Controle de Prazos
          </span>
          <h1 style={{ fontFamily: 'var(--font-raleway)', fontSize: '2rem', marginTop: '6px', fontWeight: 700 }}>
            Prazos & Agenda
          </h1>
        </div>

        <button
          type="button"
          style={{
            backgroundColor: 'var(--color-success)',
            color: 'var(--color-white)',
            padding: '10px 20px',
            borderRadius: '8px',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            cursor: 'pointer'
          }}
        >
          <Plus size={18} />
          Novo Prazo
        </button>
      </div>

      <div className="card-popup">
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
          <Calendar size={24} color="#F93D4A" />
          <h2 style={{ fontFamily: 'var(--font-raleway)', fontSize: '1.2rem', fontWeight: 600 }}>
            Agenda de Prazos e Audiências
          </h2>
        </div>
        <p style={{ opacity: '0.8' }}>
          Módulo de controle de prazos fatais, audiências e compromissos.
        </p>
      </div>
    </div>
  );
}
