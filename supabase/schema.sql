-- ==============================================================================
-- DANIEL ADV HUB - ESQUEMA DE BANCO DE DADOS POSTGRESQL (SUPABASE)
-- ==============================================================================
-- Estrutura limpa e crua (DDL): tabelas, chaves estrangeiras, índices, triggers e RLS.
-- Totalmente reexecutável sem erros de políticas já existentes.
-- ==============================================================================

-- 1. EXTENSÕES NECESSÁRIAS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. FUNÇÃO E TRIGGER PARA ATUALIZAÇÃO AUTOMÁTICA DE UPDATED_AT
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ==============================================================================
-- 3. CRIAÇÃO DAS TABELAS
-- ==============================================================================

-- TABELA: clientes
CREATE TABLE IF NOT EXISTS public.clientes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nome VARCHAR(255) NOT NULL,
    tipo VARCHAR(50) NOT NULL DEFAULT 'Pessoa Física', -- 'Pessoa Física' | 'Pessoa Jurídica'
    documento VARCHAR(30), -- CPF ou CNPJ
    rg VARCHAR(30),
    profissao VARCHAR(100),
    nacionalidade VARCHAR(100) DEFAULT 'Brasileiro(a)',
    cep VARCHAR(20),
    logradouro VARCHAR(255),
    numero VARCHAR(30),
    complemento VARCHAR(100),
    bairro VARCHAR(100),
    cidade VARCHAR(100),
    uf VARCHAR(2),
    email VARCHAR(255),
    fone VARCHAR(50),
    prioritario BOOLEAN DEFAULT false,
    chave_ativa BOOLEAN DEFAULT true,
    com_processo BOOLEAN DEFAULT false,
    cadastrado_este_mes BOOLEAN DEFAULT true,
    incapacidade VARCHAR(50) DEFAULT 'Capaz',
    
    -- Dados de Representante (Pessoa Jurídica)
    resp_empresa_nome VARCHAR(255),
    resp_empresa_cpf VARCHAR(30),
    resp_empresa_endereco TEXT,
    
    -- Dados de Representante Legal (Menor / Incapaz)
    resp_legal_nome VARCHAR(255),
    resp_legal_cpf VARCHAR(30),
    resp_legal_rg VARCHAR(30),
    resp_legal_profissao VARCHAR(100),
    resp_legal_nacionalidade VARCHAR(100),
    resp_legal_endereco TEXT,
    
    anotacoes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- TABELA: processos
CREATE TABLE IF NOT EXISTS public.processos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    cnj VARCHAR(50) UNIQUE NOT NULL,
    cliente_id UUID REFERENCES public.clientes(id) ON DELETE SET NULL,
    data_protocolo DATE,
    tramitacao VARCHAR(255),
    sistema VARCHAR(50),
    assunto TEXT,
    valor_causa VARCHAR(50),
    prioritario BOOLEAN DEFAULT false,
    status VARCHAR(50) DEFAULT 'Em andamento',
    com_audiencia BOOLEAN DEFAULT false,
    encerrado BOOLEAN DEFAULT false,
    arquivado BOOLEAN DEFAULT false,
    
    -- Parte Contrária
    parte_contraria_nome VARCHAR(255),
    parte_contraria_doc VARCHAR(30),
    parte_contraria_profissao VARCHAR(100),
    parte_contraria_nacionalidade VARCHAR(100) DEFAULT 'Brasileiro(a)',
    parte_contraria_cep VARCHAR(20),
    parte_contraria_logradouro VARCHAR(255),
    parte_contraria_numero VARCHAR(30),
    parte_contraria_bairro VARCHAR(100),
    parte_contraria_cidade VARCHAR(100),
    parte_contraria_uf VARCHAR(2),
    
    anotacoes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- TABELA DE JUNÇÃO: processo_clientes
CREATE TABLE IF NOT EXISTS public.processo_clientes (
    processo_id UUID REFERENCES public.processos(id) ON DELETE CASCADE,
    cliente_id UUID REFERENCES public.clientes(id) ON DELETE CASCADE,
    PRIMARY KEY (processo_id, cliente_id)
);

-- TABELA: andamentos
CREATE TABLE IF NOT EXISTS public.andamentos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    processo_id UUID REFERENCES public.processos(id) ON DELETE CASCADE NOT NULL,
    data DATE NOT NULL,
    descricao TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- TABELA: tipos_tarefas
CREATE TABLE IF NOT EXISTS public.tipos_tarefas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nome VARCHAR(100) UNIQUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- TABELA: tarefas
CREATE TABLE IF NOT EXISTS public.tarefas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tipo VARCHAR(100) NOT NULL,
    prazo DATE NOT NULL,
    processo_id UUID REFERENCES public.processos(id) ON DELETE SET NULL,
    cliente_id UUID REFERENCES public.clientes(id) ON DELETE SET NULL,
    anotacoes TEXT,
    urgente BOOLEAN DEFAULT false,
    status VARCHAR(50) DEFAULT 'Pendente',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- TABELA: audiencias
CREATE TABLE IF NOT EXISTS public.audiencias (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    data_hora TIMESTAMPTZ NOT NULL,
    processo_id UUID REFERENCES public.processos(id) ON DELETE SET NULL,
    cliente_id UUID REFERENCES public.clientes(id) ON DELETE SET NULL,
    tipo VARCHAR(50) DEFAULT 'Presencial',
    local TEXT,
    status VARCHAR(50) DEFAULT 'Agendada',
    anotacoes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- TABELA: atendimentos
CREATE TABLE IF NOT EXISTS public.atendimentos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    cliente_id UUID REFERENCES public.clientes(id) ON DELETE SET NULL,
    nome_atendido VARCHAR(255) NOT NULL,
    data_hora TIMESTAMPTZ NOT NULL,
    telefone VARCHAR(50),
    descricao TEXT,
    status VARCHAR(50) DEFAULT 'Agendado',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- TABELA: financeiro_lancamentos
CREATE TABLE IF NOT EXISTS public.financeiro_lancamentos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    descricao VARCHAR(255) NOT NULL,
    tipo VARCHAR(50) NOT NULL, -- 'Receita' | 'Despesa' | 'Custa'
    valor NUMERIC(12, 2) NOT NULL,
    data_vencimento DATE,
    data_pagamento DATE,
    status VARCHAR(50) DEFAULT 'Pendente',
    cliente_id UUID REFERENCES public.clientes(id) ON DELETE SET NULL,
    processo_id UUID REFERENCES public.processos(id) ON DELETE SET NULL,
    categoria VARCHAR(100),
    anotacoes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- 4. TRIGGERS DE UPDATED_AT
-- ==============================================================================

DROP TRIGGER IF EXISTS update_clientes_updated_at ON public.clientes;
CREATE TRIGGER update_clientes_updated_at BEFORE UPDATE ON public.clientes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_processos_updated_at ON public.processos;
CREATE TRIGGER update_processos_updated_at BEFORE UPDATE ON public.processos FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_tarefas_updated_at ON public.tarefas;
CREATE TRIGGER update_tarefas_updated_at BEFORE UPDATE ON public.tarefas FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_audiencias_updated_at ON public.audiencias;
CREATE TRIGGER update_audiencias_updated_at BEFORE UPDATE ON public.audiencias FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_atendimentos_updated_at ON public.atendimentos;
CREATE TRIGGER update_atendimentos_updated_at BEFORE UPDATE ON public.atendimentos FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_financeiro_updated_at ON public.financeiro_lancamentos;
CREATE TRIGGER update_financeiro_updated_at BEFORE UPDATE ON public.financeiro_lancamentos FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ==============================================================================
-- 5. ÍNDICES DE DESEMPENHO
-- ==============================================================================

CREATE INDEX IF NOT EXISTS idx_clientes_documento ON public.clientes(documento);
CREATE INDEX IF NOT EXISTS idx_clientes_nome ON public.clientes(nome);

CREATE INDEX IF NOT EXISTS idx_processos_cnj ON public.processos(cnj);
CREATE INDEX IF NOT EXISTS idx_processos_cliente_id ON public.processos(cliente_id);
CREATE INDEX IF NOT EXISTS idx_processos_status ON public.processos(status);

CREATE INDEX IF NOT EXISTS idx_andamentos_processo_id ON public.andamentos(processo_id);

CREATE INDEX IF NOT EXISTS idx_tarefas_prazo ON public.tarefas(prazo);
CREATE INDEX IF NOT EXISTS idx_tarefas_status ON public.tarefas(status);
CREATE INDEX IF NOT EXISTS idx_tarefas_processo_id ON public.tarefas(processo_id);
CREATE INDEX IF NOT EXISTS idx_tarefas_cliente_id ON public.tarefas(cliente_id);

CREATE INDEX IF NOT EXISTS idx_audiencias_data_hora ON public.audiencias(data_hora);
CREATE INDEX IF NOT EXISTS idx_audiencias_processo_id ON public.audiencias(processo_id);

CREATE INDEX IF NOT EXISTS idx_atendimentos_data_hora ON public.atendimentos(data_hora);

CREATE INDEX IF NOT EXISTS idx_financeiro_tipo_status ON public.financeiro_lancamentos(tipo, status);

-- ==============================================================================
-- 6. SEGURANÇA (ROW LEVEL SECURITY - RLS)
-- ==============================================================================

ALTER TABLE public.clientes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.processos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.processo_clientes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.andamentos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tipos_tarefas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tarefas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audiencias ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.atendimentos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.financeiro_lancamentos ENABLE ROW LEVEL SECURITY;

-- Políticas com remoção prévia (DROP POLICY IF EXISTS) para evitar erros de execução múltipla
DROP POLICY IF EXISTS "Permitir acesso total a clientes" ON public.clientes;
CREATE POLICY "Permitir acesso total a clientes" ON public.clientes FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Permitir acesso total a processos" ON public.processos;
CREATE POLICY "Permitir acesso total a processos" ON public.processos FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Permitir acesso total a processo_clientes" ON public.processo_clientes;
CREATE POLICY "Permitir acesso total a processo_clientes" ON public.processo_clientes FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Permitir acesso total a andamentos" ON public.andamentos;
CREATE POLICY "Permitir acesso total a andamentos" ON public.andamentos FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Permitir acesso total a tipos_tarefas" ON public.tipos_tarefas;
CREATE POLICY "Permitir acesso total a tipos_tarefas" ON public.tipos_tarefas FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Permitir acesso total a tarefas" ON public.tarefas;
CREATE POLICY "Permitir acesso total a tarefas" ON public.tarefas FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Permitir acesso total a audiencias" ON public.audiencias;
CREATE POLICY "Permitir acesso total a audiencias" ON public.audiencias FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Permitir acesso total a atendimentos" ON public.atendimentos;
CREATE POLICY "Permitir acesso total a atendimentos" ON public.atendimentos FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Permitir acesso total a financeiro_lancamentos" ON public.financeiro_lancamentos;
CREATE POLICY "Permitir acesso total a financeiro_lancamentos" ON public.financeiro_lancamentos FOR ALL USING (true) WITH CHECK (true);
