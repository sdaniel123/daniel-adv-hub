'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import { 
  ArrowLeft, 
  Printer, 
  Edit3, 
  Trash2, 
  AlertCircle, 
  Building, 
  Save, 
  Briefcase, 
  CheckSquare, 
  User, 
  Calendar, 
  Plus, 
  Clock, 
  Gavel, 
  FileText,
  DollarSign
} from 'lucide-react';
import ToastNotification from '@/components/ui/ToastNotification';
import FormProcessoModal from '@/components/processos/FormProcessoModal';
import DetalhesTarefaModal from '@/components/tarefas/DetalhesTarefaModal';
import { initialProcessosData } from '@/lib/processosStore';
import { getTarefasSalvas, salvarTarefas, formatarDataExibicao } from '@/lib/tarefasStore';

export default function ProcessoDetalhesPage() {
  const router = useRouter();
  const params = useParams();
  const processoId = params?.id;

  const [processo, setProcesso] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  
  // States for Notes and New Progress
  const [anotacoes, setAnotacoes] = useState('');
  const [salvandoNota, setSalvandoNota] = useState(false);
  
  const [andamentos, setAndamentos] = useState([]);
  const [novoAndamentoData, setNovoAndamentoData] = useState('');
  const [novoAndamentoDesc, setNovoAndamentoDesc] = useState('');
  
  const [toast, setToast] = useState(null);
  const [todasTarefas, setTodasTarefas] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);

  useEffect(() => {
    setTodasTarefas(getTarefasSalvas());
  }, []);

  const handleUpdateTask = (updated) => {
    const newTarefas = todasTarefas.map(t => t.id === updated.id ? updated : t);
    setTodasTarefas(newTarefas);
    salvarTarefas(newTarefas);
    setSelectedTask(updated);
    setToast('Tarefa atualizada!');
  };

  const handleDeleteTask = (taskId) => {
    const newTarefas = todasTarefas.filter(t => t.id !== taskId);
    setTodasTarefas(newTarefas);
    salvarTarefas(newTarefas);
    setSelectedTask(null);
    setToast('Tarefa excluída!');
  };

  useEffect(() => {
    const todayStr = new Date().toLocaleDateString('pt-BR');
    setNovoAndamentoData(todayStr);

    const found = initialProcessosData.find((p) => p.id === processoId) || {
      id: processoId,
      cnj: '0001234-56.2026.8.26.0100',
      clientes: [{ id: '1', nome: 'Carlos Eduardo Silva' }],
      dataProtocoloFmt: '10/08/2026',
      tramitacao: '2ª Vara Cível - Comarca de São Paulo/SP',
      sistema: 'PJe',
      assunto: 'Ação de Cobrança c/c Indenização por Danos Morais',
      valorCausa: 'R$ 45.000,00',
      prioritario: true,
      status: 'Em andamento',
      parteContrariaNome: 'Banco Financeiro S.A.',
      parteContrariaDoc: '00.111.222/0001-33',
      parteContrariaProfissao: 'Instituição Financeira',
      parteContrariaNacionalidade: 'Brasileiro(a)',
      parteContrariaLogradouro: 'Avenida Paulista, 1000, Bela Vista, São Paulo/SP',
      anotacoes: 'Anotações gerais e observações do processo...',
      dataCadastro: '10/08/2026',
      andamentos: [
        { id: 'a1', data: '12/08/2026', descricao: 'Juntada de petição de especificação de provas pelo autor.' },
        { id: 'a2', data: '10/08/2026', descricao: 'Distribuição realizada com sucesso no sistema PJe.' }
      ]
    };

    setProcesso(found);
    setAnotacoes(found.anotacoes || '');
    setAndamentos(found.andamentos || []);
  }, [processoId]);

  if (!processo) {
    return (
      <div style={{ maxWidth: '1000px', margin: '40px auto', textAlign: 'center', color: '#94A3B8' }}>
        Carregando autos do processo...
      </div>
    );
  }

  // Linked tasks
  const tarefasDoProcesso = todasTarefas.filter(
    (t) => t.processoId === processo.id || (t.processo && t.processo.includes(processo.cnj))
  );

  const handlePrintPDF = () => {
    window.print();
  };

  const handleSaveNotes = () => {
    setSalvandoNota(true);
    setProcesso((prev) => ({ ...prev, anotacoes }));
    setToast('Anotações do processo salvas com sucesso!');
    setTimeout(() => setSalvandoNota(false), 500);
  };

  const handleAddAndamento = (e) => {
    e.preventDefault();
    if (!novoAndamentoDesc.trim()) return;

    const newEntry = {
      id: String(Date.now()),
      data: novoAndamentoData || new Date().toLocaleDateString('pt-BR'),
      descricao: novoAndamentoDesc,
    };

    setAndamentos((prev) => [newEntry, ...prev]);
    setNovoAndamentoDesc('');
    setToast('Novo andamento processual adicionado!');
  };

  const handleSaveEdit = (updatedData) => {
    setProcesso((prev) => ({ ...prev, ...updatedData }));
    setShowEditModal(false);
    setToast(`Dados do processo ${updatedData.cnj} atualizados!`);
  };

  const handleDelete = () => {
    setToast(`Processo ${processo.cnj} excluído.`);
    setTimeout(() => {
      router.push('/processos');
    }, 1000);
  };

  const fullEnderecoParteContraria = [
    processo.parteContrariaLogradouro,
    processo.parteContrariaNumero ? `Nº ${processo.parteContrariaNumero}` : '',
    processo.parteContrariaComplemento,
    processo.parteContrariaBairro,
    processo.parteContrariaCidade ? `${processo.parteContrariaCidade}/${processo.parteContrariaUf}` : '',
    processo.parteContrariaCep ? `CEP ${processo.parteContrariaCep}` : ''
  ].filter(Boolean).join(', ') || 'Endereço não informado';

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
      
      {/* Top Header Navigation & Actions */}
      <div className="no-print" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <Link 
          href="/processos" 
          className="btn-secondary"
          style={{ fontSize: '0.86rem', display: 'inline-flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}
        >
          <ArrowLeft size={16} /> Voltar para Processos
        </Link>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            type="button"
            className="btn-secondary"
            onClick={handlePrintPDF}
            style={{ fontSize: '0.86rem' }}
          >
            <Printer size={15} /> Exportar PDF
          </button>

          <button
            type="button"
            className="btn-secondary"
            onClick={() => setShowEditModal(true)}
            style={{ fontSize: '0.86rem', color: '#3B82F6', borderColor: 'rgba(59, 130, 246, 0.3)' }}
          >
            <Edit3 size={15} /> Editar Processo
          </button>

          <button
            type="button"
            className="btn-secondary"
            onClick={() => setShowConfirmDelete(true)}
            style={{ fontSize: '0.86rem', color: '#EF4444', borderColor: 'rgba(239, 68, 68, 0.3)' }}
          >
            <Trash2 size={15} /> Apagar
          </button>
        </div>
      </div>

      {/* Main Printable Dossier Card */}
      <div className="printable-ficha card-saas" style={{ marginBottom: '24px', padding: '32px' }}>
        
        {/* Title Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', borderBottom: '1px solid #1B263B', paddingBottom: '20px', marginBottom: '20px' }}>
          <div>
            <span className="page-header-subtitle">DANIEL ADV HUB • FICHA DO PROCESSO</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '6px' }}>
              {processo.prioritario && <AlertCircle size={22} color="#F59E0B" title="Processo Prioritário" />}
              <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#FFFFFF', fontFamily: 'monospace' }}>
                {processo.cnj}
              </h1>
            </div>
            <p style={{ fontSize: '0.9rem', color: '#FFFFFF', marginTop: '4px', fontWeight: 600 }}>
              {processo.assunto}
            </p>
          </div>

          <div style={{ textAlign: 'right' }}>
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', marginBottom: '8px' }}>
              <span className="badge-saas badge-primary">{processo.sistema}</span>
              <span className={`badge-saas ${processo.arquivado ? 'badge-warning' : 'badge-success'}`}>
                {processo.status}
              </span>
              {processo.prioritario && (
                <span className="badge-saas badge-warning" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <AlertCircle size={12} /> Prioritário
                </span>
              )}
            </div>
            <span style={{ fontSize: '0.78rem', color: '#94A3B8' }}>
              Protocolado em: <strong>{processo.dataProtocoloFmt}</strong>
            </span>
          </div>
        </div>

        {/* Data Grid: Process & Parties Details */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px', marginBottom: '24px' }}>
          
          {/* Box 1: Dados do Processo & Clientes */}
          <div style={{ backgroundColor: '#0B101D', border: '1px solid #1B263B', borderRadius: '12px', padding: '20px' }}>
            <h3 style={{ fontSize: '0.92rem', fontWeight: 700, color: '#3B82F6', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Gavel size={16} /> Tramitação & Clientes Vinculados
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.85rem' }}>
              <div>
                <span style={{ color: '#94A3B8', display: 'block', fontSize: '0.75rem' }}>Vara / Comarca:</span>
                <strong style={{ color: '#FFFFFF' }}>{processo.tramitacao || '-'}</strong>
              </div>

              <div>
                <span style={{ color: '#94A3B8', display: 'block', fontSize: '0.75rem' }}>Valor da Causa:</span>
                <strong style={{ color: '#10B981', fontSize: '1rem' }}>{processo.valorCausa || 'Não informado'}</strong>
              </div>

              <div style={{ borderTop: '1px solid #162035', paddingTop: '10px', marginTop: '4px' }}>
                <span style={{ color: '#94A3B8', display: 'block', fontSize: '0.75rem', marginBottom: '6px' }}>
                  Cliente(s) Autor(es) / Vinculado(s):
                </span>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {processo.clientes && processo.clientes.length > 0 ? (
                    processo.clientes.map((cli) => (
                      <Link
                        key={cli.id || cli.nome}
                        href={`/clientes/${cli.id}`}
                        style={{
                          backgroundColor: '#131D33',
                          color: '#3B82F6',
                          border: '1px solid rgba(59, 130, 246, 0.4)',
                          padding: '4px 10px',
                          borderRadius: '16px',
                          fontSize: '0.82rem',
                          fontWeight: 700,
                          textDecoration: 'none',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px'
                        }}
                        className="no-print-hover"
                      >
                        <User size={13} /> {cli.nome} →
                      </Link>
                    ))
                  ) : (
                    <strong style={{ color: '#FFFFFF' }}>Nenhum cliente vinculado</strong>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Box 2: Dados Completos da Parte Contrária */}
          <div style={{ backgroundColor: '#0B101D', border: '1px solid #1B263B', borderRadius: '12px', padding: '20px' }}>
            <h3 style={{ fontSize: '0.92rem', fontWeight: 700, color: '#F59E0B', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <User size={16} /> Parte Contrária (Réu / Requerido)
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.85rem' }}>
              <div>
                <span style={{ color: '#94A3B8', display: 'block', fontSize: '0.75rem' }}>Nome / Razão Social:</span>
                <strong style={{ color: '#FFFFFF' }}>{processo.parteContrariaNome || '-'}</strong>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <span style={{ color: '#94A3B8', display: 'block', fontSize: '0.75rem' }}>CPF / CNPJ:</span>
                  <span style={{ color: '#FFFFFF', fontFamily: 'monospace' }}>{processo.parteContrariaDoc || '-'}</span>
                </div>
                <div>
                  <span style={{ color: '#94A3B8', display: 'block', fontSize: '0.75rem' }}>Profissão / Ramo:</span>
                  <span style={{ color: '#FFFFFF' }}>{processo.parteContrariaProfissao || '-'}</span>
                </div>
              </div>

              <div>
                <span style={{ color: '#94A3B8', display: 'block', fontSize: '0.75rem' }}>Endereço Completo:</span>
                <span style={{ color: '#CBD5E1' }}>{fullEnderecoParteContraria}</span>
              </div>
            </div>
          </div>
        </div>

        {/* General Notes Section */}
        <div style={{ borderTop: '1px solid #1B263B', paddingTop: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <h3 style={{ fontSize: '0.92rem', fontWeight: 700, color: '#FFFFFF', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <FileText size={16} /> Anotações Gerais do Processo
            </h3>
            <button
              type="button"
              onClick={handleSaveNotes}
              className="btn-secondary no-print"
              style={{ fontSize: '0.78rem', padding: '4px 10px' }}
            >
              <Save size={13} /> {salvandoNota ? 'Salvando...' : 'Salvar Anotação'}
            </button>
          </div>
          <textarea
            rows={3}
            value={anotacoes}
            onChange={(e) => setAnotacoes(e.target.value)}
            placeholder="Digite anotações internas, observações da causa, estratégias..."
            className="search-input-dark"
            style={{ padding: '12px', lineHeight: 1.5, resize: 'vertical' }}
          />
        </div>
      </div>

      {/* 2 Bottom Cards: Andamentos (Left) & Linked Tasks (Right) */}
      <div className="no-print" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '24px', marginBottom: '32px' }}>
        
        {/* Left Card: Andamentos Processuais */}
        <div className="card-saas" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#FFFFFF', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Clock size={18} color="#3B82F6" /> Andamentos Processuais
            </h3>
            <span className="badge-saas badge-primary">{andamentos.length} registro(s)</span>
          </div>

          {/* Form to add new progress */}
          <form onSubmit={handleAddAndamento} style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px', backgroundColor: '#0B101D', padding: '12px', borderRadius: '8px', border: '1px solid #1B263B' }}>
            <div style={{ display: 'flex', gap: '10px' }}>
              <input
                type="text"
                placeholder="Data (DD/MM/AAAA)"
                value={novoAndamentoData}
                onChange={(e) => setNovoAndamentoData(e.target.value)}
                className="search-input-dark"
                style={{ width: '130px', paddingLeft: '10px', fontSize: '0.8rem' }}
              />
              <input
                type="text"
                required
                placeholder="Descreva o andamento..."
                value={novoAndamentoDesc}
                onChange={(e) => setNovoAndamentoDesc(e.target.value)}
                className="search-input-dark"
                style={{ flex: 1, paddingLeft: '10px', fontSize: '0.8rem' }}
              />
            </div>
            <button type="submit" className="btn-primary" style={{ fontSize: '0.78rem', padding: '6px 12px', alignSelf: 'flex-end' }}>
              <Plus size={14} /> Adicionar Andamento
            </button>
          </form>

          {/* Timeline list */}
          {andamentos.length === 0 ? (
            <div style={{ fontSize: '0.84rem', color: '#94A3B8', textAlign: 'center', padding: '20px 0' }}>
              Nenhum andamento cadastrado ainda neste processo.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '300px', overflowY: 'auto' }}>
              {andamentos.map((and) => (
                <div key={and.id} style={{ borderLeft: '3px solid #3B82F6', paddingLeft: '12px', backgroundColor: '#0B101D', padding: '10px 12px', borderRadius: '0 8px 8px 0' }}>
                  <span style={{ fontSize: '0.74rem', color: '#3B82F6', fontWeight: 700, display: 'block', marginBottom: '2px' }}>
                    {and.data}
                  </span>
                  <p style={{ fontSize: '0.84rem', color: '#FFFFFF', margin: 0 }}>
                    {and.descricao}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Card: Tarefas e Prazos Vinculados */}
        <div className="card-saas" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#FFFFFF', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CheckSquare size={18} color="#10B981" /> Tarefas e Prazos Vinculados
            </h3>
            <span className="badge-saas badge-primary">{tarefasDoProcesso.length} tarefa(s)</span>
          </div>

          {tarefasDoProcesso.length === 0 ? (
            <div style={{ fontSize: '0.84rem', color: '#94A3B8', textAlign: 'center', padding: '30px 0' }}>
              Nenhuma tarefa vinculada diretamente a este processo.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '350px', overflowY: 'auto' }}>
              {tarefasDoProcesso.map((tar) => (
                <div
                  key={tar.id}
                  onClick={() => setSelectedTask(tar)}
                  style={{
                    backgroundColor: '#0B101D',
                    border: '1px solid #1B263B',
                    borderRadius: '8px',
                    padding: '12px 14px',
                    cursor: 'pointer',
                    transition: 'border-color 0.15s ease'
                  }}
                  className="kanban-card-hover"
                >
                  <div style={{ fontWeight: 700, color: '#FFFFFF', fontSize: '0.88rem', marginBottom: '6px' }}>
                    {tar.tipo || tar.titulo}
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.78rem', color: '#94A3B8' }}>
                    <span>Prazo: {formatarDataExibicao(tar.prazo || tar.vencimento)}</span>
                    <span className={`badge-saas ${tar.status === 'Concluída' || tar.status === 'Arquivada' ? 'badge-success' : 'badge-primary'}`}>
                      {tar.status || 'Pendente'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Popup Detalhes da Tarefa ao clicar */}
      <DetalhesTarefaModal
        isOpen={!!selectedTask}
        onClose={() => setSelectedTask(null)}
        task={selectedTask}
        onUpdateTask={handleUpdateTask}
        onDeleteTask={handleDeleteTask}
      />

      {/* Form Edit Modal */}
      <FormProcessoModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        onSave={handleSaveEdit}
        initialData={processo}
      />

      {/* Delete Confirmation Modal */}
      {showConfirmDelete && (
        <div className="modal-backdrop-blurred" onClick={() => setShowConfirmDelete(false)}>
          <div className="card-saas" onClick={(e) => e.stopPropagation()} style={{ width: '90%', maxWidth: '400px', padding: '24px', textAlign: 'center' }}>
            <Trash2 size={40} color="#EF4444" style={{ margin: '0 auto 12px auto', display: 'block' }} />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#FFFFFF', marginBottom: '8px' }}>
              Excluir Processo?
            </h3>
            <p style={{ fontSize: '0.84rem', color: '#94A3B8', marginBottom: '20px' }}>
              Tem certeza que deseja apagar os autos do processo <strong>{processo.cnj}</strong>? Esta ação não poderá ser desfeita.
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '12px' }}>
              <button type="button" onClick={() => setShowConfirmDelete(false)} className="btn-secondary">
                Cancelar
              </button>
              <button type="button" onClick={handleDelete} className="btn-primary" style={{ backgroundColor: '#EF4444', borderColor: '#EF4444' }}>
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
