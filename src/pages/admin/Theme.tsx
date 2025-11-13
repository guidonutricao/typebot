import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { useThemeStore } from "@/stores/themeStore";
import { toast } from "sonner";
import { Send, Bot, User, Save, RotateCcw } from "lucide-react";
import { useState } from "react";

export default function Theme() {
  const { theme, updateTheme, resetTheme } = useThemeStore();
  const [chatMessages, setChatMessages] = useState([
    { type: 'bot', text: 'Olá! Como posso ajudar você hoje?' },
    { type: 'user', text: 'Gostaria de saber mais sobre o produto' },
    { type: 'bot', text: 'Claro! Temos várias opções disponíveis. Qual categoria te interessa?' },
  ]);
  const [inputMessage, setInputMessage] = useState('');

  const handleSave = () => {
    toast.success("Alterações salvas com sucesso!", {
      description: "Seu tema personalizado foi salvo e será aplicado em todo o sistema."
    });
  };

  const handleReset = () => {
    resetTheme();
    toast.success("Tema resetado para o padrão");
  };

  const handleSendMessage = () => {
    if (inputMessage.trim()) {
      setChatMessages([...chatMessages, { type: 'user', text: inputMessage }]);
      setInputMessage('');
      setTimeout(() => {
        setChatMessages(prev => [...prev, { type: 'bot', text: 'Esta é uma resposta de exemplo!' }]);
      }, 500);
    }
  };

  const getShadowClass = () => {
    switch (theme.shadowIntensity) {
      case 'none': return '';
      case 'sm': return 'shadow-sm';
      case 'md': return 'shadow-md';
      case 'lg': return 'shadow-lg';
      default: return 'shadow-md';
    }
  };

  const getSpacingClass = () => {
    switch (theme.spacing) {
      case 'compact': return 'space-y-2';
      case 'normal': return 'space-y-4';
      case 'relaxed': return 'space-y-6';
      default: return 'space-y-4';
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-amber-600 bg-clip-text text-transparent">
          Customização de Tema
        </h1>
        <p className="text-muted-foreground mt-2">
          Personalize as cores, estilo e visualize em tempo real
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Cores Principais</CardTitle>
              <CardDescription>Defina a paleta de cores do sistema</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="primary">Cor Primária</Label>
                <div className="flex gap-2">
                  <Input
                    id="primary"
                    type="color"
                    value={theme.primaryColor}
                    onChange={(e) => updateTheme({ primaryColor: e.target.value })}
                    className="w-20 h-10"
                  />
                  <Input
                    type="text"
                    value={theme.primaryColor}
                    onChange={(e) => updateTheme({ primaryColor: e.target.value })}
                    className="flex-1"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="secondary">Cor Secundária</Label>
                <div className="flex gap-2">
                  <Input
                    id="secondary"
                    type="color"
                    value={theme.secondaryColor}
                    onChange={(e) => updateTheme({ secondaryColor: e.target.value })}
                    className="w-20 h-10"
                  />
                  <Input
                    type="text"
                    value={theme.secondaryColor}
                    onChange={(e) => updateTheme({ secondaryColor: e.target.value })}
                    className="flex-1"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="background">Background</Label>
                <div className="flex gap-2">
                  <Input
                    id="background"
                    type="color"
                    value={theme.backgroundColor}
                    onChange={(e) => updateTheme({ backgroundColor: e.target.value })}
                    className="w-20 h-10"
                  />
                  <Input
                    type="text"
                    value={theme.backgroundColor}
                    onChange={(e) => updateTheme({ backgroundColor: e.target.value })}
                    className="flex-1"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="textColor">Cor do Texto</Label>
                <div className="flex gap-2">
                  <Input
                    id="textColor"
                    type="color"
                    value={theme.textColor}
                    onChange={(e) => updateTheme({ textColor: e.target.value })}
                    className="w-20 h-10"
                  />
                  <Input
                    type="text"
                    value={theme.textColor}
                    onChange={(e) => updateTheme({ textColor: e.target.value })}
                    className="flex-1"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Cores do Chat</CardTitle>
              <CardDescription>Personalize as bolhas de mensagem</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="chatUser">Bolha do Usuário</Label>
                <div className="flex gap-2">
                  <Input
                    id="chatUser"
                    type="color"
                    value={theme.chatBubbleUser}
                    onChange={(e) => updateTheme({ chatBubbleUser: e.target.value })}
                    className="w-20 h-10"
                  />
                  <Input
                    type="text"
                    value={theme.chatBubbleUser}
                    onChange={(e) => updateTheme({ chatBubbleUser: e.target.value })}
                    className="flex-1"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="chatBot">Bolha do Bot</Label>
                <div className="flex gap-2">
                  <Input
                    id="chatBot"
                    type="color"
                    value={theme.chatBubbleBot}
                    onChange={(e) => updateTheme({ chatBubbleBot: e.target.value })}
                    className="w-20 h-10"
                  />
                  <Input
                    type="text"
                    value={theme.chatBubbleBot}
                    onChange={(e) => updateTheme({ chatBubbleBot: e.target.value })}
                    className="flex-1"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Tipografia e Estilo</CardTitle>
              <CardDescription>Configure fonte e elementos visuais</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="font">Fonte</Label>
                <Select 
                  value={theme.fontFamily} 
                  onValueChange={(value) => updateTheme({ fontFamily: value })}
                >
                  <SelectTrigger id="font">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Inter">Inter</SelectItem>
                    <SelectItem value="Roboto">Roboto</SelectItem>
                    <SelectItem value="Poppins">Poppins</SelectItem>
                    <SelectItem value="Open Sans">Open Sans</SelectItem>
                    <SelectItem value="Montserrat">Montserrat</SelectItem>
                    <SelectItem value="Lato">Lato</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="buttonStyle">Estilo dos Botões</Label>
                <Select 
                  value={theme.buttonStyle} 
                  onValueChange={(value: any) => updateTheme({ buttonStyle: value })}
                >
                  <SelectTrigger id="buttonStyle">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="rounded">Arredondado</SelectItem>
                    <SelectItem value="square">Quadrado</SelectItem>
                    <SelectItem value="pill">Pill</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="shadow">Intensidade da Sombra</Label>
                <Select 
                  value={theme.shadowIntensity} 
                  onValueChange={(value: any) => updateTheme({ shadowIntensity: value })}
                >
                  <SelectTrigger id="shadow">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Nenhuma</SelectItem>
                    <SelectItem value="sm">Pequena</SelectItem>
                    <SelectItem value="md">Média</SelectItem>
                    <SelectItem value="lg">Grande</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="spacing">Espaçamento</Label>
                <Select 
                  value={theme.spacing} 
                  onValueChange={(value: any) => updateTheme({ spacing: value })}
                >
                  <SelectTrigger id="spacing">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="compact">Compacto</SelectItem>
                    <SelectItem value="normal">Normal</SelectItem>
                    <SelectItem value="relaxed">Relaxado</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="borderRadius">Raio das Bordas</Label>
                <Input
                  id="borderRadius"
                  type="text"
                  value={theme.borderRadius}
                  onChange={(e) => updateTheme({ borderRadius: e.target.value })}
                  placeholder="0.5rem"
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-3">
            <Button 
              onClick={handleSave} 
              className="flex-1 gap-2"
              style={{ backgroundColor: theme.primaryColor }}
            >
              <Save className="w-4 h-4" />
              Salvar Alterações
            </Button>
            <Button 
              onClick={handleReset} 
              variant="outline" 
              className="flex-1 gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              Resetar
            </Button>
          </div>
        </div>

        <div className="space-y-6 lg:sticky lg:top-6">
          <Card>
            <CardHeader>
              <CardTitle>Preview do Chat</CardTitle>
              <CardDescription>Visualização em tempo real do chat</CardDescription>
            </CardHeader>
            <CardContent>
              <div 
                className={`rounded-lg border flex flex-col h-[500px] ${getShadowClass()}`}
                style={{ 
                  backgroundColor: theme.backgroundColor,
                  fontFamily: theme.fontFamily,
                  borderRadius: theme.borderRadius
                }}
              >
                {/* Chat Header */}
                <div 
                  className="p-4 border-b flex items-center gap-3"
                  style={{ 
                    backgroundColor: theme.primaryColor,
                    borderRadius: `${theme.borderRadius} ${theme.borderRadius} 0 0`
                  }}
                >
                  <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                    <Bot className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">Assistente Virtual</h3>
                    <p className="text-xs text-white/80">Online</p>
                  </div>
                </div>

                {/* Chat Messages */}
                <div className={`flex-1 overflow-y-auto p-4 ${getSpacingClass()}`}>
                  {chatMessages.map((msg, idx) => (
                    <div 
                      key={idx}
                      className={`flex items-start gap-2 ${msg.type === 'user' ? 'flex-row-reverse' : ''}`}
                    >
                      <div 
                        className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${getShadowClass()}`}
                        style={{ 
                          backgroundColor: msg.type === 'user' ? theme.chatBubbleUser : theme.chatBubbleBot
                        }}
                      >
                        {msg.type === 'user' ? (
                          <User className="w-4 h-4 text-white" />
                        ) : (
                          <Bot className="w-4 h-4" style={{ color: theme.textColor }} />
                        )}
                      </div>
                      <div 
                        className={`max-w-[75%] p-3 ${getShadowClass()}`}
                        style={{ 
                          backgroundColor: msg.type === 'user' ? theme.chatBubbleUser : theme.chatBubbleBot,
                          color: msg.type === 'user' ? '#ffffff' : theme.textColor,
                          borderRadius: theme.borderRadius
                        }}
                      >
                        <p className="text-sm">{msg.text}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Chat Input */}
                <div className="p-4 border-t">
                  <div className="flex gap-2">
                    <Input
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      placeholder="Digite sua mensagem..."
                      className="flex-1"
                      style={{ 
                        borderRadius: theme.borderRadius,
                        fontFamily: theme.fontFamily
                      }}
                    />
                    <Button
                      onClick={handleSendMessage}
                      size="icon"
                      style={{ 
                        backgroundColor: theme.primaryColor,
                        borderRadius: theme.buttonStyle === 'pill' ? '9999px' : 
                                     theme.buttonStyle === 'square' ? '0' : theme.borderRadius
                      }}
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Preview de Elementos</CardTitle>
              <CardDescription>Outros componentes do sistema</CardDescription>
            </CardHeader>
            <CardContent>
              <div 
                className={`rounded-lg border p-6 ${getSpacingClass()}`}
                style={{ 
                  backgroundColor: theme.backgroundColor,
                  fontFamily: theme.fontFamily,
                  borderRadius: theme.borderRadius
                }}
              >
                <h3 
                  className="text-2xl font-bold" 
                  style={{ color: theme.primaryColor }}
                >
                  Título de Exemplo
                </h3>
                <p style={{ color: theme.textColor }}>
                  Este é um exemplo de texto com a cor personalizada.
                </p>
                <div className="flex gap-2 flex-wrap">
                  <Button 
                    className={getShadowClass()}
                    style={{ 
                      backgroundColor: theme.primaryColor,
                      borderRadius: theme.buttonStyle === 'pill' ? '9999px' : 
                                   theme.buttonStyle === 'square' ? '0' : theme.borderRadius
                    }}
                  >
                    Botão Primário
                  </Button>
                  <Button 
                    variant="outline"
                    className={getShadowClass()}
                    style={{ 
                      borderColor: theme.secondaryColor,
                      color: theme.secondaryColor,
                      borderRadius: theme.buttonStyle === 'pill' ? '9999px' : 
                                   theme.buttonStyle === 'square' ? '0' : theme.borderRadius
                    }}
                  >
                    Botão Secundário
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
