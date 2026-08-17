'use client';

import React, { useState, useEffect } from 'react';
import { X, Calendar, Clock, AlertTriangle, CheckSquare, Edit3, Trash2, Save, User, Briefcase, FileText, CheckCircle2, Archive } from 'lucide-react';
import { calcularStatusPrazo, formatarDataExibicao } from '@/lib/tarefasStore';

export default function DetalhesTarefaModal({
  isOpen,
  onClose,
  task,
  onUpdateTask,
  onDeleteTask,
  onOpenEdit
}) {
  const [anotacoes, setAnotacoes] = useState('');
  const [salvandoNotas, setSalvandoNotas] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  useEffect(() => {
    if (task) {
      setAnotacoes(task.anotacoes || '');
      setShowConfirmDelete(false);
    }
  }, [task]);

  if (!isOpen || !task) return null;

  const infoPrazo = calcularStatusPrazo(task.prazo, task.status);

  const handleStatusChange = (novoStatus) => {
    const updated = {
      ...task,
      status: novoStatus
    };
    onUpdateTask(updated);
  };

  const handleSaveNotes = () => {
    setSalvandoNotas(true);
    const updated = {
      ...task,
      anotacoes
    };
    onUpdateTask(updated);
    setTimeout(() => setSalvandoNotas(false), 400);
  };

  const handleDelete = () => {
    onDeleteTask(task.id);
    setShowConfirmDelete(false);
    onClose();
  };

  return (
    <div className="modal-backdrop-blurred" onClick={onClose}>
      <div
        className="card-saas"
        onClick={(e) => e.stopPropagation()}
        style={{ width: '90%', maxWidth: '580px', padding: '24px', margin: 'auto' }}
      >
        {/* Top Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid #1B263B', paddingBottom: '16px', marginBottom: '18px' }}>
          <div>
            <span style={{ fontSize: '0.72rem', color: '#3B82F6', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              DANIEL ADV HUB • DETALHES DA TAREFA
            </span>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#FFFFFF', marginTop: '4px', lineHeight: 1.2 }}>
              {task.tipo}
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

        {/* Status e Selo de Prazo (Vence em X dias / Vencida há X dias) */}
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap', marginBottom: '20px' }}>
          <span className={`badge-saas ${infoPrazo.badgeClass}`} style={{ fontSize: '0.82rem', padding: '6px 12px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <Clock size={14} />
            {infoPrazo.texto}
          </span>

          {task.urgente && (
            <span className="badge-saas badge-danger" style={{ fontSize: '0.82rem', padding: '6px 12px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              <AlertTriangle size={14} /> Urgente
            </span>
          )}

          <span className="badge-saas badge-primary" style={{ fontSize: '0.82rem', padding: '6px 12px' }}>
            Vencimento: {formatarDataExibicao(task.prazo)}
          </span>
        </div>

        {/* Mudar Status (Pendente | Em andamento | Concluída | Arquivada) */}
        <div style={{ backgroundColor: '#0B101D', border: '1px solid #1B263B', borderRadius: '10px', padding: '14px', marginBottom: '20px' }}>
          <label style={{ display: 'block', fontSize: '0.76rem', color: '#94A3B8', fontWeight: 700, textTransform: 'uppercase', marginBottom: '8px' }}>
            Status da Tarefa
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))', gap: '8px' }}>
            {['Pendente', 'Em andamento', 'Concluída', 'Arquivada'].map((st) => (
              <button
                key={st}
                type="button"
                onClick={() => handleStatusChange(st)}
                style={{
                  padding: '8px 10px',
                  borderRadius: '6px',
                  fontSize: '0.8rem',
                  fontWeight: task.status === st ? 700 : 500,
                  backgroundColor: task.status === st ? '#3B82F6' : '#131D33',
                  color: task.status === st ? '#FFFFFF' : '#94A3B8',
                  border: task.status === st ? '1px solid #3B82F6' : '1px solid #1B263B',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* Informações da Tarefa (Processo e Cliente Vinculados) */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '20px', fontSize: '0.86rem' }}>
          <div style={{ backgroundColor: '#0E1526', border: '1px solid #1B263B', borderRadius: '8px', padding: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#94A3B8', fontSize: '0.76rem', fontWeight: 700, marginBottom: '4px' }}>
              <Briefcase size={14} color="#3B82F6" /> PROCESSO VINCULADO
            </div>
            <div style={{ color: '#FFFFFF', fontWeight: 600, fontFamily: 'monospace' }}>
              {task.processo || 'Nenhum processo vinculado'}
            </div>
          </div>

          <div style={{ backgroundColor: '#0E1526', border: '1px solid #1B263B', borderRadius: '8px', padding: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#94A3B8', fontSize: '0.76rem', fontWeight: 700, marginBottom: '4px' }}>
              <User size={14} color="#A855F7" /> CLIENTE VINCULADO
            </div>
            <div style={{ color: '#FFFFFF', fontWeight: 600 }}>
              {task.cliente || 'Nenhum cliente vinculado'}
            </div>
          </div>
        </div>

        {/* Seção de Anotações */}
        <div style={{ marginBottom: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <label style={{ fontSize: '0.82rem', fontWeight: 700, color: '#CBD5E1', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <FileText size={15} /> Anotações / Descrição da Tarefa
            </label>
            <button
              type="button"
              onClick={handleSaveNotes}
              className="btn-secondary"
              style={{ fontSize: '0.75rem', padding: '4px 10px' }}
            >
              <Save size={13} /> {salvandoNotas ? 'Salvo!' : 'Salvar Notas'}
            </button>
          </div>
          <textarea
            rows={4}
            value={anotacoes}
            onChange={(e) => setAnotacoes(e.target.value)}
            placeholder="Digite anotações ou observações sobre esta tarefa..."
            className="search-input-dark"
            style={{ width: '100%', padding: '10px', resize: 'vertical', fontSize: '0.86rem', lineHeight: 1.5 }}
          />
        </div>

        {/* Confirmação de Exclusão */}
        {showConfirmDelete ? (
          <div style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '8px', padding: '14px', marginBottom: '16px', textAlign: 'center' }}>
            <p style={{ color: '#EF4444', fontSize: '0.86rem', fontWeight: 700, marginBottom: '10px' }}>
              Tem certeza que deseja apagar esta tarefa?
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
              <button type="button" className="btn-secondary" onClick={() => setShowConfirmDelete(false)}>
                Cancelar
              </button>
              <button type="button" className="btn-primary" style={{ backgroundColor: '#EF4444', borderColor: '#EF4444' }} onClick={handleDelete}>
                Sim, Apagar
              </button>
            </div>
          </div>
        ) : (
          /* Botões Inferiores de Ação */
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #1B263B', paddingTop: '16px' }}>
            <button
              type="button"
              onClick={() => setShowConfirmDelete(true)}
              style={{ color: '#EF4444', backgroundColor: 'transparent', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.84rem', fontWeight: 600 }}
            >
              <Trash2 size={16} /> Apagar Tarefa
            </button>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                type="button"
                className="btn-secondary"
                onClick={() => {
                  onClose();
                  if (onOpenEdit) onOpenEdit(task);
                }}
              >
                <Edit3 size={15} /> Editar
              </button>
              <button type="button" className="btn-primary" onClick={onClose}>
                Concluído
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
