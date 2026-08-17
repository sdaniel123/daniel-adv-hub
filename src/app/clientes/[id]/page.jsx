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
  ShieldAlert, 
  Building, 
  Save, 
  Briefcase, 
  CheckSquare, 
  User, 
  Mail, 
  Phone, 
  MapPin 
} from 'lucide-react';
import ToastNotification from '@/components/ui/ToastNotification';
import FormClienteModal from '@/components/clientes/FormClienteModal';
import DetalhesTarefaModal from '@/components/tarefas/DetalhesTarefaModal';
import { fetchClienteById, updateCliente, deleteCliente } from '@/lib/clientesStore';
import { fetchTarefas, formatarDataExibicao } from '@/lib/tarefasStore';

export default function ClienteDetalhesPage() {
  const router = useRouter();
  const params = useParams();
  const clienteId = params?.id;

  const [cliente, setCliente] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [anotacoes, setAnotacoes] = useState('');
  const [salvandoNota, setSalvandoNota] = useState(false);
  const [toast, setToast] = useState(null);
  const [todasTarefas, setTodasTarefas] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);

  useEffect(() => {
    async function loadData() {
      if (!clienteId) return;
      setLoading(true);
      const cli = await fetchClienteById(clienteId);
      setCliente(cli);
      if (cli) setAnotacoes(cli.anotacoes || '');
      const tar = await fetchTarefas();
      setTodasTarefas(tar);
      setLoading(false);
    }
    loadData();
  }, [clienteId]);

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
    // Load client from store or initial data
    const found = initialClientesData.find((c) => c.id === clienteId) || {
      id: clienteId,
      nome: 'Cliente Exemplo',
      tipo: 'Pessoa Física',
      documento: '123.456.789-00',
      email: 'cliente@email.com',
      fone: '(11) 98765-4321',
      cidade: 'São Paulo',
      uf: 'SP',
      incapacidade: 'Capaz',
      prioritario: true,
      anotacoes: 'Anotações gerais do cliente...',
      dataCadastro: '16/08/2026'
    };
    setCliente(found);
    setAnotacoes(found.anotacoes || '');
  }, [clienteId]);

  if (!cliente) {
    return (
      <div style={{ maxWidth: '1000px', margin: '40px auto', textAlign: 'center', color: '#94A3B8' }}>
        Carregando ficha do cliente...
      </div>
    );
  }

  const processosDoCliente = mockProcessosData.filter((p) => p.clienteId === cliente.id || p.cliente === cliente.nome);
  const tarefasDoCliente = todasTarefas.filter((t) => t.clienteId === cliente.id || t.cliente === cliente.nome);

  const handlePrintPDF = () => {
    window.print();
  };

  const handleSaveNotes = () => {
    setSalvandoNota(true);
    setCliente((prev) => ({ ...prev, anotacoes }));
    setToast('Anotações do cliente atualizadas!');
    setTimeout(() => setSalvandoNota(false), 500);
  };

  const handleSaveEdit = (updatedData) => {
    setCliente((prev) => ({ ...prev, ...updatedData }));
    setShowEditModal(false);
    setToast(`Dados de "${updatedData.nome}" atualizados com sucesso!`);
  };

  const handleDelete = () => {
    setToast(`Cliente "${cliente.nome}" excluído.`);
    setTimeout(() => {
      router.push('/clientes');
    }, 1000);
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
    <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
      
      {/* Top Header Navigation & Actions */}
      <div className="no-print" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <Link 
          href="/clientes" 
          className="btn-secondary"
          style={{ fontSize: '0.86rem', display: 'inline-flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}
        >
          <ArrowLeft size={16} /> Voltar para Clientes
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
            <Edit3 size={15} /> Editar Ficha
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
            <span className="page-header-subtitle">DANIEL ADV HUB • FICHA DO CLIENTE</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '6px' }}>
              {cliente.prioritario && <AlertCircle size={22} color="#F59E0B" title="Cliente Prioritário" />}
              <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#FFFFFF', fontFamily: 'var(--font-serif)' }}>
                {cliente.nome}
              </h1>
            </div>
            <p style={{ fontSize: '0.88rem', color: '#94A3B8', marginTop: '4px', fontFamily: 'monospace' }}>
              {cliente.documento} {cliente.rg ? `• RG/IE: ${cliente.rg}` : ''}
            </p>
          </div>

          <div style={{ textAlign: 'right' }}>
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', marginBottom: '8px' }}>
              <span className="badge-saas badge-primary">{cliente.tipo || 'Pessoa Física'}</span>
              {cliente.incapacidade && cliente.incapacidade !== 'Capaz' && (
                <span className="badge-saas badge-warning" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <ShieldAlert size={12} /> {cliente.incapacidade}
                </span>
              )}
              {cliente.prioritario && (
                <span className="badge-saas badge-warning" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <AlertCircle size={12} /> Prioritário
                </span>
              )}
            </div>
            <span style={{ fontSize: '0.78rem', color: '#64748B' }}>
              Cadastrado em {cliente.dataCadastro || '16/08/2026'}
            </span>
          </div>
        </div>

        {/* Cadastral Details Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '18px', fontSize: '0.88rem', marginBottom: '24px' }}>
          <div>
            <span style={{ color: '#64748B', display: 'block', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase' }}>PROFISSÃO / RAMO</span>
            <span style={{ color: '#FFFFFF', fontWeight: 500 }}>{cliente.profissao || 'Não informada'}</span>
          </div>

          <div>
            <span style={{ color: '#64748B', display: 'block', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase' }}>NACIONALIDADE</span>
            <span style={{ color: '#FFFFFF', fontWeight: 500 }}>{cliente.nacionalidade || 'Brasileiro(a)'}</span>
          </div>

          <div>
            <span style={{ color: '#64748B', display: 'block', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase' }}>E-MAIL</span>
            <span style={{ color: '#3B82F6', fontWeight: 500 }}>{cliente.email || 'Não informado'}</span>
          </div>

          <div>
            <span style={{ color: '#64748B', display: 'block', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase' }}>TELEFONE / CELULAR</span>
            <span style={{ color: '#FFFFFF', fontWeight: 500 }}>{cliente.fone || 'Não informado'}</span>
          </div>

          <div style={{ gridColumn: 'span 2' }}>
            <span style={{ color: '#64748B', display: 'block', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase' }}>ENDEREÇO RESIDENCIAL / SEDE</span>
            <span style={{ color: '#FFFFFF', fontWeight: 500 }}>{fullEndereco}</span>
          </div>
        </div>

        {/* Responsável Legal (se Incapaz) */}
        {cliente.incapacidade && cliente.incapacidade !== 'Capaz' && (
          <div style={{ marginBottom: '24px', backgroundColor: '#0B101D', border: '1px solid #1B263B', borderRadius: '10px', padding: '16px' }}>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#F59E0B', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ShieldAlert size={18} /> Dados do Responsável Legal ({cliente.incapacidade})
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', fontSize: '0.85rem' }}>
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

        {/* Responsável da Empresa (se PJ) */}
        {cliente.tipo === 'Pessoa Jurídica' && cliente.respEmpresaNome && (
          <div style={{ marginBottom: '24px', backgroundColor: '#0B101D', border: '1px solid #1B263B', borderRadius: '10px', padding: '16px' }}>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#3B82F6', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Building size={18} /> Representante da Empresa (PJ)
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', fontSize: '0.85rem' }}>
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

        {/* Editable General Notes */}
        <div style={{ marginBottom: '32px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#FFFFFF' }}>Anotações Gerais do Cliente</h3>
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
            rows={4}
            placeholder="Anotações internas sobre o cliente, particularidades, preferências..."
            value={anotacoes}
            onChange={(e) => setAnotacoes(e.target.value)}
            className="search-input-dark"
            style={{ width: '100%', padding: '12px', resize: 'vertical', fontSize: '0.88rem' }}
          />
        </div>

        {/* 2 Bottom Cards: Linked Processes & Linked Tasks */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '24px' }}>
          
          {/* Card Left: Linked Processes */}
          <div className="card-saas" style={{ backgroundColor: '#0B101D' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', paddingBottom: '12px', borderBottom: '1px solid #1B263B' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Briefcase size={20} color="#3B82F6" />
                <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#FFFFFF' }}>
                  Processos Vinculados
                </h3>
              </div>
              <span className="badge-saas badge-primary">
                {processosDoCliente.length} processo(s)
              </span>
            </div>

            {processosDoCliente.length === 0 ? (
              <div style={{ padding: '30px', textAlign: 'center', color: '#64748B', fontSize: '0.85rem', fontStyle: 'italic' }}>
                Nenhum processo vinculado a este cliente.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {processosDoCliente.map((p) => (
                  <div key={p.id || p.cnj} style={{ backgroundColor: '#0E1526', border: '1px solid #1B263B', borderRadius: '8px', padding: '14px' }}>
                    <div style={{ fontWeight: 700, color: '#FFFFFF', fontSize: '0.9rem', fontFamily: 'monospace' }}>
                      {p.cnj}
                    </div>
                    <div style={{ fontSize: '0.84rem', color: '#94A3B8', marginTop: '3px' }}>
                      {p.assunto || 'Ação Judicial'}
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px', fontSize: '0.78rem' }}>
                      <span style={{ color: '#64748B' }}>{p.vara || 'Vara Cível'}</span>
                      <span className="badge-saas badge-success">{p.status || 'Em andamento'}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Card Right: Linked Tasks */}
          <div className="card-saas" style={{ backgroundColor: '#0B101D' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', paddingBottom: '12px', borderBottom: '1px solid #1B263B' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <CheckSquare size={20} color="#A855F7" />
                <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#FFFFFF' }}>
                  Tarefas e Prazos Vinculados
                </h3>
              </div>
              <span className="badge-saas badge-warning">
                {tarefasDoCliente.length} tarefa(s)
              </span>
            </div>

            {tarefasDoCliente.length === 0 ? (
              <div style={{ padding: '30px', textAlign: 'center', color: '#64748B', fontSize: '0.85rem', fontStyle: 'italic' }}>
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
                      padding: '12px 14px',
                      cursor: 'pointer',
                      transition: 'border-color 0.15s ease'
                    }}
                    className="kanban-card-hover"
                  >
                    <div style={{ fontWeight: 700, color: '#FFFFFF', fontSize: '0.88rem', marginBottom: '6px' }}>
                      {t.tipo || t.titulo}
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.78rem', color: '#94A3B8' }}>
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
      </div>

      {/* Popup Detalhes da Tarefa ao clicar */}
      <DetalhesTarefaModal
        isOpen={!!selectedTask}
        onClose={() => setSelectedTask(null)}
        task={selectedTask}
        onUpdateTask={handleUpdateTask}
        onDeleteTask={handleDeleteTask}
      />

      {/* Edit Modal (Popup with Blurred Background) */}
      <FormClienteModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        onSave={handleSaveEdit}
        initialData={cliente}
      />

      {/* Delete Confirmation Modal */}
      {showConfirmDelete && (
        <div className="modal-backdrop-blurred">
          <div className="card-saas" style={{ width: '90%', maxWidth: '420px', padding: '24px', textAlign: 'center' }}>
            <Trash2 size={40} color="#EF4444" style={{ marginBottom: '14px' }} />
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#FFFFFF', marginBottom: '8px' }}>Excluir Cliente?</h3>
            <p style={{ fontSize: '0.88rem', color: '#94A3B8', marginBottom: '24px' }}>
              Tem certeza que deseja apagar o cadastro de <strong>{cliente.nome}</strong>? Esta ação não poderá ser desfeita.
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '12px' }}>
              <button type="button" className="btn-secondary" onClick={() => setShowConfirmDelete(false)}>Cancelar</button>
              <button 
                type="button" 
                className="btn-primary" 
                style={{ backgroundColor: '#EF4444', color: '#FFFFFF' }}
                onClick={handleDelete}
              >
                Confirmar Exclusão
              </button>
            </div>
          </div>
        </div>
      )}

      <ToastNotification message={toast} onClose={() => setToast(null)} />
    </div>
  );
}
