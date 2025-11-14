import { supabase } from '@/lib/supabase';

// Testa conexão com Supabase
export const testConnection = async (): Promise<boolean> => {
  try {
    const { data, error } = await supabase.from('flows').select('count').limit(1);
    return !error;
  } catch (error) {
    console.error('[Supabase] Erro de conexão:', error);
    return false;
  }
};

export interface FormMeta {
  id: string;
  name: string;
  slug?: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  isPublished: boolean;
  mimeType: string;
  originalFileName: string;
  data: any;
  settings?: Record<string, any>;
}

// Gera ID único
export const generateId = (): string => {
  return 'flow_' + Date.now() + '_' + Math.random().toString(36).substring(2, 9);
};

// Normaliza slug
const normalizeSlug = (text: string): string => {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

// Salva ou atualiza um fluxo
export const saveFlow = async (
  name: string,
  data: any,
  existingId?: string,
  slug?: string,
  settings?: Record<string, any>
): Promise<FormMeta> => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('Usuário não autenticado');
  }

  const id = existingId || generateId();
  let normalizedSlug = slug ? normalizeSlug(slug) : normalizeSlug(name);

  // Verificar se slug já existe (exceto para o próprio fluxo)
  const { data: existingSlugs } = await supabase
    .from('flows')
    .select('id')
    .eq('slug', normalizedSlug)
    .neq('id', id);

  // Se slug já existe, adicionar sufixo
  if (existingSlugs && existingSlugs.length > 0) {
    normalizedSlug = `${normalizedSlug}-${Date.now()}`;
  }

  const flowData = {
    id,
    user_id: user.id,
    name,
    slug: normalizedSlug,
    data,
    is_published: false,
    mime_type: 'application/json',
    original_file_name: `${id}.json`,
    settings: settings || {},
  };

  let flow;
  let error;

  if (existingId) {
    // Para update, primeiro verificar se existe
    const { data: existing } = await supabase
      .from('flows')
      .select('id')
      .eq('id', id)
      .single();

    if (existing) {
      // Atualizar
      const result = await supabase
        .from('flows')
        .update(flowData)
        .eq('id', id)
        .select()
        .single();
      flow = result.data;
      error = result.error;
    } else {
      // Se não existe, inserir
      const result = await supabase
        .from('flows')
        .insert(flowData)
        .select()
        .single();
      flow = result.data;
      error = result.error;
    }
  } else {
    // Inserir novo
    const result = await supabase
      .from('flows')
      .insert(flowData)
      .select()
      .single();
    flow = result.data;
    error = result.error;
  }

  if (error) throw error;
  if (!flow) throw new Error('Falha ao salvar fluxo');

  return {
    id: flow.id,
    name: flow.name,
    slug: flow.slug,
    userId: flow.user_id,
    createdAt: flow.created_at,
    updatedAt: flow.updated_at,
    isPublished: flow.is_published,
    mimeType: flow.mime_type,
    originalFileName: flow.original_file_name,
    data: flow.data,
    settings: flow.settings,
  };
};

// Obtém um fluxo por ID
export const getFlow = async (id: string): Promise<FormMeta | null> => {
  const { data: flow, error } = await supabase
    .from('flows')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !flow) return null;

  return {
    id: flow.id,
    name: flow.name,
    slug: flow.slug,
    userId: flow.user_id,
    createdAt: flow.created_at,
    updatedAt: flow.updated_at,
    isPublished: flow.is_published,
    mimeType: flow.mime_type,
    originalFileName: flow.original_file_name,
    data: flow.data,
    settings: flow.settings,
  };
};

// Obtém fluxo por slug (público)
export const getFlowBySlug = async (slug: string): Promise<FormMeta | null> => {
  const { data: flows, error } = await supabase
    .from('flows')
    .select('*')
    .eq('slug', slug)
    .eq('is_published', true)
    .limit(1);

  if (error || !flows || flows.length === 0) return null;
  
  const flow = flows[0];

  return {
    id: flow.id,
    name: flow.name,
    slug: flow.slug,
    userId: flow.user_id,
    createdAt: flow.created_at,
    updatedAt: flow.updated_at,
    isPublished: flow.is_published,
    mimeType: flow.mime_type,
    originalFileName: flow.original_file_name,
    data: flow.data,
    settings: flow.settings,
  };
};

// Lista todos os fluxos do usuário
export const listFlows = async (): Promise<FormMeta[]> => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return [];

  const { data: flows, error } = await supabase
    .from('flows')
    .select('*')
    .eq('user_id', user.id)
    .order('updated_at', { ascending: false });

  if (error || !flows) return [];

  return flows.map(flow => ({
    id: flow.id,
    name: flow.name,
    slug: flow.slug,
    userId: flow.user_id,
    createdAt: flow.created_at,
    updatedAt: flow.updated_at,
    isPublished: flow.is_published,
    mimeType: flow.mime_type,
    originalFileName: flow.original_file_name,
    data: flow.data,
    settings: flow.settings,
  }));
};

// Atualiza status de publicação
export const updatePublishStatus = async (
  id: string,
  isPublished: boolean
): Promise<boolean> => {
  const { error } = await supabase
    .from('flows')
    .update({ is_published: isPublished })
    .eq('id', id);

  return !error;
};

// Atualiza nome do fluxo
export const updateFlowName = async (
  id: string,
  name: string
): Promise<boolean> => {
  const { error } = await supabase
    .from('flows')
    .update({ name })
    .eq('id', id);

  return !error;
};

// Atualiza slug do fluxo
export const updateFlowSlug = async (
  id: string,
  slug: string
): Promise<boolean> => {
  const normalizedSlug = normalizeSlug(slug);
  
  const { error } = await supabase
    .from('flows')
    .update({ slug: normalizedSlug })
    .eq('id', id);

  return !error;
};

// Atualiza dados do fluxo
export const updateFlowData = async (
  id: string,
  data: any
): Promise<boolean> => {
  const { error } = await supabase
    .from('flows')
    .update({ data })
    .eq('id', id);

  return !error;
};

// Deleta um fluxo
export const deleteFlow = async (id: string): Promise<boolean> => {
  const { error } = await supabase
    .from('flows')
    .delete()
    .eq('id', id);

  return !error;
};

// Salva resposta de formulário
export const saveFormResponse = async (
  flowId: string,
  responses: Record<string, any>,
  completed: boolean = false
): Promise<string | null> => {
  const { data: { user } } = await supabase.auth.getUser();

  const responseData = {
    flow_id: flowId,
    user_id: user?.id || null,
    responses,
    completed,
  };

  const { data, error } = await supabase
    .from('form_responses')
    .insert(responseData)
    .select()
    .single();

  if (error) {
    console.error('Erro ao salvar resposta:', error);
    return null;
  }

  return data.id;
};

// Lista respostas de um fluxo
export const getFlowResponses = async (flowId: string) => {
  const { data, error } = await supabase
    .from('form_responses')
    .select('*')
    .eq('flow_id', flowId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Erro ao buscar respostas:', error);
    return [];
  }

  return data;
};

// Deleta uma resposta de formulário
export const deleteFormResponse = async (responseId: string): Promise<boolean> => {
  const { error } = await supabase
    .from('form_responses')
    .delete()
    .eq('id', responseId);

  if (error) {
    console.error('Erro ao deletar resposta:', error);
    return false;
  }

  return true;
};
