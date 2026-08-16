'use client';

import React, { useState } from 'react';
import { Search, ChevronDown, ChevronUp, FileText, ShieldCheck, Clock, ExternalLink } from 'lucide-react';

const mockProcessos = [
  {
    id: '1',
    numero: '1042345-12.2026.8.26.0100',
    cliente: 'Carlos Eduardo Silva',
    parteContraria: 'Banco Exemplo S.A.',
    tribunal: 'TJSP - 4ª Vara Cível',
    area: 'Direito Cível',
    status: 'Em Andamento',
    proximoPrazo: 'Hoje (23:59)',
    isUrgent: true,
    historico: [
      { data: '16/08/2026', desc: 'Petição intermediária anexada aos autos.' },
      { data: '10/08/2026', desc: 'Citação da parte contrária confirmada.' },
      { data: '02/08/2026', desc: 'Distribuição da Ação Cível.' }
    ]
  },
  {
    id: '2',
    numero: '0000845-90.2026.5.02.0001',
    cliente: 'Tech Solutions Ltda',
    parteContraria: 'João Pedro Santos',
    tribunal: 'TRT-2 - 1ª Vara do Trabalho',
    area: 'Trabalhista',
    status: 'Réplica Concluída',
    proximoPrazo: 'Amanhã (14:00)',
    isUrgent: false,
    historico: [
      { data: '15/08/2026', desc: 'Protocolada réplica à contestação trabalhista.' },
      { data: '05/08/2026', desc: 'Notificação de audiência designada.' }
    ]
  },
  {
    id: '3',
    numero: '5001234-88.2026.4.03.6100',
    cliente: 'Indústria Matarazzo S.A.',
    parteContraria: 'União Federal (Fazenda Nacional)',
    tribunal: 'TRF-3 - 8ª Vara Federal',
    area: 'Tributário',
    status: 'Aguardando Sentença',
    proximoPrazo: 'Em 5 dias',
    isUrgent: false,
    historico: [
      { data: '01/08/2026', desc: 'Conclusos para julgamento.' },
      { data: '20/07/2026', desc: 'Apresentadas alegações finais.' }
    ]
  }
];

export default function ProcessosTable() {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedId, setExpandedId] = useState(null);

  const filtered = mockProcessos.filter((p) =>
    p.numero.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.cliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.area.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="card-glass-3d">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ fontFamily: 'var(--font-raleway)', fontSize: '1.35rem', fontWeight: 800 }}>
            Tabela de Processos
          </h2>
          <p style={{ fontSize: '0.85rem', opacity: 0.75, marginTop: '2px' }}>
            Clique em qualquer linha para expandir os andamentos completos
          </p>
        </div>

        <div style={{ position: 'relative', width: '320px' }}>
          <Search size={18} style={{ position: 'absolute', left: '14px', top: '12px', opacity: 0.6 }} />
          <input
            type="text"
            placeholder="Buscar por número, cliente ou área..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '10px 14px 10px 42px',
              borderRadius: '12px',
              border: '1px solid var(--card-border)',
              backgroundColor: 'rgba(0, 0, 0, 0.04)',
              color: 'var(--text-page)',
              outline: 'none'
            }}
          />
        </div>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid var(--card-border)', opacity: 0.8 }}>
              <th style={{ padding: '12px 14px', fontWeight: 700 }}>Número do Processo</th>
              <th style={{ padding: '12px 14px', fontWeight: 700 }}>Cliente</th>
              <th style={{ padding: '12px 14px', fontWeight: 700 }}>Área / Tribunal</th>
              <th style={{ padding: '12px 14px', fontWeight: 700 }}>Próximo Prazo</th>
              <th style={{ padding: '12px 14px', fontWeight: 700 }}>Status</th>
              <th style={{ padding: '12px 14px', textIndent: '-9999px' }}>Detalhes</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((proc) => {
              const isExpanded = expandedId === proc.id;

              return (
                <React.Fragment key={proc.id}>
                  <tr
                    onClick={() => setExpandedId(isExpanded ? null : proc.id)}
                    style={{
                      borderBottom: '1px solid var(--card-border)',
                      cursor: 'pointer',
                      backgroundColor: isExpanded ? 'rgba(55, 116, 255, 0.06)' : 'transparent',
                      transition: 'background-color 0.2s ease'
                    }}
                  >
                    <td style={{ padding: '16px 14px', fontWeight: 700 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <FileText size={16} color="#3774FF" />
                        <span>{proc.numero}</span>
                      </div>
                    </td>
                    <td style={{ padding: '16px 14px' }}>{proc.cliente}</td>
                    <td style={{ padding: '16px 14px' }}>
                      <div>{proc.area}</div>
                      <div style={{ fontSize: '0.78rem', opacity: 0.7 }}>{proc.tribunal}</div>
                    </td>
                    <td style={{ padding: '16px 14px' }}>
                      <span className={proc.isUrgent ? 'badge-pill-error' : 'badge-pill-success'}>
                        <Clock size={13} /> {proc.proximoPrazo}
                      </span>
                    </td>
                    <td style={{ padding: '16px 14px' }}>
                      <span className="badge-pill-success">
                        <ShieldCheck size={13} /> {proc.status}
                      </span>
                    </td>
                    <td style={{ padding: '16px 14px', textAlign: 'right' }}>
                      {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                    </td>
                  </tr>

                  {isExpanded && (
                    <tr style={{ backgroundColor: 'rgba(0, 0, 0, 0.02)', borderBottom: '1px solid var(--card-border)' }}>
                      <td colSpan={6} style={{ padding: '20px 24px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h4 style={{ fontFamily: 'var(--font-raleway)', fontWeight: 800, fontSize: '1rem' }}>
                              Histórico de Andamentos ({proc.cliente} vs. {proc.parteContraria})
                            </h4>
                            <button
                              type="button"
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px',
                                color: '#3774FF',
                                fontWeight: 700,
                                fontSize: '0.85rem'
                              }}
                            >
                              Abrir no e-SAJ / PJe <ExternalLink size={14} />
                            </button>
                          </div>

                          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            {proc.historico.map((h, i) => (
                              <div
                                key={i}
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '16px',
                                  padding: '10px 14px',
                                  borderRadius: '10px',
                                  backgroundColor: 'var(--card-bg)',
                                  border: '1px solid var(--card-border)'
                                }}
                              >
                                <span style={{ fontSize: '0.82rem', fontWeight: 700, minWidth: '90px', opacity: 0.8 }}>
                                  {h.data}
                                </span>
                                <span style={{ fontSize: '0.88rem' }}>{h.desc}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
