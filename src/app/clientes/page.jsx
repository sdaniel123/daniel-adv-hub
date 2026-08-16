'use client';

import React, { useState } from 'react';
import { 
  Users, 
  Star, 
  Key, 
  Calendar, 
  Search, 
  Download, 
  Plus, 
  UserPlus, 
  X, 
  Mail, 
  Phone, 
  MapPin, 
  FileText, 
  CheckCircle2, 
  ShieldAlert 
} from 'lucide-react';
import ToastNotification from '@/components/ui/ToastNotification';

const mockClientes = [
  { id: '1', nome: 'Carlos Eduardo Silva', tipo: 'Pessoa Física', documento: 'CPF 123.456.789-00', rg: '12.345.678-9', email: 'carlos.silva@email.com', fone: '(11) 98765-4321', cidade: 'São Paulo - SP', processos: 2, prioritario: true, chaveAtiva: true, comProcesso: true, cadastradoEsteMes: true },
  { id: '2', nome: 'Tech Solutions Ltda', tipo: 'Pessoa Jurídica', documento: 'CNPJ 12.345.678/0001-90', rg: '-', email: 'contato@techsolutions.com', fone: '(11) 3344-5566', cidade: 'Campinas - SP', processos: 5, prioritario: false, chaveAtiva: true, comProcesso: true, cadastradoEsteMes: false },
  { id: '3', nome: 'Maria Fernanda Oliveira', tipo: 'Pessoa Física', documento: 'CPF 987.654.321-11', rg: '98.765.432-1', email: 'mf.oliveira@email.com', fone: '(21) 99887-7665', cidade: 'Rio de Janeiro - RJ', processos: 1, prioritario: true, chaveAtiva: true, comProcesso: true, cadastradoEsteMes: true },
  { id: '4', nome: 'Lucas Mendes (Menor Representado)', tipo: 'Pessoa Física', documento: 'CPF 456.789.123-44', rg: '45.678.912-3', email: 'lucas.mendes@email.com', fone: '(11) 97766-5544', cidade: 'São Paulo - SP', processos: 0, prioritario: false, chaveAtiva: false, comProcesso: false, menorIncapaz: true, cadastradoEsteMes: true },
];

export default function ClientesPage() {
  const [activeFilter, setActiveFilter] = useState('todos');
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [toast, setToast] = useState(null);
  const [newNome, setNewNome] = useState('');
  const [newDoc, setNewDoc] = useState('');
  const [newEmail, setNewEmail] = useState('');

  const filteredClientes = mockClientes.filter((cli) => {
    const term = searchTerm.toLowerCase();
    const matchesSearch = 
      cli.nome.toLowerCase().includes(term) ||
      cli.documento.toLowerCase().includes(term) ||
      cli.email.toLowerCase().includes(term) ||
      cli.fone.toLowerCase().includes(term);

    if (!matchesSearch) return false;

    if (activeFilter === 'prioritarios') return cli.prioritario;
    if (activeFilter === 'menores') return cli.menorIncapaz;
    if (activeFilter === 'com_processo') return cli.comProcesso;
    if (activeFilter === 'sem_processo') return !cli.comProcesso;

    return true;
  });

  const handleExportCSV = () => {
    const headers = 'Nome,Documento,Email,Telefone,Cidade,Processos\n';
    const rows = filteredClientes.map(c => `"${c.nome}","${c.documento}","${c.email}","${c.fone}","${c.cidade}",${c.processos}`).join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `clientes_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setToast('Relatório em CSV exportado com sucesso!');
  };

  const handleAddCliente = (e) => {
    e.preventDefault();
    setToast(`Cliente ${newNome || 'Novo'} cadastrado com sucesso!`);
    setShowModal(false);
    setNewNome('');
    setNewDoc('');
    setNewEmail('');
  };

  const totalPrioritarios = mockClientes.filter(c => c.prioritario).length;
  const totalChaveAtiva = mockClientes.filter(c => c.chaveAtiva).length;
  const totalEsteMes = mockClientes.filter(c => c.cadastradoEsteMes).length;

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
      {/* Header section with Title & Action Buttons */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <span className="page-header-subtitle">DANIEL ADV HUB</span>
          <h1 className="page-header-title">Clientes</h1>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button type="button" className="btn-secondary" onClick={handleExportCSV}>
            <Download size={15} />
            <span>Exportar CSV</span>
          </button>
          <button type="button" className="btn-primary" onClick={() => setShowModal(true)}>
            <Plus size={15} />
            <span>Novo cliente</span>
          </button>
        </div>
      </div>

      {/* 4 Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        {/* Card 1: Total de Assistidos / Clientes */}
        <div className="card-saas">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <span style={{ fontSize: '0.82rem', color: '#94A3B8', fontWeight: 500 }}>Total de Clientes</span>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: '#FFFFFF', marginTop: '4px' }}>
                {mockClientes.length}
              </div>
            </div>
            <div style={{ padding: '8px', borderRadius: '8px', backgroundColor: '#131D33', color: '#94A3B8' }}>
              <Users size={18} />
            </div>
          </div>
        </div>

        {/* Card 2: Atendimentos Prioritários */}
        <div className="card-saas">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <span style={{ fontSize: '0.82rem', color: '#94A3B8', fontWeight: 500 }}>Atendimentos Prioritários</span>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: '#F59E0B', marginTop: '4px' }}>
                {totalPrioritarios}
              </div>
            </div>
            <div style={{ padding: '8px', borderRadius: '8px', backgroundColor: '#131D33', color: '#F59E0B' }}>
              <Star size={18} />
            </div>
          </div>
        </div>

        {/* Card 3: Chave Pública Ativa */}
        <div className="card-saas">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <span style={{ fontSize: '0.82rem', color: '#94A3B8', fontWeight: 500 }}>Chave Pública Ativa</span>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: '#10B981', marginTop: '4px' }}>
                {totalChaveAtiva}
              </div>
            </div>
            <div style={{ padding: '8px', borderRadius: '8px', backgroundColor: '#131D33', color: '#10B981' }}>
              <Key size={18} />
            </div>
          </div>
        </div>

        {/* Card 4: Cadastrados este Mês */}
        <div className="card-saas">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <span style={{ fontSize: '0.82rem', color: '#94A3B8', fontWeight: 500 }}>Cadastrados este Mês</span>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: '#3B82F6', marginTop: '4px' }}>
                {totalEsteMes}
              </div>
            </div>
            <div style={{ padding: '8px', borderRadius: '8px', backgroundColor: '#131D33', color: '#3B82F6' }}>
              <CheckCircle2 size={18} />
            </div>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px', marginBottom: '20px' }}>
        <div style={{ position: 'relative', width: '380px', maxWidth: '100%' }}>
          <Search size={15} style={{ position: 'absolute', left: '12px', top: '10px', color: '#94A3B8' }} />
          <input
            type="text"
            placeholder="Buscar por nome, CPF/CNPJ, RG, e-mail ou telefone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input-dark"
          />
        </div>

        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          <button
            type="button"
            className={`pill-filter ${activeFilter === 'todos' ? 'active' : ''}`}
            onClick={() => setActiveFilter('todos')}
          >
            Todos ({mockClientes.length})
          </button>
          <button
            type="button"
            className={`pill-filter ${activeFilter === 'prioritarios' ? 'active' : ''}`}
            onClick={() => setActiveFilter('prioritarios')}
          >
            Prioritários ({totalPrioritarios})
          </button>
          <button
            type="button"
            className={`pill-filter ${activeFilter === 'menores' ? 'active' : ''}`}
            onClick={() => setActiveFilter('menores')}
          >
            Menores / Incapazes
          </button>
          <button
            type="button"
            className={`pill-filter ${activeFilter === 'com_processo' ? 'active' : ''}`}
            onClick={() => setActiveFilter('com_processo')}
          >
            Com Processo
          </button>
          <button
            type="button"
            className={`pill-filter ${activeFilter === 'sem_processo' ? 'active' : ''}`}
            onClick={() => setActiveFilter('sem_processo')}
          >
            Sem Processo
          </button>
        </div>
      </div>

      {/* Content Container */}
      <div className="card-saas" style={{ padding: filteredClientes.length === 0 ? '60px 20px' : '0', overflow: 'hidden' }}>
        {filteredClientes.length === 0 ? (
          <div style={{ textAlign: 'center', color: '#94A3B8', fontSize: '0.88rem' }}>
            Nenhum cliente encontrado com os filtros selecionados.
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.86rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #1B263B', color: '#94A3B8', fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  <th style={{ padding: '16px 20px' }}>Cliente</th>
                  <th style={{ padding: '16px 20px' }}>Documento</th>
                  <th style={{ padding: '16px 20px' }}>Contato</th>
                  <th style={{ padding: '16px 20px' }}>Cidade</th>
                  <th style={{ padding: '16px 20px' }}>Processos</th>
                  <th style={{ padding: '16px 20px', textAlign: 'right' }}>Ação</th>
                </tr>
              </thead>
              <tbody>
                {filteredClientes.map((cli) => (
                  <tr key={cli.id} style={{ borderBottom: '1px solid #162035', transition: 'background-color 0.15s ease' }}>
                    <td style={{ padding: '16px 20px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {cli.prioritario && <Star size={14} color="#F59E0B" fill="#F59E0B" />}
                        <span style={{ fontWeight: 700, color: '#FFFFFF' }}>{cli.nome}</span>
                      </div>
                      <span style={{ fontSize: '0.75rem', color: '#64748B' }}>{cli.tipo}</span>
                    </td>
                    <td style={{ padding: '16px 20px', color: '#94A3B8' }}>
                      {cli.documento}
                    </td>
                    <td style={{ padding: '16px 20px' }}>
                      <div style={{ color: '#FFFFFF' }}>{cli.email}</div>
                      <div style={{ fontSize: '0.78rem', color: '#64748B' }}>{cli.fone}</div>
                    </td>
                    <td style={{ padding: '16px 20px', color: '#94A3B8' }}>
                      {cli.cidade}
                    </td>
                    <td style={{ padding: '16px 20px' }}>
                      <span className="badge-saas badge-primary">
                        {cli.processos} ativo(s)
                      </span>
                    </td>
                    <td style={{ padding: '16px 20px', textAlign: 'right' }}>
                      <button
                        type="button"
                        style={{ color: '#3B82F6', fontWeight: 600, fontSize: '0.82rem' }}
                        onClick={() => setToast(`Abrindo detalhes de ${cli.nome}...`)}
                      >
                        Ver ficha →
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal Novo Cliente */}
      {showModal && (
        <div className="sidebar-overlay open" onClick={() => setShowModal(false)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="card-saas" onClick={(e) => e.stopPropagation()} style={{ width: '90%', maxWidth: '460px', margin: 0 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#FFFFFF' }}>Novo Cliente</h3>
              <button type="button" onClick={() => setShowModal(false)} style={{ color: '#94A3B8' }}><X size={18} /></button>
            </div>

            <form onSubmit={handleAddCliente} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '4px', color: '#94A3B8' }}>Nome Completo / Razão Social</label>
                <input
                  type="text"
                  required
                  placeholder="Nome do cliente..."
                  value={newNome}
                  onChange={(e) => setNewNome(e.target.value)}
                  className="search-input-dark"
                  style={{ paddingLeft: '12px' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '4px', color: '#94A3B8' }}>CPF ou CNPJ</label>
                <input
                  type="text"
                  placeholder="000.000.000-00"
                  value={newDoc}
                  onChange={(e) => setNewDoc(e.target.value)}
                  className="search-input-dark"
                  style={{ paddingLeft: '12px' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '4px', color: '#94A3B8' }}>E-mail</label>
                <input
                  type="email"
                  placeholder="cliente@email.com"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className="search-input-dark"
                  style={{ paddingLeft: '12px' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
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
