import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Copy, Check, ExternalLink } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import QRCode from "react-qr-code";

interface PublishDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  flowId: string;
  flowName: string;
  isPublished: boolean;
  onTogglePublish: () => void;
}

export function PublishDialog({
  open,
  onOpenChange,
  flowId,
  flowName,
  isPublished,
  onTogglePublish,
}: PublishDialogProps) {
  const [copied, setCopied] = useState(false);
  const publicUrl = `${window.location.origin}/forms/${flowId}`;
  
  console.log('[PublishDialog] Configuração do formulário:', {
    flowId,
    flowName,
    isPublished,
    publicUrl,
    origin: window.location.origin
  });

  const handleCopy = () => {
    navigator.clipboard.writeText(publicUrl);
    setCopied(true);
    toast.success("Link copiado!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleOpenPreview = () => {
    window.open(publicUrl, '_blank');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Publicar Formulário</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${isPublished ? 'bg-green-500' : 'bg-muted-foreground'}`} />
              <span className="text-sm font-medium">
                {isPublished ? 'Publicado' : 'Não Publicado'}
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              {flowName}
            </p>
          </div>

          {isPublished && (
            <>
              <div className="space-y-2">
                <label className="text-sm font-medium">Link Público</label>
                <div className="flex gap-2">
                  <Input 
                    value={publicUrl} 
                    readOnly 
                    className="flex-1"
                  />
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={handleCopy}
                  >
                    {copied ? (
                      <Check className="w-4 h-4 text-green-500" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </Button>
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={handleOpenPreview}
                  >
                    <ExternalLink className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="flex justify-center p-4 bg-white rounded-lg">
                <QRCode value={publicUrl} size={200} />
              </div>

              <p className="text-sm text-muted-foreground text-center">
                Qualquer pessoa com este link pode preencher o formulário
              </p>
            </>
          )}

          <div className="flex gap-2 justify-end">
            <Button
              variant={isPublished ? "destructive" : "default"}
              onClick={onTogglePublish}
            >
              {isPublished ? 'Despublicar' : 'Publicar Agora'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
