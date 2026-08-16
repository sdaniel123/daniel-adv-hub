'use client';

import React, { useState } from 'react';
import { CheckCircle2, AlertCircle, FileText, Clock, Users, DollarSign, TrendingUp, ArrowUpRight } from 'lucide-react';
import InteractiveChart from '@/components/dashboard/InteractiveChart';
import WeeklyTimeline from '@/components/dashboard/WeeklyTimeline';
import QuickActions from '@/components/dashboard/QuickActions';
import ToastNotification from '@/components/ui/ToastNotification';

export default function HomePage() {
  const [toastMessage, setToastMessage] = useState(null);

  const handleShowToast = (msg) => {
    setToastMessage(msg);
  };

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
      <div style={{ marginBottom: '28px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-success)', textTransform: 'uppercase', letterSpacing: '1.2px' }}>
            Painel Executivo
          </span>
          <h1 style={{ fontFamily: 'var(--font-raleway)', fontSize: '2.2rem', marginTop: '4px', fontWeight: 800 }}>
            Visão Geral do Escritório
          </h1>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <span className="badge-pill-success">
            <CheckCircle2 size={15} /> Sistema Sincronizado
          </span>
        </div>
      </div>

      <QuickActions onActionSuccess={handleShowToast} />

      <WeeklyTimeline onSelectDay={(day) => handleShowToast(`Filtro aplicado para ${day.dayName} (${day.dateNum})`)} />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '24px', marginBottom: '36px' }}>
        <div className="card-glass-3d">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <span style={{ fontSize: '0.9rem', fontWeight: 700, opacity: 0.85 }}>Processos Ativos</span>
            <div style={{ padding: '10px', borderRadius: '14px', backgroundColor: 'rgba(55, 116, 255, 0.12)' }}>
              <FileText size={22} color="#3774FF" />
            </div>
          </div>
          <div style={{ fontSize: '2.2rem', fontWeight: 800, fontFamily: 'var(--font-montserrat)', marginBottom: '8px' }}>
            48
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span className="badge-pill-success">
              <TrendingUp size={13} /> +12% este mês
            </span>
            <span style={{ fontSize: '0.8rem', opacity: 0.7 }}>32 cíveis / 16 trab</span>
          </div>
        </div>

        <div className="card-glass-3d">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <span style={{ fontSize: '0.9rem', fontWeight: 700, opacity: 0.85 }}>Prazos da Semana</span>
            <div style={{ padding: '10px', borderRadius: '14px', backgroundColor: 'rgba(249, 61, 74, 0.12)' }}>
              <Clock size={22} color="#F93D4A" />
            </div>
          </div>
          <div style={{ fontSize: '2.2rem', fontWeight: 800, fontFamily: 'var(--font-montserrat)', marginBottom: '8px' }}>
            12
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span className="badge-pill-error">
              <AlertCircle size={13} /> 3 Fatais hoje
            </span>
            <span style={{ fontSize: '0.8rem', opacity: 0.7 }}>Atenção alta</span>
          </div>
        </div>

        <div className="card-glass-3d">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <span style={{ fontSize: '0.9rem', fontWeight: 700, opacity: 0.85 }}>Clientes Ativos</span>
            <div style={{ padding: '10px', borderRadius: '14px', backgroundColor: 'rgba(55, 116, 255, 0.12)' }}>
              <Users size={22} color="#3774FF" />
            </div>
          </div>
          <div style={{ fontSize: '2.2rem', fontWeight: 800, fontFamily: 'var(--font-montserrat)', marginBottom: '8px' }}>
            154
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span className="badge-pill-success">
              <CheckCircle2 size={13} /> Base verificada
            </span>
            <span style={{ fontSize: '0.8rem', opacity: 0.7 }}>8 novos este mês</span>
          </div>
        </div>

        <div className="card-glass-3d">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <span style={{ fontSize: '0.9rem', fontWeight: 700, opacity: 0.85 }}>Honorários Mensais</span>
            <div style={{ padding: '10px', borderRadius: '14px', backgroundColor: 'rgba(55, 116, 255, 0.12)' }}>
              <DollarSign size={22} color="#3774FF" />
            </div>
          </div>
          <div style={{ fontSize: '2.2rem', fontWeight: 800, fontFamily: 'var(--font-montserrat)', marginBottom: '8px' }}>
            R$ 42.850
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span className="badge-pill-success">
              <TrendingUp size={13} /> +8.4% de meta
            </span>
            <span style={{ fontSize: '0.8rem', opacity: 0.7 }}>Previsto R$ 50k</span>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '24px', marginBottom: '36px' }}>
        <div style={{ gridColumn: 'span 2' }}>
          <InteractiveChart />
        </div>

        <div className="card-glass-3d">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2 style={{ fontFamily: 'var(--font-raleway)', fontSize: '1.25rem', fontWeight: 800 }}>
              Prazos Prioritários
            </h2>
            <ArrowUpRight size={20} color="#3774FF" />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ padding: '14px', borderRadius: '14px', backgroundColor: 'rgba(249, 61, 74, 0.08)', borderLeft: '4px solid #F93D4A' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>Contestação Cível</span>
                <span className="badge-pill-error" style={{ padding: '2px 8px', fontSize: '0.75rem' }}>Hoje</span>
              </div>
              <p style={{ fontSize: '0.82rem', opacity: 0.8 }}>Proc. nº 1042345-12.2026</p>
            </div>

            <div style={{ padding: '14px', borderRadius: '14px', backgroundColor: 'rgba(55, 116, 255, 0.08)', borderLeft: '4px solid #3774FF' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>Réplica Trabalhista</span>
                <span className="badge-pill-success" style={{ padding: '2px 8px', fontSize: '0.75rem' }}>Amanhã</span>
              </div>
              <p style={{ fontSize: '0.82rem', opacity: 0.8 }}>Proc. nº 0000845-90.2026</p>
            </div>

            <div style={{ padding: '14px', borderRadius: '14px', backgroundColor: 'rgba(55, 116, 255, 0.08)', borderLeft: '4px solid #3774FF' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>Recurso Apelação</span>
                <span className="badge-pill-success" style={{ padding: '2px 8px', fontSize: '0.75rem' }}>em 3 dias</span>
              </div>
              <p style={{ fontSize: '0.82rem', opacity: 0.8 }}>Proc. nº 5001234-88.2026</p>
            </div>
          </div>
        </div>
      </div>

      <ToastNotification message={toastMessage} onClose={() => setToastMessage(null)} />
    </div>
  );
}
