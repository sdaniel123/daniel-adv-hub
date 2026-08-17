'use client';

import React, { useState, useEffect } from 'react';
import { X, Calendar, Clock, MapPin, Link as LinkIcon, Briefcase, User, Gavel } from 'lucide-react';
import { initialProcessosData } from '@/lib/processosStore';

export default function FormAudienciaModal({
  isOpen,
  onClose,
  onSave,
  initialData = null
}) {
  const [dataHora, setDataHora] = useState('');
  const [processoId, setProcessoId] = useState('');
  const [tipo, setTipo] = useState('Presencial'); // 'Presencial' | 'Online'
  const [local, setLocal] = useState('');
  const [status, setStatus] = useState('Agendada');
  const [anotacoes, setAnotacoes] = useState('');

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setDataHora(initialData.dataHora || '');
        setProcessoId(initialData.processoId || '');
        setTipo(initialData.tipo || 'Presencial');
        setLocal(initialData.local || '');
        setStatus(initialData.status || 'Agendada');
        setAnotacoes(initialData.anotacoes || '');
      } else {
        // Data e Hora padrão (amanhã às 10:00)
        const amanha = new Date();
        amanha.setDate(amanha.getDate() + 1);
        amanha.setHours(10, 0, 0, 0);
        
        // Formato para input datetime-local: YYYY-MM-DDTHH:mm
        const yyyy = amanha.getFullYear();
        const mm = String(amanha.getMonth() + 1).padStart(2, '0');
        const dd = String(amanha.getDate()).padStart(2, '0');
        const hh = String(amanha.getHours()).padStart(2, '0');
        const min = String(amanha.getMinutes()).padStart(2, '0');

        setDataHora(`${yyyy}-${mm}-${dd}T${hh}:${min}`);
        setProcessoId('');
        setTipo('Presencial');
        setLocal('');
        setStatus('Agendada');
        setAnotacoes('');
      }
    }
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!dataHora) return;

    const proc = initialProcessosData.find(p => p.id === processoId);

    const payload = {
      id: initialData?.id || `aud-${Date.now()}`,
      dataHora,
      processoId: processoId || '',
      processo: proc ? proc.cnj : (initialData?.processo || 'Processo não vinculado'),
      cliente: proc && proc.clientes ? proc.clientes[0]?.nome : (initialData?.cliente || 'Cliente não informado'),
      tipo,
      local,
      status,
      anotacoes
    };

    onSave(payload);
  };

  return (
    <div className="modal-backdrop-blurred" onClick={onClose}>
      <div
        className="card-saas"
        onClick={(e) => e.stopPropagation()}
        style={{ width: '90%', maxWidth: '520px', padding: '24px', margin: 'auto' }}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid #1B263B', paddingBottom: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Gavel size={22} color="#3B82F6" />
            <div>
              <span style={{ fontSize: '0.72rem', color: '#3B82F6', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                DANIEL ADV HUB • AGENDA
              </span>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#FFFFFF', margin: 0 }}>
                {initialData ? 'Editar Audiência' : 'Cadastrar Nova Audiência'}
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

          {/* Campo 1: Data e Hora */}
          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#CBD5E1', marginBottom: '6px' }}>
              Data e Hora da Audiência <span style={{ color: '#EF4444' }}>*</span>
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

          {/* Campo 2: Processo Vinculado */}
          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#CBD5E1', marginBottom: '6px' }}>
              Processo Vinculado
            </label>
            <select
              value={processoId}
              onChange={(e) => setProcessoId(e.target.value)}
              className="search-input-dark"
              style={{ width: '100%', paddingLeft: '10px', cursor: 'pointer' }}
            >
              <option value="">Selecione o processo (CNJ)...</option>
              {initialProcessosData.map((p) => (
                <option key={p.id} value={p.id}>
                  CNJ: {p.cnj} ({p.clientes?.[0]?.nome || 'Sem cliente'})
                </option>
              ))}
            </select>
          </div>

          {/* Campo 3: Tipo (Presencial ou Online) */}
          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#CBD5E1', marginBottom: '6px' }}>
              Tipo de Audiência <span style={{ color: '#EF4444' }}>*</span>
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <button
                type="button"
                onClick={() => setTipo('Presencial')}
                style={{
                  padding: '10px',
                  borderRadius: '8px',
                  fontSize: '0.86rem',
                  fontWeight: tipo === 'Presencial' ? 700 : 500,
                  backgroundColor: tipo === 'Presencial' ? '#3B82F6' : '#0B101D',
                  color: tipo === 'Presencial' ? '#FFFFFF' : '#94A3B8',
                  border: tipo === 'Presencial' ? '1px solid #3B82F6' : '1px solid #1B263B',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  transition: 'all 0.15s ease'
                }}
              >
                <MapPin size={16} /> Presencial
              </button>

              <button
                type="button"
                onClick={() => setTipo('Online')}
                style={{
                  padding: '10px',
                  borderRadius: '8px',
                  fontSize: '0.86rem',
                  fontWeight: tipo === 'Online' ? 700 : 500,
                  backgroundColor: tipo === 'Online' ? '#A855F7' : '#0B101D',
                  color: tipo === 'Online' ? '#FFFFFF' : '#94A3B8',
                  border: tipo === 'Online' ? '1px solid #A855F7' : '1px solid #1B263B',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justify: 'center',
                  gap: '8px',
                  transition: 'all 0.15s ease'
                }}
              >
                <LinkIcon size={16} /> Online / Vídeo
              </button>
            </div>
          </div>

          {/* Campo 4: Local (Endereço físico ou Link do Teams/Zoom) */}
          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#CBD5E1', marginBottom: '6px' }}>
              {tipo === 'Online' ? 'Link da Sala Virtual (Teams, Zoom, Google Meet)' : 'Local / Vara da Audiência'}
            </label>
            <input
              type="text"
              placeholder={tipo === 'Online' ? 'https://teams.microsoft.com/...' : 'Ex: 2ª Vara Cível - Fórum Central de SP'}
              value={local}
              onChange={(e) => setLocal(e.target.value)}
              className="search-input-dark"
              style={{ width: '100%', paddingLeft: '12px' }}
            />
          </div>

          {/* Campo 5: Status */}
          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#CBD5E1', marginBottom: '6px' }}>
              Status da Audiência
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="search-input-dark"
              style={{ width: '100%', paddingLeft: '10px', cursor: 'pointer' }}
            >
              <option value="Agendada">Agendada</option>
              <option value="Realizada">Realizada</option>
              <option value="Não realizada">Não realizada</option>
              <option value="Reagendada">Reagendada</option>
            </select>
          </div>

          {/* Campo 6: Anotações */}
          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#CBD5E1', marginBottom: '6px' }}>
              Anotações / Instruções Gerais
            </label>
            <textarea
              rows={3}
              placeholder="Instruções para a audiência, teste de equipamentos, pauta..."
              value={anotacoes}
              onChange={(e) => setAnotacoes(e.target.value)}
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
              {initialData ? 'Salvar Alterações' : 'Cadastrar Audiência'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
