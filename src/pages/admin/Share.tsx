import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Copy, QrCode, Code, Share2 } from "lucide-react";
import QRCodeSVG from "react-qr-code";
import {
  WhatsappShareButton,
  TelegramShareButton,
  EmailShareButton,
  WhatsappIcon,
  TelegramIcon,
  EmailIcon,
} from "react-share";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function Share() {
  const formUrl = `${window.location.origin}/form`;
  const embedCode = `<iframe src="${formUrl}" width="100%" height="600" frameborder="0"></iframe>`;
  const [isActive, setIsActive] = useState(true);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copiado!`);
  };

  return (
    <div className="max-w-3xl space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-amber-600 bg-clip-text text-transparent">
          Compartilhar Formulário
        </h1>
        <p className="text-muted-foreground mt-2">
          Publique e compartilhe seu formulário com o mundo
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Status de Publicação</CardTitle>
              <CardDescription>Controle a disponibilidade do formulário</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${isActive ? 'bg-green-500' : 'bg-red-500'}`} />
              <span className="font-medium">{isActive ? 'Ativo' : 'Pausado'}</span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsActive(!isActive)}
              >
                {isActive ? 'Pausar' : 'Ativar'}
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Share2 className="w-5 h-5" />
            Link Público
          </CardTitle>
          <CardDescription>Compartilhe este link com seus usuários</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>URL do Formulário</Label>
            <div className="flex gap-2">
              <Input value={formUrl} readOnly className="flex-1" />
              <Button
                variant="outline"
                size="icon"
                onClick={() => copyToClipboard(formUrl, "Link")}
              >
                <Copy className="w-4 h-4" />
              </Button>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" size="icon">
                    <QrCode className="w-4 h-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>QR Code</DialogTitle>
                    <DialogDescription>
                      Escaneie para acessar o formulário
                    </DialogDescription>
                  </DialogHeader>
                  <div className="flex justify-center p-4">
                    <QRCodeSVG value={formUrl} size={256} />
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Compartilhar em Redes Sociais</Label>
            <div className="flex gap-2">
              <WhatsappShareButton url={formUrl} title="Preencha nosso formulário">
                <WhatsappIcon size={40} round />
              </WhatsappShareButton>
              <TelegramShareButton url={formUrl} title="Preencha nosso formulário">
                <TelegramIcon size={40} round />
              </TelegramShareButton>
              <EmailShareButton url={formUrl} subject="Formulário" body="Confira este formulário:">
                <EmailIcon size={40} round />
              </EmailShareButton>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Code className="w-5 h-5" />
            Incorporar (Embed)
          </CardTitle>
          <CardDescription>Adicione o formulário ao seu site</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Código HTML</Label>
            <div className="relative">
              <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
                <code>{embedCode}</code>
              </pre>
              <Button
                variant="outline"
                size="sm"
                className="absolute top-2 right-2"
                onClick={() => copyToClipboard(embedCode, "Código")}
              >
                <Copy className="w-4 h-4 mr-2" />
                Copiar
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Preview do Iframe</Label>
            <div className="border rounded-lg overflow-hidden">
              <iframe
                src={formUrl}
                className="w-full h-96"
                title="Form Preview"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
