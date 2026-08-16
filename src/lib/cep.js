// Helper utilities for formatters and ViaCEP API

export function maskCpfCnpj(value = '') {
  const clean = value.replace(/\D/g, '');
  if (clean.length <= 11) {
    return clean
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
  }
  return clean
    .slice(0, 14)
    .replace(/^(\d{2})(\d)/, '$1.$2')
    .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
    .replace(/\.(\d{3})(\d)/, '.$1/$2')
    .replace(/(\d{4})(\d{1,2})$/, '$1-$2');
}

export function maskPhone(value = '') {
  const clean = value.replace(/\D/g, '');
  if (clean.length <= 10) {
    return clean
      .replace(/^(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{4})(\d)/, '$1-$2');
  }
  return clean
    .slice(0, 11)
    .replace(/^(\d{2})(\d)/, '($1) $2')
    .replace(/(\d{5})(\d)/, '$1-$2');
}

export function maskCep(value = '') {
  const clean = value.replace(/\D/g, '').slice(0, 8);
  return clean.replace(/^(\d{5})(\d)/, '$1-$2');
}

// Máscara CNJ: XXXXXXX-XX.XXXX.X.XX.XXXX (20 dígitos)
export function maskCnj(value = '') {
  const clean = value.replace(/\D/g, '').slice(0, 20);
  return clean
    .replace(/^(\d{7})(\d)/, '$1-$2')
    .replace(/^(\d{7}-\d{2})(\d)/, '$1.$2')
    .replace(/^(\d{7}-\d{2}\.\d{4})(\d)/, '$1.$2')
    .replace(/^(\d{7}-\d{2}\.\d{4}\.\d{1})(\d)/, '$1.$2')
    .replace(/^(\d{7}-\d{2}\.\d{4}\.\d{1}\.\d{2})(\d)/, '$1.$2');
}

// Máscara de moeda R$
export function maskCurrency(value = '') {
  const clean = value.replace(/\D/g, '');
  if (!clean) return '';
  const numberVal = (parseFloat(clean) / 100).toFixed(2);
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(numberVal);
}

export async function fetchAddressByCep(cepInput = '') {
  const cleanCep = cepInput.replace(/\D/g, '');
  if (cleanCep.length !== 8) {
    return { error: 'CEP inválido. Digite 8 números.' };
  }

  try {
    const res = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
    if (!res.ok) throw new Error('Erro ao buscar CEP');
    const data = await res.json();
    if (data.erro) {
      return { error: 'CEP não encontrado.' };
    }
    return {
      logradouro: data.logradouro || '',
      bairro: data.bairro || '',
      cidade: data.localidade || '',
      uf: data.uf || '',
      error: null,
    };
  } catch (err) {
    return { error: 'Não foi possível consultar o CEP no momento.' };
  }
}
