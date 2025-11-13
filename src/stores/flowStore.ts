import { create } from 'zustand';
import { FlowData } from '@/types/flow';
import * as supabaseStorage from '@/utils/supabaseStorage';

export interface Flow {
  id: string;
  name: string;
  slug?: string;
  data: FlowData;
  createdAt: string;
  updatedAt: string;
  isPublished: boolean;
  settings?: {
    theme?: string;
    customColors?: Record<string, string>;
    thankYouMessage?: string;
    redirectUrl?: string;
  };
}

interface FlowStore {
  flows: Flow[];
  activeFlowId: string | null;
  isLoading: boolean;
  
  loadFlows: () => Promise<void>;
  addFlow: (name: string, data: FlowData, slug?: string) => Promise<string>;
  updateFlow: (id: string, data: FlowData) => Promise<void>;
  updateFlowName: (id: string, name: string) => Promise<void>;
  updateFlowSlug: (id: string, slug: string) => Promise<void>;
  deleteFlow: (id: string) => Promise<void>;
  duplicateFlow: (id: string) => Promise<string>;
  getFlow: (id: string) => Flow | undefined;
  getFlowBySlug: (slug: string) => Flow | undefined;
  setActiveFlow: (id: string) => void;
  togglePublish: (id: string) => Promise<void>;
  getPublicUrl: (id: string) => string;
}

const generateId = () => {
  return 'flow_' + Date.now() + '_' + Math.random().toString(36).substring(2, 9);
};

export const useFlowStore = create<FlowStore>((set, get) => ({
  flows: [],
  activeFlowId: null,
  isLoading: false,

  loadFlows: async () => {
    set({ isLoading: true });
    try {
      const flowsData = await supabaseStorage.listFlows();
      const flows: Flow[] = flowsData.map(f => ({
        id: f.id,
        name: f.name,
        slug: f.slug,
        data: f.data,
        createdAt: f.createdAt,
        updatedAt: f.updatedAt,
        isPublished: f.isPublished,
        settings: f.settings,
      }));
      set({ flows, isLoading: false });
    } catch (error) {
      console.error('[FlowStore] Erro ao carregar fluxos:', error);
      set({ isLoading: false });
    }
  },

  addFlow: async (name: string, data: FlowData, slug?: string) => {
    try {
      const meta = await supabaseStorage.saveFlow(name, data, undefined, slug);
      
      const newFlow: Flow = {
        id: meta.id,
        name: meta.name,
        slug: meta.slug,
        data: meta.data,
        createdAt: meta.createdAt,
        updatedAt: meta.updatedAt,
        isPublished: meta.isPublished,
        settings: meta.settings,
      };
      
      set((state) => ({
        flows: [...state.flows, newFlow],
        activeFlowId: meta.id,
      }));
      
      console.log('[FlowStore] Novo fluxo criado:', { id: meta.id, name, slug: meta.slug });
      return meta.id;
    } catch (error) {
      console.error('[FlowStore] Erro ao criar fluxo:', error);
      throw error;
    }
  },

  updateFlow: async (id: string, data: FlowData) => {
    try {
      await supabaseStorage.updateFlowData(id, data);
      
      set((state) => ({
        flows: state.flows.map((flow) =>
          flow.id === id
            ? { ...flow, data, updatedAt: new Date().toISOString() }
            : flow
        ),
      }));
    } catch (error) {
      console.error('[FlowStore] Erro ao atualizar fluxo:', error);
      throw error;
    }
  },

  updateFlowName: async (id: string, name: string) => {
    try {
      await supabaseStorage.updateFlowName(id, name);
      
      set((state) => ({
        flows: state.flows.map((flow) =>
          flow.id === id
            ? { ...flow, name, updatedAt: new Date().toISOString() }
            : flow
        ),
      }));
    } catch (error) {
      console.error('[FlowStore] Erro ao atualizar nome:', error);
      throw error;
    }
  },

  updateFlowSlug: async (id: string, slug: string) => {
    try {
      await supabaseStorage.updateFlowSlug(id, slug);
      
      set((state) => ({
        flows: state.flows.map((flow) =>
          flow.id === id
            ? { ...flow, slug, updatedAt: new Date().toISOString() }
            : flow
        ),
      }));
      
      console.log('[FlowStore] Slug atualizado:', { id, slug });
    } catch (error) {
      console.error('[FlowStore] Erro ao atualizar slug:', error);
      throw error;
    }
  },

  deleteFlow: async (id: string) => {
    try {
      await supabaseStorage.deleteFlow(id);
      
      set((state) => ({
        flows: state.flows.filter((flow) => flow.id !== id),
        activeFlowId: state.activeFlowId === id ? null : state.activeFlowId,
      }));
    } catch (error) {
      console.error('[FlowStore] Erro ao deletar fluxo:', error);
      throw error;
    }
  },

  duplicateFlow: async (id: string) => {
    const flow = get().flows.find((f) => f.id === id);
    if (!flow) return '';
    
    try {
      const newId = generateId();
      const meta = await supabaseStorage.saveFlow(
        `${flow.name} (cópia)`,
        flow.data,
        newId
      );
      
      const duplicatedFlow: Flow = {
        id: meta.id,
        name: meta.name,
        slug: meta.slug,
        data: meta.data,
        createdAt: meta.createdAt,
        updatedAt: meta.updatedAt,
        isPublished: false,
        settings: flow.settings,
      };
      
      set((state) => ({
        flows: [...state.flows, duplicatedFlow],
      }));
      
      return meta.id;
    } catch (error) {
      console.error('[FlowStore] Erro ao duplicar fluxo:', error);
      return '';
    }
  },

  getFlow: (id: string) => {
    return get().flows.find((flow) => flow.id === id);
  },

  getFlowBySlug: (slug: string) => {
    return get().flows.find((flow) => flow.slug === slug);
  },

  setActiveFlow: (id: string) => {
    set({ activeFlowId: id });
  },

  getPublicUrl: (id: string) => {
    const baseUrl = typeof window !== 'undefined' 
      ? window.location.origin 
      : import.meta.env.VITE_BASE_URL || 'http://localhost:8080';
    return `${baseUrl}/forms/${id}`;
  },

  togglePublish: async (id: string) => {
    const flow = get().flows.find((f) => f.id === id);
    if (!flow) return;
    
    const newPublishStatus = !flow.isPublished;
    
    try {
      await supabaseStorage.updatePublishStatus(id, newPublishStatus);
      
      set((state) => ({
        flows: state.flows.map((flow) =>
          flow.id === id
            ? { ...flow, isPublished: newPublishStatus, updatedAt: new Date().toISOString() }
            : flow
        ),
      }));
      
      console.log('[FlowStore] Status de publicação atualizado:', { id, isPublished: newPublishStatus });
    } catch (error) {
      console.error('[FlowStore] Erro ao atualizar publicação:', error);
      throw error;
    }
  },
}));
