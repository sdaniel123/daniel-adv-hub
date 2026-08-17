// Central store and helpers for Tasks (Tarefas e Prazos) and Task Types (Tipos de Tarefas)

export const initialTiposTarefas = [
  { id: 'tipo-1', nome: 'Elaborar Petição / Réplica' },
  { id: 'tipo-2', nome: 'Protocolar Recurso / Agravo' },
  { id: 'tipo-3', nome: 'Juntar Procuração / Guias' },
  { id: 'tipo-4', nome: 'Solicitar Guia de Custas' },
  { id: 'tipo-5', nome: 'Audiência de Conciliação / Instrução' },
  { id: 'tipo-6', nome: 'Contestar Ação Judicial' },
  { id: 'tipo-7', nome: 'Atendimento ao Cliente / Reunião' },
  { id: 'tipo-8', nome: 'Conferir Depósito Judicial' }
];

export const initialTarefasData = [
  {
    id: 't-1',
    tipo: 'Elaborar Petição / Réplica',
    prazo: '2026-08-18', // YYYY-MM-DD para alta precisão
    processoId: '1',
    processo: '0001234-56.2026.8.26.0100',
    clienteId: '1',
    cliente: 'Carlos Eduardo Silva',
    anotacoes: 'Analisar preliminares de contestação apresentadas pelo réu e juntar documentos comprobatórios.',
    urgente: true,
    status: 'Pendente', // 'Pendente' | 'Em andamento' | 'Concluída' | 'Arquivada'
    dataCriacao: '2026-08-10'
  },
  {
    id: 't-2',
    tipo: 'Protocolar Recurso / Agravo',
    prazo: '2026-08-17',
    processoId: '2',
    processo: '0098765-43.2025.8.26.0000',
    clienteId: '2',
    cliente: 'Tech Solutions Ltda',
    anotacoes: 'Protocolar agravo de instrumento contra decisão interlocutória que indeferiu a tutela de urgência.',
    urgente: true,
    status: 'Em andamento',
    dataCriacao: '2026-08-11'
  },
  {
    id: 't-3',
    tipo: 'Solicitar Guia de Custas',
    prazo: '2026-08-22',
    processoId: '3',
    processo: '0004321-12.2024.8.16.0014',
    clienteId: '3',
    cliente: 'Maria Fernanda Oliveira',
    anotacoes: 'Emitir guia de custas finais no portal do TJPR e encaminhar ao cliente para pagamento.',
    urgente: false,
    status: 'Pendente',
    dataCriacao: '2026-08-12'
  },
  {
    id: 't-4',
    tipo: 'Juntar Procuração / Guias',
    prazo: '2026-08-12',
    processoId: '1',
    processo: '0001234-56.2026.8.26.0100',
    clienteId: '1',
    cliente: 'Carlos Eduardo Silva',
    anotacoes: 'Procuração com poderes específicos juntada com sucesso nos autos.',
    urgente: false,
    status: 'Concluída',
    dataCriacao: '2026-08-08'
  }
];

// Helper: Converter strings de data (YYYY-MM-DD ou DD/MM/YYYY) para objeto Date
export function parseDate(dateStr) {
  if (!dateStr) return new Date();
  if (dateStr.includes('/')) {
    const parts = dateStr.split('/');
    if (parts.length === 3) {
      return new Date(parseInt(parts[2], 10), parseInt(parts[1], 10) - 1, parseInt(parts[0], 10));
    }
  }
  const [y, m, d] = dateStr.split('-');
  return new Date(parseInt(y, 10), parseInt(m, 10) - 1, parseInt(d, 10));
}

// Helper: Formatar data para exibição PT-BR (DD/MM/AAAA)
export function formatarDataExibicao(dateStr) {
  if (!dateStr) return '-';
  if (dateStr.includes('/')) return dateStr;
  const d = parseDate(dateStr);
  const dia = String(d.getDate()).padStart(2, '0');
  const mes = String(d.getMonth() + 1).padStart(2, '0');
  const ano = d.getFullYear();
  return `${dia}/${mes}/${ano}`;
}

// Helper: Calcular status do prazo (Ex: Vence em X dias / Vencida há X dias)
export function calcularStatusPrazo(prazoStr, status) {
  if (status === 'Concluída' || status === 'Arquivada') {
    return {
      texto: status,
      badgeClass: 'badge-success',
      isVencida: false,
      diffDias: 0
    };
  }

  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);

  const dataPrazo = parseDate(prazoStr);
  dataPrazo.setHours(0, 0, 0, 0);

  const diffTime = dataPrazo.getTime() - hoje.getTime();
  const diffDias = Math.round(diffTime / (1000 * 3600 * 24));

  if (diffDias < 0) {
    const diasAtraso = Math.abs(diffDias);
    return {
      texto: `Vencida há ${diasAtraso} ${diasAtraso === 1 ? 'dia' : 'dias'}`,
      badgeClass: 'badge-danger',
      isVencida: true,
      diffDias
    };
  } else if (diffDias === 0) {
    return {
      texto: 'Vence HOJE!',
      badgeClass: 'badge-warning',
      isVencida: false,
      diffDias
    };
  } else if (diffDias === 1) {
    return {
      texto: 'Vence amanhã',
      badgeClass: 'badge-warning',
      isVencida: false,
      diffDias
    };
  } else {
    return {
      texto: `Vence em ${diffDias} dias`,
      badgeClass: diffDias <= 3 ? 'badge-warning' : 'badge-primary',
      isVencida: false,
      diffDias
    };
  }
}

// Helper: Ordenar tarefas por vencimento (mais perto para mais longe) e urgência
export function ordenarTarefas(tarefas) {
  return [...tarefas].sort((a, b) => {
    // 1º Crivo: Urgência (urgentes primeiro)
    if (a.urgente && !b.urgente) return -1;
    if (!a.urgente && b.urgente) return 1;

    // 2º Crivo: Data de Vencimento (mais recente/próximo primeiro)
    const dataA = parseDate(a.prazo).getTime();
    const dataB = parseDate(b.prazo).getTime();

    return dataA - dataB;
  });
}

// Persistência em LocalStorage (com fallback)
const STORAGE_KEY_TAREFAS = 'daniel_adv_tarefas_v1';
const STORAGE_KEY_TIPOS = 'daniel_adv_tipos_tarefas_v1';

export function getTarefasSalvas() {
  if (typeof window === 'undefined') return initialTarefasData;
  try {
    const saved = localStorage.getItem(STORAGE_KEY_TAREFAS);
    if (saved) return JSON.parse(saved);
  } catch (e) {
    console.error('Erro ao ler tarefas salvas:', e);
  }
  return initialTarefasData;
}

export function salvarTarefas(tarefas) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY_TAREFAS, JSON.stringify(tarefas));
  } catch (e) {
    console.error('Erro ao salvar tarefas:', e);
  }
}

export function getTiposTarefasSalvos() {
  if (typeof window === 'undefined') return initialTiposTarefas;
  try {
    const saved = localStorage.getItem(STORAGE_KEY_TIPOS);
    if (saved) return JSON.parse(saved);
  } catch (e) {
    console.error('Erro ao ler tipos de tarefas:', e);
  }
  return initialTiposTarefas;
}

export function salvarTiposTarefas(tipos) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY_TIPOS, JSON.stringify(tipos));
  } catch (e) {
    console.error('Erro ao salvar tipos de tarefas:', e);
  }
}
