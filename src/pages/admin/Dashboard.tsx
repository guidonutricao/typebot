import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Card } from '@/components/design-system';
import { Plus, FileText, LogOut } from 'lucide-react';
import { useFlowStore } from '@/stores/flowStore';
import { useAuthStore } from '@/stores/authStore';
import { FlowCard } from '@/components/admin/FlowCard';
import { CreateFlowDialog } from '@/components/admin/CreateFlowDialog';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

export default function Dashboard() {
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  
  const flows = useFlowStore((state) => state.flows);
  const getFlow = useFlowStore((state) => state.getFlow);
  const deleteFlow = useFlowStore((state) => state.deleteFlow);
  const duplicateFlow = useFlowStore((state) => state.duplicateFlow);
  const togglePublish = useFlowStore((state) => state.togglePublish);
  const updateFlowName = useFlowStore((state) => state.updateFlowName);
  const addFlow = useFlowStore((state) => state.addFlow);
  
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logout realizado com sucesso');
      navigate('/auth');
    } catch (error) {
      toast.error('Erro ao fazer logout');
    }
  };

  // Migration: Import existing flow.json on first load
  useEffect(() => {
    if (!isInitialized && flows.length === 0) {
      fetch('/flow.json')
        .then((res) => res.json())
        .then((data) => {
          addFlow('Meu Primeiro Formulário', data);
          toast.success('Formulário importado com sucesso!');
        })
        .catch(() => {
          // No flow.json to migrate, that's ok
        })
        .finally(() => {
          setIsInitialized(true);
        });
    } else {
      setIsInitialized(true);
    }
  }, [flows.length, addFlow, isInitialized]);

  const handleEdit = (flowId: string) => {
    navigate(`/admin/flow/${flowId}`);
  };

  const handlePreview = (flowId: string) => {
    const flow = getFlow(flowId);
    if (flow?.isPublished) {
      window.open(`/forms/${flowId}`, '_blank');
    } else {
      toast.error("Publique o formulário primeiro para visualizar");
    }
  };

  const handleDelete = (flowId: string) => {
    deleteFlow(flowId);
    toast.success('Formulário excluído');
  };

  const handleDuplicate = (flowId: string) => {
    const newId = duplicateFlow(flowId);
    if (newId) {
      toast.success('Formulário duplicado');
    }
  };

  const handleTogglePublish = (flowId: string) => {
    togglePublish(flowId);
    const flow = flows.find((f) => f.id === flowId);
    toast.success(flow?.isPublished ? 'Formulário despublicado' : 'Formulário publicado');
  };

  const handleUpdateName = (flowId: string, name: string) => {
    updateFlowName(flowId, name);
  };

  if (!isInitialized) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in bg-[#0f172a] min-h-screen p-6">
      <div className="flex items-center gap-4">
        <Button 
          variant="secondary" 
          onClick={handleLogout}
          className="shrink-0"
        >
          <LogOut className="w-4 h-4" />
        </Button>
        
        <div className="flex-1 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-white via-[#22d3ee] to-white bg-clip-text text-transparent">
              Meus Formulários
            </h1>
            <p className="text-[rgba(165,243,252,0.7)] mt-2 text-lg">
              Gerencie seus formulários conversacionais
            </p>
          </div>
          <Button variant="primary" onClick={() => setShowCreateDialog(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Novo Fluxo
          </Button>
        </div>
      </div>

      {flows.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex items-center justify-center py-20"
        >
          <Card className="max-w-md text-center space-y-4">
            <div className="mx-auto w-12 h-12 rounded-full bg-gradient-to-r from-[rgba(6,182,212,0.125)] to-[rgba(3,105,161,0.125)] flex items-center justify-center">
              <FileText className="w-6 h-6 text-[#22d3ee]" />
            </div>
            <div>
              <h3 className="font-semibold text-lg text-white">Nenhum formulário ainda</h3>
              <p className="text-sm text-[rgba(165,243,252,0.7)] mt-1">
                Comece criando seu primeiro formulário conversacional
              </p>
            </div>
            <Button variant="primary" onClick={() => setShowCreateDialog(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Criar Primeiro Formulário
            </Button>
          </Card>
        </motion.div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {flows.map((flow) => (
              <FlowCard
                key={flow.id}
                flow={flow}
                onEdit={() => handleEdit(flow.id)}
                onPreview={() => handlePreview(flow.id)}
                onDelete={() => handleDelete(flow.id)}
                onDuplicate={() => handleDuplicate(flow.id)}
                onTogglePublish={() => handleTogglePublish(flow.id)}
                onUpdateName={(name) => handleUpdateName(flow.id, name)}
              />
            ))}
          </AnimatePresence>
        </div>
      )}

      <CreateFlowDialog open={showCreateDialog} onOpenChange={setShowCreateDialog} />
    </div>
  );
}
