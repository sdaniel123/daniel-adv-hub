'use client';

import React, { useState } from 'react';
import { Plus, Search, Filter, Mail, Phone, MapPin, MoreVertical, X } from 'lucide-react';
import ToastNotification from '@/components/ui/ToastNotification';

const mockClientes = [
  { id: '1', nome: 'Carlos Eduardo Silva', tipo: 'Pessoa Física', documento: 'CPF 123.456.789-00', email: 'carlos.silva@email.com', fone: '(11) 98765-4321', cidade: 'São Paulo - SP', processos: 2, status: 'Ativo' },
  { id: '2', nome: 'Tech Solutions Ltda', tipo: 'Pessoa Jurídica', documento: 'CNPJ 12.345.678/0001-90', email: 'contato@techsolutions.com', fone: '(11) 3344-5566', cidade: 'Campinas - SP', processos: 5, status: 'Ativo' },
  { id: '3', nome: 'Maria Fernanda Oliveira', tipo: 'Pessoa Física', documento: 'CPF 987.654.321-11', email: 'mf.oliveira@email.com', fone: '(21) 99887-7665', cidade: 'Rio de Janeiro - RJ', processos: 1, status: 'Ativo' },
];

export default function ClientesPage() {
  const [activeTab, setActiveTab] = useState('todos');
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [toast, setToast] = useState(null);
  const [newNome, setNewNome] = useState('');

  const filtered = mockClientes.filter((c) => {
    const matchesSearch = c.nome.toLowerCase().includes(searchTerm.toLowerCase()) || c.documento.toLowerCase().includes(searchTerm.toLowerCase());
    if (activeTab === 'pf') return matchesSearch && c.tipo === 'Pessoa Física';
    if (activeTab === 'pj') return matchesSearch && c.tipo === 'Pessoa Jurídica';
    return matchesSearch;
  });

  const handleAddCliente = (e) => {
    e.preventDefault();
    setToast(`Cliente ${newNome || 'Novo'} cadastrado com sucesso!`);
    setShowModal(false);
    setNewNome('');
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', flexWrap: 'wrap', gap: '20px' }}>
        <div>
          <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '1px' }}>
            Base de Contatos
          </span>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2.2rem', marginTop: '2px', fontWeight: 800 }}>
            Gestão de Clientes
          </h1>
        </div>

        <button type="button" className="btn-primary" onClick={() => setShowModal(true)}>
          <Plus size={18} />
          <span>Cadastrar Cliente</span>
        </button>
      </div>

      <div className="card-saas" style={{ marginBottom: '28px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button type="button" className={`tab-btn ${activeTab === 'todos' ? 'active' : ''}`} onClick={() => setActiveTab('todos')}>
              Todos os Clientes (154)
            </button>
            <button type="button" className={`tab-btn ${activeTab === 'pf' ? 'active' : ''}`} onClick={() => setActiveTab('pf')}>
              Pessoa Física (110)
            </button>
            <button type="button" className={`tab-btn ${activeTab === 'pj' ? 'active' : ''}`} onClick={() => setActiveTab('pj')}>
              Pessoa Jurídica (44)
            </button>
          </div>

          <div style={{ position: 'relative', width: '300px' }}>
            <Search size={16} style={{ position: 'absolute', left: '14px', top: '11px', color: 'var(--text-muted)' }} />
            <input
              type="text"
              placeholder="Buscar por nome ou CPF/CNPJ..."
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
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
        {filtered.map((cli) => (
          <div key={cli.id} className="card-saas">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
              <div>
                <span className="badge-saas badge-primary" style={{ marginBottom: '8px' }}>{cli.tipo}</span>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', fontWeight: 700 }}>{cli.nome}</h3>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>{cli.documento}</p>
              </div>
              <button type="button" style={{ color: 'var(--text-muted)' }}>
                <MoreVertical size={18} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.88rem', borderTop: '1px solid var(--border-light)', paddingTop: '14px', marginBottom: '18px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Mail size={15} color="var(--primary)" />
                <span>{cli.email}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Phone size={15} color="var(--primary)" />
                <span>{cli.fone}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <MapPin size={15} color="var(--primary)" />
                <span>{cli.cidade}</span>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem' }}>
              <span className="badge-saas badge-success">{cli.processos} Processos Ativos</span>
              <span style={{ color: 'var(--primary)', fontWeight: 700, cursor: 'pointer' }}>Ficha completa →</span>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="sidebar-overlay open" onClick={() => setShowModal(false)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="card-popup" onClick={(e) => e.stopPropagation()} style={{ width: '90%', maxWidth: '440px', margin: 0 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', fontWeight: 700 }}>Cadastrar Cliente</h3>
              <button type="button" onClick={() => setShowModal(false)} style={{ color: 'var(--text-muted)' }}><X size={18} /></button>
            </div>

            <form onSubmit={handleAddCliente} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>Nome Completo / Razão Social</label>
                <input
                  type="text"
                  required
                  placeholder="Nome do cliente..."
                  value={newNome}
                  onChange={(e) => setNewNome(e.target.value)}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border-light)', backgroundColor: 'var(--bg-main)', color: 'var(--text-main)', outline: 'none' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '8px' }}>
                <button type="button" onClick={() => setShowModal(false)} className="btn-secondary">Cancelar</button>
                <button type="submit" className="btn-primary">Salvar Cliente</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ToastNotification message={toast} onClose={() => setToast(null)} />
    </div>
  );
}
