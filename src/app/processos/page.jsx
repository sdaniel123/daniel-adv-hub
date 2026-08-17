'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Briefcase, 
  FileText, 
  CheckCircle2, 
  Search, 
  Download, 
  Plus, 
  Gavel, 
  Calendar, 
  User, 
  AlertCircle,
  Archive
} from 'lucide-react';
import ToastNotification from '@/components/ui/ToastNotification';
import FormProcessoModal from '@/components/processos/FormProcessoModal';
import { fetchProcessos, createProcesso, updateProcesso } from '@/lib/processosStore';

export default function ProcessosPage() {
  const router = useRouter();
  const [processos, setProcessos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('em_andamento'); // 'em_andamento' | 'com_audiencia' | 'encerrados' | 'arquivados'
  const [activeSystemFilter, setActiveSystemFilter] = useState('todos');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modal state
  const [showFormModal, setShowFormModal] = useState(false);
  const [editingProcesso, setEditingProcesso] = useState(null);
  const [toast, setToast] = useState(null);

  const loadData = async () => {
    setLoading(true);
    const data = await fetchProcessos();
    setProcessos(data);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredSortedProcessos = useMemo(() => {
    return processos
      .filter((proc) => {
        const term = searchTerm.toLowerCase().trim();
        
        const clientNames = (proc.clientes || []).map(c => c.nome.toLowerCase()).join(' ');
        const matchesSearch = 
          !term ||
          proc.cnj.toLowerCase().includes(term) ||
          clientNames.includes(term) ||
          proc.assunto.toLowerCase().includes(term) ||
          proc.tramitacao.toLowerCase().includes(term);

        if (!matchesSearch) return false;

        if (activeTab === 'arquivados') {
          if (!proc.arquivado && proc.status !== 'Arquivado') return false;
        } else {
          if (proc.arquivado || proc.status === 'Arquivado') return false;

          if (activeTab === 'em_andamento' && proc.status !== 'Em andamento') return false;
          if (activeTab === 'com_audiencia' && !proc.comAudiencia) return false;
          if (activeTab === 'encerrados' && !proc.encerado && proc.status !== 'Encerrado') return false;
        }

        if (activeSystemFilter === 'pje' && proc.sistema !== 'PJe') return false;
        if (activeSystemFilter === 'projudi' && proc.sistema !== 'Projudi') return false;
        if (activeSystemFilter === 'eproc' && proc.sistema !== 'EProc') return false;
        if (activeSystemFilter === 'prioritarios' && !proc.prioritario) return false;

        return true;
      })
      .sort((a, b) => {
        const dateA = a.dataProtocolo || '1970-01-01';
        const dateB = b.dataProtocolo || '1970-01-01';
        return dateB.localeCompare(dateA);
      });
  }, [processos, searchTerm, activeTab, activeSystemFilter]);

  const handleOpenCreateModal = () => {
    setEditingProcesso(null);
    setShowFormModal(true);
  };

  const handleSaveProcesso = async (formData) => {
    try {
      if (formData.id) {
        const updated = await updateProcesso(formData.id, formData);
        setProcessos((prev) => prev.map((p) => (p.id === formData.id ? updated : p)));
        setToast(`Processo CNJ "${formData.cnj}" atualizado!`);
      } else {
        const created = await createProcesso(formData);
        setProcessos((prev) => [created, ...prev]);
        setToast(`Processo CNJ "${formData.cnj}" criado no Supabase!`);
      }
      setShowFormModal(false);
    } catch (err) {
      setToast('Erro ao salvar processo no banco de dados.');
    }
  };

  const handleExportCSV = () => {
    const headers = 'CNJ,Clientes,Assunto,Sistema,Tramitação,Status,Prioritario,DataProtocolo\n';
    const rows = filteredSortedProcessos.map(p => {
      const cliNames = (p.clientes || []).map(c => c.nome).join('; ');
      return `"${p.cnj}","${cliNames}","${p.assunto}","${p.sistema}","${p.tramitacao}","${p.status}",${p.prioritario ? 'Sim' : 'Não'},"${p.dataProtocoloFmt || ''}"`;
    }).join('\n');

    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `relatorio_processos_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setToast('Relatório de Processos em CSV exportado com sucesso!');
  };

  // Stat Card Metrics
  const totalEmAndamento = processos.filter(p => !p.arquivado && p.status === 'Em andamento').length;
  const totalJudiciais = processos.filter(p => !p.arquivado).length;
  const totalPrioritarios = processos.filter(p => !p.arquivado && p.prioritario).length;
  const totalArquivados = processos.filter(p => p.arquivado || p.status === 'Arquivado').length;

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
      {/* Header section with Title & Action Buttons */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <span className="page-header-subtitle">DANIEL ADV HUB</span>
          <h1 className="page-header-title">Processos</h1>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button type="button" className="btn-secondary" onClick={handleExportCSV}>
            <Download size={15} />
            <span>Exportar CSV</span>
          </button>
          <button type="button" className="btn-primary" onClick={handleOpenCreateModal}>
            <Plus size={15} />
            <span>Novo processo</span>
          </button>
        </div>
      </div>

      {/* 4 Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        <div className="card-saas">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <span style={{ fontSize: '0.82rem', color: '#94A3B8', fontWeight: 500 }}>Processos em Andamento</span>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: '#FFFFFF', marginTop: '4px' }}>
                {totalEmAndamento}
              </div>
            </div>
            <div style={{ padding: '8px', borderRadius: '8px', backgroundColor: '#131D33', color: '#94A3B8' }}>
              <Briefcase size={18} />
            </div>
          </div>
        </div>

        <div className="card-saas">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <span style={{ fontSize: '0.82rem', color: '#94A3B8', fontWeight: 500 }}>Processos Ativos</span>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: '#3B82F6', marginTop: '4px' }}>
                {totalJudiciais}
              </div>
            </div>
            <div style={{ padding: '8px', borderRadius: '8px', backgroundColor: '#131D33', color: '#3B82F6' }}>
              <FileText size={18} />
            </div>
          </div>
        </div>

        <div className="card-saas">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <span style={{ fontSize: '0.82rem', color: '#94A3B8', fontWeight: 500 }}>Processos Prioritários</span>
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
              <span style={{ fontSize: '0.82rem', color: '#94A3B8', fontWeight: 500 }}>Processos Arquivados</span>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: '#64748B', marginTop: '4px' }}>
                {totalArquivados}
              </div>
            </div>
            <div style={{ padding: '8px', borderRadius: '8px', backgroundColor: '#131D33', color: '#64748B' }}>
              <Archive size={18} />
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Row */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '18px', borderBottom: '1px solid #1B263B', paddingBottom: '10px' }}>
        <button
          type="button"
          className={`tab-nav-btn ${activeTab === 'em_andamento' ? 'active' : ''}`}
          onClick={() => setActiveTab('em_andamento')}
        >
          Em andamento
        </button>
        <button
          type="button"
          className={`tab-nav-btn ${activeTab === 'com_audiencia' ? 'active' : ''}`}
          onClick={() => setActiveTab('com_audiencia')}
        >
          Com audiência
        </button>
        <button
          type="button"
          className={`tab-nav-btn ${activeTab === 'encerrados' ? 'active' : ''}`}
          onClick={() => setActiveTab('encerrados')}
        >
          Encerrados
        </button>
        <button
          type="button"
          className={`tab-nav-btn ${activeTab === 'arquivados' ? 'active' : ''}`}
          onClick={() => setActiveTab('arquivados')}
        >
          Arquivados ({totalArquivados})
        </button>
      </div>

      {/* Filter & Search Bar (Número CNJ ou Cliente) */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px', marginBottom: '20px' }}>
        <div style={{ position: 'relative', width: '420px', maxWidth: '100%' }}>
          <Search size={15} style={{ position: 'absolute', left: '12px', top: '10px', color: '#94A3B8' }} />
          <input
            type="text"
            placeholder="Buscar por número CNJ ou nome do cliente..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input-dark"
          />
        </div>

        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          <button
            type="button"
            className={`pill-filter ${activeSystemFilter === 'todos' ? 'active' : ''}`}
            onClick={() => setActiveSystemFilter('todos')}
          >
            Todos os Sistemas
          </button>
          <button
            type="button"
            className={`pill-filter ${activeSystemFilter === 'pje' ? 'active' : ''}`}
            onClick={() => setActiveSystemFilter('pje')}
          >
            PJe
          </button>
          <button
            type="button"
            className={`pill-filter ${activeSystemFilter === 'projudi' ? 'active' : ''}`}
            onClick={() => setActiveSystemFilter('projudi')}
          >
            Projudi
          </button>
          <button
            type="button"
            className={`pill-filter ${activeSystemFilter === 'eproc' ? 'active' : ''}`}
            onClick={() => setActiveSystemFilter('eproc')}
          >
            EProc
          </button>
          <button
            type="button"
            className={`pill-filter ${activeSystemFilter === 'prioritarios' ? 'active' : ''}`}
            onClick={() => setActiveSystemFilter('prioritarios')}
          >
            Prioritários
          </button>
        </div>
      </div>

      {/* Main Table Container (Clickable Rows) */}
      <div className="card-saas" style={{ padding: filteredSortedProcessos.length === 0 ? '60px 20px' : '0', overflow: 'hidden' }}>
        {filteredSortedProcessos.length === 0 ? (
          <div style={{ textAlign: 'center', color: '#94A3B8', fontSize: '0.88rem' }}>
            Nenhum processo encontrado para a pesquisa ou filtro informado.
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.86rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #1B263B', color: '#94A3B8', fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  <th style={{ padding: '16px 20px' }}>Número CNJ / Protocolo</th>
                  <th style={{ padding: '16px 20px' }}>Cliente(s) Vinculado(s)</th>
                  <th style={{ padding: '16px 20px' }}>Status</th>
                  <th style={{ padding: '16px 20px' }}>Tramitação (Vara/Comarca)</th>
                  <th style={{ padding: '16px 20px', textAlign: 'right' }}>Ação</th>
                </tr>
              </thead>
              <tbody>
                {filteredSortedProcessos.map((proc) => (
                  <tr 
                    key={proc.id} 
                    onClick={() => router.push(`/processos/${proc.id}`)}
                    style={{ 
                      borderBottom: '1px solid #162035', 
                      transition: 'background-color 0.15s ease',
                      cursor: 'pointer' 
                    }}
                    className="table-row-hover"
                  >
                    {/* Número CNJ & Exclamação Amarela de Prioridade */}
                    <td style={{ padding: '16px 20px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {proc.prioritario && (
                          <AlertCircle size={16} color="#F59E0B" title="Processo Prioritário" />
                        )}
                        <span style={{ fontWeight: 700, color: '#FFFFFF', fontFamily: 'monospace', fontSize: '0.9rem' }}>
                          {proc.cnj}
                        </span>
                      </div>
                      <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginTop: '4px' }}>
                        <span style={{ fontSize: '0.72rem', color: '#94A3B8' }}>{proc.assunto}</span>
                        {proc.dataProtocoloFmt && (
                          <span style={{ fontSize: '0.70rem', color: '#3B82F6', fontWeight: 600 }}>• Protocolo: {proc.dataProtocoloFmt}</span>
                        )}
                      </div>
                    </td>

                    {/* Cliente(s) Vinculado(s) */}
                    <td style={{ padding: '16px 20px' }}>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                        {proc.clientes && proc.clientes.length > 0 ? (
                          proc.clientes.map((c) => (
                            <Link
                              key={c.id || c.nome}
                              href={`/clientes/${c.id}`}
                              onClick={(e) => e.stopPropagation()}
                              style={{ color: '#FFFFFF', fontWeight: 600, fontSize: '0.84rem', textDecoration: 'underline' }}
                            >
                              {c.nome}
                            </Link>
                          ))
                        ) : (
                          <span style={{ color: '#94A3B8' }}>-</span>
                        )}
                      </div>
                    </td>

                    {/* Status */}
                    <td style={{ padding: '16px 20px' }}>
                      <span className={`badge-saas ${proc.arquivado ? 'badge-warning' : 'badge-primary'}`}>
                        {proc.status}
                      </span>
                      {proc.sistema && (
                        <span className="badge-saas badge-secondary" style={{ marginLeft: '6px' }}>
                          {proc.sistema}
                        </span>
                      )}
                    </td>

                    {/* Tramitação */}
                    <td style={{ padding: '16px 20px', color: '#94A3B8' }}>
                      {proc.tramitacao || '-'}
                    </td>

                    {/* Action */}
                    <td style={{ padding: '16px 20px', textAlign: 'right' }}>
                      <span style={{ color: '#3B82F6', fontWeight: 600, fontSize: '0.82rem' }}>
                        Ver autos →
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Popup Modal: Criar / Editar Processo (com Blur) */}
      <FormProcessoModal
        isOpen={showFormModal}
        onClose={() => setShowFormModal(false)}
        onSave={handleSaveProcesso}
        initialData={editingProcesso}
      />

      <ToastNotification message={toast} onClose={() => setToast(null)} />
    </div>
  );
}
