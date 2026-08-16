'use client';

import React, { useState } from 'react';
import { 
  Briefcase, 
  FileText, 
  Star, 
  CheckCircle2, 
  Search, 
  Download, 
  Plus, 
  X, 
  Gavel, 
  Calendar, 
  User, 
  AlertCircle 
} from 'lucide-react';
import ToastNotification from '@/components/ui/ToastNotification';

const mockProcessos = [
  { id: '1', cnj: '0001234-56.2026.8.26.0100', cliente: 'Carlos Eduardo Silva', assunto: 'Ação de Cobrança c/c Indenização', sistema: 'PJe', vara: '2ª Vara Cível - Foro Central', status: 'Em andamento', comAudiencia: true, prioritario: true, encerado: false, arquivado: false },
  { id: '2', cnj: '0098765-43.2025.8.26.0000', cliente: 'Tech Solutions Ltda', assunto: 'Recurso de Apelação Cível', sistema: 'EProc', vara: '3ª Câmara de Direito Privado', status: 'Em andamento', comAudiencia: false, prioritario: false, encerado: false, arquivado: false },
  { id: '3', cnj: '0004321-12.2024.8.16.0014', cliente: 'Maria Fernanda Oliveira', assunto: 'Revisão Contratual Bancária', sistema: 'Projudi', vara: '1ª Vara Cível de Londrina', status: 'Encerrados', comAudiencia: false, prioritario: true, encerado: true, arquivado: false },
];

export default function ProcessosPage() {
  const [activeTab, setActiveTab] = useState('em_andamento');
  const [activeSystemFilter, setActiveSystemFilter] = useState('todos');
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [toast, setToast] = useState(null);

  // Form states
  const [cnjInput, setCnjInput] = useState('');
  const [clienteInput, setClienteInput] = useState('');
  const [assuntoInput, setAssuntoInput] = useState('');

  const filteredProcessos = mockProcessos.filter((proc) => {
    const term = searchTerm.toLowerCase();
    const matchesSearch = 
      proc.cnj.toLowerCase().includes(term) ||
      proc.cliente.toLowerCase().includes(term) ||
      proc.assunto.toLowerCase().includes(term) ||
      proc.vara.toLowerCase().includes(term) ||
      proc.sistema.toLowerCase().includes(term);

    if (!matchesSearch) return false;

    // Filter by Tab state
    if (activeTab === 'em_andamento' && proc.status !== 'Em andamento') return false;
    if (activeTab === 'com_audiencia' && !proc.comAudiencia) return false;
    if (activeTab === 'encerrados' && !proc.encerado) return false;
    if (activeTab === 'arquivados' && !proc.arquivado) return false;

    // Filter by System tag
    if (activeSystemFilter === 'pje' && proc.sistema !== 'PJe') return false;
    if (activeSystemFilter === 'projudi' && proc.sistema !== 'Projudi') return false;
    if (activeSystemFilter === 'eproc' && proc.sistema !== 'EProc') return false;
    if (activeSystemFilter === 'prioritarios' && !proc.prioritario) return false;

    return true;
  });

  const handleExportCSV = () => {
    const headers = 'CNJ,Cliente,Assunto,Sistema,Vara,Status\n';
    const rows = filteredProcessos.map(p => `"${p.cnj}","${p.cliente}","${p.assunto}","${p.sistema}","${p.vara}","${p.status}"`).join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `processos_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setToast('Relatório de Processos exportado em CSV com sucesso!');
  };

  const handleAddProcesso = (e) => {
    e.preventDefault();
    setToast(`Processo ${cnjInput || 'Novo'} cadastrado com sucesso!`);
    setShowModal(false);
    setCnjInput('');
    setClienteInput('');
    setAssuntoInput('');
  };

  const totalEmAndamento = mockProcessos.filter(p => p.status === 'Em andamento').length;
  const totalJudiciais = mockProcessos.length;
  const totalPrioritarios = mockProcessos.filter(p => p.prioritario).length;
  const totalEncerrados = mockProcessos.filter(p => p.encerado).length;

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
      {/* Header section */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <span className="page-header-subtitle">DANIEL ADV HUB</span>
          <h1 className="page-header-title">Processos</h1>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button type="button" className="btn-secondary" onClick={handleExportCSV}>
            <Download size={15} />
            <span>Exportar CSV</span>
          </button>
          <button type="button" className="btn-primary" onClick={() => setShowModal(true)}>
            <Plus size={15} />
            <span>Novo processo</span>
          </button>
        </div>
      </div>

      {/* 4 Stat Cards (No procedures!) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        {/* Card 1: Processos em Andamento */}
        <div className="card-saas">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <span style={{ fontSize: '0.82rem', color: '#94A3B8', fontWeight: 500 }}>Processos em Andamento</span>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: '#FFFFFF', marginTop: '4px' }}>
                {totalEmAndamento}
              </div>
            </div>
            <div style={{ padding: '8px', borderRadius: '8px', backgroundColor: '#131D33', color: '#94A3B8' }}>
              <Briefcase size={18} />
            </div>
          </div>
        </div>

        {/* Card 2: Processos Judiciais */}
        <div className="card-saas">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <span style={{ fontSize: '0.82rem', color: '#94A3B8', fontWeight: 500 }}>Processos Judiciais</span>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: '#3B82F6', marginTop: '4px' }}>
                {totalJudiciais}
              </div>
            </div>
            <div style={{ padding: '8px', borderRadius: '8px', backgroundColor: '#131D33', color: '#3B82F6' }}>
              <FileText size={18} />
            </div>
          </div>
        </div>

        {/* Card 3: Processos Prioritários */}
        <div className="card-saas">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <span style={{ fontSize: '0.82rem', color: '#94A3B8', fontWeight: 500 }}>Processos Prioritários</span>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: '#F59E0B', marginTop: '4px' }}>
                {totalPrioritarios}
              </div>
            </div>
            <div style={{ padding: '8px', borderRadius: '8px', backgroundColor: '#131D33', color: '#F59E0B' }}>
              <Star size={18} />
            </div>
          </div>
        </div>

        {/* Card 4: Processos Encerrados */}
        <div className="card-saas">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <span style={{ fontSize: '0.82rem', color: '#94A3B8', fontWeight: 500 }}>Processos Encerrados</span>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: '#10B981', marginTop: '4px' }}>
                {totalEncerrados}
              </div>
            </div>
            <div style={{ padding: '8px', borderRadius: '8px', backgroundColor: '#131D33', color: '#10B981' }}>
              <CheckCircle2 size={18} />
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Row */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '18px', borderBottom: '1px solid #1B263B', paddingBottom: '10px' }}>
        <button
          type="button"
          className={`tab-nav-btn ${activeTab === 'em_andamento' ? 'active' : ''}`}
          onClick={() => setActiveTab('em_andamento')}
        >
          Em andamento
        </button>
        <button
          type="button"
          className={`tab-nav-btn ${activeTab === 'com_audiencia' ? 'active' : ''}`}
          onClick={() => setActiveTab('com_audiencia')}
        >
          Com audiência
        </button>
        <button
          type="button"
          className={`tab-nav-btn ${activeTab === 'encerrados' ? 'active' : ''}`}
          onClick={() => setActiveTab('encerrados')}
        >
          Encerrados
        </button>
        <button
          type="button"
          className={`tab-nav-btn ${activeTab === 'arquivados' ? 'active' : ''}`}
          onClick={() => setActiveTab('arquivados')}
        >
          Arquivados
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px', marginBottom: '20px' }}>
        <div style={{ position: 'relative', width: '420px', maxWidth: '100%' }}>
          <Search size={15} style={{ position: 'absolute', left: '12px', top: '10px', color: '#94A3B8' }} />
          <input
            type="text"
            placeholder="Buscar por número CNJ, cliente, assunto, vara ou sistema..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input-dark"
          />
        </div>

        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          <button
            type="button"
            className={`pill-filter ${activeSystemFilter === 'todos' ? 'active' : ''}`}
            onClick={() => setActiveSystemFilter('todos')}
          >
            Todos
          </button>
          <button
            type="button"
            className={`pill-filter ${activeSystemFilter === 'processos' ? 'active' : ''}`}
            onClick={() => setActiveSystemFilter('processos')}
          >
            Processos
          </button>
          <button
            type="button"
            className={`pill-filter ${activeSystemFilter === 'pje' ? 'active' : ''}`}
            onClick={() => setActiveSystemFilter('pje')}
          >
            PJe
          </button>
          <button
            type="button"
            className={`pill-filter ${activeSystemFilter === 'projudi' ? 'active' : ''}`}
            onClick={() => setActiveSystemFilter('projudi')}
          >
            Projudi
          </button>
          <button
            type="button"
            className={`pill-filter ${activeSystemFilter === 'eproc' ? 'active' : ''}`}
            onClick={() => setActiveSystemFilter('eproc')}
          >
            EProc
          </button>
          <button
            type="button"
            className={`pill-filter ${activeSystemFilter === 'prioritarios' ? 'active' : ''}`}
            onClick={() => setActiveSystemFilter('prioritarios')}
          >
            Prioritários
          </button>
        </div>
      </div>

      {/* Main Table / Empty State Area */}
      <div className="card-saas" style={{ padding: filteredProcessos.length === 0 ? '60px 20px' : '0', overflow: 'hidden' }}>
        {filteredProcessos.length === 0 ? (
          <div style={{ textAlign: 'center', color: '#94A3B8', fontSize: '0.88rem' }}>
            Nenhum processo encontrado com os filtros selecionados.
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.86rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #1B263B', color: '#94A3B8', fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  <th style={{ padding: '16px 20px' }}>Número CNJ</th>
                  <th style={{ padding: '16px 20px' }}>Cliente / Parte</th>
                  <th style={{ padding: '16px 20px' }}>Assunto</th>
                  <th style={{ padding: '16px 20px' }}>Vara / Sistema</th>
                  <th style={{ padding: '16px 20px' }}>Status</th>
                  <th style={{ padding: '16px 20px', textAlign: 'right' }}>Ação</th>
                </tr>
              </thead>
              <tbody>
                {filteredProcessos.map((proc) => (
                  <tr key={proc.id} style={{ borderBottom: '1px solid #162035', transition: 'background-color 0.15s ease' }}>
                    <td style={{ padding: '16px 20px' }}>
                      <div style={{ fontWeight: 700, color: '#FFFFFF', fontFamily: 'monospace' }}>{proc.cnj}</div>
                      {proc.prioritario && (
                        <span className="badge-saas badge-warning" style={{ marginTop: '4px' }}>
                          <Star size={10} /> Prioritário
                        </span>
                      )}
                    </td>
                    <td style={{ padding: '16px 20px', color: '#FFFFFF', fontWeight: 600 }}>
                      {proc.cliente}
                    </td>
                    <td style={{ padding: '16px 20px', color: '#94A3B8' }}>
                      {proc.assunto}
                    </td>
                    <td style={{ padding: '16px 20px' }}>
                      <div style={{ color: '#FFFFFF' }}>{proc.vara}</div>
                      <span className="badge-saas badge-primary" style={{ marginTop: '4px' }}>
                        {proc.sistema}
                      </span>
                    </td>
                    <td style={{ padding: '16px 20px' }}>
                      <span className={`badge-saas ${proc.encerado ? 'badge-success' : 'badge-primary'}`}>
                        {proc.status}
                      </span>
                    </td>
                    <td style={{ padding: '16px 20px', textAlign: 'right' }}>
                      <button
                        type="button"
                        style={{ color: '#3B82F6', fontWeight: 600, fontSize: '0.82rem' }}
                        onClick={() => setToast(`Abrindo detalhes do processo ${proc.cnj}...`)}
                      >
                        Ver autos →
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal Novo Processo */}
      {showModal && (
        <div className="sidebar-overlay open" onClick={() => setShowModal(false)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="card-saas" onClick={(e) => e.stopPropagation()} style={{ width: '90%', maxWidth: '460px', margin: 0 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#FFFFFF' }}>Novo Processo</h3>
              <button type="button" onClick={() => setShowModal(false)} style={{ color: '#94A3B8' }}><X size={18} /></button>
            </div>

            <form onSubmit={handleAddProcesso} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '4px', color: '#94A3B8' }}>Número CNJ</label>
                <input
                  type="text"
                  required
                  placeholder="0000000-00.2026.8.26.0000"
                  value={cnjInput}
                  onChange={(e) => setCnjInput(e.target.value)}
                  className="search-input-dark"
                  style={{ paddingLeft: '12px' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '4px', color: '#94A3B8' }}>Cliente</label>
                <input
                  type="text"
                  required
                  placeholder="Nome do cliente..."
                  value={clienteInput}
                  onChange={(e) => setClienteInput(e.target.value)}
                  className="search-input-dark"
                  style={{ paddingLeft: '12px' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '4px', color: '#94A3B8' }}>Assunto / Ação</label>
                <input
                  type="text"
                  placeholder="Ex: Ação de Cobrança"
                  value={assuntoInput}
                  onChange={(e) => setAssuntoInput(e.target.value)}
                  className="search-input-dark"
                  style={{ paddingLeft: '12px' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
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
