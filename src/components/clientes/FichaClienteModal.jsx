'use client';

import React, { useState } from 'react';
import { 
  X, 
  Edit3, 
  Trash2, 
  FileText, 
  Printer, 
  Star, 
  User, 
  Building, 
  Mail, 
  Phone, 
  MapPin, 
  Briefcase, 
  CheckSquare, 
  ShieldAlert, 
  Calendar, 
  Clock,
  Save
} from 'lucide-react';
import DetalhesTarefaModal from '@/components/tarefas/DetalhesTarefaModal';
import { formatarDataExibicao } from '@/lib/tarefasStore';

export default function FichaClienteModal({ 
  isOpen, 
  onClose, 
  cliente, 
  onEdit, 
  onDelete, 
  onSaveAnotacoes, 
  mockProcessos = [], 
  mockTarefas = [] 
}) {
  if (!isOpen || !cliente) return null;

  const [anotacoes, setAnotacoes] = useState(cliente.anotacoes || '');
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [salvandoNota, setSalvandoNota] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  // Filter linked processes and tasks
  const processosDoCliente = mockProcessos.filter((p) => p.clienteId === cliente.id || p.cliente === cliente.nome);
  const tarefasDoCliente = mockTarefas.filter((t) => t.clienteId === cliente.id || t.cliente === cliente.nome);

  const handlePrintPDF = () => {
    window.print();
  };

  const handleSaveNotes = () => {
    setSalvandoNota(true);
    if (onSaveAnotacoes) {
      onSaveAnotacoes(cliente.id, anotacoes);
    }
    setTimeout(() => setSalvandoNota(false), 500);
  };

  const fullEndereco = [
    cliente.logradouro,
    cliente.numero ? `Nº ${cliente.numero}` : '',
    cliente.complemento,
    cliente.bairro,
    cliente.cidade ? `${cliente.cidade}/${cliente.uf}` : '',
    cliente.cep ? `CEP ${cliente.cep}` : ''
  ].filter(Boolean).join(', ') || cliente.cidade || 'Endereço não informado';

  return (
    <div className="sidebar-overlay open" onClick={onClose} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
      <div className="card-saas printable-ficha" onClick={(e) => e.stopPropagation()} style={{ width: '94%', maxWidth: '900px', maxHeight: '92vh', overflowY: 'auto', margin: 0, padding: '28px' }}>
        
        {/* Modal Top Bar (Non-printable buttons) */}
        <div className="no-print" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid #1B263B', paddingBottom: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="page-header-subtitle">Ficha Dossiê do Cliente</span>
            <span style={{ fontSize: '0.75rem', color: '#64748B' }}>• Cadastrado em {cliente.dataCadastro || '16/08/2026'}</span>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              type="button"
              className="btn-secondary"
              onClick={handlePrintPDF}
              style={{ fontSize: '0.82rem', padding: '6px 12px' }}
              title="Exportar / Imprimir Ficha em PDF"
            >
              <Printer size={15} /> Exportar PDF
            </button>

            <button
              type="button"
              className="btn-secondary"
              onClick={() => onEdit(cliente)}
              style={{ fontSize: '0.82rem', padding: '6px 12px', color: '#3B82F6', borderColor: 'rgba(59, 130, 246, 0.3)' }}
            >
              <Edit3 size={15} /> Editar
            </button>

            <button
              type="button"
              className="btn-secondary"
              onClick={() => setShowConfirmDelete(true)}
              style={{ fontSize: '0.82rem', padding: '6px 12px', color: '#EF4444', borderColor: 'rgba(239, 68, 68, 0.3)' }}
            >
              <Trash2 size={15} /> Apagar
            </button>

            <button type="button" onClick={onClose} style={{ color: '#94A3B8', padding: '6px', marginLeft: '6px' }}>
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Printable Ficha Header */}
        <div style={{ marginBottom: '24px', backgroundColor: '#0B101D', border: '1px solid #1B263B', borderRadius: '12px', padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '14px', marginBottom: '16px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                {cliente.prioritario && <Star size={20} color="#F59E0B" fill="#F59E0B" title="Cliente Prioritário" />}
                <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#FFFFFF', fontFamily: 'var(--font-serif)' }}>
                  {cliente.nome}
                </h2>
              </div>
              <p style={{ fontSize: '0.86rem', color: '#94A3B8', fontFamily: 'monospace' }}>
                {cliente.documento} {cliente.rg ? `• RG/IE: ${cliente.rg}` : ''}
              </p>
            </div>

            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <span className="badge-saas badge-primary">{cliente.tipo || 'Pessoa Física'}</span>
              {cliente.incapacidade && cliente.incapacidade !== 'Capaz' && (
                <span className="badge-saas badge-warning" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <ShieldAlert size={12} /> {cliente.incapacidade}
                </span>
              )}
              {cliente.prioritario && (
                <span className="badge-saas badge-warning">
                  ⭐ Prioritário
                </span>
              )}
            </div>
          </div>

          {/* Grid de Informações Cadastrais */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px', fontSize: '0.85rem', borderTop: '1px solid #1B263B', paddingTop: '16px' }}>
            <div>
              <span style={{ color: '#64748B', display: 'block', fontSize: '0.75rem', fontWeight: 600 }}>PROFISSÃO / OCUPAÇÃO</span>
              <span style={{ color: '#FFFFFF', fontWeight: 500 }}>{cliente.profissao || 'Não informada'}</span>
            </div>

            <div>
              <span style={{ color: '#64748B', display: 'block', fontSize: '0.75rem', fontWeight: 600 }}>NACIONALIDADE</span>
              <span style={{ color: '#FFFFFF', fontWeight: 500 }}>{cliente.nacionalidade || 'Brasileiro(a)'}</span>
            </div>

            <div>
              <span style={{ color: '#64748B', display: 'block', fontSize: '0.75rem', fontWeight: 600 }}>E-MAIL</span>
              <span style={{ color: '#3B82F6', fontWeight: 500 }}>{cliente.email || 'Não informado'}</span>
            </div>

            <div>
              <span style={{ color: '#64748B', display: 'block', fontSize: '0.75rem', fontWeight: 600 }}>TELEFONE / CELULAR</span>
              <span style={{ color: '#FFFFFF', fontWeight: 500 }}>{cliente.fone || 'Não informado'}</span>
            </div>

            <div style={{ gridColumn: 'span 2' }}>
              <span style={{ color: '#64748B', display: 'block', fontSize: '0.75rem', fontWeight: 600 }}>ENDEREÇO RESIDENCIAL / SEDE</span>
              <span style={{ color: '#FFFFFF', fontWeight: 500 }}>{fullEndereco}</span>
            </div>
          </div>

          {/* Dados do Responsável Legal se Incapaz */}
          {cliente.incapacidade && cliente.incapacidade !== 'Capaz' && (
            <div style={{ marginTop: '16px', borderTop: '1px dashed #1B263B', paddingTop: '14px', backgroundColor: '#131D33', padding: '14px', borderRadius: '8px' }}>
              <h4 style={{ fontSize: '0.88rem', fontWeight: 700, color: '#F59E0B', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <ShieldAlert size={16} /> Responsável Legal ({cliente.incapacidade})
              </h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px', fontSize: '0.82rem' }}>
                <div>
                  <span style={{ color: '#94A3B8' }}>Nome:</span> <strong style={{ color: '#FFFFFF' }}>{cliente.respLegalNome || 'Não informado'}</strong>
                </div>
                <div>
                  <span style={{ color: '#94A3B8' }}>CPF:</span> <strong style={{ color: '#FFFFFF' }}>{cliente.respLegalCpf || '-'}</strong>
                </div>
                <div>
                  <span style={{ color: '#94A3B8' }}>RG:</span> <strong style={{ color: '#FFFFFF' }}>{cliente.respLegalRg || '-'}</strong>
                </div>
                <div>
                  <span style={{ color: '#94A3B8' }}>Profissão:</span> <strong style={{ color: '#FFFFFF' }}>{cliente.respLegalProfissao || '-'}</strong>
                </div>
                <div style={{ gridColumn: 'span 2' }}>
                  <span style={{ color: '#94A3B8' }}>Endereço do Responsável:</span> <strong style={{ color: '#FFFFFF' }}>{cliente.respLegalEndereco || fullEndereco}</strong>
                </div>
              </div>
            </div>
          )}

          {/* Dados do Responsável da Empresa se PJ */}
          {cliente.tipo === 'Pessoa Jurídica' && cliente.respEmpresaNome && (
            <div style={{ marginTop: '16px', borderTop: '1px dashed #1B263B', paddingTop: '14px', backgroundColor: '#131D33', padding: '14px', borderRadius: '8px' }}>
              <h4 style={{ fontSize: '0.88rem', fontWeight: 700, color: '#3B82F6', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Building size={16} /> Representante Legal da Empresa (PJ)
              </h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px', fontSize: '0.82rem' }}>
                <div>
                  <span style={{ color: '#94A3B8' }}>Representante:</span> <strong style={{ color: '#FFFFFF' }}>{cliente.respEmpresaNome}</strong>
                </div>
                <div>
                  <span style={{ color: '#94A3B8' }}>CPF:</span> <strong style={{ color: '#FFFFFF' }}>{cliente.respEmpresaCpf || '-'}</strong>
                </div>
                <div style={{ gridColumn: 'span 2' }}>
                  <span style={{ color: '#94A3B8' }}>Endereço:</span> <strong style={{ color: '#FFFFFF' }}>{cliente.respEmpresaEndereco || '-'}</strong>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Seção de Anotações Gerais */}
        <div style={{ marginBottom: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#FFFFFF' }}>Anotações Gerais do Cliente</h3>
            <button
              type="button"
              className="no-print btn-secondary"
              onClick={handleSaveNotes}
              style={{ fontSize: '0.78rem', padding: '4px 10px' }}
            >
              <Save size={13} /> {salvandoNota ? 'Salvo!' : 'Salvar Notas'}
            </button>
          </div>
          <textarea
            rows={3}
            placeholder="Anotações internas sobre o cliente, histórico de conversas..."
            value={anotacoes}
            onChange={(e) => setAnotacoes(e.target.value)}
            className="search-input-dark"
            style={{ width: '100%', padding: '10px 12px', resize: 'vertical', fontSize: '0.85rem' }}
          />
        </div>

        {/* 2 Cards Inferiores: Processos e Tarefas */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '20px' }}>
          
          {/* Card Esquerdo: Processos Vinculados */}
          <div className="card-saas" style={{ backgroundColor: '#0B101D' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', paddingBottom: '10px', borderBottom: '1px solid #1B263B' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Briefcase size={18} color="#3B82F6" />
                <h3 style={{ fontSize: '0.98rem', fontWeight: 700, color: '#FFFFFF' }}>
                  Processos Vinculados
                </h3>
              </div>
              <span className="badge-saas badge-primary">
                {processosDoCliente.length} processo(s)
              </span>
            </div>

            {processosDoCliente.length === 0 ? (
              <div style={{ padding: '24px', textAlign: 'center', color: '#64748B', fontSize: '0.82rem', fontStyle: 'italic' }}>
                Nenhum processo vinculado a este cliente.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {processosDoCliente.map((p) => (
                  <div key={p.id || p.cnj} style={{ backgroundColor: '#0E1526', border: '1px solid #1B263B', borderRadius: '8px', padding: '12px' }}>
                    <div style={{ fontWeight: 700, color: '#FFFFFF', fontSize: '0.85rem', fontFamily: 'monospace' }}>
                      {p.cnj}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: '#94A3B8', marginTop: '2px' }}>
                      {p.assunto || 'Ação Judicial'}
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px', fontSize: '0.75rem' }}>
                      <span style={{ color: '#64748B' }}>{p.vara || 'Vara Cível'}</span>
                      <span className="badge-saas badge-success">{p.status || 'Em andamento'}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Card Direito: Tarefas Vinculadas */}
          <div className="card-saas" style={{ backgroundColor: '#0B101D' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', paddingBottom: '10px', borderBottom: '1px solid #1B263B' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckSquare size={18} color="#A855F7" />
                <h3 style={{ fontSize: '0.98rem', fontWeight: 700, color: '#FFFFFF' }}>
                  Tarefas e Prazos Vinculados
                </h3>
              </div>
              <span className="badge-saas badge-warning">
                {tarefasDoCliente.length} tarefa(s)
              </span>
            </div>

            {tarefasDoCliente.length === 0 ? (
              <div style={{ padding: '24px', textAlign: 'center', color: '#64748B', fontSize: '0.82rem', fontStyle: 'italic' }}>
                Nenhuma tarefa vinculada a este cliente.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {tarefasDoCliente.map((t) => (
                  <div
                    key={t.id}
                    onClick={() => setSelectedTask(t)}
                    style={{
                      backgroundColor: '#0E1526',
                      border: '1px solid #1B263B',
                      borderRadius: '8px',
                      padding: '12px',
                      cursor: 'pointer',
                      transition: 'border-color 0.15s ease'
                    }}
                    className="kanban-card-hover"
                  >
                    <div style={{ fontWeight: 700, color: '#FFFFFF', fontSize: '0.86rem', marginBottom: '4px' }}>
                      {t.tipo || t.titulo}
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.76rem', color: '#94A3B8' }}>
                      <span>Prazo: {formatarDataExibicao(t.prazo || t.vencimento)}</span>
                      <span className={`badge-saas ${t.status === 'Concluída' || t.status === 'Arquivada' ? 'badge-success' : 'badge-primary'}`}>
                        {t.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Modal Confirmação de Exclusão */}
        {showConfirmDelete && (
          <div className="sidebar-overlay open" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1100 }}>
            <div className="card-saas" style={{ width: '90%', maxWidth: '400px', padding: '20px', textAlign: 'center' }}>
              <Trash2 size={36} color="#EF4444" style={{ marginBottom: '12px' }} />
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#FFFFFF', marginBottom: '8px' }}>Excluir Cliente?</h3>
              <p style={{ fontSize: '0.85rem', color: '#94A3B8', marginBottom: '20px' }}>
                Tem certeza que deseja apagar o cadastro de <strong>{cliente.nome}</strong>? Esta ação não poderá ser desfeita.
              </p>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '12px' }}>
                <button type="button" className="btn-secondary" onClick={() => setShowConfirmDelete(false)}>Cancelar</button>
                <button 
                  type="button" 
                  className="btn-primary" 
                  style={{ backgroundColor: '#EF4444', color: '#FFFFFF' }}
                  onClick={() => {
                    setShowConfirmDelete(false);
                    onDelete(cliente.id);
                  }}
                >
                  Confirmar Exclusão
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal Popup Detalhes da Tarefa ao Clicar */}
        <DetalhesTarefaModal
          isOpen={!!selectedTask}
          onClose={() => setSelectedTask(null)}
          task={selectedTask}
          onUpdateTask={(updated) => setSelectedTask(updated)}
          onDeleteTask={() => setSelectedTask(null)}
        />
      </div>
    </div>
  );
}
