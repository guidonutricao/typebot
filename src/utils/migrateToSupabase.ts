import * as localFormStorage from './formStorage';
import * as supabaseStorage from './supabaseStorage';
import { supabase } from '@/lib/supabase';

export interface MigrationResult {
  success: boolean;
  migratedCount: number;
  failedCount: number;
  errors: string[];
}

/**
 * Migra todos os fluxos do localStorage para o Supabase
 */
export const migrateLocalStorageToSupabase = async (): Promise<MigrationResult> => {
  const result: MigrationResult = {
    success: true,
    migratedCount: 0,
    failedCount: 0,
    errors: [],
  };

  try {
    // Verificar se usuário está autenticado
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error('Usuário não autenticado');
    }

    // Obter todos os fluxos do localStorage
    const localFlows = localFormStorage.listForms();
    console.log(`[Migration] Encontrados ${localFlows.length} fluxos no localStorage`);

    if (localFlows.length === 0) {
      console.log('[Migration] Nenhum fluxo para migrar');
      return result;
    }

    // Migrar cada fluxo
    for (const localFlow of localFlows) {
      try {
        console.log(`[Migration] Migrando fluxo: ${localFlow.name} (${localFlow.id})`);

        // Obter conteúdo do arquivo
        const fileEntry = localFormStorage.getFileEntry(localFlow.id);
        if (!fileEntry) {
          throw new Error(`Arquivo não encontrado`);
        }

        // Decodificar conteúdo
        let data;
        try {
          const content = localFormStorage.base64ToString(fileEntry.contentBase64);
          data = JSON.parse(content);
        } catch (parseError: any) {
          throw new Error(`Erro ao processar dados: ${parseError.message}`);
        }

        // Validar dados
        if (!data || typeof data !== 'object') {
          throw new Error('Dados do fluxo inválidos');
        }

        // Salvar no Supabase
        try {
          await supabaseStorage.saveFlow(
            localFlow.name,
            data,
            localFlow.id,
            localFlow.slug
          );
        } catch (saveError: any) {
          throw new Error(`Erro ao salvar: ${saveError.message}`);
        }

        // Atualizar status de publicação se necessário
        if (localFlow.isPublished) {
          try {
            await supabaseStorage.updatePublishStatus(localFlow.id, true);
          } catch (publishError: any) {
            console.warn(`[Migration] Aviso: não foi possível publicar ${localFlow.name}`);
          }
        }

        result.migratedCount++;
        console.log(`[Migration] ✓ Fluxo migrado com sucesso: ${localFlow.name}`);
      } catch (error: any) {
        result.failedCount++;
        const errorMsg = `Erro ao migrar ${localFlow.name}: ${error.message}`;
        result.errors.push(errorMsg);
        console.error(`[Migration] ✗ ${errorMsg}`, error);
      }
    }

    result.success = result.failedCount === 0;
    console.log(`[Migration] Migração concluída: ${result.migratedCount} sucesso, ${result.failedCount} falhas`);

    return result;
  } catch (error: any) {
    result.success = false;
    result.errors.push(error.message);
    console.error('[Migration] Erro na migração:', error);
    return result;
  }
};

/**
 * Limpa dados do localStorage após migração bem-sucedida
 */
export const clearLocalStorage = (): void => {
  const localFlows = localFormStorage.listForms();
  
  for (const flow of localFlows) {
    localFormStorage.deleteForm(flow.id);
  }

  // Limpar também o store do Zustand
  localStorage.removeItem('typeflow-flows');
  
  console.log('[Migration] localStorage limpo');
};

/**
 * Verifica se há dados no localStorage que precisam ser migrados
 */
export const hasLocalStorageData = (): boolean => {
  const localFlows = localFormStorage.listForms();
  return localFlows.length > 0;
};
