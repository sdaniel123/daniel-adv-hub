import { supabase } from './supabaseClient';

export async function fetchAudiencias() {
  try {
    const { data, error } = await supabase
      .from('audiencias')
      .select('*, processos(cnj), clientes(nome)')
      .order('data_hora', { ascending: true });

    if (error) {
      console.error('Erro ao buscar audiências no Supabase:', error);
      return [];
    }

    return (data || []).map((db) => ({
      id: db.id,
      dataHora: db.data_hora ? db.data_hora.slice(0, 16) : '',
      processoId: db.processo_id || '',
      processo: db.processos ? db.processos.cnj : '',
      clienteId: db.cliente_id || '',
      cliente: db.clientes ? db.clientes.nome : '',
      tipo: db.tipo || 'Presencial',
      local: db.local || '',
      status: db.status || 'Agendada',
      anotacoes: db.anotacoes || ''
    }));
  } catch (err) {
    console.error('Falha de conexão com Supabase:', err);
    return [];
  }
}

export async function createAudiencia(payload) {
  try {
    const dbData = {
      data_hora: payload.dataHora,
      processo_id: payload.processoId || null,
      cliente_id: payload.clienteId || null,
      tipo: payload.tipo || 'Presencial',
      local: payload.local || null,
      status: payload.status || 'Agendada',
      anotacoes: payload.anotacoes || null
    };

    const { data, error } = await supabase
      .from('audiencias')
      .insert([dbData])
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (err) {
    console.error('Erro ao salvar audiência:', err);
    throw err;
  }
}

export async function updateAudienciaStatus(id, status) {
  try {
    const { error } = await supabase
      .from('audiencias')
      .update({ status })
      .eq('id', id);

    if (error) throw error;
    return true;
  } catch (err) {
    console.error('Erro ao atualizar status da audiência:', err);
    throw err;
  }
}

export async function fetchAtendimentos() {
  try {
    const { data, error } = await supabase
      .from('atendimentos')
      .select('*, clientes(nome)')
      .order('data_hora', { ascending: true });

    if (error) {
      console.error('Erro ao buscar atendimentos no Supabase:', error);
      return [];
    }

    return (data || []).map((db) => ({
      id: db.id,
      nomeAtendido: db.nome_atendido || (db.clientes ? db.clientes.nome : ''),
      clienteId: db.cliente_id || '',
      dataHora: db.data_hora ? db.data_hora.slice(0, 16) : '',
      telefone: db.telefone || '',
      descricao: db.descricao || '',
      status: db.status || 'Agendado'
    }));
  } catch (err) {
    console.error('Falha de conexão com Supabase:', err);
    return [];
  }
}

export async function createAtendimento(payload) {
  try {
    const dbData = {
      cliente_id: payload.clienteId || null,
      nome_atendido: payload.nomeAtendido,
      data_hora: payload.dataHora,
      telefone: payload.telefone || null,
      descricao: payload.descricao || null,
      status: payload.status || 'Agendado'
    };

    const { data, error } = await supabase
      .from('atendimentos')
      .insert([dbData])
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (err) {
    console.error('Erro ao salvar atendimento:', err);
    throw err;
  }
}

export async function updateAtendimentoStatus(id, status) {
  try {
    const { error } = await supabase
      .from('atendimentos')
      .update({ status })
      .eq('id', id);

    if (error) throw error;
    return true;
  } catch (err) {
    console.error('Erro ao atualizar status do atendimento:', err);
    throw err;
  }
}

// Fallback arrays vazios
export const initialAudiencias = [];
export const initialAtendimentos = [];

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

export function formatarHoraExibicao(isoStr) {
  if (!isoStr) return '-';
  const d = new Date(isoStr);
  if (isNaN(d.getTime())) return isoStr;

  const hora = String(d.getHours()).padStart(2, '0');
  const minuto = String(d.getMinutes()).padStart(2, '0');
  return `${hora}:${minuto}`;
}

export function formatarCabecalhoDia(dateObjOrStr) {
  const d = typeof dateObjOrStr === 'string' ? new Date(dateObjOrStr) : dateObjOrStr;
  if (!d || isNaN(d.getTime())) return 'Data não especificada';

  const diaSemana = DIAS_SEMANA[d.getDay()];
  const diaMes = d.getDate();
  const mesNome = MESES[d.getMonth()];
  const ano = d.getFullYear();

  return `${diaSemana}, ${diaMes} de ${mesNome} de ${ano}`;
}

export function agruparPorDiaSemana(itens) {
  const ordenados = [...itens].sort((a, b) => {
    const dataA = new Date(a.dataHora).getTime();
    const dataB = new Date(b.dataHora).getTime();
    return dataA - dataB;
  });

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
      const diaSemana = hoje.getDay();
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
