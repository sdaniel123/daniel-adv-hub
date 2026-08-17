'use client';

import React, { useState, useEffect } from 'react';
import { 
  Calendar as CalendarIcon, 
  Plus, 
  Clock, 
  User, 
  Gavel, 
  MapPin, 
  Phone, 
  Filter, 
  Edit3, 
  Trash2, 
  Check, 
  X, 
  Link as LinkIcon, 
  ExternalLink,
  ChevronDown
} from 'lucide-react';
import ToastNotification from '@/components/ui/ToastNotification';
import FormAudienciaModal from '@/components/agenda/FormAudienciaModal';
import FormAtendimentoModal from '@/components/agenda/FormAtendimentoModal';
import CalendarioCompleto from '@/components/agenda/CalendarioCompleto';
import { 
  fetchAudiencias, 
  createAudiencia, 
  updateAudienciaStatus, 
  fetchAtendimentos, 
  createAtendimento, 
  updateAtendimentoStatus, 
  agruparPorDiaSemana, 
  filtrarPorPeriodo, 
  formatarDataHoraExibicao, 
  formatarHoraExibicao 
} from '@/lib/agendaStore';

export default function AgendaPage() {
  const [activeSubtela, setActiveSubtela] = useState('atendimentos'); // 'atendimentos' | 'audiencias' | 'calendario'
  const [periodoFilter, setPeriodoFilter] = useState('todos'); // 'todos' | 'hoje' | 'semana' | 'mes' | 'proximos_30' | 'custom'
  const [dataInicioCustom, setDataInicioCustom] = useState('');
  const [dataFimCustom, setDataFimCustom] = useState('');

  // Data states
  const [audiencias, setAudiencias] = useState([]);
  const [atendimentos, setAtendimentos] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modals state
  const [showAudienciaModal, setShowAudienciaModal] = useState(false);
  const [editingAudiencia, setEditingAudiencia] = useState(null);

  const [showAtendimentoModal, setShowAtendimentoModal] = useState(false);
  const [editingAtendimento, setEditingAtendimento] = useState(null);

  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [deleteType, setDeleteType] = useState(null); // 'audiencia' | 'atendimento'

  const [toast, setToast] = useState(null);

  const loadAgendaData = async () => {
    setLoading(true);
    const [auds, atends] = await Promise.all([
      fetchAudiencias(),
      fetchAtendimentos()
    ]);
    setAudiencias(auds);
    setAtendimentos(atends);
    setLoading(false);
  };

  useEffect(() => {
    loadAgendaData();
  }, []);

  // Handlers para Audiências
  const handleSaveAudiencia = (payload) => {
    let updated;
    const exists = audiencias.some(a => a.id === payload.id);

    if (exists) {
      updated = audiencias.map(a => a.id === payload.id ? payload : a);
      setToast('Audiência atualizada com sucesso!');
    } else {
      updated = [payload, ...audiencias];
      setToast('Nova audiência cadastrada com sucesso!');
    }

    setAudiencias(updated);
    salvarAudiencias(updated);
    setShowAudienciaModal(false);
    setEditingAudiencia(null);
  };

  const handleUpdateStatusAudiencia = (id, novoStatus) => {
    const updated = audiencias.map(a => a.id === id ? { ...a, status: novoStatus } : a);
    setAudiencias(updated);
    salvarAudiencias(updated);
    setToast(`Status da audiência alterado para "${novoStatus}"`);
  };

  const handleDeleteAudiencia = (id) => {
    const updated = audiencias.filter(a => a.id !== id);
    setAudiencias(updated);
    salvarAudiencias(updated);
    setToast('Audiência excluída.');
    setConfirmDeleteId(null);
  };

  // Handlers para Atendimentos
  const handleSaveAtendimento = (payload) => {
    let updated;
    const exists = atendimentos.some(a => a.id === payload.id);

    if (exists) {
      updated = atendimentos.map(a => a.id === payload.id ? payload : a);
      setToast('Atendimento atualizado com sucesso!');
    } else {
      updated = [payload, ...atendimentos];
      setToast('Novo atendimento cadastrado com sucesso!');
    }

    setAtendimentos(updated);
    salvarAtendimentos(updated);
    setShowAtendimentoModal(false);
    setEditingAtendimento(null);
  };

  const handleUpdateStatusAtendimento = (id, novoStatus) => {
    const updated = atendimentos.map(a => a.id === id ? { ...a, status: novoStatus } : a);
    setAtendimentos(updated);
    salvarAtendimentos(updated);
    setToast(`Status do atendimento alterado para "${novoStatus}"`);
  };

  const handleDeleteAtendimento = (id) => {
    const updated = atendimentos.filter(a => a.id !== id);
    setAtendimentos(updated);
    salvarAtendimentos(updated);
    setToast('Atendimento excluído.');
    setConfirmDeleteId(null);
  };

  // Filtragem por período e agrupamento por dia da semana
  const audienciasFiltradas = filtrarPorPeriodo(audiencias, periodoFilter, dataInicioCustom, dataFimCustom);
  const atendimentosFiltrados = filtrarPorPeriodo(atendimentos, periodoFilter, dataInicioCustom, dataFimCustom);

  const gruposAudiencias = agruparPorDiaSemana(audienciasFiltradas);
  const gruposAtendimentos = agruparPorDiaSemana(atendimentosFiltrados);

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
      
      {/* Header section com botões de cadastro */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <span className="page-header-subtitle">DANIEL ADV HUB</span>
          <h1 className="page-header-title">Agenda do Advogado</h1>
        </div>

        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <button
            type="button"
            className="btn-secondary"
            onClick={() => {
              setEditingAudiencia(null);
              setShowAudienciaModal(true);
            }}
            style={{ color: '#3B82F6', borderColor: 'rgba(59, 130, 246, 0.4)' }}
          >
            <Gavel size={16} />
            <span>+ Nova Audiência</span>
          </button>

          <button
            type="button"
            className="btn-primary"
            onClick={() => {
              setEditingAtendimento(null);
              setShowAtendimentoModal(true);
            }}
            style={{ backgroundColor: '#10B981', borderColor: '#10B981' }}
          >
            <User size={16} />
            <span>+ Novo Atendimento</span>
          </button>
        </div>
      </div>

      {/* Subtelas Navigation Bar (Tabs) */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px', marginBottom: '20px', borderBottom: '1px solid #1B263B', paddingBottom: '10px' }}>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button
            type="button"
            className={`tab-nav-btn ${activeSubtela === 'atendimentos' ? 'active' : ''}`}
            onClick={() => setActiveSubtela('atendimentos')}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
          >
            <User size={16} />
            Atendimentos ({atendimentos.length})
          </button>

          <button
            type="button"
            className={`tab-nav-btn ${activeSubtela === 'audiencias' ? 'active' : ''}`}
            onClick={() => setActiveSubtela('audiencias')}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
          >
            <Gavel size={16} />
            Audiências ({audiencias.length})
          </button>

          <button
            type="button"
            className={`tab-nav-btn ${activeSubtela === 'calendario' ? 'active' : ''}`}
            onClick={() => setActiveSubtela('calendario')}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
          >
            <CalendarIcon size={16} />
            Calendário Completo
          </button>
        </div>

        {/* Filtro por Período (visível nas subtelas de Atendimentos e Audiências) */}
        {activeSubtela !== 'calendario' && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.82rem', color: '#94A3B8', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Filter size={14} /> Período:
            </span>
            <select
              value={periodoFilter}
              onChange={(e) => setPeriodoFilter(e.target.value)}
              className="search-input-dark"
              style={{ width: '180px', paddingLeft: '10px', cursor: 'pointer', fontSize: '0.82rem' }}
            >
              <option value="todos">Todos os Períodos</option>
              <option value="hoje">Hoje</option>
              <option value="semana">Esta Semana</option>
              <option value="mes">Este Mês</option>
              <option value="proximos_30">Próximos 30 Dias</option>
              <option value="custom">Personalizado</option>
            </select>

            {periodoFilter === 'custom' && (
              <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                <input
                  type="date"
                  value={dataInicioCustom}
                  onChange={(e) => setDataInicioCustom(e.target.value)}
                  className="search-input-dark"
                  style={{ width: '130px', fontSize: '0.78rem' }}
                />
                <span style={{ color: '#94A3B8', fontSize: '0.78rem' }}>até</span>
                <input
                  type="date"
                  value={dataFimCustom}
                  onChange={(e) => setDataFimCustom(e.target.value)}
                  className="search-input-dark"
                  style={{ width: '130px', fontSize: '0.78rem' }}
                />
              </div>
            )}
          </div>
        )}
      </div>

      {/* CONTEÚDO DAS SUBTELAS */}

      {/* SUBTELA 1: LISTA DE ATENDIMENTOS */}
      {activeSubtela === 'atendimentos' && (
        <div>
          {gruposAtendimentos.length === 0 ? (
            <div className="card-saas" style={{ padding: '60px 20px', textAlign: 'center', color: '#94A3B8', fontSize: '0.9rem' }}>
              Nenhum atendimento encontrado para o período selecionado.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {gruposAtendimentos.map((grupo) => (
                <div key={grupo.dataKey}>
                  {/* Cabeçalho do Dia (Ex: Segunda-feira, 18 de Agosto de 2026) */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px', borderBottom: '1px solid #1B263B', paddingBottom: '8px' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10B981' }} />
                    <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#FFFFFF', letterSpacing: '0.3px' }}>
                      {grupo.tituloDia}
                    </h3>
                    <span style={{ fontSize: '0.74rem', color: '#94A3B8', backgroundColor: '#131D33', padding: '2px 8px', borderRadius: '10px' }}>
                      {grupo.itens.length} atendimento(s)
                    </span>
                  </div>

                  {/* Itens do Dia (Exibição Inline completa) */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {grupo.itens.map((atend) => (
                      <div
                        key={atend.id}
                        className="card-saas"
                        style={{
                          backgroundColor: '#0B101D',
                          border: '1px solid #1B263B',
                          borderLeft: '4px solid #10B981',
                          padding: '18px 20px'
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '14px' }}>
                          
                          {/* Dados do Atendimento */}
                          <div style={{ flex: 1, minWidth: '280px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                              <span style={{ fontWeight: 800, color: '#10B981', fontSize: '0.95rem' }}>
                                <Clock size={14} style={{ display: 'inline', marginRight: '4px' }} />
                                {formatarHoraExibicao(atend.dataHora)}
                              </span>
                              <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#FFFFFF', margin: 0 }}>
                                {atend.nomeAtendido}
                              </h4>
                            </div>

                            {atend.telefone && (
                              <div style={{ fontSize: '0.84rem', color: '#94A3B8', display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px' }}>
                                <Phone size={14} color="#10B981" /> Telefone: <strong style={{ color: '#FFFFFF' }}>{atend.telefone}</strong>
                              </div>
                            )}

                            {atend.descricao && (
                              <div style={{ fontSize: '0.85rem', color: '#CBD5E1', marginTop: '8px', lineHeight: 1.5, backgroundColor: '#0E1526', padding: '10px 12px', borderRadius: '8px', border: '1px solid #162035' }}>
                                {atend.descricao}
                              </div>
                            )}
                          </div>

                          {/* Seletor Inline de Status (Realizado, Não realizado, Reagendado) & Ações */}
                          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '12px' }}>
                            
                            {/* Botoes Inline de Status */}
                            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                              {['Realizado', 'Não realizado', 'Reagendado'].map((st) => (
                                <button
                                  key={st}
                                  type="button"
                                  onClick={() => handleUpdateStatusAtendimento(atend.id, st)}
                                  style={{
                                    padding: '5px 10px',
                                    borderRadius: '6px',
                                    fontSize: '0.76rem',
                                    fontWeight: atend.status === st ? 700 : 500,
                                    backgroundColor: atend.status === st 
                                      ? (st === 'Realizado' ? '#10B981' : st === 'Não realizado' ? '#EF4444' : '#F59E0B') 
                                      : '#131D33',
                                    color: atend.status === st ? '#FFFFFF' : '#94A3B8',
                                    border: atend.status === st 
                                      ? 'none' 
                                      : '1px solid #1B263B',
                                    cursor: 'pointer',
                                    transition: 'all 0.15s ease'
                                  }}
                                >
                                  {st}
                                </button>
                              ))}
                            </div>

                            {/* Opções de Editar e Apagar */}
                            <div style={{ display: 'flex', gap: '10px' }}>
                              <button
                                type="button"
                                onClick={() => {
                                  setEditingAtendimento(atend);
                                  setShowAtendimentoModal(true);
                                }}
                                style={{ color: '#3B82F6', fontSize: '0.8rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px', backgroundColor: 'transparent' }}
                              >
                                <Edit3 size={14} /> Editar
                              </button>

                              <button
                                type="button"
                                onClick={() => {
                                  setConfirmDeleteId(atend.id);
                                  setDeleteType('atendimento');
                                }}
                                style={{ color: '#EF4444', fontSize: '0.8rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px', backgroundColor: 'transparent' }}
                              >
                                <Trash2 size={14} /> Apagar
                              </button>
                            </div>

                          </div>

                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* SUBTELA 2: LISTA DE AUDIÊNCIAS */}
      {activeSubtela === 'audiencias' && (
        <div>
          {gruposAudiencias.length === 0 ? (
            <div className="card-saas" style={{ padding: '60px 20px', textAlign: 'center', color: '#94A3B8', fontSize: '0.9rem' }}>
              Nenhuma audiência encontrada para o período selecionado.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {gruposAudiencias.map((grupo) => (
                <div key={grupo.dataKey}>
                  {/* Cabeçalho do Dia (Ex: Terça-feira, 19 de Agosto de 2026) */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px', borderBottom: '1px solid #1B263B', paddingBottom: '8px' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#3B82F6' }} />
                    <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#FFFFFF', letterSpacing: '0.3px' }}>
                      {grupo.tituloDia}
                    </h3>
                    <span style={{ fontSize: '0.74rem', color: '#94A3B8', backgroundColor: '#131D33', padding: '2px 8px', borderRadius: '10px' }}>
                      {grupo.itens.length} audiência(s)
                    </span>
                  </div>

                  {/* Itens do Dia (Exibição Inline completa) */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {grupo.itens.map((aud) => (
                      <div
                        key={aud.id}
                        className="card-saas"
                        style={{
                          backgroundColor: '#0B101D',
                          border: '1px solid #1B263B',
                          borderLeft: '4px solid #3B82F6',
                          padding: '18px 20px'
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '14px' }}>
                          
                          {/* Dados da Audiência */}
                          <div style={{ flex: 1, minWidth: '280px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                              <span style={{ fontWeight: 800, color: '#3B82F6', fontSize: '0.95rem' }}>
                                <Clock size={14} style={{ display: 'inline', marginRight: '4px' }} />
                                {formatarHoraExibicao(aud.dataHora)}
                              </span>
                              <span className={`badge-saas ${aud.tipo === 'Online' ? 'badge-warning' : 'badge-primary'}`}>
                                {aud.tipo === 'Online' ? 'Online / Vídeo' : 'Presencial'}
                              </span>
                            </div>

                            <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#FFFFFF', margin: '0 0 4px 0', fontFamily: 'monospace' }}>
                              CNJ: {aud.processo}
                            </h4>

                            <p style={{ fontSize: '0.84rem', color: '#94A3B8', margin: '0 0 6px 0' }}>
                              Cliente: <strong style={{ color: '#FFFFFF' }}>{aud.cliente}</strong>
                            </p>

                            <div style={{ fontSize: '0.82rem', color: '#CBD5E1', display: 'flex', alignItems: 'center', gap: '6px' }}>
                              {aud.tipo === 'Online' ? <LinkIcon size={14} color="#A855F7" /> : <MapPin size={14} color="#3B82F6" />}
                              <span>Local / Link: </span>
                              {aud.local && aud.local.startsWith('http') ? (
                                <a
                                  href={aud.local}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  style={{ color: '#3B82F6', textDecoration: 'underline', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                                >
                                  Acessar Link da Sala <ExternalLink size={12} />
                                </a>
                              ) : (
                                <strong style={{ color: '#FFFFFF' }}>{aud.local || 'Não informado'}</strong>
                              )}
                            </div>

                            {aud.anotacoes && (
                              <div style={{ fontSize: '0.82rem', color: '#94A3B8', marginTop: '8px', fontStyle: 'italic' }}>
                                Observações: &quot;{aud.anotacoes}&quot;
                              </div>
                            )}
                          </div>

                          {/* Seletor Inline de Status (Realizada, Não realizada, Reagendada) & Ações */}
                          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '12px' }}>
                            
                            {/* Botões Inline de Status */}
                            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                              {['Realizada', 'Não realizada', 'Reagendada'].map((st) => (
                                <button
                                  key={st}
                                  type="button"
                                  onClick={() => handleUpdateStatusAudiencia(aud.id, st)}
                                  style={{
                                    padding: '5px 10px',
                                    borderRadius: '6px',
                                    fontSize: '0.76rem',
                                    fontWeight: aud.status === st ? 700 : 500,
                                    backgroundColor: aud.status === st 
                                      ? (st === 'Realizada' ? '#10B981' : st === 'Não realizada' ? '#EF4444' : '#F59E0B') 
                                      : '#131D33',
                                    color: aud.status === st ? '#FFFFFF' : '#94A3B8',
                                    border: aud.status === st 
                                      ? 'none' 
                                      : '1px solid #1B263B',
                                    cursor: 'pointer',
                                    transition: 'all 0.15s ease'
                                  }}
                                >
                                  {st}
                                </button>
                              ))}
                            </div>

                            {/* Opções de Editar e Apagar */}
                            <div style={{ display: 'flex', gap: '10px' }}>
                              <button
                                type="button"
                                onClick={() => {
                                  setEditingAudiencia(aud);
                                  setShowAudienciaModal(true);
                                }}
                                style={{ color: '#3B82F6', fontSize: '0.8rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px', backgroundColor: 'transparent' }}
                              >
                                <Edit3 size={14} /> Editar
                              </button>

                              <button
                                type="button"
                                onClick={() => {
                                  setConfirmDeleteId(aud.id);
                                  setDeleteType('audiencia');
                                }}
                                style={{ color: '#EF4444', fontSize: '0.8rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px', backgroundColor: 'transparent' }}
                              >
                                <Trash2 size={14} /> Apagar
                              </button>
                            </div>

                          </div>

                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* SUBTELA 3: CALENDÁRIO COMPLETO */}
      {activeSubtela === 'calendario' && (
        <CalendarioCompleto
          audiencias={audiencias}
          atendimentos={atendimentos}
          onEditAudiencia={(aud) => {
            setEditingAudiencia(aud);
            setShowAudienciaModal(true);
          }}
          onEditAtendimento={(atend) => {
            setEditingAtendimento(atend);
            setShowAtendimentoModal(true);
          }}
        />
      )}

      {/* MODAIS DE CADASTRO E EDIÇÃO */}

      {/* Modal Audiência */}
      <FormAudienciaModal
        isOpen={showAudienciaModal}
        onClose={() => {
          setShowAudienciaModal(false);
          setEditingAudiencia(null);
        }}
        onSave={handleSaveAudiencia}
        initialData={editingAudiencia}
      />

      {/* Modal Atendimento */}
      <FormAtendimentoModal
        isOpen={showAtendimentoModal}
        onClose={() => {
          setShowAtendimentoModal(false);
          setEditingAtendimento(null);
        }}
        onSave={handleSaveAtendimento}
        initialData={editingAtendimento}
      />

      {/* Modal Confirmação de Exclusão */}
      {confirmDeleteId && (
        <div className="modal-backdrop-blurred" onClick={() => setConfirmDeleteId(null)}>
          <div className="card-saas" onClick={(e) => e.stopPropagation()} style={{ width: '90%', maxWidth: '400px', padding: '24px', textAlign: 'center' }}>
            <Trash2 size={40} color="#EF4444" style={{ margin: '0 auto 12px auto', display: 'block' }} />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#FFFFFF', marginBottom: '8px' }}>
              Excluir {deleteType === 'audiencia' ? 'Audiência' : 'Atendimento'}?
            </h3>
            <p style={{ fontSize: '0.84rem', color: '#94A3B8', marginBottom: '20px' }}>
              Tem certeza que deseja apagar este agendamento da sua agenda? Esta ação não poderá ser desfeita.
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '12px' }}>
              <button type="button" onClick={() => setConfirmDeleteId(null)} className="btn-secondary">
                Cancelar
              </button>
              <button
                type="button"
                className="btn-primary"
                style={{ backgroundColor: '#EF4444', borderColor: '#EF4444' }}
                onClick={() => {
                  if (deleteType === 'audiencia') handleDeleteAudiencia(confirmDeleteId);
                  else handleDeleteAtendimento(confirmDeleteId);
                }}
              >
                Sim, Excluir
              </button>
            </div>
          </div>
        </div>
      )}

      <ToastNotification message={toast} onClose={() => setToast(null)} />
    </div>
  );
}
