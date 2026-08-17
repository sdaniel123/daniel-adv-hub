'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Users, 
  Briefcase, 
  DollarSign, 
  Calendar, 
  Clock, 
  Gavel, 
  UserCheck, 
  ChevronRight, 
  CheckSquare, 
  Plus, 
  UserPlus, 
  FilePlus, 
  CalendarPlus,
  X
} from 'lucide-react';
import ToastNotification from '@/components/ui/ToastNotification';
import { fetchClientes } from '@/lib/clientesStore';
import { fetchProcessos } from '@/lib/processosStore';
import { fetchFinanceiroLancamentos } from '@/lib/financeiroStore';

export default function HomePage() {
  const [toastMessage, setToastMessage] = useState(null);
  const [activeModal, setActiveModal] = useState(null);
  const [modalInput, setModalInput] = useState('');
  const [formattedDate, setFormattedDate] = useState('');

  // Dynamic Dashboard Stats
  const [totalClientes, setTotalClientes] = useState(0);
  const [totalProcessos, setTotalProcessos] = useState(0);
  const [totalCaixa, setTotalCaixa] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const now = new Date();
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = now.getFullYear();
    setFormattedDate(`${day}/${month}/${year}`);

    async function loadDashboardMetrics() {
      setLoading(true);
      const [cliData, procData, finData] = await Promise.all([
        fetchClientes(),
        fetchProcessos(),
        fetchFinanceiroLancamentos()
      ]);
      setTotalClientes(cliData.length);
      setTotalProcessos(procData.length);

      const receitas = finData
        .filter((item) => item.tipo === 'Receita')
        .reduce((sum, item) => sum + (item.valor || 0), 0);
      setTotalCaixa(receitas);

      setLoading(false);
    }

    loadDashboardMetrics();
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
      {/* Header section */}
      <div style={{ marginBottom: '28px' }}>
        <span className="page-header-subtitle">DANIEL ADV HUB</span>
        <h1 className="page-header-title">Painel de Controle</h1>
      </div>

      {/* Top 3 Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', marginBottom: '24px' }}>
        {/* Card 1: Total de Clientes */}
        <div className="card-saas">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
            <div>
              <span style={{ fontSize: '0.85rem', color: '#94A3B8', fontWeight: 500 }}>Total de Clientes</span>
              <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#FFFFFF', marginTop: '6px', fontFamily: 'var(--font-sans)' }}>
                {loading ? '...' : totalClientes}
              </div>
              <p style={{ fontSize: '0.78rem', color: '#64748B', marginTop: '4px' }}>Clientes cadastrados no banco</p>
            </div>
            <div style={{ padding: '10px', borderRadius: '10px', backgroundColor: '#131D33', color: '#94A3B8' }}>
              <Users size={22} />
            </div>
          </div>
        </div>

        {/* Card 2: Total de Processos */}
        <div className="card-saas">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
            <div>
              <span style={{ fontSize: '0.85rem', color: '#94A3B8', fontWeight: 500 }}>Total de Processos</span>
              <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#FFFFFF', marginTop: '6px', fontFamily: 'var(--font-sans)' }}>
                {loading ? '...' : totalProcessos}
              </div>
              <p style={{ fontSize: '0.78rem', color: '#64748B', marginTop: '4px' }}>Processos e ações ativas</p>
            </div>
            <div style={{ padding: '10px', borderRadius: '10px', backgroundColor: '#131D33', color: '#3B82F6' }}>
              <Briefcase size={22} />
            </div>
          </div>
        </div>

        {/* Card 3: Caixa do Mês */}
        <div className="card-saas">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
            <div>
              <span style={{ fontSize: '0.85rem', color: '#94A3B8', fontWeight: 500 }}>Caixa (Receitas)</span>
              <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#F59E0B', marginTop: '6px', fontFamily: 'var(--font-sans)' }}>
                {loading ? '...' : new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalCaixa)}
              </div>
              <p style={{ fontSize: '0.78rem', color: '#64748B', marginTop: '4px' }}>Entradas de honorários registradas</p>
            </div>
            <div style={{ padding: '10px', borderRadius: '10px', backgroundColor: '#131D33', color: '#F59E0B' }}>
              <DollarSign size={22} />
            </div>
          </div>
        </div>
      </div>

      {/* Cronograma do Dia Card */}
      <div className="card-saas" style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Clock size={18} color="#A855F7" />
            <h2 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#FFFFFF', fontFamily: 'var(--font-sans)' }}>
              Cronograma do Dia ({formattedDate || '16/08/2026'})
            </h2>
          </div>
          <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#94A3B8', backgroundColor: '#131D33', padding: '4px 10px', borderRadius: '6px', border: '1px solid #1B263B' }}>
            0 eventos hoje
          </span>
        </div>
        <p style={{ fontSize: '0.82rem', color: '#64748B', marginBottom: '24px' }}>
          Visão cronológica unificada dos compromissos e prazos de hoje.
        </p>

        <div style={{ padding: '36px 20px', textAlign: 'center', color: '#64748B', fontStyle: 'italic', fontSize: '0.85rem' }}>
          Nenhum compromisso ou vencimento agendado para hoje.
        </div>
      </div>

      {/* Bottom Grid Section */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '20px' }}>
        {/* Minhas Tarefas Pendentes */}
        <div className="card-saas">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#FFFFFF', fontFamily: 'var(--font-sans)' }}>
              Minhas Tarefas Pendentes
            </h3>
            <Link href="/prazos" style={{ fontSize: '0.8rem', color: '#94A3B8', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '2px', fontWeight: 500 }}>
              Ver todas <ChevronRight size={14} />
            </Link>
          </div>
          <p style={{ fontSize: '0.8rem', color: '#64748B', marginBottom: '32px' }}>
            Tarefas sob sua responsabilidade ordenadas por prioridade e vencimento.
          </p>

          <div style={{ padding: '40px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '10px', color: '#64748B', border: '1px dashed #1B263B', borderRadius: '8px' }}>
            <CheckSquare size={24} color="#64748B" />
            <span style={{ fontSize: '0.85rem' }}>Nenhuma tarefa pendente atribuída a você.</span>
          </div>
        </div>

        {/* Right side: Audiências & Atendimentos */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Audiências Agendadas */}
          <div className="card-saas">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Gavel size={16} color="#94A3B8" />
                <h3 style={{ fontSize: '0.98rem', fontWeight: 700, color: '#FFFFFF', fontFamily: 'var(--font-sans)' }}>
                  Audiências Agendadas (Geral)
                </h3>
              </div>
              <Link href="/agenda" style={{ fontSize: '0.78rem', color: '#94A3B8', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '2px' }}>
                Ver audiências <ChevronRight size={14} />
              </Link>
            </div>
            <p style={{ fontSize: '0.78rem', color: '#64748B', marginBottom: '20px' }}>
              Próximas audiências registradas.
            </p>
            <div style={{ fontSize: '0.82rem', color: '#64748B', fontStyle: 'italic' }}>
              Nenhuma audiência pendente cadastrada.
            </div>
          </div>

          {/* Próximos Atendimentos */}
          <div className="card-saas">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <UserCheck size={16} color="#10B981" />
                <h3 style={{ fontSize: '0.98rem', fontWeight: 700, color: '#FFFFFF', fontFamily: 'var(--font-sans)' }}>
                  Próximos Atendimentos
                </h3>
              </div>
              <Link href="/agenda" style={{ fontSize: '0.78rem', color: '#94A3B8', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '2px' }}>
                Ver agenda <ChevronRight size={14} />
              </Link>
            </div>
            <p style={{ fontSize: '0.78rem', color: '#64748B', marginBottom: '20px' }}>
              Agendamentos gerais de triagem e acolhimento.
            </p>
            <div style={{ fontSize: '0.82rem', color: '#64748B', fontStyle: 'italic' }}>
              Nenhum atendimento pendente agendado.
            </div>
          </div>
        </div>
      </div>

      {/* Quick Action Modal */}
      {activeModal && (
        <div className="sidebar-overlay open" onClick={() => setActiveModal(null)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="card-saas" onClick={(e) => e.stopPropagation()} style={{ width: '90%', maxWidth: '440px', margin: 0 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#FFFFFF' }}>Nova Ação Rápida</h3>
              <button type="button" onClick={() => setActiveModal(null)} style={{ color: '#94A3B8' }}><X size={18} /></button>
            </div>

            <form onSubmit={handleSaveModal} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px', color: '#94A3B8' }}>Título / Descrição</label>
                <input
                  type="text"
                  required
                  placeholder="Informe os detalhes..."
                  value={modalInput}
                  onChange={(e) => setModalInput(e.target.value)}
                  className="search-input-dark"
                  style={{ paddingLeft: '14px' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '8px' }}>
                <button type="button" onClick={() => setActiveModal(null)} className="btn-secondary">Cancelar</button>
                <button type="submit" className="btn-primary">Salvar</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ToastNotification message={toastMessage} onClose={() => setToastMessage(null)} />
    </div>
  );
}
