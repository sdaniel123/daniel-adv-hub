'use client';

import React from 'react';
import { Calendar, Plus, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function PrazosPage() {
  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-error)', textTransform: 'uppercase', letterSpacing: '1.2px' }}>
            Controle de Agendamentos
          </span>
          <h1 style={{ fontFamily: 'var(--font-raleway)', fontSize: '2.2rem', marginTop: '4px', fontWeight: 700 }}>
            Prazos & Agenda
          </h1>
        </div>

        <button type="button" className="action-btn-3d">
          <Plus size={18} />
          Novo Prazo
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
        <div className="card-glass-3d" style={{ borderLeft: '5px solid #F93D4A' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
            <div>
              <span className="badge-pill-error" style={{ marginBottom: '8px' }}>
                <AlertCircle size={14} /> Prazo Fatal (Hoje)
              </span>
              <h3 style={{ fontFamily: 'var(--font-raleway)', fontSize: '1.25rem', fontWeight: 700 }}>
                Protocolo de Contestação
              </h3>
              <p style={{ fontSize: '0.85rem', opacity: 0.75, marginTop: '4px' }}>
                Proc. nº 1042345-12.2026.8.26.0100
              </p>
            </div>
            <Calendar size={22} color="#F93D4A" />
          </div>

          <div style={{ fontSize: '0.88rem', borderTop: '1px solid var(--card-border)', paddingTop: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>Vencimento: <strong>Hoje às 23:59</strong></span>
            <span style={{ color: '#F93D4A', fontWeight: 700, cursor: 'pointer' }}>Concluir →</span>
          </div>
        </div>

        <div className="card-glass-3d" style={{ borderLeft: '5px solid #3774FF' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
            <div>
              <span className="badge-pill-success" style={{ marginBottom: '8px' }}>
                <CheckCircle2 size={14} /> Em Prazo (Amanhã)
              </span>
              <h3 style={{ fontFamily: 'var(--font-raleway)', fontSize: '1.25rem', fontWeight: 700 }}>
                Audiência de Conciliação
              </h3>
              <p style={{ fontSize: '0.85rem', opacity: 0.75, marginTop: '4px' }}>
                Proc. nº 0000845-90.2026.5.02.0001
              </p>
            </div>
            <Calendar size={22} color="#3774FF" />
          </div>

          <div style={{ fontSize: '0.88rem', borderTop: '1px solid var(--card-border)', paddingTop: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>Data: <strong>Amanhã às 14:00</strong></span>
            <span style={{ color: '#3774FF', fontWeight: 700, cursor: 'pointer' }}>Detalhes →</span>
          </div>
        </div>
      </div>
    </div>
  );
}
