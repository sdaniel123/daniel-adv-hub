'use client';

import React from 'react';
import { FileText, Plus, Search, Filter, ShieldCheck } from 'lucide-react';

export default function ProcessosPage() {
  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-success)', textTransform: 'uppercase', letterSpacing: '1.2px' }}>
            Acompanhamento Processual
          </span>
          <h1 style={{ fontFamily: 'var(--font-raleway)', fontSize: '2.2rem', marginTop: '4px', fontWeight: 800 }}>
            Gestão de Processos
          </h1>
        </div>

        <button type="button" className="action-btn-3d">
          <Plus size={18} />
          Novo Processo
        </button>
      </div>

      <div className="card-glass-3d" style={{ marginBottom: '28px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div style={{ position: 'relative', width: '340px' }}>
            <Search size={18} style={{ position: 'absolute', left: '14px', top: '12px', opacity: 0.6 }} />
            <input
              type="text"
              placeholder="Buscar processo por número ou parte..."
              style={{
                width: '100%',
                padding: '10px 14px 10px 42px',
                borderRadius: '12px',
                border: '1px solid var(--card-border)',
                backgroundColor: 'rgba(0, 0, 0, 0.04)',
                outline: 'none'
              }}
            />
          </div>

          <button
            type="button"
            style={{
              padding: '10px 16px',
              borderRadius: '12px',
              border: '1px solid var(--card-border)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontWeight: 600,
              fontSize: '0.9rem'
            }}
          >
            <Filter size={16} />
            Filtrar por Tribunal
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div className="card-glass-3d">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '14px' }}>
            <div>
              <span className="badge-pill-success" style={{ marginBottom: '6px' }}>TJSP - Cível</span>
              <h3 style={{ fontFamily: 'var(--font-raleway)', fontSize: '1.25rem', fontWeight: 700 }}>
                Proc. nº 1042345-12.2026.8.26.0100
              </h3>
              <p style={{ fontSize: '0.88rem', opacity: 0.75, marginTop: '2px' }}>
                Autor: Carlos Eduardo Silva vs. Banco Exemplo S.A.
              </p>
            </div>

            <div style={{ textAlign: 'right' }}>
              <span className="badge-pill-success">
                <ShieldCheck size={14} /> Em Andamento
              </span>
              <p style={{ fontSize: '0.8rem', opacity: 0.7, marginTop: '6px' }}>Vara: 4ª Vara Cível Central</p>
            </div>
          </div>
        </div>

        <div className="card-glass-3d">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '14px' }}>
            <div>
              <span className="badge-pill-success" style={{ marginBottom: '6px' }}>TRT-2 - Trabalhista</span>
              <h3 style={{ fontFamily: 'var(--font-raleway)', fontSize: '1.25rem', fontWeight: 700 }}>
                Proc. nº 0000845-90.2026.5.02.0001
              </h3>
              <p style={{ fontSize: '0.88rem', opacity: 0.75, marginTop: '2px' }}>
                Reclamante: Tech Solutions Ltda vs. Ex-funcionário
              </p>
            </div>

            <div style={{ textAlign: 'right' }}>
              <span className="badge-pill-success">
                <ShieldCheck size={14} /> Réplica Apresentada
              </span>
              <p style={{ fontSize: '0.8rem', opacity: 0.7, marginTop: '6px' }}>Vara: 1ª Vara do Trabalho</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
