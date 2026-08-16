'use client';

import React, { useState } from 'react';
import { PlusCircle, Clock, UserPlus, FilePlus, X } from 'lucide-react';

export default function QuickActions({ onActionSuccess }) {
  const [activeModal, setActiveModal] = useState(null);
  const [formData, setFormData] = useState({ title: '', detail: '' });

  const actions = [
    { id: 'processo', title: 'Novo Processo', subtitle: 'Cadastrar ação judicial', icon: PlusCircle, color: '#3774FF' },
    { id: 'prazo', title: 'Lançar Prazo', subtitle: 'Registrar vencimento fatal', icon: Clock, color: '#F93D4A' },
    { id: 'cliente', title: 'Adicionar Cliente', subtitle: 'Cadastrar PF ou PJ', icon: UserPlus, color: '#3774FF' },
    { id: 'documento', title: 'Gerar Documento', subtitle: 'Procuração ou Petição', icon: FilePlus, color: '#3774FF' },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    const actionName = actions.find((a) => a.id === activeModal)?.title || 'Ação';
    if (onActionSuccess) {
      onActionSuccess(`${actionName} registrado com sucesso!`);
    }
    setActiveModal(null);
    setFormData({ title: '', detail: '' });
  };

  return (
    <>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '18px', marginBottom: '32px' }}>
        {actions.map((act) => {
          const IconComponent = act.icon;

          return (
            <div
              key={act.id}
              className="card-glass-3d"
              onClick={() => setActiveModal(act.id)}
              style={{
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                padding: '20px'
              }}
            >
              <div
                style={{
                  padding: '12px',
                  borderRadius: '14px',
                  backgroundColor: `${act.color}18`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <IconComponent size={24} color={act.color} />
              </div>

              <div>
                <h3 style={{ fontFamily: 'var(--font-raleway)', fontSize: '1rem', fontWeight: 800 }}>
                  {act.title}
                </h3>
                <p style={{ fontSize: '0.78rem', opacity: 0.7, marginTop: '2px' }}>
                  {act.subtitle}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {activeModal && (
        <div
          className="sidebar-overlay open"
          onClick={() => setActiveModal(null)}
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <div
            className="card-popup"
            onClick={(e) => e.stopPropagation()}
            style={{ width: '90%', maxWidth: '440px', margin: 0 }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ fontFamily: 'var(--font-raleway)', fontSize: '1.3rem', fontWeight: 800 }}>
                {actions.find((a) => a.id === activeModal)?.title}
              </h2>
              <button type="button" onClick={() => setActiveModal(null)} aria-label="Fechar modal">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '6px' }}>
                  Título / Nome
                </label>
                <input
                  type="text"
                  required
                  placeholder="Informe o título..."
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    borderRadius: '12px',
                    border: '1px solid var(--card-border)',
                    backgroundColor: 'rgba(0, 0, 0, 0.04)',
                    color: 'var(--text-page)',
                    outline: 'none'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '6px' }}>
                  Observações / Número
                </label>
                <textarea
                  rows={3}
                  placeholder="Informações adicionais..."
                  value={formData.detail}
                  onChange={(e) => setFormData({ ...formData, detail: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    borderRadius: '12px',
                    border: '1px solid var(--card-border)',
                    backgroundColor: 'rgba(0, 0, 0, 0.04)',
                    color: 'var(--text-page)',
                    outline: 'none',
                    resize: 'none'
                  }}
                />
              </div>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '8px' }}>
                <button
                  type="button"
                  onClick={() => setActiveModal(null)}
                  style={{
                    padding: '10px 18px',
                    borderRadius: '12px',
                    border: '1px solid var(--card-border)',
                    fontWeight: 600
                  }}
                >
                  Cancelar
                </button>
                <button type="submit" className="action-btn-3d">
                  Salvar Registro
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
