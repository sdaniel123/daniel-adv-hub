'use client';

import React, { useState, useEffect } from 'react';
import { X, Plus, Edit3, Trash2, Check, Tag } from 'lucide-react';
import { getTiposTarefasSalvos, salvarTiposTarefas } from '@/lib/tarefasStore';

export default function GestaoTiposModal({
  isOpen,
  onClose,
  onTiposUpdated
}) {
  const [tipos, setTipos] = useState([]);
  const [novoNome, setNovoNome] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editingNome, setEditingNome] = useState('');

  useEffect(() => {
    if (isOpen) {
      const saved = getTiposTarefasSalvos();
      setTipos(saved);
      setNovoNome('');
      setEditingId(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleAddTipo = (e) => {
    e.preventDefault();
    if (!novoNome.trim()) return;

    const newTipo = {
      id: `tipo-${Date.now()}`,
      nome: novoNome.trim()
    };

    const updatedList = [newTipo, ...tipos];
    setTipos(updatedList);
    salvarTiposTarefas(updatedList);
    setNovoNome('');
    if (onTiposUpdated) onTiposUpdated(updatedList);
  };

  const handleStartEdit = (tipo) => {
    setEditingId(tipo.id);
    setEditingNome(tipo.nome);
  };

  const handleSaveEdit = (id) => {
    if (!editingNome.trim()) return;

    const updatedList = tipos.map(t =>
      t.id === id ? { ...t, nome: editingNome.trim() } : t
    );

    setTipos(updatedList);
    salvarTiposTarefas(updatedList);
    setEditingId(null);
    if (onTiposUpdated) onTiposUpdated(updatedList);
  };

  const handleDeleteTipo = (id) => {
    const updatedList = tipos.filter(t => t.id !== id);
    setTipos(updatedList);
    salvarTiposTarefas(updatedList);
    if (onTiposUpdated) onTiposUpdated(updatedList);
  };

  return (
    <div className="modal-backdrop-blurred" onClick={onClose}>
      <div
        className="card-saas"
        onClick={(e) => e.stopPropagation()}
        style={{ width: '90%', maxWidth: '500px', padding: '24px', margin: 'auto' }}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', borderBottom: '1px solid #1B263B', paddingBottom: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Tag size={20} color="#3B82F6" />
            <div>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#FFFFFF', margin: 0 }}>
                Gestão de Tipos de Tarefas
              </h2>
              <span style={{ fontSize: '0.74rem', color: '#94A3B8' }}>
                Cadastre, edite e remova os tipos pré-definidos
              </span>
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

        {/* Form para cadastrar Novo Tipo */}
        <form onSubmit={handleAddTipo} style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
          <input
            type="text"
            required
            placeholder="Nome do novo tipo (ex: Elaborar Apelação)..."
            value={novoNome}
            onChange={(e) => setNovoNome(e.target.value)}
            className="search-input-dark"
            style={{ flex: 1, paddingLeft: '12px' }}
          />
          <button type="submit" className="btn-primary" style={{ fontSize: '0.84rem' }}>
            <Plus size={16} /> Adicionar
          </button>
        </form>

        {/* Lista de Tipos */}
        <div style={{ maxHeight: '300px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {tipos.length === 0 ? (
            <div style={{ textTransform: 'none', color: '#94A3B8', fontSize: '0.84rem', fontStyle: 'italic', textAlign: 'center', padding: '20px 0' }}>
              Nenhum tipo de tarefa cadastrado.
            </div>
          ) : (
            tipos.map((t) => (
              <div
                key={t.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justify: 'space-between',
                  backgroundColor: '#0E1526',
                  border: '1px solid #1B263B',
                  borderRadius: '8px',
                  padding: '10px 14px'
                }}
              >
                {editingId === t.id ? (
                  <div style={{ display: 'flex', gap: '8px', flex: 1, marginRight: '10px' }}>
                    <input
                      type="text"
                      value={editingNome}
                      onChange={(e) => setEditingNome(e.target.value)}
                      className="search-input-dark"
                      style={{ flex: 1, paddingLeft: '8px', fontSize: '0.84rem' }}
                      autoFocus
                    />
                    <button
                      type="button"
                      className="btn-primary"
                      onClick={() => handleSaveEdit(t.id)}
                      style={{ padding: '6px 10px' }}
                    >
                      <Check size={14} />
                    </button>
                  </div>
                ) : (
                  <span style={{ fontSize: '0.88rem', fontWeight: 600, color: '#FFFFFF' }}>
                    {t.nome}
                  </span>
                )}

                {editingId !== t.id && (
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      type="button"
                      onClick={() => handleStartEdit(t)}
                      style={{ color: '#3B82F6', backgroundColor: 'transparent', padding: '4px' }}
                      title="Editar Tipo"
                    >
                      <Edit3 size={15} />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteTipo(t.id)}
                      style={{ color: '#EF4444', backgroundColor: 'transparent', padding: '4px' }}
                      title="Apagar Tipo"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Rodapé */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px', borderTop: '1px solid #1B263B', paddingTop: '14px' }}>
          <button type="button" className="btn-secondary" onClick={onClose}>
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}
