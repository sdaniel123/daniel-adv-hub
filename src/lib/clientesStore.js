import { supabase } from './supabaseClient';

// Helper to map DB row (snake_case) to Frontend camelCase object
export function mapClienteDbToFrontend(dbRow) {
  if (!dbRow) return null;
  return {
    id: dbRow.id,
    nome: dbRow.nome || '',
    tipo: dbRow.tipo || 'Pessoa Física',
    documento: dbRow.documento || '',
    rg: dbRow.rg || '',
    profissao: dbRow.profissao || '',
    nacionalidade: dbRow.nacionalidade || 'Brasileiro(a)',
    cep: dbRow.cep || '',
    logradouro: dbRow.logradouro || '',
    numero: dbRow.numero || '',
    complemento: dbRow.complemento || '',
    bairro: dbRow.bairro || '',
    cidade: dbRow.cidade || '',
    uf: dbRow.uf || '',
    email: dbRow.email || '',
    fone: dbRow.fone || '',
    processosCount: dbRow.processosCount || 0,
    prioritario: Boolean(dbRow.prioritario),
    chaveAtiva: Boolean(dbRow.chave_ativa),
    comProcesso: Boolean(dbRow.com_processo),
    cadastradoEsteMes: Boolean(dbRow.cadastrado_este_mes),
    incapacidade: dbRow.incapacidade || 'Capaz',
    respEmpresaNome: dbRow.resp_empresa_nome || '',
    respEmpresaCpf: dbRow.resp_empresa_cpf || '',
    respEmpresaEndereco: dbRow.resp_empresa_endereco || '',
    respLegalNome: dbRow.resp_legal_nome || '',
    respLegalCpf: dbRow.resp_legal_cpf || '',
    respLegalRg: dbRow.resp_legal_rg || '',
    respLegalProfissao: dbRow.resp_legal_profissao || '',
    respLegalNacionalidade: dbRow.resp_legal_nacionalidade || '',
    respLegalEndereco: dbRow.resp_legal_endereco || '',
    anotacoes: dbRow.anotacoes || '',
    dataCadastro: dbRow.created_at ? new Date(dbRow.created_at).toLocaleDateString('pt-BR') : ''
  };
}

// Helper to map Frontend camelCase to DB snake_case object
export function mapClienteFrontendToDb(data) {
  return {
    nome: data.nome,
    tipo: data.tipo || 'Pessoa Física',
    documento: data.documento || null,
    rg: data.rg || null,
    profissao: data.profissao || null,
    nacionalidade: data.nacionalidade || 'Brasileiro(a)',
    cep: data.cep || null,
    logradouro: data.logradouro || null,
    numero: data.numero || null,
    complemento: data.complemento || null,
    bairro: data.bairro || null,
    cidade: data.cidade || null,
    uf: data.uf || null,
    email: data.email || null,
    fone: data.fone || null,
    prioritario: Boolean(data.prioritario),
    chave_ativa: data.chaveAtiva !== undefined ? Boolean(data.chaveAtiva) : true,
    com_processo: Boolean(data.comProcesso),
    cadastrado_este_mes: data.cadastradoEsteMes !== undefined ? Boolean(data.cadastradoEsteMes) : true,
    incapacidade: data.incapacidade || 'Capaz',
    resp_empresa_nome: data.respEmpresaNome || null,
    resp_empresa_cpf: data.respEmpresaCpf || null,
    resp_empresa_endereco: data.respEmpresaEndereco || null,
    resp_legal_nome: data.respLegalNome || null,
    resp_legal_cpf: data.respLegalCpf || null,
    resp_legal_rg: data.respLegalRg || null,
    resp_legal_profissao: data.respLegalProfissao || null,
    resp_legal_nacionalidade: data.respLegalNacionalidade || null,
    resp_legal_endereco: data.respLegalEndereco || null,
    anotacoes: data.anotacoes || null
  };
}

// Store API
export async function fetchClientes() {
  try {
    const { data, error } = await supabase
      .from('clientes')
      .select('*')
      .order('nome', { ascending: true });

    if (error) {
      console.error('Erro ao buscar clientes no Supabase:', error);
      return [];
    }
    return (data || []).map(mapClienteDbToFrontend);
  } catch (err) {
    console.error('Falha de conexão com Supabase:', err);
    return [];
  }
}

export async function fetchClienteById(id) {
  try {
    const { data, error } = await supabase
      .from('clientes')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Erro ao buscar cliente por ID:', error);
      return null;
    }
    return mapClienteDbToFrontend(data);
  } catch (err) {
    console.error('Falha ao buscar cliente:', err);
    return null;
  }
}

export async function createCliente(clienteData) {
  try {
    const dbPayload = mapClienteFrontendToDb(clienteData);
    const { data, error } = await supabase
      .from('clientes')
      .insert([dbPayload])
      .select()
      .single();

    if (error) throw error;
    return mapClienteDbToFrontend(data);
  } catch (err) {
    console.error('Erro ao criar cliente no Supabase:', err);
    throw err;
  }
}

export async function updateCliente(id, clienteData) {
  try {
    const dbPayload = mapClienteFrontendToDb(clienteData);
    const { data, error } = await supabase
      .from('clientes')
      .update(dbPayload)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return mapClienteDbToFrontend(data);
  } catch (err) {
    console.error('Erro ao atualizar cliente:', err);
    throw err;
  }
}

export async function deleteCliente(id) {
  try {
    const { error } = await supabase
      .from('clientes')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return true;
  } catch (err) {
    console.error('Erro ao deletar cliente:', err);
    throw err;
  }
}

// Fallback vazio sem mocks
export const initialClientesData = [];
