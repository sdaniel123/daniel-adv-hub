'use client';

import React, { useState, useEffect } from 'react';
import { X, Search, Loader2, Star, UserCheck, Building, ShieldAlert } from 'lucide-react';
import { maskCpfCnpj, maskPhone, maskCep, fetchAddressByCep } from '@/lib/cep';

export default function FormClienteModal({ isOpen, onClose, onSave, initialData = null }) {
  const [formData, setFormData] = useState({
    nome: '',
    tipo: 'Pessoa Física', // 'Pessoa Física' | 'Pessoa Jurídica'
    documento: '',
    rg: '',
    profissao: '',
    nacionalidade: 'Brasileiro(a)',
    
    // Endereço
    cep: '',
    logradouro: '',
    numero: '',
    complemento: '',
    bairro: '',
    cidade: '',
    uf: '',
    
    // Campos Pessoa Jurídica
    respEmpresaNome: '',
    respEmpresaCpf: '',
    respEmpresaEndereco: '',

    // Capacidade Civil
    incapacidade: 'Capaz', // 'Capaz' | 'Menor Impúbere' | 'Curatelado' | 'Tutelado'
    
    // Dados Responsável Legal (caso incapaz)
    respLegalNome: '',
    respLegalCpf: '',
    respLegalRg: '',
    respLegalProfissao: '',
    respLegalNacionalidade: 'Brasileiro(a)',
    respLegalEndereco: '',
    copiarEnderecoCliente: false,

    // Contato & Extra
    fone: '',
    email: '',
    prioritario: false,
    anotacoes: '',
  });

  const [loadingCep, setLoadingCep] = useState(false);
  const [cepError, setCepError] = useState('');

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        nacionalidade: initialData.nacionalidade || 'Brasileiro(a)',
        incapacidade: initialData.incapacidade || (initialData.menorIncapaz ? 'Menor Impúbere' : 'Capaz'),
        respLegalNacionalidade: initialData.respLegalNacionalidade || 'Brasileiro(a)',
      });
    } else {
      // Reset form for creation
      setFormData({
        nome: '',
        tipo: 'Pessoa Física',
        documento: '',
        rg: '',
        profissao: '',
        nacionalidade: 'Brasileiro(a)',
        cep: '',
        logradouro: '',
        numero: '',
        complemento: '',
        bairro: '',
        cidade: '',
        uf: '',
        respEmpresaNome: '',
        respEmpresaCpf: '',
        respEmpresaEndereco: '',
        incapacidade: 'Capaz',
        respLegalNome: '',
        respLegalCpf: '',
        respLegalRg: '',
        respLegalProfissao: '',
        respLegalNacionalidade: 'Brasileiro(a)',
        respLegalEndereco: '',
        copiarEnderecoCliente: false,
        fone: '',
        email: '',
        prioritario: false,
        anotacoes: '',
      });
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleCepSearch = async (cepValue) => {
    const rawCep = cepValue || formData.cep;
    if (!rawCep) return;
    setLoadingCep(true);
    setCepError('');
    const res = await fetchAddressByCep(rawCep);
    setLoadingCep(false);

    if (res.error) {
      setCepError(res.error);
    } else {
      setFormData((prev) => ({
        ...prev,
        logradouro: res.logradouro || prev.logradouro,
        bairro: res.bairro || prev.bairro,
        cidade: res.cidade || prev.cidade,
        uf: res.uf || prev.uf,
      }));
    }
  };

  const handleCopiarEndereco = (e) => {
    const checked = e.target.checked;
    const enderecoCliente = `${formData.logradouro}${formData.numero ? `, ${formData.numero}` : ''}${formData.bairro ? ` - ${formData.bairro}` : ''}${formData.cidade ? `, ${formData.cidade}/${formData.uf}` : ''}`;
    
    setFormData((prev) => ({
      ...prev,
      copiarEnderecoCliente: checked,
      respLegalEndereco: checked ? enderecoCliente : prev.respLegalEndereco,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="modal-backdrop-blurred" onClick={onClose}>
      <div className="card-saas" onClick={(e) => e.stopPropagation()} style={{ width: '92%', maxWidth: '780px', maxHeight: '90vh', overflowY: 'auto', margin: 0, padding: '24px' }}>
        
        {/* Modal Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid #1B263B', paddingBottom: '14px' }}>
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#FFFFFF', fontFamily: 'var(--font-serif)' }}>
              {initialData ? 'Editar Cliente' : 'Cadastrar Novo Cliente'}
            </h3>
            <p style={{ fontSize: '0.78rem', color: '#94A3B8', marginTop: '2px' }}>
              Preencha os dados cadastrais do cliente conforme o tipo de pessoa e capacidade civil.
            </p>
          </div>
          <button type="button" onClick={onClose} style={{ color: '#94A3B8', padding: '6px' }}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Tipo de Pessoa Toggle */}
          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              type="button"
              onClick={() => handleChange('tipo', 'Pessoa Física')}
              style={{
                flex: 1,
                padding: '10px',
                borderRadius: '8px',
                border: '1px solid',
                borderColor: formData.tipo === 'Pessoa Física' ? '#3B82F6' : '#1B263B',
                backgroundColor: formData.tipo === 'Pessoa Física' ? '#131D33' : '#0B101D',
                color: formData.tipo === 'Pessoa Física' ? '#FFFFFF' : '#94A3B8',
                fontWeight: 600,
                fontSize: '0.86rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                transition: 'all 0.15s ease'
              }}
            >
              <UserCheck size={16} /> Pessoa Física
            </button>
            <button
              type="button"
              onClick={() => handleChange('tipo', 'Pessoa Jurídica')}
              style={{
                flex: 1,
                padding: '10px',
                borderRadius: '8px',
                border: '1px solid',
                borderColor: formData.tipo === 'Pessoa Jurídica' ? '#3B82F6' : '#1B263B',
                backgroundColor: formData.tipo === 'Pessoa Jurídica' ? '#131D33' : '#0B101D',
                color: formData.tipo === 'Pessoa Jurídica' ? '#FFFFFF' : '#94A3B8',
                fontWeight: 600,
                fontSize: '0.86rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                transition: 'all 0.15s ease'
              }}
            >
              <Building size={16} /> Pessoa Jurídica
            </button>
          </div>

          {/* Dados Principais */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px' }}>
            <div style={{ gridColumn: 'span 2' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#94A3B8', marginBottom: '4px' }}>
                {formData.tipo === 'Pessoa Jurídica' ? 'Razão Social *' : 'Nome Completo *'}
              </label>
              <input
                type="text"
                required
                placeholder={formData.tipo === 'Pessoa Jurídica' ? 'Razão Social da empresa...' : 'Nome do cliente...'}
                value={formData.nome}
                onChange={(e) => handleChange('nome', e.target.value)}
                className="search-input-dark"
                style={{ paddingLeft: '12px' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#94A3B8', marginBottom: '4px' }}>
                {formData.tipo === 'Pessoa Jurídica' ? 'CNPJ *' : 'CPF *'}
              </label>
              <input
                type="text"
                required
                placeholder={formData.tipo === 'Pessoa Jurídica' ? '00.000.000/0001-00' : '000.000.000-00'}
                value={formData.documento}
                onChange={(e) => handleChange('documento', maskCpfCnpj(e.target.value))}
                className="search-input-dark"
                style={{ paddingLeft: '12px' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#94A3B8', marginBottom: '4px' }}>
                RG / IE
              </label>
              <input
                type="text"
                placeholder="Número do RG ou Inscrição Estadual"
                value={formData.rg}
                onChange={(e) => handleChange('rg', e.target.value)}
                className="search-input-dark"
                style={{ paddingLeft: '12px' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#94A3B8', marginBottom: '4px' }}>
                Profissão / Ramo
              </label>
              <input
                type="text"
                placeholder="Ex: Advogado, Empresário..."
                value={formData.profissao}
                onChange={(e) => handleChange('profissao', e.target.value)}
                className="search-input-dark"
                style={{ paddingLeft: '12px' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#94A3B8', marginBottom: '4px' }}>
                Nacionalidade
              </label>
              <input
                type="text"
                placeholder="Brasileiro(a)"
                value={formData.nacionalidade}
                onChange={(e) => handleChange('nacionalidade', e.target.value)}
                className="search-input-dark"
                style={{ paddingLeft: '12px' }}
              />
            </div>
          </div>

          {/* Endereço com Busca via CEP */}
          <div style={{ backgroundColor: '#0B101D', border: '1px solid #1B263B', borderRadius: '10px', padding: '16px' }}>
            <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#FFFFFF', marginBottom: '12px' }}>
              Endereço do Cliente
            </h4>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#94A3B8', marginBottom: '4px' }}>
                  CEP
                </label>
                <div style={{ display: 'flex', gap: '6px' }}>
                  <input
                    type="text"
                    placeholder="00000-000"
                    value={formData.cep}
                    onChange={(e) => {
                      const val = maskCep(e.target.value);
                      handleChange('cep', val);
                      if (val.replace(/\D/g, '').length === 8) {
                        handleCepSearch(val);
                      }
                    }}
                    onBlur={() => handleCepSearch()}
                    className="search-input-dark"
                    style={{ paddingLeft: '12px' }}
                  />
                  <button
                    type="button"
                    onClick={() => handleCepSearch()}
                    className="btn-secondary"
                    style={{ padding: '0 12px', height: '36px' }}
                    title="Buscar CEP na ViaCEP"
                  >
                    {loadingCep ? <Loader2 size={15} className="spin" /> : <Search size={15} />}
                  </button>
                </div>
                {cepError && <span style={{ fontSize: '0.72rem', color: '#EF4444', marginTop: '2px', display: 'block' }}>{cepError}</span>}
              </div>

              <div style={{ gridColumn: 'span 2' }}>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#94A3B8', marginBottom: '4px' }}>
                  Logradouro (Rua/Av.)
                </label>
                <input
                  type="text"
                  placeholder="Rua, Avenida..."
                  value={formData.logradouro}
                  onChange={(e) => handleChange('logradouro', e.target.value)}
                  className="search-input-dark"
                  style={{ paddingLeft: '12px' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#94A3B8', marginBottom: '4px' }}>
                  Número
                </label>
                <input
                  type="text"
                  placeholder="Nº"
                  value={formData.numero}
                  onChange={(e) => handleChange('numero', e.target.value)}
                  className="search-input-dark"
                  style={{ paddingLeft: '12px' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#94A3B8', marginBottom: '4px' }}>
                  Complemento
                </label>
                <input
                  type="text"
                  placeholder="Apto, Sala..."
                  value={formData.complemento}
                  onChange={(e) => handleChange('complemento', e.target.value)}
                  className="search-input-dark"
                  style={{ paddingLeft: '12px' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#94A3B8', marginBottom: '4px' }}>
                  Bairro
                </label>
                <input
                  type="text"
                  placeholder="Bairro"
                  value={formData.bairro}
                  onChange={(e) => handleChange('bairro', e.target.value)}
                  className="search-input-dark"
                  style={{ paddingLeft: '12px' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#94A3B8', marginBottom: '4px' }}>
                  Cidade / UF
                </label>
                <div style={{ display: 'flex', gap: '6px' }}>
                  <input
                    type="text"
                    placeholder="Cidade"
                    value={formData.cidade}
                    onChange={(e) => handleChange('cidade', e.target.value)}
                    className="search-input-dark"
                    style={{ flex: 1, paddingLeft: '12px' }}
                  />
                  <input
                    type="text"
                    placeholder="UF"
                    maxLength={2}
                    value={formData.uf}
                    onChange={(e) => handleChange('uf', e.target.value.toUpperCase())}
                    className="search-input-dark"
                    style={{ width: '50px', textAlign: 'center', paddingLeft: '0' }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Se Pessoa Jurídica: Campos do Responsável da Empresa */}
          {formData.tipo === 'Pessoa Jurídica' && (
            <div style={{ backgroundColor: '#0B101D', border: '1px solid #1B263B', borderRadius: '10px', padding: '16px' }}>
              <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#FFFFFF', marginBottom: '12px' }}>
                Dados do Responsável da Empresa (PJ)
              </h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#94A3B8', marginBottom: '4px' }}>
                    Nome do Responsável
                  </label>
                  <input
                    type="text"
                    placeholder="Nome completo do representante..."
                    value={formData.respEmpresaNome}
                    onChange={(e) => handleChange('respEmpresaNome', e.target.value)}
                    className="search-input-dark"
                    style={{ paddingLeft: '12px' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#94A3B8', marginBottom: '4px' }}>
                    CPF do Responsável
                  </label>
                  <input
                    type="text"
                    placeholder="000.000.000-00"
                    value={formData.respEmpresaCpf}
                    onChange={(e) => handleChange('respEmpresaCpf', maskCpfCnpj(e.target.value))}
                    className="search-input-dark"
                    style={{ paddingLeft: '12px' }}
                  />
                </div>
                <div style={{ gridColumn: 'span 2' }}>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#94A3B8', marginBottom: '4px' }}>
                    Endereço do Responsável
                  </label>
                  <input
                    type="text"
                    placeholder="Endereço do representante..."
                    value={formData.respEmpresaEndereco}
                    onChange={(e) => handleChange('respEmpresaEndereco', e.target.value)}
                    className="search-input-dark"
                    style={{ paddingLeft: '12px' }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Capacidade Civil / Incapacidade (Apenas para Pessoa Física) */}
          {formData.tipo === 'Pessoa Física' && (
            <div style={{ backgroundColor: '#0B101D', border: '1px solid #1B263B', borderRadius: '10px', padding: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#FFFFFF' }}>
                  Capacidade Civil / Incapacidade
                </h4>
                <span className="badge-saas badge-primary">
                  {formData.incapacidade}
                </span>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#94A3B8', marginBottom: '4px' }}>
                  Situação do Cliente
                </label>
                <select
                  value={formData.incapacidade}
                  onChange={(e) => handleChange('incapacidade', e.target.value)}
                  className="search-input-dark"
                  style={{ width: '100%', paddingLeft: '12px', cursor: 'pointer' }}
                >
                  <option value="Capaz">Capaz (Padrão)</option>
                  <option value="Menor Impúbere">Menor Impúbere / Relativamente Incapaz</option>
                  <option value="Curatelado">Curatelado (Interditado)</option>
                  <option value="Tutelado">Tutelado</option>
                </select>
              </div>

              {/* Se Incapaz: Libera Seção do Responsável Legal */}
              {formData.incapacidade !== 'Capaz' && (
                <div style={{ marginTop: '16px', borderTop: '1px dashed #1B263B', paddingTop: '14px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <h5 style={{ fontSize: '0.85rem', fontWeight: 700, color: '#F59E0B', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <ShieldAlert size={15} /> Dados do Responsável Legal ({formData.incapacidade})
                    </h5>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', color: '#94A3B8', cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={formData.copiarEnderecoCliente}
                        onChange={handleCopiarEndereco}
                      />
                      Copiar endereço do cliente
                    </label>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
                    <div style={{ gridColumn: 'span 2' }}>
                      <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#94A3B8', marginBottom: '4px' }}>
                        Nome Completo do Responsável *
                      </label>
                      <input
                        type="text"
                        required={formData.incapacidade !== 'Capaz'}
                        placeholder="Nome do representante legal..."
                        value={formData.respLegalNome}
                        onChange={(e) => handleChange('respLegalNome', e.target.value)}
                        className="search-input-dark"
                        style={{ paddingLeft: '12px' }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#94A3B8', marginBottom: '4px' }}>
                        CPF do Responsável *
                      </label>
                      <input
                        type="text"
                        required={formData.incapacidade !== 'Capaz'}
                        placeholder="000.000.000-00"
                        value={formData.respLegalCpf}
                        onChange={(e) => handleChange('respLegalCpf', maskCpfCnpj(e.target.value))}
                        className="search-input-dark"
                        style={{ paddingLeft: '12px' }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#94A3B8', marginBottom: '4px' }}>
                        RG do Responsável
                      </label>
                      <input
                        type="text"
                        placeholder="RG do representante"
                        value={formData.respLegalRg}
                        onChange={(e) => handleChange('respLegalRg', e.target.value)}
                        className="search-input-dark"
                        style={{ paddingLeft: '12px' }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#94A3B8', marginBottom: '4px' }}>
                        Profissão do Responsável
                      </label>
                      <input
                        type="text"
                        placeholder="Profissão"
                        value={formData.respLegalProfissao}
                        onChange={(e) => handleChange('respLegalProfissao', e.target.value)}
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
                        value={formData.respLegalNacionalidade}
                        onChange={(e) => handleChange('respLegalNacionalidade', e.target.value)}
                        className="search-input-dark"
                        style={{ paddingLeft: '12px' }}
                      />
                    </div>

                    <div style={{ gridColumn: 'span 2' }}>
                      <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#94A3B8', marginBottom: '4px' }}>
                        Endereço do Responsável Legal
                      </label>
                      <input
                        type="text"
                        placeholder="Endereço residencial do responsável..."
                        value={formData.respLegalEndereco}
                        onChange={(e) => handleChange('respLegalEndereco', e.target.value)}
                        className="search-input-dark"
                        style={{ paddingLeft: '12px' }}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Contato & Informações Finais */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#94A3B8', marginBottom: '4px' }}>
                Telefone / Celular *
              </label>
              <input
                type="text"
                required
                placeholder="(00) 00000-0000"
                value={formData.fone}
                onChange={(e) => handleChange('fone', maskPhone(e.target.value))}
                className="search-input-dark"
                style={{ paddingLeft: '12px' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#94A3B8', marginBottom: '4px' }}>
                E-mail *
              </label>
              <input
                type="email"
                required
                placeholder="cliente@email.com"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                className="search-input-dark"
                style={{ paddingLeft: '12px' }}
              />
            </div>
          </div>

          {/* Opção Prioritário & Anotações */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.85rem', color: '#FFFFFF', fontWeight: 600 }}>
              <input
                type="checkbox"
                checked={formData.prioritario}
                onChange={(e) => handleChange('prioritario', e.target.checked)}
                style={{ width: '16px', height: '16px', accentColor: '#F59E0B' }}
              />
              Marcar este cliente como Prioritário
            </label>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#94A3B8', marginBottom: '4px' }}>
                Anotações Gerais
              </label>
              <textarea
                rows={3}
                placeholder="Observações importantes, detalhes do atendimento..."
                value={formData.anotacoes}
                onChange={(e) => handleChange('anotacoes', e.target.value)}
                className="search-input-dark"
                style={{ width: '100%', padding: '10px 12px', resize: 'vertical' }}
              />
            </div>
          </div>

          {/* Modal Actions */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', borderTop: '1px solid #1B263B', paddingTop: '16px', marginTop: '8px' }}>
            <button type="button" onClick={onClose} className="btn-secondary">
              Cancelar
            </button>
            <button type="submit" className="btn-primary" style={{ minWidth: '140px' }}>
              {initialData ? 'Salvar Alterações' : 'Cadastrar Cliente'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
