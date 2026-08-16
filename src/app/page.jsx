'use client';

import React from 'react';
import { CheckCircle2, AlertCircle, FileText, Clock, Users, DollarSign, TrendingUp, Scale, ArrowUpRight } from 'lucide-react';

export default function HomePage() {
  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
      <div style={{ marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '16px' }}>
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
        <div className="card-glass-3d" style={{ gridColumn: 'span 2' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <div>
              <h2 style={{ fontFamily: 'var(--font-raleway)', fontSize: '1.35rem', fontWeight: 700 }}>
                Distribuição de Processos por Área
              </h2>
              <p style={{ fontSize: '0.85rem', opacity: 0.75, marginTop: '2px' }}>
                Acompanhamento em tempo real dos tipos de ação
              </p>
            </div>
            <Scale size={24} color="#3774FF" />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '0.9rem', fontWeight: 600 }}>
                <span>Direito Cível & Contratos</span>
                <span>20 processos (42%)</span>
              </div>
              <div style={{ width: '100%', height: '10px', backgroundColor: 'rgba(0, 0, 0, 0.08)', borderRadius: '6px', overflow: 'hidden' }}>
                <div style={{ width: '42%', height: '100%', backgroundColor: '#3774FF', borderRadius: '6px' }} />
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '0.9rem', fontWeight: 600 }}>
                <span>Direito Trabalhista</span>
                <span>16 processos (33%)</span>
              </div>
              <div style={{ width: '100%', height: '10px', backgroundColor: 'rgba(0, 0, 0, 0.08)', borderRadius: '6px', overflow: 'hidden' }}>
                <div style={{ width: '33%', height: '100%', backgroundColor: '#3774FF', opacity: 0.8, borderRadius: '6px' }} />
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '0.9rem', fontWeight: 600 }}>
                <span>Direito Empresarial & Tributário</span>
                <span>8 processos (17%)</span>
              </div>
              <div style={{ width: '100%', height: '10px', backgroundColor: 'rgba(0, 0, 0, 0.08)', borderRadius: '6px', overflow: 'hidden' }}>
                <div style={{ width: '17%', height: '100%', backgroundColor: '#3774FF', opacity: 0.6, borderRadius: '6px' }} />
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '0.9rem', fontWeight: 600 }}>
                <span>Família & Sucessões</span>
                <span>4 processos (8%)</span>
              </div>
              <div style={{ width: '100%', height: '10px', backgroundColor: 'rgba(0, 0, 0, 0.08)', borderRadius: '6px', overflow: 'hidden' }}>
                <div style={{ width: '8%', height: '100%', backgroundColor: '#F93D4A', borderRadius: '6px' }} />
              </div>
            </div>
          </div>
        </div>

        <div className="card-glass-3d">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2 style={{ fontFamily: 'var(--font-raleway)', fontSize: '1.25rem', fontWeight: 700 }}>
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
    </div>
  );
}
