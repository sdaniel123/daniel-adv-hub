// Store for Processos and Andamentos

export const initialProcessosData = [
  { 
    id: '1', 
    cnj: '0001234-56.2026.8.26.0100', 
    clientes: [
      { id: '1', nome: 'Carlos Eduardo Silva' }
    ], 
    dataProtocolo: '2026-08-10', // YYYY-MM-DD para ordenação precisa
    dataProtocoloFmt: '10/08/2026',
    tramitacao: '2ª Vara Cível - Comarca de São Paulo/SP',
    sistema: 'PJe', 
    assunto: 'Ação de Cobrança c/c Indenização por Danos Morais', 
    valorCausa: 'R$ 45.000,00',
    prioritario: true, 
    status: 'Em andamento', // 'Em andamento' | 'Com audiência' | 'Encerrado' | 'Arquivado'
    comAudiencia: true, 
    encerado: false, 
    arquivado: false,
    
    // Dados completos da Parte Contrária
    parteContrariaNome: 'Banco Financeiro S.A.',
    parteContrariaDoc: '00.111.222/0001-33',
    parteContrariaProfissao: 'Instituição Financeira',
    parteContrariaNacionalidade: 'Brasileiro(a)',
    parteContrariaCep: '01310-100',
    parteContrariaLogradouro: 'Avenida Paulista',
    parteContrariaNumero: '1000',
    parteContrariaBairro: 'Bela Vista',
    parteContrariaCidade: 'São Paulo',
    parteContrariaUf: 'SP',

    anotacoes: 'Audiência de conciliação designada para a próxima semana. Aguardando contestação.',
    dataCadastro: '10/08/2026',

    // Andamentos Processuais
    andamentos: [
      { id: 'a1', data: '12/08/2026', descricao: 'Juntada de petição de especificação de provas pelo autor.' },
      { id: 'a2', data: '10/08/2026', descricao: 'Distribuição realizada com sucesso no sistema PJe.' }
    ]
  },
  { 
    id: '2', 
    cnj: '0098765-43.2025.8.26.0000', 
    clientes: [
      { id: '2', nome: 'Tech Solutions Ltda' }
    ], 
    dataProtocolo: '2025-11-20',
    dataProtocoloFmt: '20/11/2025',
    tramitacao: '3ª Câmara de Direito Privado - TJSP',
    sistema: 'EProc', 
    assunto: 'Recurso de Apelação Cível em Contrato de Prestação de Serviços', 
    valorCausa: 'R$ 120.000,00',
    prioritario: false, 
    status: 'Em andamento', 
    comAudiencia: false, 
    encerado: false, 
    arquivado: false,

    parteContrariaNome: 'Mega Distribuidora de Eletrônicos Ltda',
    parteContrariaDoc: '99.888.777/0001-66',
    parteContrariaProfissao: 'Comércio Atacadista',
    parteContrariaNacionalidade: 'Brasileiro(a)',
    parteContrariaCep: '13020-000',
    parteContrariaLogradouro: 'Rua Barão de Jaguara',
    parteContrariaNumero: '850',
    parteContrariaBairro: 'Centro',
    parteContrariaCidade: 'Campinas',
    parteContrariaUf: 'SP',

    anotacoes: 'Autos remetidos ao Desembargador Relator para elaboração do voto.',
    dataCadastro: '20/11/2025',

    andamentos: [
      { id: 'a3', data: '05/01/2026', descricao: 'Conclusos ao Relator para parecer e julgamento.' }
    ]
  },
  { 
    id: '3', 
    cnj: '0004321-12.2024.8.16.0014', 
    clientes: [
      { id: '3', nome: 'Maria Fernanda Oliveira' }
    ], 
    dataProtocolo: '2024-05-15',
    dataProtocoloFmt: '15/05/2024',
    tramitacao: '1ª Vara Cível - Comarca de Londrina/PR',
    sistema: 'Projudi', 
    assunto: 'Ação de Revisão Contratual Bancária', 
    valorCausa: 'R$ 35.000,00',
    prioritario: true, 
    status: 'Arquivado', 
    comAudiencia: false, 
    encerado: true, 
    arquivado: true,

    parteContrariaNome: 'Banco Crédito Rápido S.A.',
    parteContrariaDoc: '11.222.333/0001-44',
    parteContrariaProfissao: 'Instituição Financeira',
    parteContrariaNacionalidade: 'Brasileiro(a)',
    parteContrariaCep: '86010-000',
    parteContrariaLogradouro: 'Rua Sergipe',
    parteContrariaNumero: '300',
    parteContrariaBairro: 'Centro',
    parteContrariaCidade: 'Londrina',
    parteContrariaUf: 'PR',

    anotacoes: 'Processo arquivado definitivamente após trânsito em julgado e pagamento de custas.',
    dataCadastro: '15/05/2024',

    andamentos: [
      { id: 'a4', data: '10/06/2025', descricao: 'Arquivamento definitivo dos autos.' }
    ]
  },
];
