import { supabase } from './supabaseClient';

export async function fetchTarefas() {
  try {
    const { data, error } = await supabase
      .from('tarefas')
      .select('*, processos(cnj), clientes(nome)')
      .order('prazo', { ascending: true });

    if (error) {
      console.error('Erro ao buscar tarefas no Supabase:', error);
      return [];
    }

    return (data || []).map((db) => ({
      id: db.id,
      tipo: db.tipo || 'Pendente',
      prazo: db.prazo || '',
      processoId: db.processo_id || '',
      processo: db.processos ? db.processos.cnj : '',
      clienteId: db.cliente_id || '',
      cliente: db.clientes ? db.clientes.nome : '',
      anotacoes: db.anotacoes || '',
      urgente: Boolean(db.urgente),
      status: db.status || 'Pendente',
      dataCriacao: db.created_at ? db.created_at.slice(0, 10) : ''
    }));
  } catch (err) {
    console.error('Falha de conexão com Supabase:', err);
    return [];
  }
}

export async function createTarefa(payload) {
  try {
    const dbData = {
      tipo: payload.tipo,
      prazo: payload.prazo,
      processo_id: payload.processoId || null,
      cliente_id: payload.clienteId || null,
      anotacoes: payload.anotacoes || null,
      urgente: Boolean(payload.urgente),
      status: payload.status || 'Pendente'
    };

    const { data, error } = await supabase
      .from('tarefas')
      .insert([dbData])
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (err) {
    console.error('Erro ao criar tarefa no Supabase:', err);
    throw err;
  }
}

export async function updateTarefaStatus(id, status) {
  try {
    const { error } = await supabase
      .from('tarefas')
      .update({ status })
      .eq('id', id);

    if (error) throw error;
    return true;
  } catch (err) {
    console.error('Erro ao atualizar status da tarefa:', err);
    throw err;
  }
}

export async function deleteTarefa(id) {
  try {
    const { error } = await supabase
      .from('tarefas')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return true;
  } catch (err) {
    console.error('Erro ao deletar tarefa:', err);
    throw err;
  }
}

export async function fetchTiposTarefas() {
  try {
    const { data, error } = await supabase
      .from('tipos_tarefas')
      .select('*')
      .order('nome', { ascending: true });

    if (error) {
      console.error('Erro ao buscar tipos de tarefas:', error);
      return defaultTiposTarefas;
    }
    if (!data || data.length === 0) return defaultTiposTarefas;
    return data;
  } catch (err) {
    return defaultTiposTarefas;
  }
}

export function getTiposTarefasSalvos() {
  return defaultTiposTarefas;
}

export function salvarTiposTarefas(list) {
  return list;
}

export const initialTarefasData = [];
export const initialTiposTarefas = defaultTiposTarefas;

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

export function formatarDataExibicao(dateStr) {
  if (!dateStr) return '-';
  if (dateStr.includes('/')) return dateStr;
  const d = parseDate(dateStr);
  const dia = String(d.getDate()).padStart(2, '0');
  const mes = String(d.getMonth() + 1).padStart(2, '0');
  const ano = d.getFullYear();
  return `${dia}/${mes}/${ano}`;
}

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

export function ordenarTarefas(tarefas) {
  return [...tarefas].sort((a, b) => {
    if (a.urgente && !b.urgente) return -1;
    if (!a.urgente && b.urgente) return 1;

    const dataA = parseDate(a.prazo).getTime();
    const dataB = parseDate(b.prazo).getTime();

    return dataA - dataB;
  });
}
