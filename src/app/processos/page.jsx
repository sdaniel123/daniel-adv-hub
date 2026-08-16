'use client';

import React, { useState } from 'react';
import { Plus, Search, FileText, ShieldCheck, ChevronDown, ChevronUp, ExternalLink, X } from 'lucide-react';
import ToastNotification from '@/components/ui/ToastNotification';

const mockProcessos = [
  { id: '1', numero: '1042345-12.2026.8.26.0100', cliente: 'Carlos Eduardo Silva', parteContraria: 'Banco Exemplo S.A.', tribunal: 'TJSP - 4ª Vara Cível Central', area: 'Cível', status: 'Em Andamento', proximoPrazo: 'Hoje (23:59)', historico: [{ data: '16/08/2026', desc: 'Petição intermediária de réplica juntada aos autos.' }, { data: '10/08/2026', desc: 'Citação eletrônica confirmada pela ré.' }] },
  { id: '2', numero: '0000845-90.2026.5.02.0001', cliente: 'Tech Solutions Ltda', parteContraria: 'João Pedro Santos', tribunal: 'TRT-2 - 1ª Vara do Trabalho', area: 'Trabalhista', status: 'Audiência Marcada', proximoPrazo: 'Amanhã (14:00)', historico: [{ data: '15/08/2026', desc: 'Audiência de conciliação designada para 17/08/2026.' }] },
  { id: '3', numero: '5001234-88.2026.4.03.6100', cliente: 'Indústria Matarazzo S.A.', parteContraria: 'União Federal (Fazenda Nacional)', tribunal: 'TRF-3 - 8ª Vara Federal', area: 'Tributário', status: 'Aguardando Sentença', proximoPrazo: 'Em 5 dias', historico: [{ data: '01/08/2026', desc: 'Conclusos os autos para proferimento de sentença.' }] },
];

export default function ProcessosPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedId, setExpandedId] = useState('1');
  const [showModal, setShowModal] = useState(false);
  const [toast, setToast] = useState(null);
  const [numProc, setNumProc] = useState('');

  const filtered = mockProcessos.filter((p) =>
    p.numero.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.cliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.area.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddProcesso = (e) => {
    e.preventDefault();
    setToast(`Processo ${numProc || 'Novo'} registrado com sucesso!`);
    setShowModal(false);
    setNumProc('');
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', flexWrap: 'wrap', gap: '20px' }}>
        <div>
          <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '1px' }}>
            Acompanhamento Judicial
          </span>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2.2rem', marginTop: '2px', fontWeight: 800 }}>
            Gestão de Processos
          </h1>
        </div>

        <button type="button" className="btn-primary" onClick={() => setShowModal(true)}>
          <Plus size={18} />
          <span>Cadastrar Processo</span>
        </button>
      </div>

      <div className="card-saas" style={{ marginBottom: '28px' }}>
        <div style={{ position: 'relative', width: '100%', maxWidth: '400px' }}>
          <Search size={16} style={{ position: 'absolute', left: '14px', top: '11px', color: 'var(--text-muted)' }} />
          <input
            type="text"
            placeholder="Buscar por número, cliente ou área..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '8px 14px 8px 40px',
              borderRadius: '20px',
              border: '1px solid var(--border-light)',
              backgroundColor: 'var(--bg-main)',
              color: 'var(--text-main)',
              fontSize: '0.88rem',
              outline: 'none'
            }}
          />
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {filtered.map((proc) => {
          const isExpanded = expandedId === proc.id;

          return (
            <div key={proc.id} className="card-saas">
              <div
                onClick={() => setExpandedId(isExpanded ? null : proc.id)}
                style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', flexWrap: 'wrap', gap: '16px' }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                    <span className="badge-saas badge-primary">{proc.area}</span>
                    <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>{proc.tribunal}</span>
                  </div>
                  <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 700 }}>{proc.numero}</h3>
                  <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                    {proc.cliente} vs. {proc.parteContraria}
                  </p>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <span className="badge-saas badge-success">
                    <ShieldCheck size={14} /> {proc.status}
                  </span>
                  {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </div>
              </div>

              {isExpanded && (
                <div style={{ borderTop: '1px solid var(--border-light)', marginTop: '16px', paddingTop: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <h4 style={{ fontSize: '0.92rem', fontWeight: 700 }}>Movimentações do Processo</h4>
                    <a href="#" style={{ fontSize: '0.82rem', color: 'var(--primary)', textDecoration: 'none', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                      Abrir no e-SAJ / PJe <ExternalLink size={14} />
                    </a>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {proc.historico.map((h, i) => (
                      <div key={i} style={{ padding: '10px 14px', borderRadius: '8px', backgroundColor: 'var(--bg-main)', border: '1px solid var(--border-light)', display: 'flex', gap: '12px' }}>
                        <span style={{ fontSize: '0.82rem', fontWeight: 700, minWidth: '90px' }}>{h.data}</span>
                        <span style={{ fontSize: '0.85rem', color: 'var(--text-main)' }}>{h.desc}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {showModal && (
        <div className="sidebar-overlay open" onClick={() => setShowModal(false)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="card-popup" onClick={(e) => e.stopPropagation()} style={{ width: '90%', maxWidth: '440px', margin: 0 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', fontWeight: 700 }}>Cadastrar Processo</h3>
              <button type="button" onClick={() => setShowModal(false)} style={{ color: 'var(--text-muted)' }}><X size={18} /></button>
            </div>

            <form onSubmit={handleAddProcesso} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>Número do Processo (CNJ)</label>
                <input
                  type="text"
                  required
                  placeholder="0000000-00.2026.8.26.0000"
                  value={numProc}
                  onChange={(e) => setNumProc(e.target.value)}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border-light)', backgroundColor: 'var(--bg-main)', color: 'var(--text-main)', outline: 'none' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '8px' }}>
                <button type="button" onClick={() => setShowModal(false)} className="btn-secondary">Cancelar</button>
                <button type="submit" className="btn-primary">Salvar Processo</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ToastNotification message={toast} onClose={() => setToast(null)} />
    </div>
  );
}
