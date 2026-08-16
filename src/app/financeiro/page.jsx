'use client';

import React from 'react';
import { DollarSign, Plus, TrendingUp, ArrowUpRight, ArrowDownRight } from 'lucide-react';

export default function FinanceiroPage() {
  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-gold)', textTransform: 'uppercase', letterSpacing: '1px' }}>
            Fluxo de Caixa & Honorários
          </span>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '2.2rem', marginTop: '2px', fontWeight: 700 }}>
            Gestão Financeira
          </h1>
        </div>

        <button type="button" className="action-btn-3d">
          <Plus size={18} />
          Novo Lançamento
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', marginBottom: '32px' }}>
        <div className="card-glass-3d">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <span style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-muted)' }}>Receita Bruta (Mês)</span>
            <ArrowUpRight size={22} color="#2563EB" />
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 700, fontFamily: 'var(--font-heading)', marginBottom: '8px' }}>
            R$ 42.850,00
          </div>
          <span className="badge-pill-success">
            <TrendingUp size={13} /> Entrada confirmada
          </span>
        </div>

        <div className="card-glass-3d">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <span style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-muted)' }}>Custas & Despesas</span>
            <ArrowDownRight size={22} color="#DC2626" />
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 700, fontFamily: 'var(--font-heading)', marginBottom: '8px' }}>
            R$ 6.420,00
          </div>
          <span className="badge-pill-error">
            Custas processuais
          </span>
        </div>

        <div className="card-glass-3d">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <span style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-muted)' }}>Saldo Líquido</span>
            <DollarSign size={22} color="#C5A059" />
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 700, fontFamily: 'var(--font-heading)', marginBottom: '8px' }}>
            R$ 36.430,00
          </div>
          <span className="badge-pill-success">
            Lucro operacional
          </span>
        </div>
      </div>
    </div>
  );
}
