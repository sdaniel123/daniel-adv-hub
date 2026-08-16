'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { FileText, Clock, Users, DollarSign, TrendingUp, AlertCircle, Plus, ChevronRight, CheckCircle2, Calendar, Folder, UserPlus, FilePlus, CalendarPlus, X } from 'lucide-react';
import ToastNotification from '@/components/ui/ToastNotification';

export default function HomePage() {
  const [toastMessage, setToastMessage] = useState(null);
  const [activeModal, setActiveModal] = useState(null);
  const [modalInput, setModalInput] = useState('');
  const [timeString, setTimeString] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const options = { day: 'numeric', month: 'long', year: 'numeric' };
      const dateFormatted = now.toLocaleDateString('pt-BR', options);
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      setTimeString(`${dateFormatted} • ${hours}:${minutes}h`);
    };
    updateTime();
    const interval = setInterval(updateTime, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleOpenModal = (type) => {
    setActiveModal(type);
    setModalInput('');
  };

  const handleSaveModal = (e) => {
    e.preventDefault();
    const labels = {
      cliente: 'Novo Cliente',
      processo: 'Novo Processo',
      prazo: 'Novo Prazo'
    };
    setToastMessage(`${labels[activeModal] || 'Registro'} cadastrado com sucesso!`);
    setActiveModal(null);
  };

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', flexWrap: 'wrap', gap: '20px' }}>
        <div>
          <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '1px' }}>
            Painel Executivo
          </span>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2.2rem', marginTop: '2px', fontWeight: 800 }}>
            Dr. Daniel G. Simões
          </h1>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            {timeString || '16 de Agosto de 2026 • 15:25h'}
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <button type="button" className="btn-secondary" onClick={() => handleOpenModal('cliente')}>
            <UserPlus size={16} />
            <span>Novo Cliente</span>
          </button>

          <button type="button" className="btn-secondary" onClick={() => handleOpenModal('processo')}>
            <FilePlus size={16} />
            <span>Novo Processo</span>
          </button>

          <button type="button" className="btn-primary" onClick={() => handleOpenModal('prazo')}>
            <CalendarPlus size={16} />
            <span>Novo Prazo</span>
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px', marginBottom: '32px' }}>
        <div className="card-saas">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <span style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-muted)' }}>Processos Ativos</span>
            <div style={{ padding: '8px', borderRadius: '10px', backgroundColor: 'var(--primary-light)' }}>
              <FileText size={20} color="var(--primary)" />
            </div>
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, fontFamily: 'var(--font-display)', marginBottom: '8px' }}>
            48
          </div>
          <span className="badge-saas badge-success">
            <TrendingUp size={12} /> +12% este mês
          </span>
        </div>

        <div className="card-saas">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <span style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-muted)' }}>Prazos da Semana</span>
            <div style={{ padding: '8px', borderRadius: '10px', backgroundColor: 'var(--danger-bg)' }}>
              <Clock size={20} color="var(--danger)" />
            </div>
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, fontFamily: 'var(--font-display)', marginBottom: '8px' }}>
            12
          </div>
          <span className="badge-saas badge-danger">
            <AlertCircle size={12} /> 3 urgentes hoje
          </span>
        </div>

        <div className="card-saas">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <span style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-muted)' }}>Clientes Cadastrados</span>
            <div style={{ padding: '8px', borderRadius: '10px', backgroundColor: 'var(--primary-light)' }}>
              <Users size={20} color="var(--primary)" />
            </div>
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, fontFamily: 'var(--font-display)', marginBottom: '8px' }}>
            154
          </div>
          <span className="badge-saas badge-success">
            <CheckCircle2 size={12} /> Base ativa
          </span>
        </div>

        <div className="card-saas">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <span style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-muted)' }}>Honorários (Mês)</span>
            <div style={{ padding: '8px', borderRadius: '10px', backgroundColor: 'var(--primary-light)' }}>
              <DollarSign size={20} color="var(--primary)" />
            </div>
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, fontFamily: 'var(--font-display)', marginBottom: '8px' }}>
            R$ 42.850
          </div>
          <span className="badge-saas badge-success">
            <TrendingUp size={12} /> +8.4% meta
          </span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '28px' }}>
        <div className="card-saas" style={{ gridColumn: 'span 2' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <div>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 700 }}>
                Compromissos e Prazos Prioritários
              </h2>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                Pendências com atendimento necessário
              </p>
            </div>
            <Link href="/prazos" className="btn-secondary" style={{ padding: '6px 14px', fontSize: '0.82rem' }}>
              <span>Ver todos</span>
              <ChevronRight size={14} />
            </Link>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', borderRadius: '12px', backgroundColor: 'var(--bg-main)', border: '1px solid var(--border-light)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#F43F5E' }} />
                <div>
                  <h4 style={{ fontSize: '0.92rem', fontWeight: 700 }}>Protocolo de Contestação Cível</h4>
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Proc. nº 1042345-12.2026 • 4ª Vara Cível TJSP</p>
                </div>
              </div>
              <span className="badge-saas badge-danger">Hoje às 23:59</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', borderRadius: '12px', backgroundColor: 'var(--bg-main)', border: '1px solid var(--border-light)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#4F46E5' }} />
                <div>
                  <h4 style={{ fontSize: '0.92rem', fontWeight: 700 }}>Audiência de Conciliação Trabalhista</h4>
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Proc. nº 0000845-90.2026 • TRT-2 Trabalhista</p>
                </div>
              </div>
              <span className="badge-saas badge-primary">Amanhã às 14:00</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', borderRadius: '12px', backgroundColor: 'var(--bg-main)', border: '1px solid var(--border-light)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#10B981' }} />
                <div>
                  <h4 style={{ fontSize: '0.92rem', fontWeight: 700 }}>Reunião de Alinhamento com Cliente</h4>
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Tech Solutions Ltda • Atendimento Presencial</p>
                </div>
              </div>
              <span className="badge-saas badge-success">18 de Agosto</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', borderRadius: '12px', backgroundColor: 'var(--bg-main)', border: '1px solid var(--border-light)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#F59E0B' }} />
                <div>
                  <h4 style={{ fontSize: '0.92rem', fontWeight: 700 }}>Réplica em Ação Tributária</h4>
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Proc. nº 5001234-88.2026 • TRF-3 Federal</p>
                </div>
              </div>
              <span className="badge-saas badge-warning">Em 5 dias</span>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="card-saas">
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', fontWeight: 700, marginBottom: '16px' }}>
              Módulos Principais
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <Link href="/clientes" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', borderRadius: '10px', backgroundColor: 'var(--bg-main)', border: '1px solid var(--border-light)', textDecoration: 'none', color: 'var(--text-main)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Users size={18} color="var(--primary)" />
                  <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>Clientes</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '0.88rem', fontWeight: 800 }}>154</span>
                  <ChevronRight size={14} color="var(--text-muted)" />
                </div>
              </Link>

              <Link href="/processos" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', borderRadius: '10px', backgroundColor: 'var(--bg-main)', border: '1px solid var(--border-light)', textDecoration: 'none', color: 'var(--text-main)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <FileText size={18} color="var(--primary)" />
                  <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>Processos</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '0.88rem', fontWeight: 800 }}>48</span>
                  <ChevronRight size={14} color="var(--text-muted)" />
                </div>
              </Link>

              <Link href="/agenda" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', borderRadius: '10px', backgroundColor: 'var(--bg-main)', border: '1px solid var(--border-light)', textDecoration: 'none', color: 'var(--text-main)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Calendar size={18} color="var(--primary)" />
                  <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>Agenda</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '0.88rem', fontWeight: 800 }}>3 hoje</span>
                  <ChevronRight size={14} color="var(--text-muted)" />
                </div>
              </Link>

              <Link href="/documentos" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', borderRadius: '10px', backgroundColor: 'var(--bg-main)', border: '1px solid var(--border-light)', textDecoration: 'none', color: 'var(--text-main)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Folder size={18} color="var(--primary)" />
                  <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>Documentos</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '0.88rem', fontWeight: 800 }}>69 modelos</span>
                  <ChevronRight size={14} color="var(--text-muted)" />
                </div>
              </Link>

              <Link href="/financeiro" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', borderRadius: '10px', backgroundColor: 'var(--bg-main)', border: '1px solid var(--border-light)', textDecoration: 'none', color: 'var(--text-main)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <DollarSign size={18} color="var(--primary)" />
                  <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>Financeiro</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '0.88rem', fontWeight: 800, color: 'var(--success)' }}>R$ 42.850</span>
                  <ChevronRight size={14} color="var(--text-muted)" />
                </div>
              </Link>
            </div>
          </div>
        </div>
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
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', fontWeight: 700 }}>
                {activeModal === 'cliente' && 'Cadastrar Novo Cliente'}
                {activeModal === 'processo' && 'Cadastrar Novo Processo'}
                {activeModal === 'prazo' && 'Lançar Novo Prazo'}
              </h3>
              <button type="button" onClick={() => setActiveModal(null)} aria-label="Fechar modal">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveModal} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>
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
                    padding: '10px 14px',
                    borderRadius: '8px',
                    border: '1px solid var(--border-light)',
                    backgroundColor: 'var(--bg-main)',
                    color: 'var(--text-main)',
                    outline: 'none'
                  }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '8px' }}>
                <button type="button" onClick={() => setActiveModal(null)} className="btn-secondary">
                  Cancelar
                </button>
                <button type="submit" className="btn-primary">
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
