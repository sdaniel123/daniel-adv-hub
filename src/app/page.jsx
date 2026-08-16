'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Sparkles, AlertCircle, ChevronRight, Plus, X } from 'lucide-react';
import InteractiveChart from '@/components/dashboard/InteractiveChart';
import MonthCalendar from '@/components/dashboard/MonthCalendar';
import ToastNotification from '@/components/ui/ToastNotification';

const mockCompromissos = [
  { id: '1', title: 'Audiência de Conciliação - Proc. 1042345-12', status: 'Fatal', isUrgent: true },
  { id: '2', title: 'Protocolo de Contestação Trabalhista', status: 'Pendente', isUrgent: true },
  { id: '3', title: 'Reunião com cliente Tech Solutions', status: 'Agendado', isUrgent: false },
  { id: '4', title: 'Elaboração de Minuta de Contrato', status: 'Em andamento', isUrgent: false },
  { id: '5', title: 'Pagamento de Custas Processuais TJSP', status: 'Pendente', isUrgent: true },
  { id: '6', title: 'Réplica à Contestação - Proc. 0000845-90', status: 'Concluído', isUrgent: false },
  { id: '7', title: 'Conferência de Prazos Fatais da Semana', status: 'Concluído', isUrgent: false },
  { id: '8', title: 'Envio de Notificação Extrajudicial', status: 'Em andamento', isUrgent: false },
  { id: '9', title: 'Consulta Inicial - Novo Cliente Cível', status: 'Agendado', isUrgent: false },
  { id: '10', title: 'Revisão de Procuração e Documentos', status: 'Concluído', isUrgent: false },
  { id: '11', title: 'Recurso de Apelação - Proc. 5001234-88', status: 'Pendente', isUrgent: true },
  { id: '12', title: 'Perícia Técnica Trabalhista', status: 'Agendado', isUrgent: false },
];

export default function HomePage() {
  const [toastMessage, setToastMessage] = useState(null);
  const [activeModal, setActiveModal] = useState(null);
  const [modalInput, setModalInput] = useState('');
  const [timeString, setTimeString] = useState('');

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      const options = { day: 'numeric', month: 'long', year: 'numeric' };
      const dateFormatted = now.toLocaleDateString('pt-BR', options);
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      setTimeString(`${dateFormatted} | ${hours}:${minutes}h`);
    };
    updateDateTime();
    const interval = setInterval(updateDateTime, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleOpenModal = (modalType) => {
    setActiveModal(modalType);
    setModalInput('');
  };

  const handleSaveModal = (e) => {
    e.preventDefault();
    const labels = {
      cliente: 'Novo Cliente',
      processo: 'Novo Processo',
      prazo: 'Novo Prazo'
    };
    setToastMessage(`${labels[activeModal] || 'Registro'} adicionado com sucesso!`);
    setActiveModal(null);
  };

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', flexWrap: 'wrap', gap: '20px' }}>
        <div>
          <span style={{ fontSize: '0.85rem', fontWeight: 700, opacity: 0.75, textTransform: 'uppercase', letterSpacing: '1px' }}>
            Bem-vindo(a)
          </span>
          <h1 style={{ fontFamily: 'var(--font-raleway)', fontSize: '2.2rem', marginTop: '2px', fontWeight: 800 }}>
            Daniel G. Simões
          </h1>
          <p style={{ fontSize: '0.85rem', opacity: 0.7, marginTop: '4px' }}>
            {timeString || '16 de Agosto de 2026 | 13:48h'}
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={() => handleOpenModal('cliente')}
            style={{
              padding: '10px 20px',
              borderRadius: '24px',
              border: '1px solid var(--card-border)',
              backgroundColor: 'var(--card-bg)',
              color: 'var(--text-page)',
              fontWeight: 700,
              fontSize: '0.9rem',
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
              transition: 'transform 0.2s ease'
            }}
          >
            Novo cliente
          </button>

          <button
            type="button"
            onClick={() => handleOpenModal('processo')}
            style={{
              padding: '10px 20px',
              borderRadius: '24px',
              border: '1px solid var(--card-border)',
              backgroundColor: 'var(--card-bg)',
              color: 'var(--text-page)',
              fontWeight: 700,
              fontSize: '0.9rem',
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
              transition: 'transform 0.2s ease'
            }}
          >
            Novo Processo
          </button>

          <button
            type="button"
            onClick={() => handleOpenModal('prazo')}
            style={{
              padding: '10px 20px',
              borderRadius: '24px',
              border: '1px solid var(--card-border)',
              backgroundColor: 'var(--card-bg)',
              color: 'var(--text-page)',
              fontWeight: 700,
              fontSize: '0.9rem',
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
              transition: 'transform 0.2s ease'
            }}
          >
            Novo Prazo
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '28px', marginBottom: '32px' }}>
        
        <div className="card-glass-3d" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 style={{ fontFamily: 'var(--font-raleway)', fontSize: '1.35rem', fontWeight: 800 }}>
                Meu compromissos
              </h2>
              <Link
                href="/prazos"
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  border: '1px solid var(--card-border)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--text-page)'
                }}
                aria-label="Ver todos os compromissos"
              >
                <ChevronRight size={18} />
              </Link>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {mockCompromissos.map((item) => (
                <div
                  key={item.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px 14px',
                    borderRadius: '12px',
                    backgroundColor: 'rgba(0, 0, 0, 0.03)',
                    border: '1px solid var(--card-border)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, paddingRight: '12px' }}>
                    {item.isUrgent ? (
                      <AlertCircle size={18} color="#F93D4A" style={{ flexShrink: 0 }} />
                    ) : (
                      <Sparkles size={18} color="#3774FF" style={{ flexShrink: 0 }} />
                    )}
                    <span style={{ fontSize: '0.9rem', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {item.title}
                    </span>
                  </div>

                  <span className={item.isUrgent ? 'badge-pill-error' : 'badge-pill-success'} style={{ fontSize: '0.78rem' }}>
                    {item.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
            <span
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '50%',
                border: '1px solid var(--card-border)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.85rem',
                fontWeight: 800
              }}
            >
              +10
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <MonthCalendar />

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <Link
              href="/clientes"
              className="card-glass-3d"
              style={{
                display: 'flex',
                justify: 'space-between',
                alignItems: 'center',
                padding: '16px 24px',
                borderRadius: '30px',
                textDecoration: 'none',
                color: 'var(--text-page)'
              }}
            >
              <span style={{ fontSize: '1rem', fontWeight: 700 }}>Clientes</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <span style={{ fontSize: '1.4rem', fontWeight: 800, fontFamily: 'var(--font-montserrat)' }}>154</span>
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', border: '1px solid var(--card-border)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <ChevronRight size={16} />
                </div>
              </div>
            </Link>

            <Link
              href="/processos"
              className="card-glass-3d"
              style={{
                display: 'flex',
                justify: 'space-between',
                alignItems: 'center',
                padding: '16px 24px',
                borderRadius: '30px',
                textDecoration: 'none',
                color: 'var(--text-page)'
              }}
            >
              <span style={{ fontSize: '1rem', fontWeight: 700 }}>Processos</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <span style={{ fontSize: '1.4rem', fontWeight: 800, fontFamily: 'var(--font-montserrat)' }}>48</span>
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', border: '1px solid var(--card-border)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <ChevronRight size={16} />
                </div>
              </div>
            </Link>

            <Link
              href="/financeiro"
              className="card-glass-3d"
              style={{
                display: 'flex',
                justify: 'space-between',
                alignItems: 'center',
                padding: '16px 24px',
                borderRadius: '30px',
                textDecoration: 'none',
                color: 'var(--text-page)'
              }}
            >
              <span style={{ fontSize: '1rem', fontWeight: 700 }}>Ganhos</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <span style={{ fontSize: '1.3rem', fontWeight: 800, fontFamily: 'var(--font-montserrat)' }}>R$ 42.850,00</span>
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', border: '1px solid var(--card-border)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <ChevronRight size={16} />
                </div>
              </div>
            </Link>

            <Link
              href="/financeiro"
              className="card-glass-3d"
              style={{
                display: 'flex',
                justify: 'space-between',
                alignItems: 'center',
                padding: '16px 24px',
                borderRadius: '30px',
                textDecoration: 'none',
                color: 'var(--text-page)'
              }}
            >
              <span style={{ fontSize: '1rem', fontWeight: 700 }}>Gastos</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <span style={{ fontSize: '1.3rem', fontWeight: 800, fontFamily: 'var(--font-montserrat)' }}>R$ 6.420,00</span>
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', border: '1px solid var(--card-border)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <ChevronRight size={16} />
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>

      <div style={{ marginBottom: '32px' }}>
        <InteractiveChart />
      </div>

      {activeModal && (
        <div
          className="sidebar-overlay open"
          onClick={() => setActiveModal(null)}
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <div
            className="card-popup"
            onClick={(e) => e.stopPropagation()}
            style={{ width: '90%', maxWidth: '440px', margin: 0 }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontFamily: 'var(--font-raleway)', fontSize: '1.25rem', fontWeight: 800 }}>
                {activeModal === 'cliente' && 'Cadastrar Novo Cliente'}
                {activeModal === 'processo' && 'Cadastrar Novo Processo'}
                {activeModal === 'prazo' && 'Lançar Novo Prazo'}
              </h3>
              <button type="button" onClick={() => setActiveModal(null)} aria-label="Fechar modal">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveModal} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '6px' }}>
                  Nome / Título
                </label>
                <input
                  type="text"
                  required
                  placeholder="Informe o nome ou título..."
                  value={modalInput}
                  onChange={(e) => setModalInput(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    borderRadius: '12px',
                    border: '1px solid var(--card-border)',
                    backgroundColor: 'rgba(0,0,0,0.04)',
                    color: 'var(--text-page)',
                    outline: 'none'
                  }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '8px' }}>
                <button
                  type="button"
                  onClick={() => setActiveModal(null)}
                  style={{ padding: '10px 18px', borderRadius: '12px', border: '1px solid var(--card-border)', fontWeight: 600 }}
                >
                  Cancelar
                </button>
                <button type="submit" className="action-btn-3d">
                  Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ToastNotification message={toastMessage} onClose={() => setToastMessage(null)} />
    </div>
  );
}
