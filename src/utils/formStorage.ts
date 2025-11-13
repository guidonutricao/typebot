/**
 * Sistema de storage local para arquivos de fluxo
 * Salva arquivos em base64 no localStorage com metadados separados
 */

export interface FormMeta {
  id: string;
  name: string;
  filePath: string;
  createdAt: string;
  updatedAt: string;
  isPublished: boolean;
  mimeType: string;
  originalFileName: string;
}

interface FileEntry {
  contentBase64: string;
  mimeType: string;
  originalFileName: string;
}

const STORAGE_PREFIX = 'typeflow';
const INDEX_KEY = `${STORAGE_PREFIX}:index`;

// Gera ID único no formato flow_timestamp_random
export const generateId = (): string => {
  return 'flow_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
};

// Constrói o filePath virtual
export const buildFilePath = (id: string, ext: string = '.json'): string => {
  return `/storage/forms/${id}${ext}`;
};

// Obtém extensão do arquivo
const getFileExtension = (filename: string): string => {
  const match = filename.match(/\.(json|js)$/i);
  return match ? match[0] : '.json';
};

// Verifica quota disponível no localStorage
const checkStorageQuota = (sizeNeeded: number): boolean => {
  try {
    // Estima tamanho atual do localStorage
    let currentSize = 0;
    for (let key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        currentSize += localStorage[key].length + key.length;
      }
    }
    
    // Limite típico do localStorage: 5-10MB (usamos 5MB como seguro)
    const STORAGE_LIMIT = 5 * 1024 * 1024; // 5MB
    const available = STORAGE_LIMIT - currentSize;
    
    if (sizeNeeded > available) {
      console.warn('[FormStorage] ⚠️ Espaço insuficiente:', {
        necessário: `${(sizeNeeded / 1024).toFixed(2)}KB`,
        disponível: `${(available / 1024).toFixed(2)}KB`,
      });
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('[FormStorage] Erro ao verificar quota:', error);
    return true; // Permite tentar mesmo com erro na verificação
  }
};

// Converte File para base64
const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      // Remove o prefixo "data:*/*;base64,"
      const base64Content = base64.split(',')[1] || base64;
      resolve(base64Content);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

// Converte base64 para string
export const base64ToString = (base64: string): string => {
  try {
    return atob(base64);
  } catch (error) {
    console.error('[FormStorage] Erro ao decodificar base64:', error);
    throw error;
  }
};

// Salva arquivo e retorna metadados
export const saveFormFile = async (
  file: File,
  name: string,
  existingId?: string
): Promise<FormMeta> => {
  try {
    const id = existingId || generateId();
    const ext = getFileExtension(file.name);
    const filePath = buildFilePath(id, ext);
    const contentBase64 = await fileToBase64(file);

    // Verificar quota antes de salvar
    const estimatedSize = contentBase64.length + name.length + 500; // +500 para metadados
    if (!checkStorageQuota(estimatedSize)) {
      throw new Error('Espaço insuficiente no localStorage. Considere remover fluxos antigos.');
    }

    const meta: FormMeta = {
      id,
      name,
      filePath,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isPublished: false,
      mimeType: file.type || 'application/json',
      originalFileName: file.name,
    };

    const fileEntry: FileEntry = {
      contentBase64,
      mimeType: file.type || 'application/json',
      originalFileName: file.name,
    };

    // Salvar no localStorage com tratamento de erro de quota
    try {
      localStorage.setItem(`${STORAGE_PREFIX}:meta:${id}`, JSON.stringify(meta));
      localStorage.setItem(`${STORAGE_PREFIX}:file:${id}`, JSON.stringify(fileEntry));
    } catch (storageError: any) {
      if (storageError.name === 'QuotaExceededError') {
        throw new Error('Limite de armazenamento excedido. Remova alguns fluxos para liberar espaço.');
      }
      throw storageError;
    }

    // Atualizar índice
    const index = getIndex();
    if (!index.includes(id)) {
      index.push(id);
      localStorage.setItem(INDEX_KEY, JSON.stringify(index));
    }

    console.log('[FormStorage] Arquivo salvo com sucesso:', {
      id,
      name,
      filePath,
      size: `${(contentBase64.length / 1024).toFixed(2)}KB`,
    });

    return meta;
  } catch (error) {
    console.error('[FormStorage] Erro ao salvar arquivo:', error);
    throw error;
  }
};

// Obtém metadados de um formulário
export const getFormMeta = (id: string): FormMeta | null => {
  try {
    const data = localStorage.getItem(`${STORAGE_PREFIX}:meta:${id}`);
    if (!data) {
      console.warn('[FormStorage] ⚠️ Meta não encontrado para ID:', id);
      
      // Debug: listar todos os metas disponíveis
      const allKeys = Object.keys(localStorage)
        .filter(k => k.startsWith(`${STORAGE_PREFIX}:meta:`));
      console.log('[FormStorage] Metas disponíveis:', allKeys.map(k => k.replace(`${STORAGE_PREFIX}:meta:`, '')));
      
      return null;
    }
    const meta = JSON.parse(data) as FormMeta;
    console.log('[FormStorage] ✓ Meta encontrado:', { id: meta.id, name: meta.name });
    return meta;
  } catch (error) {
    console.error('[FormStorage] ❌ Erro ao ler meta:', error);
    return null;
  }
};

// Obtém conteúdo do arquivo
export const getFileEntry = (id: string): FileEntry | null => {
  try {
    const data = localStorage.getItem(`${STORAGE_PREFIX}:file:${id}`);
    if (!data) {
      console.warn('[FormStorage] ⚠️ Arquivo não encontrado para ID:', id);
      
      // Debug: listar todos os files disponíveis
      const allKeys = Object.keys(localStorage)
        .filter(k => k.startsWith(`${STORAGE_PREFIX}:file:`));
      console.log('[FormStorage] Arquivos disponíveis:', allKeys.map(k => k.replace(`${STORAGE_PREFIX}:file:`, '')));
      
      return null;
    }
    console.log('[FormStorage] ✓ Arquivo encontrado para ID:', id);
    return JSON.parse(data) as FileEntry;
  } catch (error) {
    console.error('[FormStorage] ❌ Erro ao ler arquivo:', error);
    return null;
  }
};

// Atualiza status de publicação
export const updatePublishStatus = (id: string, isPublished: boolean): boolean => {
  try {
    const meta = getFormMeta(id);
    if (!meta) {
      console.error('[FormStorage] ❌ Não é possível atualizar status: meta não encontrado para ID:', id);
      console.error('[FormStorage] Este fluxo precisa ser migrado ou recriado');
      return false;
    }

    meta.isPublished = isPublished;
    meta.updatedAt = new Date().toISOString();

    localStorage.setItem(`${STORAGE_PREFIX}:meta:${id}`, JSON.stringify(meta));
    console.log('[FormStorage] ✓ Status de publicação atualizado:', { id, isPublished });
    return true;
  } catch (error) {
    console.error('[FormStorage] ❌ Erro ao atualizar status:', error);
    return false;
  }
};

// Lista todos os formulários
export const listForms = (): FormMeta[] => {
  const index = getIndex();
  return index
    .map((id) => getFormMeta(id))
    .filter((meta): meta is FormMeta => meta !== null);
};

// Obtém índice de IDs
const getIndex = (): string[] => {
  try {
    const data = localStorage.getItem(INDEX_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('[FormStorage] Erro ao ler índice:', error);
    return [];
  }
};

// Extrai ID do filePath
export const getIdFromFilePath = (filePath: string): string | null => {
  const match = filePath.match(/\/storage\/forms\/([^.]+)/);
  return match ? match[1] : null;
};

// Remove um formulário
export const deleteForm = (id: string): boolean => {
  try {
    localStorage.removeItem(`${STORAGE_PREFIX}:meta:${id}`);
    localStorage.removeItem(`${STORAGE_PREFIX}:file:${id}`);

    const index = getIndex();
    const newIndex = index.filter((itemId) => itemId !== id);
    localStorage.setItem(INDEX_KEY, JSON.stringify(newIndex));

    console.log('[FormStorage] Formulário removido:', id);
    return true;
  } catch (error) {
    console.error('[FormStorage] Erro ao remover formulário:', error);
    return false;
  }
};

// Atualiza nome do formulário
export const updateFormName = (id: string, name: string): boolean => {
  try {
    const meta = getFormMeta(id);
    if (!meta) return false;

    meta.name = name;
    meta.updatedAt = new Date().toISOString();

    localStorage.setItem(`${STORAGE_PREFIX}:meta:${id}`, JSON.stringify(meta));
    console.log('[FormStorage] Nome atualizado:', { id, name });
    return true;
  } catch (error) {
    console.error('[FormStorage] Erro ao atualizar nome:', error);
    return false;
  }
};
