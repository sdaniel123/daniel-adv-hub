'use client';

import React from 'react';
import { Users, Plus, Search, Filter, Mail, Phone, MoreVertical } from 'lucide-react';

export default function ClientesPage() {
  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-success)', textTransform: 'uppercase', letterSpacing: '1.2px' }}>
            Base de Clientes
          </span>
          <h1 style={{ fontFamily: 'var(--font-raleway)', fontSize: '2.2rem', marginTop: '4px', fontWeight: 800 }}>
            Gestão de Clientes
          </h1>
        </div>

        <button type="button" className="action-btn-3d">
          <Plus size={18} />
          Novo Cliente
        </button>
      </div>

      <div className="card-glass-3d" style={{ marginBottom: '28px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div style={{ position: 'relative', width: '320px' }}>
            <Search size={18} style={{ position: 'absolute', left: '14px', top: '12px', opacity: 0.6 }} />
            <input
              type="text"
              placeholder="Buscar cliente por nome ou CPF/CNPJ..."
              style={{
                width: '100%',
                padding: '10px 14px 10px 42px',
                borderRadius: '12px',
                border: '1px solid var(--card-border)',
                backgroundColor: 'rgba(0, 0, 0, 0.04)',
                outline: 'none'
              }}
            />
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              type="button"
              style={{
                padding: '10px 16px',
                borderRadius: '12px',
                border: '1px solid var(--card-border)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontWeight: 600,
                fontSize: '0.9rem'
              }}
            >
              <Filter size={16} />
              Filtrar
            </button>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
        <div className="card-glass-3d">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
            <div>
              <span className="badge-pill-success" style={{ marginBottom: '8px' }}>Pessoa Física</span>
              <h3 style={{ fontFamily: 'var(--font-raleway)', fontSize: '1.2rem', fontWeight: 700 }}>
                Carlos Eduardo Silva
              </h3>
              <p style={{ fontSize: '0.85rem', opacity: 0.7 }}>CPF: 123.456.789-00</p>
            </div>
            <button type="button" style={{ opacity: 0.7 }}>
              <MoreVertical size={20} />
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.9rem', marginBottom: '20px', borderTop: '1px solid var(--card-border)', paddingTop: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Mail size={16} color="#3774FF" />
              <span>carlos.silva@email.com</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Phone size={16} color="#3774FF" />
              <span>(11) 98765-4321</span>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem' }}>
            <span style={{ fontWeight: 600 }}>2 Processos Ativos</span>
            <span style={{ color: '#3774FF', fontWeight: 700, cursor: 'pointer' }}>Ver detalhes →</span>
          </div>
        </div>

        <div className="card-glass-3d">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
            <div>
              <span className="badge-pill-success" style={{ marginBottom: '8px' }}>Pessoa Jurídica</span>
              <h3 style={{ fontFamily: 'var(--font-raleway)', fontSize: '1.2rem', fontWeight: 700 }}>
                Tech Solutions Ltda
              </h3>
              <p style={{ fontSize: '0.85rem', opacity: 0.7 }}>CNPJ: 12.345.678/0001-90</p>
            </div>
            <button type="button" style={{ opacity: 0.7 }}>
              <MoreVertical size={20} />
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.9rem', marginBottom: '20px', borderTop: '1px solid var(--card-border)', paddingTop: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Mail size={16} color="#3774FF" />
              <span>contato@techsolutions.com</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Phone size={16} color="#3774FF" />
              <span>(11) 3344-5566</span>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem' }}>
            <span style={{ fontWeight: 600 }}>5 Processos Ativos</span>
            <span style={{ color: '#3774FF', fontWeight: 700, cursor: 'pointer' }}>Ver detalhes →</span>
          </div>
        </div>
      </div>
    </div>
  );
}
