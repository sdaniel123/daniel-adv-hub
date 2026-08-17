'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Users, 
  AlertCircle, 
  Key, 
  Calendar, 
  Search, 
  Download, 
  Plus, 
  CheckCircle2, 
  ShieldAlert 
} from 'lucide-react';
import ToastNotification from '@/components/ui/ToastNotification';
import FormClienteModal from '@/components/clientes/FormClienteModal';
import { fetchClientes, createCliente } from '@/lib/clientesStore';

export default function ClientesPage() {
  const router = useRouter();
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('todos');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modals state
  const [showFormModal, setShowFormModal] = useState(false);
  const [toast, setToast] = useState(null);

  const loadClientesData = async () => {
    setLoading(true);
    const data = await fetchClientes();
    setClientes(data);
    setLoading(false);
  };

  useEffect(() => {
    loadClientesData();
  }, []);

  const filteredSortedClientes = useMemo(() => {
    return clientes
      .filter((cli) => {
        const term = searchTerm.toLowerCase().trim();
        const matchesSearch = 
          !term ||
          cli.nome.toLowerCase().includes(term) ||
          cli.documento.toLowerCase().includes(term) ||
          cli.email.toLowerCase().includes(term);

        if (!matchesSearch) return false;

        if (activeFilter === 'prioritarios') return cli.prioritario;
        if (activeFilter === 'menores') return cli.incapacidade && cli.incapacidade !== 'Capaz';
        if (activeFilter === 'com_processo') return cli.comProcesso || (cli.processosCount > 0);
        if (activeFilter === 'sem_processo') return !cli.comProcesso && (cli.processosCount === 0);

        return true;
      })
      .sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR', { sensitivity: 'base' }));
  }, [clientes, searchTerm, activeFilter]);

  const handleOpenCreateModal = () => {
    setShowFormModal(true);
  };

  const handleSaveCliente = async (formData) => {
    try {
      const created = await createCliente(formData);
      setClientes((prev) => [...prev, created]);
      setToast(`Cliente "${formData.nome}" cadastrado com sucesso no Supabase!`);
      setShowFormModal(false);
    } catch (err) {
      setToast('Erro ao salvar cliente no banco de dados.');
    }
  };

  const handleExportCSV = () => {
    const headers = 'Nome,CPF_CNPJ,Email,Telefone,Cidade,UF,Incapacidade,Prioritario,ProcessosAtivos\n';
    const rows = filteredSortedClientes.map(c => 
      `"${c.nome}","${c.documento}","${c.email}","${c.fone}","${c.cidade || ''}","${c.uf || ''}","${c.incapacidade || 'Capaz'}",${c.prioritario ? 'Sim' : 'Não'},${c.processosCount || 0}`
    ).join('\n');

    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `relatorio_clientes_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setToast('Relatório em CSV exportado com sucesso!');
  };

  // Metrics counts
  const totalClientes = clientes.length;
  const totalPrioritarios = clientes.filter((c) => c.prioritario).length;
  const totalChaveAtiva = clientes.filter((c) => c.chaveAtiva).length;
  const totalEsteMes = clientes.filter((c) => c.cadastradoEsteMes).length;

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
      {/* Header section with Title & Action Buttons */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <span className="page-header-subtitle">DANIEL ADV HUB</span>
          <h1 className="page-header-title">Clientes</h1>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button type="button" className="btn-secondary" onClick={handleExportCSV}>
            <Download size={15} />
            <span>Exportar CSV</span>
          </button>
          <button type="button" className="btn-primary" onClick={handleOpenCreateModal}>
            <Plus size={15} />
            <span>Novo cliente</span>
          </button>
        </div>
      </div>

      {/* 4 Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        <div className="card-saas">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <span style={{ fontSize: '0.82rem', color: '#94A3B8', fontWeight: 500 }}>Total de Clientes</span>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: '#FFFFFF', marginTop: '4px' }}>
                {totalClientes}
              </div>
            </div>
            <div style={{ padding: '8px', borderRadius: '8px', backgroundColor: '#131D33', color: '#94A3B8' }}>
              <Users size={18} />
            </div>
          </div>
        </div>

        <div className="card-saas">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <span style={{ fontSize: '0.82rem', color: '#94A3B8', fontWeight: 500 }}>Clientes Prioritários</span>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: '#F59E0B', marginTop: '4px' }}>
                {totalPrioritarios}
              </div>
            </div>
            <div style={{ padding: '8px', borderRadius: '8px', backgroundColor: '#131D33', color: '#F59E0B' }}>
              <AlertCircle size={18} />
            </div>
          </div>
        </div>

        <div className="card-saas">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <span style={{ fontSize: '0.82rem', color: '#94A3B8', fontWeight: 500 }}>Chave Pública Ativa</span>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: '#10B981', marginTop: '4px' }}>
                {totalChaveAtiva}
              </div>
            </div>
            <div style={{ padding: '8px', borderRadius: '8px', backgroundColor: '#131D33', color: '#10B981' }}>
              <Key size={18} />
            </div>
          </div>
        </div>

        <div className="card-saas">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <span style={{ fontSize: '0.82rem', color: '#94A3B8', fontWeight: 500 }}>Cadastrados este Mês</span>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: '#3B82F6', marginTop: '4px' }}>
                {totalEsteMes}
              </div>
            </div>
            <div style={{ padding: '8px', borderRadius: '8px', backgroundColor: '#131D33', color: '#3B82F6' }}>
              <CheckCircle2 size={18} />
            </div>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px', marginBottom: '20px' }}>
        <div style={{ position: 'relative', width: '380px', maxWidth: '100%' }}>
          <Search size={15} style={{ position: 'absolute', left: '12px', top: '10px', color: '#94A3B8' }} />
          <input
            type="text"
            placeholder="Buscar por nome completo, CPF/CNPJ ou e-mail..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input-dark"
          />
        </div>

        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          <button
            type="button"
            className={`pill-filter ${activeFilter === 'todos' ? 'active' : ''}`}
            onClick={() => setActiveFilter('todos')}
          >
            Todos ({totalClientes})
          </button>
          <button
            type="button"
            className={`pill-filter ${activeFilter === 'prioritarios' ? 'active' : ''}`}
            onClick={() => setActiveFilter('prioritarios')}
          >
            Prioritários ({totalPrioritarios})
          </button>
          <button
            type="button"
            className={`pill-filter ${activeFilter === 'menores' ? 'active' : ''}`}
            onClick={() => setActiveFilter('menores')}
          >
            Menores / Incapazes
          </button>
          <button
            type="button"
            className={`pill-filter ${activeFilter === 'com_processo' ? 'active' : ''}`}
            onClick={() => setActiveFilter('com_processo')}
          >
            Com Processo
          </button>
          <button
            type="button"
            className={`pill-filter ${activeFilter === 'sem_processo' ? 'active' : ''}`}
            onClick={() => setActiveFilter('sem_processo')}
          >
            Sem Processo
          </button>
        </div>
      </div>

      {/* Content Container (Alphabetical Order A-Z Table) */}
      <div className="card-saas" style={{ padding: filteredSortedClientes.length === 0 ? '60px 20px' : '0', overflow: 'hidden' }}>
        {filteredSortedClientes.length === 0 ? (
          <div style={{ textAlign: 'center', color: '#94A3B8', fontSize: '0.88rem' }}>
            Nenhum cliente encontrado com os filtros e termo de pesquisa informados.
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.86rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #1B263B', color: '#94A3B8', fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  <th style={{ padding: '16px 20px' }}>Nome Completo</th>
                  <th style={{ padding: '16px 20px' }}>CPF / CNPJ</th>
                  <th style={{ padding: '16px 20px' }}>E-mail</th>
                  <th style={{ padding: '16px 20px' }}>Telefone</th>
                  <th style={{ padding: '16px 20px' }}>Processos Ativos</th>
                  <th style={{ padding: '16px 20px', textAlign: 'right' }}>Ação</th>
                </tr>
              </thead>
              <tbody>
                {filteredSortedClientes.map((cli) => (
                  <tr 
                    key={cli.id} 
                    onClick={() => router.push(`/clientes/${cli.id}`)}
                    style={{ 
                      borderBottom: '1px solid #162035', 
                      transition: 'background-color 0.15s ease',
                      cursor: 'pointer'
                    }}
                    className="table-row-hover"
                  >
                    <td style={{ padding: '16px 20px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {cli.prioritario && (
                          <AlertCircle size={15} color="#F59E0B" title="Cliente Prioritário" />
                        )}
                        <span style={{ fontWeight: 700, color: '#FFFFFF' }}>{cli.nome}</span>
                      </div>
                      <div style={{ display: 'flex', gap: '6px', marginTop: '3px' }}>
                        <span style={{ fontSize: '0.72rem', color: '#64748B' }}>{cli.tipo}</span>
                        {cli.incapacidade && cli.incapacidade !== 'Capaz' && (
                          <span style={{ fontSize: '0.70rem', color: '#F59E0B', fontWeight: 600 }}>• {cli.incapacidade}</span>
                        )}
                      </div>
                    </td>
                    <td style={{ padding: '16px 20px', color: '#94A3B8', fontFamily: 'monospace' }}>
                      {cli.documento}
                    </td>
                    <td style={{ padding: '16px 20px', color: '#FFFFFF' }}>
                      {cli.email || '-'}
                    </td>
                    <td style={{ padding: '16px 20px', color: '#94A3B8' }}>
                      {cli.fone || '-'}
                    </td>
                    <td style={{ padding: '16px 20px' }}>
                      <span className="badge-saas badge-primary">
                        {cli.processosCount || 0} ativo(s)
                      </span>
                    </td>
                    <td style={{ padding: '16px 20px', textAlign: 'right' }}>
                      <Link
                        href={`/clientes/${cli.id}`}
                        style={{ color: '#3B82F6', fontWeight: 600, fontSize: '0.82rem', textDecoration: 'none' }}
                      >
                        Ver ficha →
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Popup Modal: Criar Novo Cliente (com Fundo Embaçado Blur) */}
      <FormClienteModal
        isOpen={showFormModal}
        onClose={() => setShowFormModal(false)}
        onSave={handleSaveCliente}
      />

      <ToastNotification message={toast} onClose={() => setToast(null)} />
    </div>
  );
}
