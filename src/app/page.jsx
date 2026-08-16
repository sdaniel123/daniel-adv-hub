'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { FileText, Clock, Users, DollarSign, TrendingUp, AlertCircle, Plus, ChevronRight, CheckCircle2 } from 'lucide-react';
import ToastNotification from '@/components/ui/ToastNotification';

export default function HomePage() {
  const [toastMessage, setToastMessage] = useState(null);
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

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', flexWrap: 'wrap', gap: '20px' }}>
        <div>
          <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '1px' }}>
            Painel Geral
          </span>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2.2rem', marginTop: '2px', fontWeight: 800 }}>
            Visão Executiva
          </h1>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            {timeString || '16 de Agosto de 2026 • 15:15h'}
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <Link href="/clientes" className="btn-secondary">
            <Plus size={16} />
            <span>Novo Cliente</span>
          </Link>
          <Link href="/processos" className="btn-secondary">
            <Plus size={16} />
            <span>Novo Processo</span>
          </Link>
          <Link href="/prazos" className="btn-primary">
            <Plus size={16} />
            <span>Novo Prazo</span>
          </Link>
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

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '28px', marginBottom: '32px' }}>
        <div className="card-saas" style={{ gridColumn: 'span 2' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <div>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 700 }}>
                Compromissos e Prazos Prioritários
              </h2>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                Próximas pendências registradas no sistema
              </p>
            </div>
            <Link href="/prazos" className="btn-secondary" style={{ padding: '6px 14px', fontSize: '0.82rem' }}>
              <span>Ver todos</span>
              <ChevronRight size={14} />
            </Link>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 16px', borderRadius: '10px', backgroundColor: 'var(--bg-main)', border: '1px solid var(--border-light)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#F43F5E' }} />
                <div>
                  <h4 style={{ fontSize: '0.9rem', fontWeight: 700 }}>Protocolo de Contestação Cível</h4>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Proc. nº 1042345-12.2026 • 4ª Vara Cível TJSP</p>
                </div>
              </div>
              <span className="badge-saas badge-danger">Hoje às 23:59</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 16px', borderRadius: '10px', backgroundColor: 'var(--bg-main)', border: '1px solid var(--border-light)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#4F46E5' }} />
                <div>
                  <h4 style={{ fontSize: '0.9rem', fontWeight: 700 }}>Audiência de Conciliação</h4>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Proc. nº 0000845-90.2026 • TRT-2 Trabalhista</p>
                </div>
              </div>
              <span className="badge-saas badge-primary">Amanhã às 14:00</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 16px', borderRadius: '10px', backgroundColor: 'var(--bg-main)', border: '1px solid var(--border-light)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10B981' }} />
                <div>
                  <h4 style={{ fontSize: '0.9rem', fontWeight: 700 }}>Reunião de Alinhamento - Tech Solutions</h4>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Atendimento presencial no escritório</p>
                </div>
              </div>
              <span className="badge-saas badge-success">18 de Agosto</span>
            </div>
          </div>
        </div>

        <div className="card-saas">
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 700, marginBottom: '16px' }}>
            Distribuição por Área
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>
                <span>Cível & Contratos</span>
                <span>42% (20)</span>
              </div>
              <div style={{ height: '8px', borderRadius: '4px', backgroundColor: 'var(--border-light)', overflow: 'hidden' }}>
                <div style={{ width: '42%', height: '100%', backgroundColor: '#4F46E5', borderRadius: '4px' }} />
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>
                <span>Trabalhista</span>
                <span>33% (16)</span>
              </div>
              <div style={{ height: '8px', borderRadius: '4px', backgroundColor: 'var(--border-light)', overflow: 'hidden' }}>
                <div style={{ width: '33%', height: '100%', backgroundColor: '#10B981', borderRadius: '4px' }} />
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>
                <span>Tributário & Empresarial</span>
                <span>17% (8)</span>
              </div>
              <div style={{ height: '8px', borderRadius: '4px', backgroundColor: 'var(--border-light)', overflow: 'hidden' }}>
                <div style={{ width: '17%', height: '100%', backgroundColor: '#F59E0B', borderRadius: '4px' }} />
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>
                <span>Família & Sucessões</span>
                <span>8% (4)</span>
              </div>
              <div style={{ height: '8px', borderRadius: '4px', backgroundColor: 'var(--border-light)', overflow: 'hidden' }}>
                <div style={{ width: '8%', height: '100%', backgroundColor: '#F43F5E', borderRadius: '4px' }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <ToastNotification message={toastMessage} onClose={() => setToastMessage(null)} />
    </div>
  );
}
