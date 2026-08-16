'use client';

import React, { useState, useMemo } from 'react';
import { 
  Users, 
  Star, 
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
import FichaClienteModal from '@/components/clientes/FichaClienteModal';

const initialClientes = [
  { 
    id: '1', 
    nome: 'Carlos Eduardo Silva', 
    tipo: 'Pessoa Física', 
    documento: '123.456.789-00', 
    rg: '12.345.678-9', 
    profissao: 'Engenheiro Civil',
    nacionalidade: 'Brasileiro(a)',
    cep: '01001-000',
    logradouro: 'Praça da Sé',
    numero: '100',
    complemento: 'Apto 42',
    bairro: 'Sé',
    cidade: 'São Paulo',
    uf: 'SP',
    email: 'carlos.silva@email.com', 
    fone: '(11) 98765-4321', 
    processosCount: 2, 
    prioritario: true, 
    chaveAtiva: true, 
    comProcesso: true, 
    cadastradoEsteMes: true,
    incapacidade: 'Capaz',
    anotacoes: 'Cliente preferencial. Solicita contato sempre via WhatsApp no período da tarde.',
    dataCadastro: '10/08/2026'
  },
  { 
    id: '2', 
    nome: 'Tech Solutions Ltda', 
    tipo: 'Pessoa Jurídica', 
    documento: '12.345.678/0001-90', 
    rg: 'ISENTO', 
    profissao: 'Tecnologia da Informação',
    nacionalidade: 'Brasileiro(a)',
    cep: '13010-000',
    logradouro: 'Avenida Francisco Glicério',
    numero: '1500',
    complemento: 'Bloco B',
    bairro: 'Centro',
    cidade: 'Campinas',
    uf: 'SP',
    respEmpresaNome: 'Roberto Alencar',
    respEmpresaCpf: '321.654.987-11',
    respEmpresaEndereco: 'Av. Brasil, 450 - Campinas/SP',
    email: 'contato@techsolutions.com', 
    fone: '(11) 3344-5566', 
    processosCount: 5, 
    prioritario: false, 
    chaveAtiva: true, 
    comProcesso: true, 
    cadastradoEsteMes: false,
    incapacidade: 'Capaz',
    anotacoes: 'Empresa do ramo de software. Contrato de assessoria jurídica mensal.',
    dataCadastro: '01/07/2026'
  },
  { 
    id: '3', 
    nome: 'Maria Fernanda Oliveira', 
    tipo: 'Pessoa Física', 
    documento: '987.654.321-11', 
    rg: '98.765.432-1', 
    profissao: 'Médica Veterinária',
    nacionalidade: 'Brasileiro(a)',
    cep: '22041-001',
    logradouro: 'Avenida Atlântica',
    numero: '2000',
    complemento: '',
    bairro: 'Copacabana',
    cidade: 'Rio de Janeiro',
    uf: 'RJ',
    email: 'mf.oliveira@email.com', 
    fone: '(21) 99887-7665', 
    processosCount: 1, 
    prioritario: true, 
    chaveAtiva: true, 
    comProcesso: true, 
    cadastradoEsteMes: true,
    incapacidade: 'Capaz',
    anotacoes: 'Ação indenizatória contra cia aérea.',
    dataCadastro: '14/08/2026'
  },
  { 
    id: '4', 
    nome: 'Lucas Mendes (Menor Impúbere)', 
    tipo: 'Pessoa Física', 
    documento: '456.789.123-44', 
    rg: '45.678.912-3', 
    profissao: 'Estudante',
    nacionalidade: 'Brasileiro(a)',
    cep: '04530-000',
    logradouro: 'Rua Juscelino Kubitschek',
    numero: '500',
    complemento: '',
    bairro: 'Itaim Bibi',
    cidade: 'São Paulo',
    uf: 'SP',
    incapacidade: 'Menor Impúbere',
    respLegalNome: 'Ana Paula Mendes (Mãe)',
    respLegalCpf: '111.222.333-44',
    respLegalRg: '11.222.333-4',
    respLegalProfissao: 'Arquiteta',
    respLegalNacionalidade: 'Brasileiro(a)',
    respLegalEndereco: 'Rua Juscelino Kubitschek, 500 - Itaim Bibi - São Paulo/SP',
    email: 'anapaula.mendes@email.com', 
    fone: '(11) 97766-5544', 
    processosCount: 0, 
    prioritario: false, 
    chaveAtiva: false, 
    comProcesso: false, 
    cadastradoEsteMes: true,
    anotacoes: 'Representado por sua genitora Ana Paula Mendes para ação de alimentos.',
    dataCadastro: '15/08/2026'
  },
];

const mockProcessosData = [
  { id: 'p1', cnj: '0001234-56.2026.8.26.0100', clienteId: '1', cliente: 'Carlos Eduardo Silva', assunto: 'Ação de Cobrança c/c Indenização', vara: '2ª Vara Cível - Foro Central', status: 'Em andamento' },
  { id: 'p2', cnj: '0005544-11.2025.8.26.0100', clienteId: '1', cliente: 'Carlos Eduardo Silva', assunto: 'Execução de Título Extrajudicial', vara: '4ª Vara Cível', status: 'Em andamento' },
  { id: 'p3', cnj: '0098765-43.2025.8.26.0000', clienteId: '2', cliente: 'Tech Solutions Ltda', assunto: 'Recurso de Apelação Cível', vara: '3ª Câmara de Direito Privado', status: 'Em andamento' },
  { id: 'p4', cnj: '0004321-12.2024.8.16.0014', clienteId: '3', cliente: 'Maria Fernanda Oliveira', assunto: 'Revisão Contratual Bancária', vara: '1ª Vara Cível de Londrina', status: 'Concluído' },
];

const mockTarefasData = [
  { id: 't1', titulo: 'Elaborar Réplica à Contestação', clienteId: '1', cliente: 'Carlos Eduardo Silva', vencimento: '18/08/2026', urgencia: true, status: 'Pendente' },
  { id: 't2', titulo: 'Juntar Procuração e Guias', clienteId: '2', cliente: 'Tech Solutions Ltda', vencimento: '20/08/2026', urgencia: false, status: 'Pendente' },
  { id: 't3', titulo: 'Conferir Depósito Judicial', clienteId: '3', cliente: 'Maria Fernanda Oliveira', vencimento: '15/08/2026', urgencia: false, status: 'Concluída' },
];

export default function ClientesPage() {
  const [clientes, setClientes] = useState(initialClientes);
  const [activeFilter, setActiveFilter] = useState('todos');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modals state
  const [showFormModal, setShowFormModal] = useState(false);
  const [selectedClienteToEdit, setSelectedClienteToEdit] = useState(null);
  const [selectedClienteFicha, setSelectedClienteFicha] = useState(null);
  const [toast, setToast] = useState(null);

  // Alphabetical sort (A-Z) and search filtering
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
    setSelectedClienteToEdit(null);
    setShowFormModal(true);
  };

  const handleOpenEditModal = (cli) => {
    setSelectedClienteToEdit(cli);
    setShowFormModal(true);
  };

  const handleSaveCliente = (formData) => {
    if (selectedClienteToEdit) {
      // Update existing
      setClientes((prev) =>
        prev.map((c) => (c.id === selectedClienteToEdit.id ? { ...c, ...formData } : c))
      );
      setToast(`Dados de "${formData.nome}" atualizados com sucesso!`);
      if (selectedClienteFicha && selectedClienteFicha.id === selectedClienteToEdit.id) {
        setSelectedClienteFicha((prev) => ({ ...prev, ...formData }));
      }
    } else {
      // Create new
      const newId = String(Date.now());
      const now = new Date();
      const dateStr = `${String(now.getDate()).padStart(2, '0')}/${String(now.getMonth() + 1).padStart(2, '0')}/${now.getFullYear()}`;
      const newClient = {
        ...formData,
        id: newId,
        processosCount: 0,
        comProcesso: false,
        chaveAtiva: true,
        cadastradoEsteMes: true,
        dataCadastro: dateStr,
      };
      setClientes((prev) => [...prev, newClient]);
      setToast(`Cliente "${formData.nome}" cadastrado com sucesso!`);
    }
    setShowFormModal(false);
  };

  const handleDeleteCliente = (clienteId) => {
    const cliObj = clientes.find((c) => c.id === clienteId);
    setClientes((prev) => prev.filter((c) => c.id !== clienteId));
    setToast(`Cliente "${cliObj?.nome || ''}" removido da base com sucesso.`);
    if (selectedClienteFicha && selectedClienteFicha.id === clienteId) {
      setSelectedClienteFicha(null);
    }
  };

  const handleSaveAnotacoes = (clienteId, novasAnotacoes) => {
    setClientes((prev) =>
      prev.map((c) => (c.id === clienteId ? { ...c, anotacoes: novasAnotacoes } : c))
    );
    setToast('Anotações salvas com sucesso!');
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
              <Star size={18} />
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
                  <tr key={cli.id} style={{ borderBottom: '1px solid #162035', transition: 'background-color 0.15s ease' }}>
                    <td style={{ padding: '16px 20px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {cli.prioritario && (
                          <Star size={15} color="#F59E0B" fill="#F59E0B" title="Cliente Prioritário" />
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
                      <button
                        type="button"
                        style={{ color: '#3B82F6', fontWeight: 600, fontSize: '0.82rem' }}
                        onClick={() => setSelectedClienteFicha(cli)}
                      >
                        Ver ficha →
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal Form: Criar / Editar Cliente */}
      <FormClienteModal
        isOpen={showFormModal}
        onClose={() => setShowFormModal(false)}
        onSave={handleSaveCliente}
        initialData={selectedClienteToEdit}
      />

      {/* Modal Ficha: Dossiê Completo do Cliente */}
      <FichaClienteModal
        isOpen={!!selectedClienteFicha}
        onClose={() => setSelectedClienteFicha(null)}
        cliente={selectedClienteFicha}
        onEdit={(cli) => {
          setSelectedClienteFicha(null);
          handleOpenEditModal(cli);
        }}
        onDelete={(id) => handleDeleteCliente(id)}
        onSaveAnotacoes={handleSaveAnotacoes}
        mockProcessos={mockProcessosData}
        mockTarefas={mockTarefasData}
      />

      <ToastNotification message={toast} onClose={() => setToast(null)} />
    </div>
  );
}
