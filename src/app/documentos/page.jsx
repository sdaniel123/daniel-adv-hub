'use client';

import React from 'react';
import { Folder, Plus, FileCode, Download } from 'lucide-react';

export default function DocumentosPage() {
  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-gold)', textTransform: 'uppercase', letterSpacing: '1px' }}>
            Modelos & Arquivos
          </span>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '2.2rem', marginTop: '2px', fontWeight: 700 }}>
            Repositório de Documentos
          </h1>
        </div>

        <button type="button" className="action-btn-3d">
          <Plus size={18} />
          Enviar Documento
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
        <div className="card-glass-3d">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <Folder size={26} color="#C5A059" />
            <Download size={18} style={{ opacity: 0.7, cursor: 'pointer' }} />
          </div>
          <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.15rem', fontWeight: 700, marginBottom: '6px' }}>
            Modelos de Procuração
          </h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '14px' }}>
            Procurações ad judicia atualizadas com cláusulas de honorários.
          </p>
          <span className="badge-pill-success">
            <FileCode size={13} /> 12 Arquivos (.docx)
          </span>
        </div>

        <div className="card-glass-3d">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <Folder size={26} color="#C5A059" />
            <Download size={18} style={{ opacity: 0.7, cursor: 'pointer' }} />
          </div>
          <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.15rem', fontWeight: 700, marginBottom: '6px' }}>
            Petições Cíveis
          </h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '14px' }}>
            Modelos de petição inicial, réplica, embargos e agravo.
          </p>
          <span className="badge-pill-success">
            <FileCode size={13} /> 34 Arquivos (.docx)
          </span>
        </div>
      </div>
    </div>
  );
}
