'use client';

import React, { useState } from 'react';
import { Search, ChevronDown, ChevronUp, User, Mail, Phone, MapPin, ExternalLink } from 'lucide-react';

const mockClientes = [
  {
    id: '1',
    nome: 'Carlos Eduardo Silva',
    tipo: 'Pessoa Física',
    documento: 'CPF: 123.456.789-00',
    email: 'carlos.silva@email.com',
    telefone: '(11) 98765-4321',
    cidade: 'São Paulo - SP',
    processosCount: 2,
    status: 'Ativo'
  },
  {
    id: '2',
    nome: 'Tech Solutions Ltda',
    tipo: 'Pessoa Jurídica',
    documento: 'CNPJ: 12.345.678/0001-90',
    email: 'contato@techsolutions.com',
    telefone: '(11) 3344-5566',
    cidade: 'Campinas - SP',
    processosCount: 5,
    status: 'Ativo'
  },
  {
    id: '3',
    nome: 'Maria Fernanda Oliveira',
    tipo: 'Pessoa Física',
    documento: 'CPF: 987.654.321-11',
    email: 'mf.oliveira@email.com',
    telefone: '(21) 99887-7665',
    cidade: 'Rio de Janeiro - RJ',
    processosCount: 1,
    status: 'Ativo'
  }
];

export default function ClientesTable() {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedId, setExpandedId] = useState(null);

  const filtered = mockClientes.filter((c) =>
    c.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.documento.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="card-glass-3d">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ fontFamily: 'var(--font-raleway)', fontSize: '1.35rem', fontWeight: 800 }}>
            Tabela de Clientes Cadastrados
          </h2>
          <p style={{ fontSize: '0.85rem', opacity: 0.75, marginTop: '2px' }}>
            Clique na linha para ver contatos completos e processos vinculados
          </p>
        </div>

        <div style={{ position: 'relative', width: '320px' }}>
          <Search size={18} style={{ position: 'absolute', left: '14px', top: '12px', opacity: 0.6 }} />
          <input
            type="text"
            placeholder="Buscar por nome, documento ou e-mail..."
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
              <th style={{ padding: '12px 14px', fontWeight: 700 }}>Nome do Cliente</th>
              <th style={{ padding: '12px 14px', fontWeight: 700 }}>Tipo / Documento</th>
              <th style={{ padding: '12px 14px', fontWeight: 700 }}>Contato</th>
              <th style={{ padding: '12px 14px', fontWeight: 700 }}>Cidade/UF</th>
              <th style={{ padding: '12px 14px', fontWeight: 700 }}>Processos</th>
              <th style={{ padding: '12px 14px', textIndent: '-9999px' }}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((cli) => {
              const isExpanded = expandedId === cli.id;

              return (
                <React.Fragment key={cli.id}>
                  <tr
                    onClick={() => setExpandedId(isExpanded ? null : cli.id)}
                    style={{
                      borderBottom: '1px solid var(--card-border)',
                      cursor: 'pointer',
                      backgroundColor: isExpanded ? 'rgba(55, 116, 255, 0.06)' : 'transparent',
                      transition: 'background-color 0.2s ease'
                    }}
                  >
                    <td style={{ padding: '16px 14px', fontWeight: 700 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <User size={18} color="#3774FF" />
                        <span>{cli.nome}</span>
                      </div>
                    </td>
                    <td style={{ padding: '16px 14px' }}>
                      <span className="badge-pill-success" style={{ fontSize: '0.75rem', marginBottom: '4px' }}>{cli.tipo}</span>
                      <div style={{ fontSize: '0.8rem', opacity: 0.75 }}>{cli.documento}</div>
                    </td>
                    <td style={{ padding: '16px 14px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem' }}>
                        <Mail size={14} color="#3774FF" />
                        <span>{cli.email}</span>
                      </div>
                    </td>
                    <td style={{ padding: '16px 14px' }}>{cli.cidade}</td>
                    <td style={{ padding: '16px 14px', fontWeight: 700 }}>{cli.processosCount} ativos</td>
                    <td style={{ padding: '16px 14px', textAlign: 'right' }}>
                      {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                    </td>
                  </tr>

                  {isExpanded && (
                    <tr style={{ backgroundColor: 'rgba(0, 0, 0, 0.02)', borderBottom: '1px solid var(--card-border)' }}>
                      <td colSpan={6} style={{ padding: '20px 24px' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <Mail size={18} color="#3774FF" />
                            <div>
                              <span style={{ fontSize: '0.78rem', opacity: 0.7, display: 'block' }}>E-mail Principal</span>
                              <span style={{ fontWeight: 600 }}>{cli.email}</span>
                            </div>
                          </div>

                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <Phone size={18} color="#3774FF" />
                            <div>
                              <span style={{ fontSize: '0.78rem', opacity: 0.7, display: 'block' }}>Telefone / WhatsApp</span>
                              <span style={{ fontWeight: 600 }}>{cli.telefone}</span>
                            </div>
                          </div>

                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <MapPin size={18} color="#3774FF" />
                            <div>
                              <span style={{ fontSize: '0.78rem', opacity: 0.7, display: 'block' }}>Localização</span>
                              <span style={{ fontWeight: 600 }}>{cli.cidade}</span>
                            </div>
                          </div>

                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                            <button
                              type="button"
                              className="action-btn-3d"
                              style={{ padding: '8px 16px', fontSize: '0.85rem' }}
                            >
                              Ver Ficha Completa <ExternalLink size={14} />
                            </button>
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
