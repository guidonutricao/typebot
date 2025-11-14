import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload, CheckCircle2, XCircle } from 'lucide-react';
import { toast } from 'sonner';
import { useFlowStore } from '@/stores/flowStore';
import { useNavigate } from 'react-router-dom';
import { parseFlowFile } from '@/utils/flowParser';
import { testConnection } from '@/utils/supabaseStorage';
import { supabase } from '@/lib/supabase';

interface CreateFlowDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateFlowDialog({ open, onOpenChange }: CreateFlowDialogProps) {
  const [name, setName] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState('');
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    const ext = selectedFile.name.toLowerCase();
    if (!ext.endsWith('.json') && !ext.endsWith('.js')) {
      setUploadStatus('error');
      setErrorMessage('Tipo de arquivo inválido. Use apenas .json ou .js');
      return;
    }

    try {
      // Parse do arquivo para validar
      const parseResult = await parseFlowFile(selectedFile);
      
      if (!parseResult.data) {
        setUploadStatus('error');
        setErrorMessage('Arquivo inválido. Verifique a estrutura do fluxo.');
        setFile(null);
        return;
      }

      setUploadStatus('success');
      setErrorMessage('');
      setFile(selectedFile);
      setFileName(selectedFile.name);
    } catch (error) {
      console.error('[CreateFlow] Erro ao validar arquivo:', error);
      setUploadStatus('error');
      setErrorMessage('Erro ao ler arquivo');
      setFile(null);
    }
  };

  const handleCreate = async () => {
    if (!name.trim()) {
      toast.error('Digite um nome para o formulário');
      return;
    }

    if (name.trim().length < 3) {
      toast.error('O nome deve ter pelo menos 3 caracteres');
      return;
    }

    if (!file) {
      toast.error('Selecione um arquivo válido');
      return;
    }

    try {
      setLoading(true);
      console.log('[CreateFlow] Criando novo fluxo...');
      
      // Testar conexão com Supabase
      const isConnected = await testConnection();
      if (!isConnected) {
        toast.error('Erro de conexão com o Supabase. Verifique sua internet e configuração.');
        return;
      }
      
      // Verificar autenticação
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) {
        console.error('[CreateFlow] Erro de autenticação:', authError);
        toast.error('Você precisa estar autenticado. Faça login novamente.');
        return;
      }
      
      console.log('[CreateFlow] Usuário autenticado:', user.id);
      
      // Parse do arquivo para obter os dados
      const parseResult = await parseFlowFile(file);
      
      if (!parseResult.data) {
        toast.error('Arquivo inválido');
        return;
      }
      
      console.log('[CreateFlow] Arquivo parseado com sucesso');
      
      // Salvar no Supabase usando o store
      const flowId = await useFlowStore.getState().addFlow(name.trim(), parseResult.data);
      console.log('[CreateFlow] Fluxo salvo no Supabase:', flowId);
      
      toast.success('Formulário criado com sucesso!');
      
      // Reset
      setName('');
      setFile(null);
      setFileName('');
      setUploadStatus('idle');
      onOpenChange(false);
      
      // Navigate
      navigate(`/admin/flow/${flowId}`);
    } catch (error: any) {
      console.error('[CreateFlow] Erro ao criar fluxo:', error);
      
      // Mensagens de erro mais específicas
      if (error.message?.includes('not authenticated') || error.message?.includes('JWT')) {
        toast.error('Erro de autenticação. Faça login novamente.');
      } else if (error.message?.includes('network') || error.message?.includes('fetch')) {
        toast.error('Erro de conexão. Verifique sua internet.');
      } else if (error.message?.includes('duplicate') || error.message?.includes('unique')) {
        toast.error('Já existe um formulário com este nome.');
      } else {
        toast.error(`Erro ao criar formulário: ${error.message || 'Verifique a conexão com o Supabase'}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (loading) return;
    setName('');
    setFile(null);
    setFileName('');
    setUploadStatus('idle');
    setErrorMessage('');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Criar Novo Formulário</DialogTitle>
          <DialogDescription>
            Dê um nome e faça upload do JSON exportado do Typebot
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="flow-name">Nome do Formulário</Label>
            <Input
              id="flow-name"
              placeholder="Ex: Check-in Mensal"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Arquivo JSON (Typebot Export)</Label>
            <div className="border-2 border-dashed rounded-lg p-6 text-center">
              <input
                type="file"
                accept=".json"
                onChange={handleFileChange}
                className="hidden"
                id="create-json-upload"
              />
              
              <label htmlFor="create-json-upload" className="cursor-pointer block">
                <div className="flex flex-col items-center gap-2">
                  {uploadStatus === 'success' ? (
                    <CheckCircle2 className="w-8 h-8 text-green-500" />
                  ) : uploadStatus === 'error' ? (
                    <XCircle className="w-8 h-8 text-destructive" />
                  ) : (
                    <Upload className="w-8 h-8 text-muted-foreground" />
                  )}
                  
                  <div>
                    <p className="text-sm font-medium">
                      {fileName || 'Selecione o arquivo JSON'}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Ou arraste aqui
                    </p>
                  </div>
                  
                  {uploadStatus === 'error' && (
                    <p className="text-xs text-destructive">{errorMessage}</p>
                  )}
                </div>
              </label>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={loading}>
            Cancelar
          </Button>
          <Button onClick={handleCreate} disabled={loading || !name.trim() || !file}>
            {loading ? 'Salvando...' : 'Criar Formulário'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
