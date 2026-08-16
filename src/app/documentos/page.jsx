'use client';

import React from 'react';
import { Folder, Plus } from 'lucide-react';

export default function DocumentosPage() {
  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
        <div>
          <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-success)', textTransform: 'uppercase', letterSpacing: '1px' }}>
            Repositório de Arquivos
          </span>
          <h1 style={{ fontFamily: 'var(--font-raleway)', fontSize: '2rem', marginTop: '6px', fontWeight: 700 }}>
            Documentos
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
          Enviar Documento
        </button>
      </div>

      <div className="card-popup">
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
          <Folder size={24} color="#3774FF" />
          <h2 style={{ fontFamily: 'var(--font-raleway)', fontSize: '1.2rem', fontWeight: 600 }}>
            Documentos e Modelos
          </h2>
        </div>
        <p style={{ opacity: '0.8' }}>
          Módulo para gestão de modelos de petições, procurações e documentos dos processos.
        </p>
      </div>
    </div>
  );
}
