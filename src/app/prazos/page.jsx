'use client';

import React, { useState } from 'react';
import { Plus, CheckSquare, Clock, AlertCircle, CheckCircle2, X } from 'lucide-react';
import ToastNotification from '@/components/ui/ToastNotification';

const initialPrazos = [
  { id: '1', titulo: 'Protocolo de Contestação Cível', processo: 'Proc. nº 1042345-12.2026', vencimento: 'Hoje às 23:59', prioridade: 'Urgente', concluido: false },
  { id: '2', titulo: 'Audiência de Conciliação Trabalhista', processo: 'Proc. nº 0000845-90.2026', vencimento: 'Amanhã às 14:00', prioridade: 'Alta', concluido: false },
  { id: '3', titulo: 'Réplica à Contestação', processo: 'Proc. nº 5001234-88.2026', vencimento: 'Em 3 dias', prioridade: 'Normal', concluido: false },
  { id: '4', title: 'Pagamento de Custas Iniciais', processo: 'Proc. nº 2003456-11.2026', vencimento: 'Em 5 dias', prioridade: 'Baixa', concluido: true },
];

export default function PrazosPage() {
  const [prazos, setPrazos] = useState(initialPrazos);
  const [filter, setFilter] = useState('todos');
  const [showModal, setShowModal] = useState(false);
  const [toast, setToast] = useState(null);
  const [newTitle, setNewTitle] = useState('');

  const toggleConcluido = (id) => {
    setPrazos(prazos.map(p => {
      if (p.id === id) {
        const nextState = !p.concluido;
        setToast(nextState ? 'Prazo marcado como concluído!' : 'Prazo reaberto.');
        return { ...p, concluido: nextState };
      }
      return p;
    }));
  };

  const filtered = prazos.filter(p => {
    if (filter === 'fatais') return p.prioridade === 'Urgente' && !p.concluido;
    if (filter === 'concluidos') return p.concluido;
    return true;
  });

  const handleAddPrazo = (e) => {
    e.preventDefault();
    setPrazos([...prazos, { id: String(Date.now()), titulo: newTitle, processo: 'Novo Processo registrado', vencimento: 'Nos próximos dias', prioridade: 'Alta', concluido: false }]);
    setToast('Novo prazo agendado com sucesso!');
    setShowModal(false);
    setNewTitle('');
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', flexWrap: 'wrap', gap: '20px' }}>
        <div>
          <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--danger)', textTransform: 'uppercase', letterSpacing: '1px' }}>
            Controle de Pendências
          </span>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2.2rem', marginTop: '2px', fontWeight: 800 }}>
            Tarefas & Prazos
          </h1>
        </div>

        <button type="button" className="btn-primary" onClick={() => setShowModal(true)}>
          <Plus size={18} />
          <span>Lançar Novo Prazo</span>
        </button>
      </div>

      <div className="card-saas" style={{ marginBottom: '28px' }}>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <button type="button" className={`tab-btn ${filter === 'todos' ? 'active' : ''}`} onClick={() => setFilter('todos')}>
            Todos os Prazos
          </button>
          <button type="button" className={`tab-btn ${filter === 'fatais' ? 'active' : ''}`} onClick={() => setFilter('fatais')}>
            Fatais Hoje (1)
          </button>
          <button type="button" className={`tab-btn ${filter === 'concluidos' ? 'active' : ''}`} onClick={() => setFilter('concluidos')}>
            Concluídos (1)
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
        {filtered.map((item) => (
          <div key={item.id} className="card-saas" style={{ opacity: item.concluido ? 0.6 : 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
              <div>
                <span className={item.prioridade === 'Urgente' ? 'badge-saas badge-danger' : 'badge-saas badge-primary'}>
                  {item.prioridade}
                </span>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.15rem', fontWeight: 700, marginTop: '6px', textDecoration: item.concluido ? 'line-through' : 'none' }}>
                  {item.titulo}
                </h3>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                  {item.processo}
                </p>
              </div>
            </div>

            <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.82rem', fontWeight: 600 }}>{item.vencimento}</span>
              <button
                type="button"
                onClick={() => toggleConcluido(item.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  color: item.concluido ? 'var(--text-muted)' : 'var(--primary)'
                }}
              >
                {item.concluido ? <CheckCircle2 size={16} color="var(--success)" /> : <CheckSquare size={16} />}
                <span>{item.concluido ? 'Concluído' : 'Marcar Concluído'}</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="sidebar-overlay open" onClick={() => setShowModal(false)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="card-popup" onClick={(e) => e.stopPropagation()} style={{ width: '90%', maxWidth: '440px', margin: 0 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', fontWeight: 700 }}>Lançar Novo Prazo</h3>
              <button type="button" onClick={() => setShowModal(false)} style={{ color: 'var(--text-muted)' }}><X size={18} /></button>
            </div>

            <form onSubmit={handleAddPrazo} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>Título do Prazo</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Contestação Cível..."
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border-light)', backgroundColor: 'var(--bg-main)', color: 'var(--text-main)', outline: 'none' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '8px' }}>
                <button type="button" onClick={() => setShowModal(false)} className="btn-secondary">Cancelar</button>
                <button type="submit" className="btn-primary">Salvar Prazo</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ToastNotification message={toast} onClose={() => setToast(null)} />
    </div>
  );
}
