'use client';

import React, { useState } from 'react';
import { 
  CheckSquare, 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  Search, 
  Download, 
  Plus, 
  List, 
  Kanban, 
  X, 
  Calendar, 
  User, 
  AlertOctagon, 
  ChevronDown, 
  Filter 
} from 'lucide-react';
import ToastNotification from '@/components/ui/ToastNotification';

const mockTarefas = [
  { id: '1', titulo: 'Elaborar Réplica à Contestação', processo: 'CNJ 0001234-56.2026.8.26.0100', cliente: 'Carlos Eduardo Silva', responsavel: 'Dr. Daniel Simões', vencimento: '18/08/2026', urgencia: true, status: 'Pendente', coluna: 'A Fazer' },
  { id: '2', titulo: 'Protocolar Agravo de Instrumento', processo: 'CNJ 0098765-43.2025.8.26.0000', cliente: 'Tech Solutions Ltda', responsavel: 'Dr. Daniel Simões', vencimento: '17/08/2026', urgencia: true, status: 'Vencendo', coluna: 'Em Andamento' },
  { id: '3', titulo: 'Solicitar Guia de Custas Iniciais', processo: 'CNJ 0004321-12.2024.8.16.0014', cliente: 'Maria Fernanda Oliveira', responsavel: 'Assistente Jurídico', vencimento: '22/08/2026', urgencia: false, status: 'Pendente', coluna: 'A Fazer' },
  { id: '4', titulo: 'Juntar Procuração e Substabelecimento', processo: 'CNJ 0001234-56.2026.8.26.0100', cliente: 'Carlos Eduardo Silva', responsavel: 'Assistente Jurídico', vencimento: '12/08/2026', urgencia: false, status: 'Concluida', coluna: 'Concluído' },
];

export default function TarefasPage() {
  const [activeTab, setActiveTab] = useState('todas');
  const [viewMode, setViewMode] = useState('lista'); // 'lista' or 'kanban'
  const [searchTerm, setSearchTerm] = useState('');
  const [responsavelFilter, setResponsavelFilter] = useState('todos');
  const [apenasUrgentes, setApenasUrgentes] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [toast, setToast] = useState(null);

  // Modal input states
  const [tituloInput, setTituloInput] = useState('');
  const [processoInput, setProcessoInput] = useState('');

  const filteredTarefas = mockTarefas.filter((task) => {
    const term = searchTerm.toLowerCase();
    const matchesSearch = 
      task.titulo.toLowerCase().includes(term) ||
      task.processo.toLowerCase().includes(term) ||
      task.cliente.toLowerCase().includes(term);

    if (!matchesSearch) return false;

    if (apenasUrgentes && !task.urgencia) return false;

    if (activeTab === 'minhas' && task.responsavel !== 'Dr. Daniel Simões') return false;
    if (activeTab === 'urgencias' && !task.urgencia) return false;
    if (activeTab === 'concluidas' && task.status !== 'Concluida') return false;

    if (responsavelFilter !== 'todos' && task.responsavel.toLowerCase() !== responsavelFilter.toLowerCase()) return false;

    return true;
  });

  const handleExportCSV = () => {
    const headers = 'Titulo,Processo,Cliente,Responsavel,Vencimento,Urgente,Status\n';
    const rows = filteredTarefas.map(t => `"${t.titulo}","${t.processo}","${t.cliente}","${t.responsavel}","${t.vencimento}",${t.urgencia},"${t.status}"`).join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `tarefas_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setToast('Relatório de Tarefas exportado em CSV com sucesso!');
  };

  const handleAddTarefa = (e) => {
    e.preventDefault();
    setToast(`Tarefa "${tituloInput || 'Nova'}" adicionada com sucesso!`);
    setShowModal(false);
    setTituloInput('');
    setProcessoInput('');
  };

  const totalPendentes = mockTarefas.filter(t => t.status === 'Pendente').length;
  const totalVencendo2Dias = mockTarefas.filter(t => t.status === 'Vencendo').length;
  const totalAtrasadas = mockTarefas.filter(t => t.status === 'Atrasado').length;
  const totalConcluidas = mockTarefas.filter(t => t.status === 'Concluida').length;

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
      {/* Header section */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <span className="page-header-subtitle">DANIEL ADV HUB</span>
          <h1 className="page-header-title">Tarefas</h1>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button type="button" className="btn-secondary" onClick={handleExportCSV}>
            <Download size={15} />
            <span>Exportar CSV</span>
          </button>
          <button type="button" className="btn-primary" onClick={() => setShowModal(true)}>
            <Plus size={15} />
            <span>Nova tarefa</span>
          </button>
        </div>
      </div>

      {/* 4 Stat Cards (No revision!) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        {/* Card 1: Tarefas Pendentes */}
        <div className="card-saas">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <span style={{ fontSize: '0.82rem', color: '#94A3B8', fontWeight: 500 }}>Tarefas Pendentes</span>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: '#FFFFFF', marginTop: '4px' }}>
                {totalPendentes}
              </div>
            </div>
            <div style={{ padding: '8px', borderRadius: '8px', backgroundColor: '#131D33', color: '#94A3B8' }}>
              <CheckSquare size={18} />
            </div>
          </div>
        </div>

        {/* Card 2: Vencendo nos Próx. 2 Dias */}
        <div className="card-saas">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <span style={{ fontSize: '0.82rem', color: '#94A3B8', fontWeight: 500 }}>Vencendo nos Próx. 2 Dias</span>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: '#F59E0B', marginTop: '4px' }}>
                {totalVencendo2Dias}
              </div>
            </div>
            <div style={{ padding: '8px', borderRadius: '8px', backgroundColor: '#131D33', color: '#F59E0B' }}>
              <Clock size={18} />
            </div>
          </div>
        </div>

        {/* Card 3: Prazos Atrasados */}
        <div className="card-saas">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <span style={{ fontSize: '0.82rem', color: '#94A3B8', fontWeight: 500 }}>Prazos Atrasados</span>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: '#EF4444', marginTop: '4px' }}>
                {totalAtrasadas}
              </div>
            </div>
            <div style={{ padding: '8px', borderRadius: '8px', backgroundColor: '#131D33', color: '#EF4444' }}>
              <AlertTriangle size={18} />
            </div>
          </div>
        </div>

        {/* Card 4: Tarefas Concluídas (Replaced Aguardando Revisão) */}
        <div className="card-saas">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <span style={{ fontSize: '0.82rem', color: '#94A3B8', fontWeight: 500 }}>Tarefas Concluídas</span>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: '#A855F7', marginTop: '4px' }}>
                {totalConcluidas}
              </div>
            </div>
            <div style={{ padding: '8px', borderRadius: '8px', backgroundColor: '#131D33', color: '#A855F7' }}>
              <CheckCircle2 size={18} />
            </div>
          </div>
        </div>
      </div>

      {/* Tabs & View Selector Row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px', marginBottom: '18px', borderBottom: '1px solid #1B263B', paddingBottom: '10px' }}>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <button
            type="button"
            className={`tab-nav-btn ${activeTab === 'todas' ? 'active' : ''}`}
            onClick={() => setActiveTab('todas')}
          >
            Todas as Tarefas
          </button>
          <button
            type="button"
            className={`tab-nav-btn ${activeTab === 'minhas' ? 'active' : ''}`}
            onClick={() => setActiveTab('minhas')}
          >
            Minhas Tarefas
          </button>
          <button
            type="button"
            className={`tab-nav-btn ${activeTab === 'urgencias' ? 'active' : ''}`}
            onClick={() => setActiveTab('urgencias')}
          >
            Urgências
          </button>
          <button
            type="button"
            className={`tab-nav-btn ${activeTab === 'concluidas' ? 'active' : ''}`}
            onClick={() => setActiveTab('concluidas')}
          >
            Concluídas
          </button>
          <button
            type="button"
            className={`tab-nav-btn ${activeTab === 'gestao' ? 'active' : ''}`}
            onClick={() => setActiveTab('gestao')}
          >
            Gestão de Tarefas
          </button>
        </div>

        {/* View mode toggle (Lista | Quadro Kanban) */}
        <div style={{ display: 'flex', backgroundColor: '#0B101D', padding: '3px', borderRadius: '8px', border: '1px solid #1B263B' }}>
          <button
            type="button"
            onClick={() => setViewMode('lista')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '5px 12px',
              borderRadius: '6px',
              fontSize: '0.8rem',
              fontWeight: 600,
              backgroundColor: viewMode === 'lista' ? '#FFFFFF' : 'transparent',
              color: viewMode === 'lista' ? '#070A12' : '#94A3B8',
              transition: 'all 0.15s ease'
            }}
          >
            <List size={14} /> Lista
          </button>
          <button
            type="button"
            onClick={() => setViewMode('kanban')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '5px 12px',
              borderRadius: '6px',
              fontSize: '0.8rem',
              fontWeight: 600,
              backgroundColor: viewMode === 'kanban' ? '#FFFFFF' : 'transparent',
              color: viewMode === 'kanban' ? '#070A12' : '#94A3B8',
              transition: 'all 0.15s ease'
            }}
          >
            <Kanban size={14} /> Quadro Kanban
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px', marginBottom: '20px' }}>
        <div style={{ display: 'flex', gap: '10px', flex: 1, minWidth: '280px', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', width: '360px', maxWidth: '100%' }}>
            <Search size={15} style={{ position: 'absolute', left: '12px', top: '10px', color: '#94A3B8' }} />
            <input
              type="text"
              placeholder="Buscar por título, caso ou cliente..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input-dark"
            />
          </div>

          <select
            value={responsavelFilter}
            onChange={(e) => setResponsavelFilter(e.target.value)}
            className="search-input-dark"
            style={{ width: '220px', paddingLeft: '12px', cursor: 'pointer' }}
          >
            <option value="todos">Todos os Responsáveis</option>
            <option value="dr. daniel simões">Dr. Daniel Simões</option>
            <option value="assistente jurídico">Assistente Jurídico</option>
          </select>
        </div>

        {/* Toggle Apenas Urgentes */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '0.82rem', color: '#94A3B8', fontWeight: 500 }}>Apenas Urgentes</span>
          <button
            type="button"
            onClick={() => setApenasUrgentes(!apenasUrgentes)}
            style={{
              width: '42px',
              height: '22px',
              borderRadius: '12px',
              backgroundColor: apenasUrgentes ? '#3B82F6' : '#1B263B',
              position: 'relative',
              transition: 'background-color 0.2s ease',
              padding: '2px'
            }}
          >
            <div
              style={{
                width: '18px',
                height: '18px',
                borderRadius: '50%',
                backgroundColor: '#FFFFFF',
                transform: apenasUrgentes ? 'translateX(20px)' : 'translateX(0px)',
                transition: 'transform 0.2s ease'
              }}
            />
          </button>
        </div>
      </div>

      {/* Main Content Area: List View OR Kanban View */}
      {viewMode === 'lista' ? (
        <div className="card-saas" style={{ padding: filteredTarefas.length === 0 ? '60px 20px' : '0', overflow: 'hidden' }}>
          {filteredTarefas.length === 0 ? (
            <div style={{ textAlign: 'center', color: '#94A3B8', fontSize: '0.88rem' }}>
              Nenhuma tarefa encontrada para os filtros selecionados.
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.86rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #1B263B', color: '#94A3B8', fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    <th style={{ padding: '16px 20px' }}>Tarefa</th>
                    <th style={{ padding: '16px 20px' }}>Processo / Cliente</th>
                    <th style={{ padding: '16px 20px' }}>Responsável</th>
                    <th style={{ padding: '16px 20px' }}>Vencimento</th>
                    <th style={{ padding: '16px 20px' }}>Status</th>
                    <th style={{ padding: '16px 20px', textAlign: 'right' }}>Ação</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTarefas.map((task) => (
                    <tr key={task.id} style={{ borderBottom: '1px solid #162035', transition: 'background-color 0.15s ease' }}>
                      <td style={{ padding: '16px 20px' }}>
                        <div style={{ fontWeight: 700, color: '#FFFFFF' }}>{task.titulo}</div>
                        {task.urgencia && (
                          <span className="badge-saas badge-danger" style={{ marginTop: '4px' }}>
                            Urgente
                          </span>
                        )}
                      </td>
                      <td style={{ padding: '16px 20px' }}>
                        <div style={{ color: '#FFFFFF', fontSize: '0.82rem' }}>{task.cliente}</div>
                        <div style={{ fontSize: '0.75rem', color: '#64748B', fontFamily: 'monospace' }}>{task.processo}</div>
                      </td>
                      <td style={{ padding: '16px 20px', color: '#94A3B8' }}>
                        {task.responsavel}
                      </td>
                      <td style={{ padding: '16px 20px', color: task.status === 'Vencendo' ? '#F59E0B' : '#94A3B8', fontWeight: task.status === 'Vencendo' ? 700 : 400 }}>
                        {task.vencimento}
                      </td>
                      <td style={{ padding: '16px 20px' }}>
                        <span className={`badge-saas ${task.status === 'Concluida' ? 'badge-success' : task.status === 'Vencendo' ? 'badge-warning' : 'badge-primary'}`}>
                          {task.status}
                        </span>
                      </td>
                      <td style={{ padding: '16px 20px', textAlign: 'right' }}>
                        <button
                          type="button"
                          style={{ color: '#3B82F6', fontWeight: 600, fontSize: '0.82rem' }}
                          onClick={() => setToast(`Abrindo detalhes da tarefa "${task.titulo}"...`)}
                        >
                          Concluir →
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      ) : (
        /* Kanban View */
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '18px' }}>
          {['A Fazer', 'Em Andamento', 'Concluído'].map((col) => {
            const colTasks = filteredTarefas.filter(t => t.coluna === col || (col === 'Concluído' && t.status === 'Concluida'));
            return (
              <div key={col} className="card-saas" style={{ backgroundColor: '#0B101D' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', paddingBottom: '10px', borderBottom: '1px solid #1B263B' }}>
                  <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#FFFFFF' }}>{col}</h3>
                  <span style={{ fontSize: '0.75rem', color: '#94A3B8', backgroundColor: '#131D33', padding: '2px 8px', borderRadius: '10px' }}>
                    {colTasks.length}
                  </span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {colTasks.map((t) => (
                    <div key={t.id} style={{ backgroundColor: '#0E1526', border: '1px solid #1B263B', borderRadius: '8px', padding: '14px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                        {t.urgencia && <span className="badge-saas badge-danger">Urgente</span>}
                        <span style={{ fontSize: '0.72rem', color: '#64748B' }}>Vence {t.vencimento}</span>
                      </div>
                      <h4 style={{ fontSize: '0.88rem', fontWeight: 700, color: '#FFFFFF', marginBottom: '6px' }}>{t.titulo}</h4>
                      <p style={{ fontSize: '0.78rem', color: '#94A3B8', marginBottom: '10px' }}>{t.cliente}</p>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.72rem', color: '#64748B', borderTop: '1px solid #162035', paddingTop: '8px' }}>
                        <span>{t.responsavel}</span>
                        <span style={{ color: '#3B82F6', cursor: 'pointer' }}>Ver card</span>
                      </div>
                    </div>
                  ))}
                  {colTasks.length === 0 && (
                    <div style={{ textAlign: 'center', padding: '24px 10px', color: '#64748B', fontSize: '0.8rem', fontStyle: 'italic' }}>
                      Nenhuma tarefa nesta coluna
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal Nova Tarefa */}
      {showModal && (
        <div className="sidebar-overlay open" onClick={() => setShowModal(false)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="card-saas" onClick={(e) => e.stopPropagation()} style={{ width: '90%', maxWidth: '460px', margin: 0 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#FFFFFF' }}>Nova Tarefa</h3>
              <button type="button" onClick={() => setShowModal(false)} style={{ color: '#94A3B8' }}><X size={18} /></button>
            </div>

            <form onSubmit={handleAddTarefa} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '4px', color: '#94A3B8' }}>Título da Tarefa</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Elaborar Réplica..."
                  value={tituloInput}
                  onChange={(e) => setTituloInput(e.target.value)}
                  className="search-input-dark"
                  style={{ paddingLeft: '12px' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '4px', color: '#94A3B8' }}>Processo / Caso Relacionado</label>
                <input
                  type="text"
                  placeholder="Selecione ou digite o CNJ..."
                  value={processoInput}
                  onChange={(e) => setProcessoInput(e.target.value)}
                  className="search-input-dark"
                  style={{ paddingLeft: '12px' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button type="button" onClick={() => setShowModal(false)} className="btn-secondary">Cancelar</button>
                <button type="submit" className="btn-primary">Salvar Tarefa</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ToastNotification message={toast} onClose={() => setToast(null)} />
    </div>
  );
}
