'use client';

import React, { useState, useEffect } from 'react';
import { X, User, Calendar, Phone, FileText, Clock } from 'lucide-react';

export default function FormAtendimentoModal({
  isOpen,
  onClose,
  onSave,
  initialData = null
}) {
  const [nomeAtendido, setNomeAtendido] = useState('');
  const [dataHora, setDataHora] = useState('');
  const [telefone, setTelefone] = useState('');
  const [descricao, setDescricao] = useState('');
  const [status, setStatus] = useState('Agendado');

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setNomeAtendido(initialData.nomeAtendido || '');
        setDataHora(initialData.dataHora || '');
        setTelefone(initialData.telefone || '');
        setDescricao(initialData.descricao || '');
        setStatus(initialData.status || 'Agendado');
      } else {
        setNomeAtendido('');
        // Padrão amanhã às 14:00
        const amanha = new Date();
        amanha.setDate(amanha.getDate() + 1);
        amanha.setHours(14, 0, 0, 0);

        const yyyy = amanha.getFullYear();
        const mm = String(amanha.getMonth() + 1).padStart(2, '0');
        const dd = String(amanha.getDate()).padStart(2, '0');
        const hh = String(amanha.getHours()).padStart(2, '0');
        const min = String(amanha.getMinutes()).padStart(2, '0');

        setDataHora(`${yyyy}-${mm}-${dd}T${hh}:${min}`);
        setTelefone('');
        setDescricao('');
        setStatus('Agendado');
      }
    }
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!nomeAtendido.trim() || !dataHora) return;

    const payload = {
      id: initialData?.id || `atend-${Date.now()}`,
      nomeAtendido: nomeAtendido.trim(),
      dataHora,
      telefone: telefone.trim(),
      descricao,
      status
    };

    onSave(payload);
  };

  return (
    <div className="modal-backdrop-blurred" onClick={onClose}>
      <div
        className="card-saas"
        onClick={(e) => e.stopPropagation()}
        style={{ width: '90%', maxWidth: '500px', padding: '24px', margin: 'auto' }}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid #1B263B', paddingBottom: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <User size={22} color="#10B981" />
            <div>
              <span style={{ fontSize: '0.72rem', color: '#10B981', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                DANIEL ADV HUB • AGENDA
              </span>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#FFFFFF', margin: 0 }}>
                {initialData ? 'Editar Atendimento' : 'Cadastrar Novo Atendimento'}
              </h2>
            </div>
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

          {/* Campo 1: Nome do Atendido */}
          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#CBD5E1', marginBottom: '6px' }}>
              Nome do Atendido <span style={{ color: '#EF4444' }}>*</span>
            </label>
            <input
              type="text"
              required
              placeholder="Ex: Carlos Eduardo Silva ou Nome do Cliente..."
              value={nomeAtendido}
              onChange={(e) => setNomeAtendido(e.target.value)}
              className="search-input-dark"
              style={{ width: '100%', paddingLeft: '12px' }}
            />
          </div>

          {/* Campo 2: Data e Hora */}
          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#CBD5E1', marginBottom: '6px' }}>
              Data e Hora do Atendimento <span style={{ color: '#EF4444' }}>*</span>
            </label>
            <input
              type="datetime-local"
              required
              value={dataHora}
              onChange={(e) => setDataHora(e.target.value)}
              className="search-input-dark"
              style={{ width: '100%', paddingLeft: '12px' }}
            />
          </div>

          {/* Campo 3: Telefone */}
          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#CBD5E1', marginBottom: '6px' }}>
              Telefone / Celular de Contato
            </label>
            <input
              type="text"
              placeholder="(11) 99999-9999"
              value={telefone}
              onChange={(e) => setTelefone(e.target.value)}
              className="search-input-dark"
              style={{ width: '100%', paddingLeft: '12px' }}
            />
          </div>

          {/* Campo 4: Status */}
          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#CBD5E1', marginBottom: '6px' }}>
              Status do Atendimento
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="search-input-dark"
              style={{ width: '100%', paddingLeft: '10px', cursor: 'pointer' }}
            >
              <option value="Agendado">Agendado</option>
              <option value="Realizado">Realizado</option>
              <option value="Não realizado">Não realizado</option>
              <option value="Reagendado">Reagendado</option>
            </select>
          </div>

          {/* Campo 5: Descrição */}
          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#CBD5E1', marginBottom: '6px' }}>
              Descrição / Anotações do Atendimento
            </label>
            <textarea
              rows={3}
              placeholder="Descreva o motivo do atendimento, assunto ou observações prévias..."
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              className="search-input-dark"
              style={{ width: '100%', padding: '10px', resize: 'vertical', fontSize: '0.85rem' }}
            />
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
            <button type="button" onClick={onClose} className="btn-secondary">
              Cancelar
            </button>
            <button type="submit" className="btn-primary">
              {initialData ? 'Salvar Alterações' : 'Cadastrar Atendimento'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
