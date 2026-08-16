'use client';

import React from 'react';
import { CheckCircle2, AlertCircle, FileText, Clock, Users } from 'lucide-react';

export default function HomePage() {
  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ marginBottom: '28px' }}>
        <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-success)', textTransform: 'uppercase', letterSpacing: '1px' }}>
          Painel de Controle
        </span>
        <h1 style={{ fontFamily: 'var(--font-raleway)', fontSize: '2rem', marginTop: '6px', fontWeight: 700 }}>
          Visão Geral do Escritório
        </h1>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginBottom: '32px' }}>
        <div className="card-popup">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>Processos Ativos</span>
            <FileText size={22} color="#3774FF" />
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 700, fontFamily: 'var(--font-montserrat)' }}>
            48
          </div>
          <div style={{ marginTop: '12px' }}>
            <span className="status-badge-success">
              <CheckCircle2 size={14} /> Atualizado
            </span>
          </div>
        </div>

        <div className="card-popup">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>Prazos da Semana</span>
            <Clock size={22} color="#F93D4A" />
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 700, fontFamily: 'var(--font-montserrat)' }}>
            12
          </div>
          <div style={{ marginTop: '12px' }}>
            <span className="status-badge-error">
              <AlertCircle size={14} /> 3 Urgentes
            </span>
          </div>
        </div>

        <div className="card-popup">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>Clientes Cadastrados</span>
            <Users size={22} color="#3774FF" />
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 700, fontFamily: 'var(--font-montserrat)' }}>
            154
          </div>
          <div style={{ marginTop: '12px' }}>
            <span className="status-badge-success">
              <CheckCircle2 size={14} /> Base Ativa
            </span>
          </div>
        </div>
      </div>

      <div className="card-popup">
        <h2 style={{ fontFamily: 'var(--font-raleway)', fontSize: '1.3rem', marginBottom: '16px', fontWeight: 600 }}>
          Últimas Atividades
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid var(--color-gray)' }}>
            <div>
              <p style={{ fontWeight: 600, fontSize: '0.95rem' }}>Petição Intermediária Protocols</p>
              <p style={{ fontSize: '0.85rem', opacity: 0.8 }}>Processo nº 0012345-67.2026.8.26.0100</p>
            </div>
            <span className="status-badge-success">
              <CheckCircle2 size={14} /> Concluído
            </span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0' }}>
            <div>
              <p style={{ fontWeight: 600, fontSize: '0.95rem' }}>Audiência de Conciliação</p>
              <p style={{ fontSize: '0.85rem', opacity: 0.8 }}>Pendente de Anexar Comprovante</p>
            </div>
            <span className="status-badge-error">
              <AlertCircle size={14} /> Pendente
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
