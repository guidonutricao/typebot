/**
 * Utilitário de debug para inspecionar o estado do storage
 * Use no console: import { debugStorage } from './utils/debugStorage'; debugStorage();
 */

export const debugStorage = () => {
  console.log('========================================');
  console.log('🔍 DEBUG DO STORAGE');
  console.log('========================================');
  
  // 1. Listar todos os flows no Zustand
  const storeData = localStorage.getItem('typeflow-flows');
  if (storeData) {
    try {
      const parsed = JSON.parse(storeData);
      const flows = parsed.state?.flows || [];
      console.log('\n📦 FLOWS NO ZUSTAND STORE:', flows.length);
      flows.forEach((flow: any) => {
        console.log(`  - ${flow.id}`, {
          name: flow.name,
          isPublished: flow.isPublished,
          hasFilePath: !!flow.filePath,
          filePath: flow.filePath
        });
      });
    } catch (error) {
      console.error('❌ Erro ao ler Zustand store:', error);
    }
  } else {
    console.log('\n📦 ZUSTAND STORE: vazio');
  }
  
  // 2. Listar índice do formStorage
  const indexData = localStorage.getItem('typeflow:index');
  if (indexData) {
    try {
      const index = JSON.parse(indexData);
      console.log('\n📁 ÍNDICE DO FORMSTORAGE:', index.length, 'itens');
      console.log('IDs:', index);
    } catch (error) {
      console.error('❌ Erro ao ler índice:', error);
    }
  } else {
    console.log('\n📁 ÍNDICE DO FORMSTORAGE: vazio');
  }
  
  // 3. Listar todos os metas
  const metaKeys = Object.keys(localStorage).filter(k => k.startsWith('typeflow:meta:'));
  console.log('\n📋 METADADOS NO FORMSTORAGE:', metaKeys.length);
  metaKeys.forEach(key => {
    const id = key.replace('typeflow:meta:', '');
    try {
      const meta = JSON.parse(localStorage.getItem(key) || '{}');
      console.log(`  - ${id}`, {
        name: meta.name,
        isPublished: meta.isPublished,
        filePath: meta.filePath
      });
    } catch (error) {
      console.error(`  ❌ Erro ao ler meta ${id}:`, error);
    }
  });
  
  // 4. Listar todos os arquivos
  const fileKeys = Object.keys(localStorage).filter(k => k.startsWith('typeflow:file:'));
  console.log('\n📄 ARQUIVOS NO FORMSTORAGE:', fileKeys.length);
  fileKeys.forEach(key => {
    const id = key.replace('typeflow:file:', '');
    try {
      const file = JSON.parse(localStorage.getItem(key) || '{}');
      console.log(`  - ${id}`, {
        fileName: file.originalFileName,
        mimeType: file.mimeType,
        size: file.contentBase64?.length || 0
      });
    } catch (error) {
      console.error(`  ❌ Erro ao ler arquivo ${id}:`, error);
    }
  });
  
  // 5. Verificar inconsistências
  console.log('\n⚠️  VERIFICANDO INCONSISTÊNCIAS...');
  
  // Flows no store sem filePath
  if (storeData) {
    try {
      const parsed = JSON.parse(storeData);
      const flows = parsed.state?.flows || [];
      const withoutFilePath = flows.filter((f: any) => !f.filePath);
      if (withoutFilePath.length > 0) {
        console.warn('❌ Flows sem filePath (precisam migração):', withoutFilePath.map((f: any) => f.id));
      } else {
        console.log('✓ Todos os flows têm filePath');
      }
    } catch (error) {
      // ignore
    }
  }
  
  // Metas sem arquivo correspondente
  const orphanMetas = metaKeys.filter(metaKey => {
    const id = metaKey.replace('typeflow:meta:', '');
    return !localStorage.getItem(`typeflow:file:${id}`);
  });
  if (orphanMetas.length > 0) {
    console.warn('❌ Metas sem arquivo:', orphanMetas.map(k => k.replace('typeflow:meta:', '')));
  } else {
    console.log('✓ Todos os metas têm arquivo');
  }
  
  // Arquivos sem meta correspondente
  const orphanFiles = fileKeys.filter(fileKey => {
    const id = fileKey.replace('typeflow:file:', '');
    return !localStorage.getItem(`typeflow:meta:${id}`);
  });
  if (orphanFiles.length > 0) {
    console.warn('❌ Arquivos sem meta:', orphanFiles.map(k => k.replace('typeflow:file:', '')));
  } else {
    console.log('✓ Todos os arquivos têm meta');
  }
  
  console.log('\n========================================');
  console.log('Uso do localStorage:', `${(JSON.stringify(localStorage).length / 1024).toFixed(2)} KB`);
  console.log('========================================');
};

// Exportar para uso no console
if (typeof window !== 'undefined') {
  (window as any).debugStorage = debugStorage;
  console.log('💡 Use debugStorage() no console para inspecionar o storage');
}

/**
 * Força migração de um fluxo específico do Zustand para formStorage
 */
export const forceMigrateFlow = async (flowId: string) => {
  console.log(`🔄 Forçando migração do fluxo ${flowId}...`);
  
  const storeData = localStorage.getItem('typeflow-flows');
  if (!storeData) {
    console.error('❌ Zustand store vazio');
    return false;
  }
  
  try {
    const parsed = JSON.parse(storeData);
    const flows = parsed.state?.flows || [];
    const flow = flows.find((f: any) => f.id === flowId);
    
    if (!flow) {
      console.error('❌ Flow não encontrado no store:', flowId);
      return false;
    }
    
    if (flow.filePath) {
      console.log('✓ Flow já tem filePath, não precisa migrar');
      return true;
    }
    
    console.log('Migrando flow:', flow.name);
    
    const { saveFormFile, updatePublishStatus } = await import('./formStorage');
    
    const jsonContent = JSON.stringify(flow.data, null, 2);
    const blob = new Blob([jsonContent], { type: 'application/json' });
    const file = new File([blob], `${flow.id}.json`, { type: 'application/json' });
    
    const meta = await saveFormFile(file, flow.name, flow.id);
    
    if (flow.isPublished) {
      updatePublishStatus(flow.id, true);
    }
    
    console.log('✓ Migração concluída:', meta.filePath);
    console.log('⚠️  IMPORTANTE: Recarregue a página para atualizar o Zustand store');
    
    return true;
  } catch (error) {
    console.error('❌ Erro na migração:', error);
    return false;
  }
};

if (typeof window !== 'undefined') {
  (window as any).forceMigrateFlow = forceMigrateFlow;
  console.log('💡 Use forceMigrateFlow("flow_id") no console para migrar um fluxo específico');
}
