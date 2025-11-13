/**
 * Parser robusto para arquivos de fluxo (.json e .js)
 * Suporta JSON direto e módulos JS com export default
 */

import { FlowData } from '@/types/flow';

export interface ParseResult {
  data: FlowData | null;
  nameFromFlow?: string;
  error?: string;
}

// Valida se o objeto tem estrutura de fluxo válida
const isValidFlowData = (obj: any): obj is FlowData => {
  return (
    obj &&
    typeof obj === 'object' &&
    Array.isArray(obj.groups) &&
    obj.groups.length > 0
  );
};

// Parse de arquivo JSON
const parseJSON = (content: string): ParseResult => {
  try {
    const data = JSON.parse(content);
    
    if (!isValidFlowData(data)) {
      return {
        data: null,
        error: 'Estrutura de fluxo inválida: falta propriedade "groups" ou está vazia',
      };
    }

    // Tenta extrair nome do fluxo se houver
    const nameFromFlow = data.name || undefined;

    return { data, nameFromFlow };
  } catch (error) {
    console.error('[FlowParser] Erro ao fazer parse de JSON:', error);
    return {
      data: null,
      error: `Erro ao analisar JSON: ${error instanceof Error ? error.message : 'Desconhecido'}`,
    };
  }
};

// Parse de arquivo JS (dynamic import)
const parseJS = async (content: string, filename: string): Promise<ParseResult> => {
  let url: string | null = null;
  
  try {
    // Cria um blob com o conteúdo JS
    const blob = new Blob([content], { type: 'text/javascript' });
    url = URL.createObjectURL(blob);

    // Faz import dinâmico
    const module = await import(/* @vite-ignore */ url);
    
    // Tenta obter o export default ou exports
    const data = module.default || module.exports || module;

    if (!isValidFlowData(data)) {
      return {
        data: null,
        error: 'Módulo JS não exporta um fluxo válido',
      };
    }

    const nameFromFlow = data.name || undefined;

    return { data, nameFromFlow };
  } catch (error) {
    console.error('[FlowParser] Erro ao fazer parse de JS:', error);
    return {
      data: null,
      error: `Erro ao analisar módulo JS: ${error instanceof Error ? error.message : 'Desconhecido'}`,
    };
  } finally {
    // CORREÇÃO: Garante que URL seja sempre liberada, mesmo em caso de erro
    if (url) {
      URL.revokeObjectURL(url);
    }
  }
};

// Parse de arquivo File (detecção automática)
export const parseFlowFile = async (file: File): Promise<ParseResult> => {
  console.log('[FlowParser] Iniciando parse de arquivo:', {
    name: file.name,
    type: file.type,
    size: file.size,
  });

  try {
    const content = await file.text();
    const extension = file.name.match(/\.(json|js)$/i)?.[1]?.toLowerCase();

    if (extension === 'json') {
      return parseJSON(content);
    } else if (extension === 'js') {
      return await parseJS(content, file.name);
    } else {
      // Tenta como JSON por padrão
      return parseJSON(content);
    }
  } catch (error) {
    console.error('[FlowParser] Erro ao ler arquivo:', error);
    return {
      data: null,
      error: `Erro ao ler arquivo: ${error instanceof Error ? error.message : 'Desconhecido'}`,
    };
  }
};

// Parse de string (para uso com base64)
export const parseFlowString = async (
  content: string,
  filename: string
): Promise<ParseResult> => {
  console.log('[FlowParser] Fazendo parse de string:', {
    filename,
    contentLength: content.length,
  });

  const extension = filename.match(/\.(json|js)$/i)?.[1]?.toLowerCase();

  if (extension === 'json') {
    return parseJSON(content);
  } else if (extension === 'js') {
    return await parseJS(content, filename);
  } else {
    // Tenta como JSON por padrão
    return parseJSON(content);
  }
};

// Valida fluxo já parseado
export const validateFlowData = (data: any): { valid: boolean; error?: string } => {
  if (!isValidFlowData(data)) {
    return {
      valid: false,
      error: 'Estrutura de fluxo inválida',
    };
  }

  // Validações adicionais
  if (data.groups.length === 0) {
    return {
      valid: false,
      error: 'Fluxo não contém grupos',
    };
  }

  const hasBlocks = data.groups.some((group: any) => 
    Array.isArray(group.blocks) && group.blocks.length > 0
  );

  if (!hasBlocks) {
    return {
      valid: false,
      error: 'Nenhum grupo contém blocos',
    };
  }

  return { valid: true };
};
