import { supabase } from './supabaseClient';

export async function fetchFinanceiroLancamentos() {
  try {
    const { data, error } = await supabase
      .from('financeiro_lancamentos')
      .select('*, clientes(nome), processos(cnj)')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Erro ao buscar lançamentos financeiros:', error);
      return [];
    }

    return (data || []).map((db) => ({
      id: db.id,
      descricao: db.descricao || '',
      tipo: db.tipo || 'Receita',
      valor: Number(db.valor) || 0,
      dataVencimento: db.data_vencimento || '',
      dataPagamento: db.data_pagamento || '',
      status: db.status || 'Pendente',
      clienteId: db.cliente_id || '',
      cliente: db.clientes ? db.clientes.nome : '',
      processoId: db.processo_id || '',
      processo: db.processos ? db.processos.cnj : '',
      categoria: db.categoria || '',
      anotacoes: db.anotacoes || ''
    }));
  } catch (err) {
    console.error('Falha de conexão com Supabase:', err);
    return [];
  }
}

export async function createFinanceiroLancamento(payload) {
  try {
    const dbData = {
      descricao: payload.descricao,
      tipo: payload.tipo || 'Receita',
      valor: parseFloat(String(payload.valor).replace('.', '').replace(',', '.')) || 0,
      data_vencimento: payload.dataVencimento || null,
      status: payload.status || 'Pendente',
      cliente_id: payload.clienteId || null,
      processo_id: payload.processoId || null,
      categoria: payload.categoria || null,
      anotacoes: payload.anotacoes || null
    };

    const { data, error } = await supabase
      .from('financeiro_lancamentos')
      .insert([dbData])
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (err) {
    console.error('Erro ao criar lançamento financeiro:', err);
    throw err;
  }
}
