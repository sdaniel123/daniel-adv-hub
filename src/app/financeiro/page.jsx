'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { DollarSign, Plus, ArrowUpRight, ArrowDownRight, TrendingUp, X } from 'lucide-react';
import ToastNotification from '@/components/ui/ToastNotification';
import { fetchFinanceiroLancamentos, createFinanceiroLancamento } from '@/lib/financeiroStore';

export default function FinanceiroPage() {
  const [lancamentos, setLancamentos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [toast, setToast] = useState(null);
  const [descricao, setDescricao] = useState('');
  const [tipo, setTipo] = useState('Receita');
  const [valor, setValor] = useState('');

  const loadData = async () => {
    setLoading(true);
    const data = await fetchFinanceiroLancamentos();
    setLancamentos(data);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const totalReceitas = useMemo(() => {
    return lancamentos
      .filter((l) => l.tipo === 'Receita')
      .reduce((sum, l) => sum + (l.valor || 0), 0);
  }, [lancamentos]);

  const totalDespesas = useMemo(() => {
    return lancamentos
      .filter((l) => l.tipo === 'Despesa' || l.tipo === 'Custa')
      .reduce((sum, l) => sum + (l.valor || 0), 0);
  }, [lancamentos]);

  const saldoLiquido = totalReceitas - totalDespesas;

  const handleAddLancamento = async (e) => {
    e.preventDefault();
    try {
      await createFinanceiroLancamento({
        descricao: descricao || 'Lançamento financeiro',
        tipo,
        valor,
        status: 'Pago'
      });
      setToast(`Lançamento de R$ ${valor || '0,00'} registrado com sucesso no Supabase!`);
      setShowModal(false);
      setDescricao('');
      setValor('');
      loadData();
    } catch (err) {
      setToast('Erro ao salvar lançamento financeiro.');
    }
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
            <span style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-muted)' }}>Receita Bruta</span>
            <ArrowUpRight size={22} color="var(--primary)" />
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, fontFamily: 'var(--font-display)', marginBottom: '8px' }}>
            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalReceitas)}
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
            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalDespesas)}
          </div>
          <span className="badge-saas badge-danger">
            Custas processuais e despesas
          </span>
        </div>

        <div className="card-saas">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <span style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-muted)' }}>Saldo Líquido</span>
            <DollarSign size={22} color="var(--primary)" />
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, fontFamily: 'var(--font-display)', marginBottom: '8px' }}>
            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(saldoLiquido)}
          </div>
          <span className="badge-saas badge-success">
            Lucro operacional
          </span>
        </div>
      </div>

      {/* Tabela de Lançamentos */}
      <div className="card-saas">
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '16px' }}>Histórico de Lançamentos</h3>
        {loading ? (
          <p style={{ color: 'var(--text-muted)' }}>Carregando dados do Supabase...</p>
        ) : lancamentos.length === 0 ? (
          <p style={{ color: 'var(--text-muted)' }}>Nenhum lançamento registrado no banco de dados.</p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-light)', textAlign: 'left', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  <th style={{ padding: '12px' }}>Descrição</th>
                  <th style={{ padding: '12px' }}>Tipo</th>
                  <th style={{ padding: '12px' }}>Valor</th>
                  <th style={{ padding: '12px' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {lancamentos.map((item) => (
                  <tr key={item.id} style={{ borderBottom: '1px solid var(--border-light)', fontSize: '0.9rem' }}>
                    <td style={{ padding: '12px', fontWeight: 600 }}>{item.descricao}</td>
                    <td style={{ padding: '12px' }}>{item.tipo}</td>
                    <td style={{ padding: '12px', fontWeight: 700, color: item.tipo === 'Receita' ? 'var(--primary)' : 'var(--danger)' }}>
                      {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.valor)}
                    </td>
                    <td style={{ padding: '12px' }}>
                      <span className={`badge-saas ${item.status === 'Pago' ? 'badge-success' : 'badge-warning'}`}>
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
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
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>Descrição</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Honorários iniciais"
                  value={descricao}
                  onChange={(e) => setDescricao(e.target.value)}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border-light)', backgroundColor: 'var(--bg-main)', color: 'var(--text-main)', outline: 'none' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>Tipo</label>
                <select
                  value={tipo}
                  onChange={(e) => setTipo(e.target.value)}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border-light)', backgroundColor: 'var(--bg-main)', color: 'var(--text-main)', outline: 'none' }}
                >
                  <option value="Receita">Receita (Entrada)</option>
                  <option value="Despesa">Despesa (Saída)</option>
                  <option value="Custa">Custas Processuais</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>Valor (R$)</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  placeholder="Ex: 5000.00"
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
