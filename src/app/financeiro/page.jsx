'use client';

import React, { useState } from 'react';
import { DollarSign, Plus, ArrowUpRight, ArrowDownRight, TrendingUp, X } from 'lucide-react';
import ToastNotification from '@/components/ui/ToastNotification';

export default function FinanceiroPage() {
  const [showModal, setShowModal] = useState(false);
  const [toast, setToast] = useState(null);
  const [valor, setValor] = useState('');

  const handleAddLancamento = (e) => {
    e.preventDefault();
    setToast(`Lançamento de R$ ${valor || '0,00'} registrado com sucesso!`);
    setShowModal(false);
    setValor('');
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', flexWrap: 'wrap', gap: '20px' }}>
        <div>
          <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '1px' }}>
            Fluxo Financeiro
          </span>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2.2rem', marginTop: '2px', fontWeight: 800 }}>
            Gestão Financeira
          </h1>
        </div>

        <button type="button" className="btn-primary" onClick={() => setShowModal(true)}>
          <Plus size={18} />
          <span>Novo Lançamento</span>
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', marginBottom: '32px' }}>
        <div className="card-saas">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <span style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-muted)' }}>Receita Bruta (Mês)</span>
            <ArrowUpRight size={22} color="var(--primary)" />
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, fontFamily: 'var(--font-display)', marginBottom: '8px' }}>
            R$ 42.850,00
          </div>
          <span className="badge-saas badge-success">
            <TrendingUp size={13} /> Entrada confirmada
          </span>
        </div>

        <div className="card-saas">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <span style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-muted)' }}>Custas & Despesas</span>
            <ArrowDownRight size={22} color="var(--danger)" />
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, fontFamily: 'var(--font-display)', marginBottom: '8px' }}>
            R$ 6.420,00
          </div>
          <span className="badge-saas badge-danger">
            Custas processuais
          </span>
        </div>

        <div className="card-saas">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <span style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-muted)' }}>Saldo Líquido</span>
            <DollarSign size={22} color="var(--primary)" />
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, fontFamily: 'var(--font-display)', marginBottom: '8px' }}>
            R$ 36.430,00
          </div>
          <span className="badge-saas badge-success">
            Lucro operacional
          </span>
        </div>
      </div>

      {showModal && (
        <div className="sidebar-overlay open" onClick={() => setShowModal(false)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="card-popup" onClick={(e) => e.stopPropagation()} style={{ width: '90%', maxWidth: '440px', margin: 0 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', fontWeight: 700 }}>Novo Lançamento</h3>
              <button type="button" onClick={() => setShowModal(false)} style={{ color: 'var(--text-muted)' }}><X size={18} /></button>
            </div>

            <form onSubmit={handleAddLancamento} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>Valor (R$)</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: 5.000,00"
                  value={valor}
                  onChange={(e) => setValor(e.target.value)}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border-light)', backgroundColor: 'var(--bg-main)', color: 'var(--text-main)', outline: 'none' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '8px' }}>
                <button type="button" onClick={() => setShowModal(false)} className="btn-secondary">Cancelar</button>
                <button type="submit" className="btn-primary">Registrar</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ToastNotification message={toast} onClose={() => setToast(null)} />
    </div>
  );
}
