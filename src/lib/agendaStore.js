// Central store and helpers for Audiências and Atendimentos

export const initialAudiencias = [
  {
    id: 'aud-1',
    dataHora: '2026-08-18T10:00',
    processoId: '1',
    processo: '0001234-56.2026.8.26.0100',
    cliente: 'Carlos Eduardo Silva',
    tipo: 'Presencial',
    local: '2ª Vara Cível - Foro Central de São Paulo/SP (Sala 204)',
    status: 'Agendada', // 'Agendada' | 'Realizada' | 'Não realizada' | 'Reagendada'
    anotacoes: 'Audiência de conciliação. Levar proposta de acordo aprovada pelo cliente.'
  },
  {
    id: 'aud-2',
    dataHora: '2026-08-20T14:30',
    processoId: '2',
    processo: '0098765-43.2025.8.26.0000',
    cliente: 'Tech Solutions Ltda',
    tipo: 'Online',
    local: 'https://teams.microsoft.com/l/meetup-join/audiencia-tjsp-123',
    status: 'Agendada',
    anotacoes: 'Sustentação oral no Agravo de Instrumento perante a 3ª Câmara Cível.'
  },
  {
    id: 'aud-3',
    dataHora: '2026-08-25T11:00',
    processoId: '3',
    processo: '0004321-12.2024.8.16.0014',
    cliente: 'Maria Fernanda Oliveira',
    tipo: 'Presencial',
    local: '1ª Vara Cível de Londrina/PR - Fórum Central',
    status: 'Realizada',
    anotacoes: 'Audiência de instrução finalizada. Processo concluso para sentença.'
  }
];

export const initialAtendimentos = [
  {
    id: 'atend-1',
    nomeAtendido: 'Carlos Eduardo Silva',
    dataHora: '2026-08-18T16:00',
    telefone: '(11) 98765-4321',
    descricao: 'Reunião de alinhamento pré-audiência e esclarecimento de dúvidas sobre a réplica.',
    status: 'Agendado' // 'Agendado' | 'Realizado' | 'Não realizado' | 'Reagendado'
  },
  {
    id: 'atend-2',
    nomeAtendido: 'Roberto Alencar (Tech Solutions)',
    dataHora: '2026-08-19T11:00',
    telefone: '(11) 3344-5566',
    descricao: 'Consulta jurídica sobre revisão contratual de fornecedores internacionais.',
    status: 'Agendado'
  },
  {
    id: 'atend-3',
    nomeAtendido: 'Ana Paula Mendes',
    dataHora: '2026-08-21T09:30',
    telefone: '(11) 97766-5544',
    descricao: 'Atendimento inicial para ação de alimentos em favor do menor Lucas Mendes.',
    status: 'Agendado'
  }
];

const DIAS_SEMANA = [
  'Domingo',
  'Segunda-feira',
  'Terça-feira',
  'Quarta-feira',
  'Quinta-feira',
  'Sexta-feira',
  'Sábado'
];

const MESES = [
  'Janeiro',
  'Fevereiro',
  'Março',
  'Abril',
  'Maio',
  'Junho',
  'Julho',
  'Agosto',
  'Setembro',
  'Outubro',
  'Novembro',
  'Dezembro'
];

// Helper: Formatar data/hora ISO (ex: 2026-08-18T10:00) para '18/08/2026 às 10:00'
export function formatarDataHoraExibicao(isoStr) {
  if (!isoStr) return '-';
  const d = new Date(isoStr);
  if (isNaN(d.getTime())) return isoStr;

  const dia = String(d.getDate()).padStart(2, '0');
  const mes = String(d.getMonth() + 1).padStart(2, '0');
  const ano = d.getFullYear();
  const hora = String(d.getHours()).padStart(2, '0');
  const minuto = String(d.getMinutes()).padStart(2, '0');

  return `${dia}/${mes}/${ano} às ${hora}:${minuto}`;
}

// Helper: Formatar apenas a hora (ex: 10:00)
export function formatarHoraExibicao(isoStr) {
  if (!isoStr) return '-';
  const d = new Date(isoStr);
  if (isNaN(d.getTime())) return isoStr;

  const hora = String(d.getHours()).padStart(2, '0');
  const minuto = String(d.getMinutes()).padStart(2, '0');
  return `${hora}:${minuto}`;
}

// Helper: Formatar cabeçalho por dia (ex: Segunda-feira, 18 de Agosto de 2026)
export function formatarCabecalhoDia(dateObjOrStr) {
  const d = typeof dateObjOrStr === 'string' ? new Date(dateObjOrStr) : dateObjOrStr;
  if (!d || isNaN(d.getTime())) return 'Data não especificada';

  const diaSemana = DIAS_SEMANA[d.getDay()];
  const diaMes = d.getDate();
  const mesNome = MESES[d.getMonth()];
  const ano = d.getFullYear();

  return `${diaSemana}, ${diaMes} de ${mesNome} de ${ano}`;
}

// Helper: Agrupar lista de compromissos por dia da semana (ordenados do mais perto ao mais longe)
export function agruparPorDiaSemana(itens) {
  // 1. Ordenar itens por dataHora cronologicamente
  const ordenados = [...itens].sort((a, b) => {
    const dataA = new Date(a.dataHora).getTime();
    const dataB = new Date(b.dataHora).getTime();
    return dataA - dataB;
  });

  // 2. Agrupar por data (YYYY-MM-DD)
  const gruposMap = new Map();

  ordenados.forEach((item) => {
    const d = new Date(item.dataHora);
    if (isNaN(d.getTime())) return;

    const dataKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

    if (!gruposMap.has(dataKey)) {
      gruposMap.set(dataKey, {
        dataKey,
        tituloDia: formatarCabecalhoDia(d),
        itens: []
      });
    }

    gruposMap.get(dataKey).itens.push(item);
  });

  return Array.from(gruposMap.values());
}

// Helper: Filtrar compromissos por período
export function filtrarPorPeriodo(itens, periodo, dataInicioCustom = '', dataFimCustom = '') {
  if (!periodo || periodo === 'todos') return itens;

  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);

  return itens.filter((item) => {
    const d = new Date(item.dataHora);
    if (isNaN(d.getTime())) return false;

    const itemDate = new Date(d.getFullYear(), d.getMonth(), d.getDate());

    if (periodo === 'hoje') {
      return itemDate.getTime() === hoje.getTime();
    }

    if (periodo === 'semana') {
      const diaSemana = hoje.getDay(); // 0 (Dom) a 6 (Sáb)
      const inicioSemana = new Date(hoje);
      inicioSemana.setDate(hoje.getDate() - diaSemana);
      const fimSemana = new Date(inicioSemana);
      fimSemana.setDate(inicioSemana.getDate() + 6);

      return itemDate.getTime() >= inicioSemana.getTime() && itemDate.getTime() <= fimSemana.getTime();
    }

    if (periodo === 'mes') {
      return d.getMonth() === hoje.getMonth() && d.getFullYear() === hoje.getFullYear();
    }

    if (periodo === 'proximos_30') {
      const em30Dias = new Date(hoje);
      em30Dias.setDate(hoje.getDate() + 30);
      return itemDate.getTime() >= hoje.getTime() && itemDate.getTime() <= em30Dias.getTime();
    }

    if (periodo === 'custom' && dataInicioCustom && dataFimCustom) {
      const ini = new Date(dataInicioCustom);
      ini.setHours(0, 0, 0, 0);
      const fim = new Date(dataFimCustom);
      fim.setHours(23, 59, 59, 999);

      return d.getTime() >= ini.getTime() && d.getTime() <= fim.getTime();
    }

    return true;
  });
}

// LocalStorage Persistence
const STORAGE_KEY_AUDIENCIAS = 'daniel_adv_audiencias_v1';
const STORAGE_KEY_ATENDIMENTOS = 'daniel_adv_atendimentos_v1';

export function getAudienciasSalvas() {
  if (typeof window === 'undefined') return initialAudiencias;
  try {
    const saved = localStorage.getItem(STORAGE_KEY_AUDIENCIAS);
    if (saved) return JSON.parse(saved);
  } catch (e) {
    console.error('Erro ao ler audiências salvas:', e);
  }
  return initialAudiencias;
}

export function salvarAudiencias(lista) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY_AUDIENCIAS, JSON.stringify(lista));
  } catch (e) {
    console.error('Erro ao salvar audiências:', e);
  }
}

export function getAtendimentosSalvos() {
  if (typeof window === 'undefined') return initialAtendimentos;
  try {
    const saved = localStorage.getItem(STORAGE_KEY_ATENDIMENTOS);
    if (saved) return JSON.parse(saved);
  } catch (e) {
    console.error('Erro ao ler atendimentos salvos:', e);
  }
  return initialAtendimentos;
}

export function salvarAtendimentos(lista) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY_ATENDIMENTOS, JSON.stringify(lista));
  } catch (e) {
    console.error('Erro ao salvar atendimentos:', e);
  }
}
