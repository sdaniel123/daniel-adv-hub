'use client';

import React, { useState, useEffect, useRef } from 'react';
import { X, Search, Check, AlertTriangle, Calendar, User, Briefcase, ChevronDown } from 'lucide-react';
import { initialClientesData } from '@/lib/clientesStore';
import { initialProcessosData } from '@/lib/processosStore';
import { getTiposTarefasSalvos } from '@/lib/tarefasStore';

export default function FormTarefaModal({
  isOpen,
  onClose,
  onSave,
  initialData = null
}) {
  const [tipoInput, setTipoInput] = useState('');
  const [showTipoDropdown, setShowTipoDropdown] = useState(false);
  const [prazo, setPrazo] = useState('');
  const [processoId, setProcessoId] = useState('');
  const [clienteId, setClienteId] = useState('');
  const [anotacoes, setAnotacoes] = useState('');
  const [urgente, setUrgente] = useState(false);
  const [status, setStatus] = useState('Pendente');

  const [tiposDisponiveis, setTiposDisponiveis] = useState([]);
  const dropdownRef = useRef(null);

  // Carregar dados iniciais ao abrir o modal
  useEffect(() => {
    if (isOpen) {
      const tipos = getTiposTarefasSalvos();
      setTiposDisponiveis(tipos);

      if (initialData) {
        setTipoInput(initialData.tipo || '');
        setPrazo(initialData.prazo || '');
        setProcessoId(initialData.processoId || '');
        setClienteId(initialData.clienteId || '');
        setAnotacoes(initialData.anotacoes || '');
        setUrgente(!!initialData.urgente);
        setStatus(initialData.status || 'Pendente');
      } else {
        // Padrão para nova tarefa
        setTipoInput('');
        const amanha = new Date();
        amanha.setDate(amanha.getDate() + 1);
        setPrazo(amanha.toISOString().split('T')[0]);
        setProcessoId('');
        setClienteId('');
        setAnotacoes('');
        setUrgente(false);
        setStatus('Pendente');
      }
    }
  }, [isOpen, initialData]);

  // Fechar dropdown ao clicar fora
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowTipoDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!isOpen) return null;

  // Atualizar cliente automaticamente quando o processo é selecionado
  const handleProcessoChange = (e) => {
    const selectedProcId = e.target.value;
    setProcessoId(selectedProcId);

    if (selectedProcId) {
      const proc = initialProcessosData.find(p => p.id === selectedProcId);
      if (proc && proc.clientes && proc.clientes.length > 0) {
        setClienteId(proc.clientes[0].id);
      }
    }
  };

  const filteredTipos = tiposDisponiveis.filter(t =>
    t.nome.toLowerCase().includes(tipoInput.toLowerCase())
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!tipoInput.trim()) return;

    const proc = initialProcessosData.find(p => p.id === processoId);
    const cli = initialClientesData.find(c => c.id === clienteId);

    const taskPayload = {
      id: initialData?.id || String(Date.now()),
      tipo: tipoInput,
      prazo,
      processoId: processoId || '',
      processo: proc ? proc.cnj : (initialData?.processo || ''),
      clienteId: clienteId || '',
      cliente: cli ? cli.nome : (proc && proc.clientes ? proc.clientes[0]?.nome : (initialData?.cliente || '')),
      anotacoes,
      urgente,
      status,
      dataCriacao: initialData?.dataCriacao || new Date().toISOString().split('T')[0]
    };

    onSave(taskPayload);
  };

  return (
    <div className="modal-backdrop-blurred" onClick={onClose}>
      <div
        className="card-saas"
        onClick={(e) => e.stopPropagation()}
        style={{ width: '90%', maxWidth: '540px', padding: '24px', margin: 'auto' }}
      >
        {/* Header do Modal */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid #1B263B', paddingBottom: '14px' }}>
          <div>
            <span style={{ fontSize: '0.72rem', color: '#3B82F6', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              DANIEL ADV HUB
            </span>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#FFFFFF', margin: 0 }}>
              {initialData ? 'Editar Tarefa' : 'Cadastrar Nova Tarefa'}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{ color: '#94A3B8', backgroundColor: 'transparent', padding: '4px', borderRadius: '6px' }}
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

          {/* Campo 1: Tipo de Tarefa (Barra de busca / Combobox filtrável) */}
          <div style={{ position: 'relative' }} ref={dropdownRef}>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#CBD5E1', marginBottom: '6px' }}>
              Tipo de Tarefa <span style={{ color: '#EF4444' }}>*</span>
            </label>
            <div style={{ position: 'relative' }}>
              <Search size={16} style={{ position: 'absolute', left: '12px', top: '12px', color: '#94A3B8' }} />
              <input
                type="text"
                required
                placeholder="Busque ou escolha o tipo de tarefa..."
                value={tipoInput}
                onChange={(e) => {
                  setTipoInput(e.target.value);
                  setShowTipoDropdown(true);
                }}
                onFocus={() => setShowTipoDropdown(true)}
                className="search-input-dark"
                style={{ paddingLeft: '38px', width: '100%' }}
              />
              <ChevronDown size={16} style={{ position: 'absolute', right: '12px', top: '12px', color: '#94A3B8', pointerEvents: 'none' }} />
            </div>

            {/* Dropdown com resultados filtrados */}
            {showTipoDropdown && (
              <div
                style={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  right: 0,
                  marginTop: '4px',
                  backgroundColor: '#0E1526',
                  border: '1px solid #1B263B',
                  borderRadius: '8px',
                  maxHeight: '180px',
                  overflowY: 'auto',
                  zIndex: 50,
                  boxShadow: '0 10px 25px rgba(0,0,0,0.5)'
                }}
              >
                {filteredTipos.length === 0 ? (
                  <div style={{ padding: '10px 14px', fontSize: '0.82rem', color: '#94A3B8', fontStyle: 'italic' }}>
                    Nenhum tipo correspondente. Digite para usar &quot;{tipoInput}&quot;
                  </div>
                ) : (
                  filteredTipos.map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => {
                        setTipoInput(t.nome);
                        setShowTipoDropdown(false);
                      }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justify: 'space-between',
                        width: '100%',
                        padding: '10px 14px',
                        fontSize: '0.84rem',
                        color: tipoInput === t.nome ? '#3B82F6' : '#FFFFFF',
                        backgroundColor: tipoInput === t.nome ? '#131D33' : 'transparent',
                        textAlign: 'left',
                        cursor: 'pointer',
                        borderBottom: '1px solid #162035',
                        transition: 'background-color 0.15s ease'
                      }}
                    >
                      <span>{t.nome}</span>
                      {tipoInput === t.nome && <Check size={14} color="#3B82F6" />}
                    </button>
                  ))
                )}
              </div>
            )}
          </div>

          {/* Campo 2: Prazo (Data) */}
          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#CBD5E1', marginBottom: '6px' }}>
              Prazo de Vencimento (Data) <span style={{ color: '#EF4444' }}>*</span>
            </label>
            <input
              type="date"
              required
              value={prazo}
              onChange={(e) => setPrazo(e.target.value)}
              className="search-input-dark"
              style={{ width: '100%', paddingLeft: '12px' }}
            />
          </div>

          {/* Campo 3 & 4: Processo Vinculado e Cliente Vinculado */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#CBD5E1', marginBottom: '6px' }}>
                Processo Vinculado
              </label>
              <select
                value={processoId}
                onChange={handleProcessoChange}
                className="search-input-dark"
                style={{ width: '100%', paddingLeft: '10px', cursor: 'pointer' }}
              >
                <option value="">Nenhum processo</option>
                {initialProcessosData.map((p) => (
                  <option key={p.id} value={p.id}>
                    CNJ: {p.cnj}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#CBD5E1', marginBottom: '6px' }}>
                Cliente Vinculado
              </label>
              <select
                value={clienteId}
                onChange={(e) => setClienteId(e.target.value)}
                className="search-input-dark"
                style={{ width: '100%', paddingLeft: '10px', cursor: 'pointer' }}
              >
                <option value="">Nenhum cliente</option>
                {initialClientesData.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.nome}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Campo 5: Anotações / Descrição */}
          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#CBD5E1', marginBottom: '6px' }}>
              Anotações / Descrição da Tarefa
            </label>
            <textarea
              rows={3}
              placeholder="Descreva detalhes ou instruções para execução da tarefa..."
              value={anotacoes}
              onChange={(e) => setAnotacoes(e.target.value)}
              className="search-input-dark"
              style={{ width: '100%', padding: '10px', resize: 'vertical', fontSize: '0.85rem' }}
            />
          </div>

          {/* Campo 6: Marcar como Urgente */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#0B101D', padding: '12px 14px', borderRadius: '8px', border: '1px solid #1B263B' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <AlertTriangle size={18} color={urgente ? '#EF4444' : '#94A3B8'} />
              <div>
                <span style={{ fontSize: '0.86rem', fontWeight: 700, color: '#FFFFFF' }}>Marcar como Urgente</span>
                <p style={{ fontSize: '0.74rem', color: '#94A3B8', margin: 0 }}>Destaca a tarefa e coloca no topo da lista</p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setUrgente(!urgente)}
              style={{
                width: '44px',
                height: '24px',
                borderRadius: '12px',
                backgroundColor: urgente ? '#EF4444' : '#1B263B',
                position: 'relative',
                transition: 'background-color 0.2s ease',
                padding: '2px',
                cursor: 'pointer'
              }}
            >
              <div
                style={{
                  width: '20px',
                  height: '20px',
                  borderRadius: '50%',
                  backgroundColor: '#FFFFFF',
                  transform: urgente ? 'translateX(20px)' : 'translateX(0px)',
                  transition: 'transform 0.2s ease'
                }}
              />
            </button>
          </div>

          {/* Botões de Ação */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
            <button type="button" onClick={onClose} className="btn-secondary">
              Cancelar
            </button>
            <button type="submit" className="btn-primary">
              {initialData ? 'Salvar Alterações' : 'Cadastrar Tarefa'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
