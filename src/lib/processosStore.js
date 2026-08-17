import { supabase } from './supabaseClient';

export function mapProcessoDbToFrontend(dbRow) {
  if (!dbRow) return null;
  return {
    id: dbRow.id,
    cnj: dbRow.cnj || '',
    clienteId: dbRow.cliente_id || '',
    clientes: dbRow.clientes ? [{ id: dbRow.clientes.id, nome: dbRow.clientes.nome }] : [],
    dataProtocolo: dbRow.data_protocolo || '',
    dataProtocoloFmt: dbRow.data_protocolo ? new Date(dbRow.data_protocolo + 'T00:00:00').toLocaleDateString('pt-BR') : '',
    tramitacao: dbRow.tramitacao || '',
    sistema: dbRow.sistema || '',
    assunto: dbRow.assunto || '',
    valorCausa: dbRow.valor_causa || '',
    prioritario: Boolean(dbRow.prioritario),
    status: dbRow.status || 'Em andamento',
    comAudiencia: Boolean(dbRow.com_audiencia),
    encerado: Boolean(dbRow.encerrado),
    arquivado: Boolean(dbRow.arquivado),
    parteContrariaNome: dbRow.parte_contraria_nome || '',
    parteContrariaDoc: dbRow.parte_contraria_doc || '',
    parteContrariaProfissao: dbRow.parte_contraria_profissao || '',
    parteContrariaNacionalidade: dbRow.parte_contraria_nacionalidade || 'Brasileiro(a)',
    parteContrariaCep: dbRow.parte_contraria_cep || '',
    parteContrariaLogradouro: dbRow.parte_contraria_logradouro || '',
    parteContrariaNumero: dbRow.parte_contraria_numero || '',
    parteContrariaBairro: dbRow.parte_contraria_bairro || '',
    parteContrariaCidade: dbRow.parte_contraria_cidade || '',
    parteContrariaUf: dbRow.parte_contraria_uf || '',
    anotacoes: dbRow.anotacoes || '',
    dataCadastro: dbRow.created_at ? new Date(dbRow.created_at).toLocaleDateString('pt-BR') : '',
    andamentos: (dbRow.andamentos || []).map((a) => ({
      id: a.id,
      data: a.data ? new Date(a.data + 'T00:00:00').toLocaleDateString('pt-BR') : '',
      descricao: a.descricao
    }))
  };
}

export function mapProcessoFrontendToDb(data) {
  return {
    cnj: data.cnj,
    cliente_id: data.clienteId || (data.clientes && data.clientes[0] ? data.clientes[0].id : null),
    data_protocolo: data.dataProtocolo || null,
    tramitacao: data.tramitacao || null,
    sistema: data.sistema || null,
    assunto: data.assunto || null,
    valor_causa: data.valorCausa || null,
    prioritario: Boolean(data.prioritario),
    status: data.status || 'Em andamento',
    com_audiencia: Boolean(data.comAudiencia),
    encerrado: Boolean(data.encerado),
    arquivado: Boolean(data.arquivado),
    parte_contraria_nome: data.parteContrariaNome || null,
    parte_contraria_doc: data.parteContrariaDoc || null,
    parte_contraria_profissao: data.parteContrariaProfissao || null,
    parte_contraria_nacionalidade: data.parteContrariaNacionalidade || 'Brasileiro(a)',
    parte_contraria_cep: data.parteContrariaCep || null,
    parte_contraria_logradouro: data.parteContrariaLogradouro || null,
    parte_contraria_numero: data.parteContrariaNumero || null,
    parte_contraria_bairro: data.parteContrariaBairro || null,
    parte_contraria_cidade: data.parteContrariaCidade || null,
    parte_contraria_uf: data.parteContrariaUf || null,
    anotacoes: data.anotacoes || null
  };
}

export async function fetchProcessos() {
  try {
    const { data, error } = await supabase
      .from('processos')
      .select('*, clientes(id, nome), andamentos(*)')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Erro ao buscar processos no Supabase:', error);
      return [];
    }

    return (data || []).map(mapProcessoDbToFrontend);
  } catch (err) {
    console.error('Falha de conexão com Supabase:', err);
    return [];
  }
}

export async function fetchProcessoById(id) {
  try {
    const { data, error } = await supabase
      .from('processos')
      .select('*, clientes(id, nome), andamentos(*)')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Erro ao buscar processo por ID:', error);
      return null;
    }

    return mapProcessoDbToFrontend(data);
  } catch (err) {
    console.error('Falha ao buscar processo:', err);
    return null;
  }
}

export async function createProcesso(processoData) {
  try {
    const dbPayload = mapProcessoFrontendToDb(processoData);
    const { data, error } = await supabase
      .from('processos')
      .insert([dbPayload])
      .select('*, clientes(id, nome)')
      .single();

    if (error) throw error;

    // Se houver um andamento inicial no cadastro
    if (processoData.andamentos && processoData.andamentos.length > 0) {
      const firstAndamento = processoData.andamentos[0];
      await supabase.from('andamentos').insert([{
        processo_id: data.id,
        data: new Date().toISOString().slice(0, 10),
        descricao: firstAndamento.descricao || 'Cadastro inicial do processo no sistema.'
      }]);
    }

    return fetchProcessoById(data.id);
  } catch (err) {
    console.error('Erro ao criar processo no Supabase:', err);
    throw err;
  }
}

export async function updateProcesso(id, processoData) {
  try {
    const dbPayload = mapProcessoFrontendToDb(processoData);
    const { data, error } = await supabase
      .from('processos')
      .update(dbPayload)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return fetchProcessoById(data.id);
  } catch (err) {
    console.error('Erro ao atualizar processo:', err);
    throw err;
  }
}

export async function addAndamento(processoId, descricao, dataStr) {
  try {
    const dateFormatted = dataStr || new Date().toISOString().slice(0, 10);
    const { data, error } = await supabase
      .from('andamentos')
      .insert([{
        processo_id: processoId,
        data: dateFormatted,
        descricao: descricao
      }])
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (err) {
    console.error('Erro ao adicionar andamento:', err);
    throw err;
  }
}

export async function deleteProcesso(id) {
  try {
    const { error } = await supabase
      .from('processos')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return true;
  } catch (err) {
    console.error('Erro ao deletar processo:', err);
    throw err;
  }
}

// Fallback vazio sem dados mock
export const initialProcessosData = [];
