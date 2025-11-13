import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye, Download, Rocket } from "lucide-react";
import { toast } from "sonner";
import { useFlowStore } from "@/stores/flowStore";
import { FileUploadZoneRaw } from "@/components/admin/FileUploadZoneRaw";
import { PublishDialog } from "@/components/admin/PublishDialog";
import { saveFormFile, getFileEntry } from "@/utils/formStorage";
import { parseFlowFile } from "@/utils/flowParser";

export default function Flow() {
  const { flowId } = useParams<{ flowId: string }>();
  const navigate = useNavigate();
  const getFlow = useFlowStore((state) => state.getFlow);
  const updateFlowFile = useFlowStore((state) => state.updateFlowFile);
  const togglePublish = useFlowStore((state) => state.togglePublish);
  
  const [flow, setFlow] = useState(flowId ? getFlow(flowId) : null);
  const [loading, setLoading] = useState(false);
  const [publishDialogOpen, setPublishDialogOpen] = useState(false);

  useEffect(() => {
    if (flowId) {
      const currentFlow = getFlow(flowId);
      if (!currentFlow) {
        toast.error("Formulário não encontrado");
        navigate("/admin/dashboard");
        return;
      }
      setFlow(currentFlow);
    }
  }, [flowId, getFlow, navigate]);

  const handleFileSelect = async (file: File) => {
    if (!flowId) return;
    
    try {
      setLoading(true);
      console.log('[Flow] Iniciando substituição do arquivo...');
      
      // Parse do novo arquivo
      const parseResult = await parseFlowFile(file);
      
      if (!parseResult.data) {
        toast.error(parseResult.error || 'Arquivo inválido');
        setLoading(false);
        return;
      }
      
      // Salvar novo arquivo no storage (sobrescreve o existente)
      const meta = await saveFormFile(file, flow?.name || 'Formulário', flowId);
      
      // Atualizar registro no store
      updateFlowFile(flowId, meta, parseResult.data);
      
      // Atualizar estado local
      setFlow(getFlow(flowId));
      
      toast.success("Arquivo atualizado com sucesso!");
      console.log('[Flow] Arquivo substituído:', meta.filePath);
    } catch (error) {
      console.error('[Flow] Erro ao atualizar arquivo:', error);
      toast.error("Erro ao atualizar arquivo");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    if (!flow || !flowId) return;
    
    try {
      // Tentar baixar o arquivo original do storage
      const fileEntry = getFileEntry(flowId);
      
      if (fileEntry) {
        // Decodificar base64
        const binaryString = atob(fileEntry.contentBase64);
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }
        
        const blob = new Blob([bytes], { type: fileEntry.mimeType });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileEntry.originalFileName;
        a.click();
        URL.revokeObjectURL(url);
        
        toast.success("Arquivo original baixado!");
        console.log('[Flow] Download do arquivo original:', fileEntry.originalFileName);
      } else {
        // Fallback: baixar flow.data como JSON
        const blob = new Blob([JSON.stringify(flow.data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${flow.name.toLowerCase().replace(/\s+/g, '-')}.json`;
        a.click();
        URL.revokeObjectURL(url);
        
        toast.success("Arquivo baixado (gerado do data)!");
        console.log('[Flow] Download do fallback JSON');
      }
    } catch (error) {
      console.error('[Flow] Erro ao baixar:', error);
      toast.error("Erro ao baixar arquivo");
    }
  };

  const handlePreview = () => {
    if (flowId && flow?.isPublished) {
      window.open(`/forms/${flowId}`, '_blank');
    } else {
      toast.error("Publique o formulário primeiro");
    }
  };

  const handleTogglePublish = () => {
    if (flowId) {
      togglePublish(flowId);
      setFlow(getFlow(flowId));
      toast.success(flow?.isPublished ? "Formulário despublicado" : "Formulário publicado!");
    }
  };

  if (!flow) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const totalBlocks = flow.data.groups.reduce((acc, g) => acc + g.blocks.length, 0);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-4">
        <div className="flex-1">
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-amber-600 bg-clip-text text-transparent">
            {flow.name}
          </h1>
          <p className="text-muted-foreground mt-2">
            Gerencie o JSON do seu formulário conversacional
          </p>
        </div>
        <Button 
          size="lg"
          onClick={() => setPublishDialogOpen(true)}
          className="gap-2"
        >
          <Rocket className="w-4 h-4" />
          {flow.isPublished ? 'Gerenciar Publicação' : 'Publicar'}
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Total de Grupos</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-primary">{flow.data.groups.length}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Total de Blocos</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-primary">{totalBlocks}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Variáveis</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-primary">{flow.data.variables?.length || 0}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Arquivo JSON do Typebot</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <FileUploadZoneRaw
            onFileSelect={handleFileSelect}
            currentFileName={flow.originalFileName || `${flow.name}.json`}
            currentFileDate={flow.updatedAt}
          />
          
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleDownload}>
              <Download className="w-4 h-4 mr-2" />
              Baixar JSON Atual
            </Button>
            <Button variant="outline" onClick={handlePreview}>
              <Eye className="w-4 h-4 mr-2" />
              Preview Fluxo
            </Button>
          </div>
        </CardContent>
      </Card>

      {flowId && (
        <PublishDialog
          open={publishDialogOpen}
          onOpenChange={setPublishDialogOpen}
          flowId={flowId}
          flowName={flow.name}
          isPublished={flow.isPublished}
          onTogglePublish={handleTogglePublish}
        />
      )}
    </div>
  );
}
