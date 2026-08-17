'use client';

import React, { useState, useEffect } from 'react';
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
  Calendar, 
  User, 
  Tag, 
  Briefcase, 
  Archive,
  ChevronRight
} from 'lucide-react';
import ToastNotification from '@/components/ui/ToastNotification';
import FormTarefaModal from '@/components/tarefas/FormTarefaModal';
import DetalhesTarefaModal from '@/components/tarefas/DetalhesTarefaModal';
import GestaoTiposModal from '@/components/tarefas/GestaoTiposModal';
import { 
  getTarefasSalvas, 
  salvarTarefas, 
  ordenarTarefas, 
  calcularStatusPrazo, 
  formatarDataExibicao 
} from '@/lib/tarefasStore';

export default function TarefasPage() {
  const [tarefas, setTarefas] = useState([]);
  const [activeTab, setActiveTab] = useState('pendentes'); // 'pendentes' | 'todas' | 'urgentes' | 'arquivadas'
  const [viewMode, setViewMode] = useState('lista'); // 'lista' | 'kanban'
  const [searchTerm, setSearchTerm] = useState('');
  const [apenasUrgentes, setApenasUrgentes] = useState(false);

  // Modals state
  const [showFormModal, setShowFormModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);
  const [showTiposModal, setShowTiposModal] = useState(false);

  const [toast, setToast] = useState(null);

  // Carregar tarefas salvas
  useEffect(() => {
    const list = getTarefasSalvas();
    setTarefas(ordenarTarefas(list));
  }, []);

  const updateTarefasState = (newList) => {
    const sorted = ordenarTarefas(newList);
    setTarefas(sorted);
    salvarTarefas(sorted);
  };

  // Handler para salvar/criar tarefa
  const handleSaveTask = (taskPayload) => {
    let updated;
    const exists = tarefas.some(t => t.id === taskPayload.id);

    if (exists) {
      updated = tarefas.map(t => t.id === taskPayload.id ? taskPayload : t);
      setToast(`Tarefa "${taskPayload.tipo}" atualizada com sucesso!`);
    } else {
      updated = [taskPayload, ...tarefas];
      setToast(`Nova tarefa "${taskPayload.tipo}" cadastrada com sucesso!`);
    }

    updateTarefasState(updated);
    setShowFormModal(false);
    setEditingTask(null);
  };

  // Handler para atualizar tarefa individual (ex: via modal de detalhes)
  const handleUpdateSingleTask = (updatedTask) => {
    const updatedList = tarefas.map(t => t.id === updatedTask.id ? updatedTask : t);
    updateTarefasState(updatedList);
    setSelectedTask(updatedTask);
    setToast(`Tarefa "${updatedTask.tipo}" atualizada!`);
  };

  // Handler para apagar tarefa
  const handleDeleteTask = (taskId) => {
    const updatedList = tarefas.filter(t => t.id !== taskId);
    updateTarefasState(updatedList);
    setToast('Tarefa removida com sucesso!');
    setSelectedTask(null);
  };

  // Filtragem e Ordenação da lista
  const filteredTarefas = tarefas.filter((task) => {
    const term = searchTerm.toLowerCase();
    const matchesSearch = 
      (task.tipo && task.tipo.toLowerCase().includes(term)) ||
      (task.processo && task.processo.toLowerCase().includes(term)) ||
      (task.cliente && task.cliente.toLowerCase().includes(term)) ||
      (task.anotacoes && task.anotacoes.toLowerCase().includes(term));

    if (!matchesSearch) return false;
    if (apenasUrgentes && !task.urgente) return false;

    // Filtros por aba
    if (activeTab === 'pendentes') {
      return task.status === 'Pendente' || task.status === 'Em andamento';
    }
    if (activeTab === 'urgentes') {
      return task.urgente && task.status !== 'Concluída' && task.status !== 'Arquivada';
    }
    if (activeTab === 'arquivadas') {
      return task.status === 'Concluída' || task.status === 'Arquivada';
    }

    return true; // 'todas'
  });

  // Exportar CSV
  const handleExportCSV = () => {
    const headers = 'Tipo,Prazo,Processo,Cliente,Urgente,Status,Anotacoes\n';
    const rows = filteredTarefas.map(t =>
      `"${t.tipo}","${t.prazo}","${t.processo || ''}","${t.cliente || ''}",${t.urgente},"${t.status}","${(t.anotacoes || '').replace(/"/g, '""')}"`
    ).join('\n');

    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `tarefas_hub_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setToast('Relatório de Tarefas exportado em CSV com sucesso!');
  };

  // Estatísticas dos Cards
  const totalPendentes = tarefas.filter(t => t.status === 'Pendente' || t.status === 'Em andamento').length;
  const totalVencendo2Dias = tarefas.filter(t => {
    if (t.status === 'Concluída' || t.status === 'Arquivada') return false;
    const info = calcularStatusPrazo(t.prazo, t.status);
    return info.diffDias >= 0 && info.diffDias <= 2;
  }).length;
  const totalAtrasadas = tarefas.filter(t => {
    if (t.status === 'Concluída' || t.status === 'Arquivada') return false;
    const info = calcularStatusPrazo(t.prazo, t.status);
    return info.isVencida;
  }).length;
  const totalArquivadas = tarefas.filter(t => t.status === 'Concluída' || t.status === 'Arquivada').length;

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
      
      {/* Header section */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <span className="page-header-subtitle">DANIEL ADV HUB</span>
          <h1 className="page-header-title">Tarefas e Prazos</h1>
        </div>

        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button type="button" className="btn-secondary" onClick={() => setShowTiposModal(true)}>
            <Tag size={15} />
            <span>Gestão de Tipos</span>
          </button>

          <button type="button" className="btn-secondary" onClick={handleExportCSV}>
            <Download size={15} />
            <span>Exportar CSV</span>
          </button>

          <button
            type="button"
            className="btn-primary"
            onClick={() => {
              setEditingTask(null);
              setShowFormModal(true);
            }}
          >
            <Plus size={15} />
            <span>Nova tarefa</span>
          </button>
        </div>
      </div>

      {/* 4 Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        {/* Card 1: Tarefas Ativas / Pendentes */}
        <div className="card-saas">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <span style={{ fontSize: '0.82rem', color: '#94A3B8', fontWeight: 500 }}>Tarefas Pendentes</span>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: '#FFFFFF', marginTop: '4px' }}>
                {totalPendentes}
              </div>
            </div>
            <div style={{ padding: '8px', borderRadius: '8px', backgroundColor: '#131D33', color: '#3B82F6' }}>
              <CheckSquare size={18} />
            </div>
          </div>
        </div>

        {/* Card 2: Vencendo nos Próx. 2 Dias */}
        <div className="card-saas">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <span style={{ fontSize: '0.82rem', color: '#94A3B8', fontWeight: 500 }}>Vencendo em 2 Dias</span>
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
              <span style={{ fontSize: '0.82rem', color: '#94A3B8', fontWeight: 500 }}>Prazos Vencidos</span>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: '#EF4444', marginTop: '4px' }}>
                {totalAtrasadas}
              </div>
            </div>
            <div style={{ padding: '8px', borderRadius: '8px', backgroundColor: '#131D33', color: '#EF4444' }}>
              <AlertTriangle size={18} />
            </div>
          </div>
        </div>

        {/* Card 4: Concluídas / Arquivadas */}
        <div className="card-saas">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <span style={{ fontSize: '0.82rem', color: '#94A3B8', fontWeight: 500 }}>Concluídas e Arquivadas</span>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: '#10B981', marginTop: '4px' }}>
                {totalArquivadas}
              </div>
            </div>
            <div style={{ padding: '8px', borderRadius: '8px', backgroundColor: '#131D33', color: '#10B981' }}>
              <Archive size={18} />
            </div>
          </div>
        </div>
      </div>

      {/* Navegação por Abas e Seletor de Visão */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px', marginBottom: '18px', borderBottom: '1px solid #1B263B', paddingBottom: '10px' }}>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <button
            type="button"
            className={`tab-nav-btn ${activeTab === 'pendentes' ? 'active' : ''}`}
            onClick={() => setActiveTab('pendentes')}
          >
            Pendentes e Em Andamento ({totalPendentes})
          </button>
          <button
            type="button"
            className={`tab-nav-btn ${activeTab === 'todas' ? 'active' : ''}`}
            onClick={() => setActiveTab('todas')}
          >
            Todas as Tarefas ({tarefas.length})
          </button>
          <button
            type="button"
            className={`tab-nav-btn ${activeTab === 'urgentes' ? 'active' : ''}`}
            onClick={() => setActiveTab('urgentes')}
          >
            Urgências
          </button>
          <button
            type="button"
            className={`tab-nav-btn ${activeTab === 'arquivadas' ? 'active' : ''}`}
            onClick={() => setActiveTab('arquivadas')}
          >
            Arquivadas / Concluídas ({totalArquivadas})
          </button>
        </div>

        {/* Toggle de Visualização (Lista vs Kanban) */}
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
              transition: 'all 0.15s ease',
              cursor: 'pointer'
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
              transition: 'all 0.15s ease',
              cursor: 'pointer'
            }}
          >
            <Kanban size={14} /> Quadro Kanban
          </button>
        </div>
      </div>

      {/* Barra de Filtro e Busca */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px', marginBottom: '20px' }}>
        <div style={{ position: 'relative', width: '380px', maxWidth: '100%' }}>
          <Search size={15} style={{ position: 'absolute', left: '12px', top: '12px', color: '#94A3B8' }} />
          <input
            type="text"
            placeholder="Buscar por tipo, processo ou cliente..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input-dark"
            style={{ paddingLeft: '38px', width: '100%' }}
          />
        </div>

        {/* Toggle Apenas Urgentes */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '0.82rem', color: '#94A3B8', fontWeight: 500 }}>Filtrar Urgentes</span>
          <button
            type="button"
            onClick={() => setApenasUrgentes(!apenasUrgentes)}
            style={{
              width: '42px',
              height: '22px',
              borderRadius: '12px',
              backgroundColor: apenasUrgentes ? '#EF4444' : '#1B263B',
              position: 'relative',
              transition: 'background-color 0.2s ease',
              padding: '2px',
              cursor: 'pointer'
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

      {/* Lista Principal de Tarefas (Organizadas por Vencimento e Urgência) */}
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
                    <th style={{ padding: '16px 20px' }}>Tipo de Tarefa</th>
                    <th style={{ padding: '16px 20px' }}>Status do Prazo</th>
                    <th style={{ padding: '16px 20px' }}>Vencimento</th>
                    <th style={{ padding: '16px 20px' }}>Processo / Cliente</th>
                    <th style={{ padding: '16px 20px' }}>Status</th>
                    <th style={{ padding: '16px 20px', textAlign: 'right' }}>Ação</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTarefas.map((task) => {
                    const infoPrazo = calcularStatusPrazo(task.prazo, task.status);
                    return (
                      <tr
                        key={task.id}
                        onClick={() => setSelectedTask(task)}
                        style={{
                          borderBottom: '1px solid #162035',
                          cursor: 'pointer',
                          transition: 'background-color 0.15s ease',
                          backgroundColor: task.urgente ? 'rgba(239, 68, 68, 0.03)' : 'transparent'
                        }}
                        className="table-row-hover"
                      >
                        <td style={{ padding: '16px 20px' }}>
                          <div style={{ fontWeight: 700, color: '#FFFFFF', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            {task.tipo}
                            {task.urgente && (
                              <span className="badge-saas badge-danger" style={{ fontSize: '0.7rem' }}>
                                Urgente
                              </span>
                            )}
                          </div>
                          {task.anotacoes && (
                            <div style={{ fontSize: '0.76rem', color: '#64748B', marginTop: '2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '300px' }}>
                              {task.anotacoes}
                            </div>
                          )}
                        </td>

                        {/* Status do Prazo (Ex: Vence em X dias / Vencida há X dias) */}
                        <td style={{ padding: '16px 20px' }}>
                          <span className={`badge-saas ${infoPrazo.badgeClass}`} style={{ fontWeight: 600 }}>
                            {infoPrazo.texto}
                          </span>
                        </td>

                        <td style={{ padding: '16px 20px', color: '#CBD5E1', fontWeight: 500 }}>
                          {formatarDataExibicao(task.prazo)}
                        </td>

                        <td style={{ padding: '16px 20px' }}>
                          <div style={{ color: '#FFFFFF', fontSize: '0.82rem', fontWeight: 600 }}>
                            {task.cliente || 'Sem cliente'}
                          </div>
                          <div style={{ fontSize: '0.75rem', color: '#64748B', fontFamily: 'monospace' }}>
                            {task.processo ? `CNJ: ${task.processo}` : 'Sem processo'}
                          </div>
                        </td>

                        <td style={{ padding: '16px 20px' }}>
                          <span className={`badge-saas ${
                            task.status === 'Concluída' || task.status === 'Arquivada' 
                              ? 'badge-success' 
                              : task.status === 'Em andamento' 
                              ? 'badge-warning' 
                              : 'badge-primary'
                          }`}>
                            {task.status}
                          </span>
                        </td>

                        <td style={{ padding: '16px 20px', textAlign: 'right' }}>
                          <button
                            type="button"
                            style={{ color: '#3B82F6', fontWeight: 600, fontSize: '0.82rem', display: 'inline-flex', alignItems: 'center', gap: '4px', backgroundColor: 'transparent' }}
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedTask(task);
                            }}
                          >
                            Ver detalhes <ChevronRight size={14} />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      ) : (
        /* Quadro Kanban */
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '18px' }}>
          {['Pendente', 'Em andamento', 'Concluída'].map((colStatus) => {
            const colTasks = filteredTarefas.filter(t => t.status === colStatus || (colStatus === 'Concluída' && t.status === 'Arquivada'));
            return (
              <div key={colStatus} className="card-saas" style={{ backgroundColor: '#0B101D' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', paddingBottom: '10px', borderBottom: '1px solid #1B263B' }}>
                  <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#FFFFFF' }}>{colStatus}</h3>
                  <span style={{ fontSize: '0.75rem', color: '#94A3B8', backgroundColor: '#131D33', padding: '2px 8px', borderRadius: '10px' }}>
                    {colTasks.length}
                  </span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {colTasks.map((t) => {
                    const infoPrazo = calcularStatusPrazo(t.prazo, t.status);
                    return (
                      <div
                        key={t.id}
                        onClick={() => setSelectedTask(t)}
                        style={{
                          backgroundColor: '#0E1526',
                          border: '1px solid #1B263B',
                          borderRadius: '8px',
                          padding: '14px',
                          cursor: 'pointer',
                          transition: 'transform 0.15s ease, border-color 0.15s ease'
                        }}
                        className="kanban-card-hover"
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', flexWrap: 'wrap', gap: '4px' }}>
                          <span className={`badge-saas ${infoPrazo.badgeClass}`} style={{ fontSize: '0.68rem' }}>
                            {infoPrazo.texto}
                          </span>
                          {t.urgente && <span className="badge-saas badge-danger" style={{ fontSize: '0.68rem' }}>Urgente</span>}
                        </div>

                        <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#FFFFFF', marginBottom: '6px' }}>
                          {t.tipo}
                        </h4>

                        <p style={{ fontSize: '0.78rem', color: '#94A3B8', marginBottom: '10px' }}>
                          {t.cliente}
                        </p>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.72rem', color: '#64748B', borderTop: '1px solid #162035', paddingTop: '8px' }}>
                          <span>Prazo: {formatarDataExibicao(t.prazo)}</span>
                          <span style={{ color: '#3B82F6', fontWeight: 600 }}>Ver popup →</span>
                        </div>
                      </div>
                    );
                  })}
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

      {/* Modais */}

      {/* 1. Modal Cadastro / Edição de Tarefa */}
      <FormTarefaModal
        isOpen={showFormModal}
        onClose={() => {
          setShowFormModal(false);
          setEditingTask(null);
        }}
        onSave={handleSaveTask}
        initialData={editingTask}
      />

      {/* 2. Modal Detalhes da Tarefa (Popup completo) */}
      <DetalhesTarefaModal
        isOpen={!!selectedTask}
        onClose={() => setSelectedTask(null)}
        task={selectedTask}
        onUpdateTask={handleUpdateSingleTask}
        onDeleteTask={handleDeleteTask}
        onOpenEdit={(taskToEdit) => {
          setSelectedTask(null);
          setEditingTask(taskToEdit);
          setShowFormModal(true);
        }}
      />

      {/* 3. Modal Gestão de Tipos de Tarefas */}
      <GestaoTiposModal
        isOpen={showTiposModal}
        onClose={() => setShowTiposModal(false)}
        onTiposUpdated={() => {
          setToast('Tipos de tarefas atualizados!');
        }}
      />

      <ToastNotification message={toast} onClose={() => setToast(null)} />
    </div>
  );
}
