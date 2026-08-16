'use client';

import React, { useState, useEffect } from 'react';
import { X, Search, Loader2, AlertCircle, Plus, UserPlus, Check, Trash2, Building } from 'lucide-react';
import { maskCnj, maskCpfCnpj, maskCep, fetchAddressByCep, maskCurrency } from '@/lib/cep';
import { initialClientesData } from '@/lib/clientesStore';

export default function FormProcessoModal({ isOpen, onClose, onSave, initialData = null }) {
  const [formData, setFormData] = useState({
    cnj: '',
    clientes: [], // Array of { id, nome }
    dataProtocolo: '',
    tramitacao: '',
    sistema: 'PJe',
    assunto: '',
    valorCausa: '',
    prioritario: false,
    status: 'Em andamento',
    
    // Dados Parte Contrária
    parteContrariaNome: '',
    parteContrariaDoc: '',
    parteContrariaProfissao: '',
    parteContrariaNacionalidade: 'Brasileiro(a)',
    parteContrariaCep: '',
    parteContrariaLogradouro: '',
    parteContrariaNumero: '',
    parteContrariaComplemento: '',
    parteContrariaBairro: '',
    parteContrariaCidade: '',
    parteContrariaUf: '',

    anotacoes: '',
  });

  // Client search state for chip selection
  const [clientSearchTerm, setClientSearchTerm] = useState('');
  const [loadingCep, setLoadingCep] = useState(false);
  const [cepError, setCepError] = useState('');

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        clientes: initialData.clientes || [],
        dataProtocolo: initialData.dataProtocolo || '',
        parteContrariaNacionalidade: initialData.parteContrariaNacionalidade || 'Brasileiro(a)',
      });
    } else {
      const todayStr = new Date().toISOString().slice(0, 10);
      setFormData({
        cnj: '',
        clientes: [],
        dataProtocolo: todayStr,
        tramitacao: '',
        sistema: 'PJe',
        assunto: '',
        valorCausa: '',
        prioritario: false,
        status: 'Em andamento',
        parteContrariaNome: '',
        parteContrariaDoc: '',
        parteContrariaProfissao: '',
        parteContrariaNacionalidade: 'Brasileiro(a)',
        parteContrariaCep: '',
        parteContrariaLogradouro: '',
        parteContrariaNumero: '',
        parteContrariaComplemento: '',
        parteContrariaBairro: '',
        parteContrariaCidade: '',
        parteContrariaUf: '',
        anotacoes: '',
      });
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Add client chip
  const handleAddClientChip = (clientObj) => {
    if (formData.clientes.some((c) => c.id === clientObj.id || c.nome.toLowerCase() === clientObj.nome.toLowerCase())) {
      setClientSearchTerm('');
      return;
    }
    setFormData((prev) => ({
      ...prev,
      clientes: [...prev.clientes, clientObj],
    }));
    setClientSearchTerm('');
  };

  // Remove client chip
  const handleRemoveClientChip = (clientId) => {
    setFormData((prev) => ({
      ...prev,
      clientes: prev.clientes.filter((c) => c.id !== clientId && c.nome !== clientId),
    }));
  };

  // Available clients matching search
  const matchingClients = initialClientesData.filter((c) => {
    if (!clientSearchTerm.trim()) return false;
    return c.nome.toLowerCase().includes(clientSearchTerm.toLowerCase());
  });

  const handleCepSearch = async () => {
    if (!formData.parteContrariaCep) return;
    setLoadingCep(true);
    setCepError('');
    const res = await fetchAddressByCep(formData.parteContrariaCep);
    setLoadingCep(false);

    if (res.error) {
      setCepError(res.error);
    } else {
      setFormData((prev) => ({
        ...prev,
        parteContrariaLogradouro: res.logradouro || prev.parteContrariaLogradouro,
        parteContrariaBairro: res.bairro || prev.parteContrariaBairro,
        parteContrariaCidade: res.cidade || prev.parteContrariaCidade,
        parteContrariaUf: res.uf || prev.parteContrariaUf,
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.clientes.length === 0) {
      alert('Selecione ao menos um cliente vinculado para o processo.');
      return;
    }

    // Format protocol date display
    let fmtDate = '';
    if (formData.dataProtocolo) {
      const parts = formData.dataProtocolo.split('-');
      if (parts.length === 3) fmtDate = `${parts[2]}/${parts[1]}/${parts[0]}`;
    }

    onSave({
      ...formData,
      dataProtocoloFmt: fmtDate || formData.dataProtocolo,
      arquivado: formData.status === 'Arquivado',
      encerado: formData.status === 'Encerrado',
      comAudiencia: formData.status === 'Com audiência',
    });
  };

  return (
    <div className="modal-backdrop-blurred" onClick={onClose}>
      <div className="card-saas" onClick={(e) => e.stopPropagation()} style={{ width: '92%', maxWidth: '800px', maxHeight: '90vh', overflowY: 'auto', margin: 0, padding: '24px' }}>
        
        {/* Modal Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid #1B263B', paddingBottom: '14px' }}>
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#FFFFFF', fontFamily: 'var(--font-serif)' }}>
              {initialData ? 'Editar Processo' : 'Cadastrar Novo Processo'}
            </h3>
            <p style={{ fontSize: '0.78rem', color: '#94A3B8', marginTop: '2px' }}>
              Informe os dados do processo, clientes vinculados e parte contrária.
            </p>
          </div>
          <button type="button" onClick={onClose} style={{ color: '#94A3B8', padding: '6px' }}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Seção 1: Dados do Processo */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px' }}>
            
            {/* CNJ Autos */}
            <div style={{ gridColumn: 'span 2' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#94A3B8', marginBottom: '4px' }}>
                Autos / Número CNJ *
              </label>
              <input
                type="text"
                required
                placeholder="0000000-00.2026.8.26.0000"
                value={formData.cnj}
                onChange={(e) => handleChange('cnj', maskCnj(e.target.value))}
                className="search-input-dark"
                style={{ paddingLeft: '12px', fontFamily: 'monospace', fontWeight: 600 }}
              />
            </div>

            {/* Data do Protocolo / Distribuição */}
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#94A3B8', marginBottom: '4px' }}>
                Data do Protocolo / Distribuição *
              </label>
              <input
                type="date"
                required
                value={formData.dataProtocolo}
                onChange={(e) => handleChange('dataProtocolo', e.target.value)}
                className="search-input-dark"
                style={{ paddingLeft: '12px', color: '#FFFFFF' }}
              />
            </div>

            {/* Sistema Judicial */}
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#94A3B8', marginBottom: '4px' }}>
                Sistema *
              </label>
              <select
                value={formData.sistema}
                onChange={(e) => handleChange('sistema', e.target.value)}
                className="search-input-dark"
                style={{ width: '100%', paddingLeft: '12px', cursor: 'pointer' }}
              >
                <option value="PJe">PJe</option>
                <option value="EProc">EProc</option>
                <option value="Projudi">Projudi</option>
                <option value="Outro">Outro</option>
              </select>
            </div>

            {/* Tramitação (Vara e Comarca) */}
            <div style={{ gridColumn: 'span 2' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#94A3B8', marginBottom: '4px' }}>
                Tramitação (Vara e Comarca) *
              </label>
              <input
                type="text"
                required
                placeholder="Ex: 2ª Vara Cível - Comarca de São Paulo/SP"
                value={formData.tramitacao}
                onChange={(e) => handleChange('tramitacao', e.target.value)}
                className="search-input-dark"
                style={{ paddingLeft: '12px' }}
              />
            </div>

            {/* Assunto / Tipo */}
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#94A3B8', marginBottom: '4px' }}>
                Assunto / Tipo de Ação *
              </label>
              <input
                type="text"
                required
                placeholder="Ex: Ação de Cobrança c/c Indenização"
                value={formData.assunto}
                onChange={(e) => handleChange('assunto', e.target.value)}
                className="search-input-dark"
                style={{ paddingLeft: '12px' }}
              />
            </div>

            {/* Valor da Causa */}
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#94A3B8', marginBottom: '4px' }}>
                Valor da Causa
              </label>
              <input
                type="text"
                placeholder="R$ 0,00"
                value={formData.valorCausa}
                onChange={(e) => handleChange('valorCausa', maskCurrency(e.target.value))}
                className="search-input-dark"
                style={{ paddingLeft: '12px' }}
              />
            </div>
          </div>

          {/* Seção 2: Cliente(s) Vinculado(s) por Busca com Chips/Tags */}
          <div style={{ backgroundColor: '#0B101D', border: '1px solid #1B263B', borderRadius: '10px', padding: '16px' }}>
            <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#FFFFFF', marginBottom: '8px' }}>
              Cliente(s) Vinculado(s) ao Processo *
            </h4>
            <p style={{ fontSize: '0.78rem', color: '#94A3B8', marginBottom: '12px' }}>
              Pesquise o cliente cadastrado pelo nome para adicionar em formato de tag/chip.
            </p>

            {/* Display selected chips */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '12px' }}>
              {formData.clientes.map((c) => (
                <span
                  key={c.id || c.nome}
                  style={{
                    backgroundColor: '#131D33',
                    color: '#FFFFFF',
                    border: '1px solid #3B82F6',
                    padding: '4px 10px',
                    borderRadius: '16px',
                    fontSize: '0.82rem',
                    fontWeight: 600,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  {c.nome}
                  <button
                    type="button"
                    onClick={() => handleRemoveClientChip(c.id || c.nome)}
                    style={{ color: '#EF4444', display: 'flex', alignItems: 'center' }}
                    title="Remover cliente"
                  >
                    <X size={14} />
                  </button>
                </span>
              ))}
              {formData.clientes.length === 0 && (
                <span style={{ fontSize: '0.78rem', color: '#EF4444', fontStyle: 'italic' }}>
                  Nenhum cliente selecionado ainda.
                </span>
              )}
            </div>

            {/* Real-time search input for clients */}
            <div style={{ position: 'relative' }}>
              <div style={{ position: 'relative' }}>
                <Search size={15} style={{ position: 'absolute', left: '12px', top: '10px', color: '#94A3B8' }} />
                <input
                  type="text"
                  placeholder="Digite o nome do cliente cadastrado para buscar..."
                  value={clientSearchTerm}
                  onChange={(e) => setClientSearchTerm(e.target.value)}
                  className="search-input-dark"
                />
              </div>

              {/* Autocomplete Suggestions dropdown */}
              {clientSearchTerm.trim() !== '' && (
                <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, backgroundColor: '#0E1526', border: '1px solid #1B263B', borderRadius: '8px', marginTop: '4px', zIndex: 10, maxHeight: '160px', overflowY: 'auto' }}>
                  {matchingClients.map((clientObj) => (
                    <div
                      key={clientObj.id}
                      onClick={() => handleAddClientChip(clientObj)}
                      style={{ padding: '10px 14px', fontSize: '0.85rem', color: '#FFFFFF', cursor: 'pointer', borderBottom: '1px solid #162035', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                    >
                      <span>{clientObj.nome} <small style={{ color: '#94A3B8' }}>({clientObj.documento})</small></span>
                      <Plus size={14} color="#3B82F6" />
                    </div>
                  ))}
                  {matchingClients.length === 0 && (
                    <div
                      onClick={() => handleAddClientChip({ id: String(Date.now()), nome: clientSearchTerm })}
                      style={{ padding: '10px 14px', fontSize: '0.85rem', color: '#3B82F6', cursor: 'pointer' }}
                    >
                      + Adicionar "{clientSearchTerm}" como novo vínculo
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Seção 3: Dados da Parte Contrária */}
          <div style={{ backgroundColor: '#0B101D', border: '1px solid #1B263B', borderRadius: '10px', padding: '16px' }}>
            <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#FFFFFF', marginBottom: '12px' }}>
              Parte Contrária (Réu / Requerido)
            </h4>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
              <div style={{ gridColumn: 'span 2' }}>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#94A3B8', marginBottom: '4px' }}>
                  Nome Completo / Razão Social da Parte Contrária
                </label>
                <input
                  type="text"
                  placeholder="Nome do réu..."
                  value={formData.parteContrariaNome}
                  onChange={(e) => handleChange('parteContrariaNome', e.target.value)}
                  className="search-input-dark"
                  style={{ paddingLeft: '12px' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#94A3B8', marginBottom: '4px' }}>
                  CPF / CNPJ da Parte Contrária
                </label>
                <input
                  type="text"
                  placeholder="000.000.000-00"
                  value={formData.parteContrariaDoc}
                  onChange={(e) => handleChange('parteContrariaDoc', maskCpfCnpj(e.target.value))}
                  className="search-input-dark"
                  style={{ paddingLeft: '12px' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#94A3B8', marginBottom: '4px' }}>
                  Profissão / Ramo
                </label>
                <input
                  type="text"
                  placeholder="Profissão do réu"
                  value={formData.parteContrariaProfissao}
                  onChange={(e) => handleChange('parteContrariaProfissao', e.target.value)}
                  className="search-input-dark"
                  style={{ paddingLeft: '12px' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#94A3B8', marginBottom: '4px' }}>
                  Nacionalidade
                </label>
                <input
                  type="text"
                  placeholder="Brasileiro(a)"
                  value={formData.parteContrariaNacionalidade}
                  onChange={(e) => handleChange('parteContrariaNacionalidade', e.target.value)}
                  className="search-input-dark"
                  style={{ paddingLeft: '12px' }}
                />
              </div>

              {/* Endereço Parte Contrária via CEP */}
              <div style={{ gridColumn: 'span 2' }}>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#94A3B8', marginBottom: '4px' }}>
                  CEP da Parte Contrária
                </label>
                <div style={{ display: 'flex', gap: '6px' }}>
                  <input
                    type="text"
                    placeholder="00000-000"
                    value={formData.parteContrariaCep}
                    onChange={(e) => {
                      const val = maskCep(e.target.value);
                      handleChange('parteContrariaCep', val);
                      if (val.replace(/\D/g, '').length === 8) {
                        handleCepSearch();
                      }
                    }}
                    onBlur={() => handleCepSearch()}
                    className="search-input-dark"
                    style={{ paddingLeft: '12px', flex: 1 }}
                  />
                  <button
                    type="button"
                    onClick={() => handleCepSearch()}
                    className="btn-secondary"
                    style={{ padding: '0 12px', height: '36px' }}
                  >
                    {loadingCep ? <Loader2 size={15} className="spin" /> : <Search size={15} />}
                  </button>
                </div>
                {cepError && <span style={{ fontSize: '0.72rem', color: '#EF4444', marginTop: '2px', display: 'block' }}>{cepError}</span>}
              </div>

              <div style={{ gridColumn: 'span 2' }}>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#94A3B8', marginBottom: '4px' }}>
                  Endereço Completo
                </label>
                <input
                  type="text"
                  placeholder="Rua, Número, Bairro, Cidade/UF..."
                  value={formData.parteContrariaLogradouro}
                  onChange={(e) => handleChange('parteContrariaLogradouro', e.target.value)}
                  className="search-input-dark"
                  style={{ paddingLeft: '12px' }}
                />
              </div>
            </div>
          </div>

          {/* Seção 4: Prioridade & Status */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.85rem', color: '#FFFFFF', fontWeight: 600 }}>
              <input
                type="checkbox"
                checked={formData.prioritario}
                onChange={(e) => handleChange('prioritario', e.target.checked)}
                style={{ width: '16px', height: '16px', accentColor: '#F59E0B' }}
              />
              <AlertCircle size={16} color="#F59E0B" />
              Marcar este processo como Prioritário
            </label>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <label style={{ fontSize: '0.8rem', color: '#94A3B8', fontWeight: 600 }}>Status do Processo:</label>
              <select
                value={formData.status}
                onChange={(e) => handleChange('status', e.target.value)}
                className="search-input-dark"
                style={{ width: '160px', paddingLeft: '10px', cursor: 'pointer' }}
              >
                <option value="Em andamento">Em andamento</option>
                <option value="Com audiência">Com audiência</option>
                <option value="Encerrado">Encerrado</option>
                <option value="Arquivado">Arquivado</option>
              </select>
            </div>
          </div>

          {/* Modal Actions */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', borderTop: '1px solid #1B263B', paddingTop: '16px' }}>
            <button type="button" onClick={onClose} className="btn-secondary">
              Cancelar
            </button>
            <button type="submit" className="btn-primary" style={{ minWidth: '140px' }}>
              {initialData ? 'Salvar Alterações' : 'Cadastrar Processo'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
