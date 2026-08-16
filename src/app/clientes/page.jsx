'use client';

import React from 'react';
import { Plus } from 'lucide-react';
import ClientesTable from '@/components/tables/ClientesTable';

export default function ClientesPage() {
  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-gold)', textTransform: 'uppercase', letterSpacing: '1px' }}>
            Base de Clientes
          </span>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '2.2rem', marginTop: '2px', fontWeight: 700 }}>
            Gestão de Clientes
          </h1>
        </div>

        <button type="button" className="action-btn-3d">
          <Plus size={18} />
          Novo Cliente
        </button>
      </div>

      <ClientesTable />
    </div>
  );
}
