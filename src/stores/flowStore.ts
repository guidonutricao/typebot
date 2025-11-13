import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { FlowData } from '@/types/flow';

export interface Flow {
  id: string;
  name: string;
  data: FlowData;
  createdAt: string;
  updatedAt: string;
  isPublished: boolean;
  filePath?: string;
  mimeType?: string;
  originalFileName?: string;
}

interface FlowStore {
  flows: Flow[];
  activeFlowId: string | null;
  _hasHydrated: boolean;
  
  addFlow: (name: string, data: FlowData) => string;
  addFlowRecord: (meta: any, data: FlowData | null) => string;
  updateFlow: (id: string, data: FlowData) => void;
  updateFlowFile: (id: string, meta: any, data: FlowData | null) => void;
  updateFlowName: (id: string, name: string) => void;
  deleteFlow: (id: string) => void;
  duplicateFlow: (id: string) => string;
  getFlow: (id: string) => Flow | undefined;
  setActiveFlow: (id: string) => void;
  togglePublish: (id: string) => void;
  setHasHydrated: (state: boolean) => void;
}

const generateId = () => {
  return 'flow_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
};

export const useFlowStore = create<FlowStore>()(
  persist(
    (set, get) => ({
      flows: [],
      activeFlowId: null,
      _hasHydrated: false,

      addFlow: (name: string, data: FlowData) => {
        const id = generateId();
        const newFlow: Flow = {
          id,
          name,
          data,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          isPublished: false,
        };
        
        set((state) => ({
          flows: [...state.flows, newFlow],
          activeFlowId: id,
        }));
        
        return id;
      },

      addFlowRecord: (meta: any, data: FlowData | null) => {
        const newFlow: Flow = {
          id: meta.id,
          name: meta.name,
          data: data || ({ groups: [], edges: [], variables: [] } as FlowData),
          createdAt: meta.createdAt,
          updatedAt: meta.updatedAt,
          isPublished: meta.isPublished,
          filePath: meta.filePath,
          mimeType: meta.mimeType,
          originalFileName: meta.originalFileName,
        };
        
        set((state) => ({
          flows: [...state.flows, newFlow],
          activeFlowId: meta.id,
        }));
        
        console.log('[FlowStore] Fluxo registrado:', {
          id: meta.id,
          name: meta.name,
          filePath: meta.filePath,
        });
        
        return meta.id;
      },

      updateFlow: (id: string, data: FlowData) => {
        set((state) => ({
          flows: state.flows.map((flow) =>
            flow.id === id
              ? { ...flow, data, updatedAt: new Date().toISOString() }
              : flow
          ),
        }));
      },

      updateFlowFile: (id: string, meta: any, data: FlowData | null) => {
        set((state) => ({
          flows: state.flows.map((flow) =>
            flow.id === id
              ? {
                  ...flow,
                  data: data || flow.data,
                  filePath: meta.filePath,
                  mimeType: meta.mimeType,
                  originalFileName: meta.originalFileName,
                  updatedAt: meta.updatedAt,
                }
              : flow
          ),
        }));
        
        console.log('[FlowStore] Arquivo do fluxo atualizado:', {
          id,
          filePath: meta.filePath,
        });
      },

      updateFlowName: (id: string, name: string) => {
        set((state) => ({
          flows: state.flows.map((flow) =>
            flow.id === id
              ? { ...flow, name, updatedAt: new Date().toISOString() }
              : flow
          ),
        }));
      },

      deleteFlow: (id: string) => {
        set((state) => ({
          flows: state.flows.filter((flow) => flow.id !== id),
          activeFlowId: state.activeFlowId === id ? null : state.activeFlowId,
        }));
      },

      duplicateFlow: (id: string) => {
        const flow = get().flows.find((f) => f.id === id);
        if (!flow) return '';
        
        const newId = generateId();
        const duplicatedFlow: Flow = {
          ...flow,
          id: newId,
          name: `${flow.name} (cópia)`,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        
        set((state) => ({
          flows: [...state.flows, duplicatedFlow],
        }));
        
        return newId;
      },

      getFlow: (id: string) => {
        const flow = get().flows.find((flow) => flow.id === id);
        console.log('[FlowStore] getFlow chamado', {
          requestedId: id,
          found: !!flow,
          totalFlows: get().flows.length,
          allIds: get().flows.map(f => f.id)
        });
        return flow;
      },

      setActiveFlow: (id: string) => {
        set({ activeFlowId: id });
      },

      togglePublish: (id: string) => {
        const flow = get().flows.find((f) => f.id === id);
        const newPublishStatus = flow ? !flow.isPublished : false;
        
        console.log('[FlowStore] Alternando publicação:', {
          id,
          novoStatus: newPublishStatus,
          flowEncontrado: !!flow
        });
        
        set((state) => ({
          flows: state.flows.map((flow) =>
            flow.id === id
              ? { ...flow, isPublished: newPublishStatus, updatedAt: new Date().toISOString() }
              : flow
          ),
        }));
        
        // Sincronizar com FormStorage
        if (typeof window !== 'undefined') {
          import('@/utils/formStorage').then(({ updatePublishStatus, getFormMeta }) => {
            const meta = getFormMeta(id);
            if (!meta) {
              console.error('[FlowStore] ⚠️ ATENÇÃO: Tentando publicar fluxo que não existe no formStorage!');
              console.error('[FlowStore] ID:', id);
              console.error('[FlowStore] Este fluxo precisa ser migrado. Recarregue a página para forçar migração.');
            } else {
              updatePublishStatus(id, newPublishStatus);
              console.log('[FlowStore] ✓ Status sincronizado com formStorage');
            }
          });
        }
      },

      setHasHydrated: (state: boolean) => {
        set({ _hasHydrated: state });
      },
    }),
    {
      name: 'typeflow-flows',
      onRehydrateStorage: () => {
        console.log('[FlowStore] Iniciando hidratação do localStorage...');
        return async (state) => {
          if (state) {
            // Validar estrutura dos fluxos e remover inválidos
            const validFlows = state.flows.filter(flow => {
              const isValid = flow.id && flow.name && flow.data;
              if (!isValid) {
                console.warn('[FlowStore] Fluxo inválido removido:', flow);
              }
              return isValid;
            });
            
            if (validFlows.length !== state.flows.length) {
              console.log('[FlowStore] Fluxos inválidos foram removidos');
              state.flows = validFlows;
            }
            
            // Migração: adicionar filePath aos fluxos antigos e sincronizar com formStorage
            const { saveFormFile, updatePublishStatus } = await import('@/utils/formStorage');
            let migrated = false;
            
            const migrationErrors: string[] = [];
            
            for (const flow of state.flows) {
              if (!flow.filePath && flow.data) {
                console.log('[FlowStore] ⚙️ Migrando fluxo antigo para formStorage:', {
                  id: flow.id,
                  name: flow.name,
                  isPublished: flow.isPublished
                });
                
                let retries = 3;
                let migrationSuccess = false;
                
                while (retries > 0 && !migrationSuccess) {
                  try {
                    // Criar arquivo JSON a partir de flow.data
                    const jsonContent = JSON.stringify(flow.data, null, 2);
                    const blob = new Blob([jsonContent], { type: 'application/json' });
                    const file = new File([blob], `${flow.id}.json`, { type: 'application/json' });
                    
                    // Salvar no FormStorage com o mesmo ID
                    const meta = await saveFormFile(file, flow.name, flow.id);
                    
                    // Sincronizar status de publicação
                    if (flow.isPublished) {
                      updatePublishStatus(flow.id, true);
                    }
                    
                    // Atualizar flow com filePath
                    flow.filePath = meta.filePath;
                    flow.mimeType = meta.mimeType;
                    flow.originalFileName = meta.originalFileName;
                    
                    migrated = true;
                    migrationSuccess = true;
                    console.log('[FlowStore] ✓ Fluxo migrado com sucesso:', {
                      id: flow.id,
                      filePath: meta.filePath,
                      isPublished: flow.isPublished
                    });
                  } catch (error) {
                    retries--;
                    console.error(`[FlowStore] ❌ Erro ao migrar fluxo (tentativas restantes: ${retries}):`, flow.id, error);
                    
                    if (retries === 0) {
                      const errorMsg = `Falha ao migrar "${flow.name}" (${flow.id})`;
                      migrationErrors.push(errorMsg);
                      console.error('[FlowStore] ❌ Migração falhou após todas as tentativas:', errorMsg);
                    } else {
                      // Aguarda antes de tentar novamente
                      await new Promise(resolve => setTimeout(resolve, 500));
                    }
                  }
                }
              }
            }
            
            // Notificar usuário sobre erros de migração
            if (migrationErrors.length > 0) {
              console.error('[FlowStore] ⚠️ ATENÇÃO: Alguns fluxos não puderam ser migrados:', migrationErrors);
              // Você pode adicionar uma notificação toast aqui se desejar
            }
            
            if (migrated) {
              console.log('[FlowStore] ✓ Migração completa, state atualizado');
            }
            
            console.log('[FlowStore] Hidratação completa!', {
              totalFlows: state.flows.length,
              flowIds: state.flows.map(f => f.id),
              migrated,
            });
            
            state.setHasHydrated(true);
          }
        };
      },
    }
  )
);
