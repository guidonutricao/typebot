import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { WelcomeScreen } from "@/components/WelcomeScreen";
import { ChatMessage } from "@/components/ChatMessage";
import { ChatInput, ChoiceButton } from "@/components/ChatInput";
import { SummaryScreen } from "@/components/SummaryScreen";
import { ThankYouScreen } from "@/components/ThankYouScreen";
import { RedirectScreen } from "@/components/RedirectScreen";
import { ImageBlock } from "@/components/blocks/ImageBlock";
import { NumberInput } from "@/components/blocks/NumberInput";
import { FileUploadInput } from "@/components/blocks/FileUploadInput";
import { RatingInput } from "@/components/blocks/RatingInput";
import { useFlowNavigation } from "@/hooks/useFlowNavigation";
import { useFlowStore } from "@/stores/flowStore";
import { useThemeStore } from "@/stores/themeStore";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  FlowData, 
  TextBlock, 
  ImageBlock as ImageBlockType,
  TextInputBlock, 
  NumberInputBlock,
  ChoiceInputBlock,
  FileUploadBlock,
  RatingBlock,
  RedirectBlock,
  RichTextElement
} from "@/types/flow";
import { toast } from "sonner";
import { getFlowBySlug, getFlow } from "@/utils/supabaseStorage";

// Debug utilities (disponível no console)
if (import.meta.env.DEV) {
  import('@/utils/debugStorage');
}

type ScreenType = 'welcome' | 'chat' | 'summary' | 'thank-you' | 'redirect';

type Message = {
  content?: string;
  richText?: RichTextElement[];
  isBot: boolean;
  image?: string;
};

const Index = () => {
  const { formId } = useParams<{ formId: string }>();
  const navigate = useNavigate();
  const { theme } = useThemeStore();
  
  const [screen, setScreen] = useState<ScreenType>('welcome');
  const [flowData, setFlowData] = useState<FlowData | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [waitingForInput, setWaitingForInput] = useState(false);
  const [redirectUrl, setRedirectUrl] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

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

  const getButtonRadius = () => {
    switch (theme.buttonStyle) {
      case 'pill': return '9999px';
      case 'square': return '0';
      case 'rounded': return theme.borderRadius;
      default: return theme.borderRadius;
    }
  };

  useEffect(() => {
    const loadFlowData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Sem formId = usar flow.json padrão
        if (!formId) {
          console.log('[Form] Carregando flow.json padrão');
          const response = await fetch("/flow.json");
          if (!response.ok) throw new Error("Failed to load flow");
          const data = await response.json();
          setFlowData(data);
          setLoading(false);
          return;
        }

        console.log('[Form] ========================================');
        console.log('[Form] Carregando fluxo do Supabase');
        console.log('[Form] ID/Slug recebido:', formId);
        console.log('[Form] ========================================');
        
        // Tentar buscar por ID primeiro
        let flowMeta = await getFlow(formId);
        
        // Se não encontrar por ID, tentar por slug
        if (!flowMeta) {
          console.log('[Form] Não encontrado por ID, tentando por slug...');
          flowMeta = await getFlowBySlug(formId);
        }
        
        if (!flowMeta) {
          console.error('[Form] ❌ Fluxo não encontrado no Supabase');
          setError("not-found");
          setLoading(false);
          return;
        }

        console.log('[Form] ✓ Fluxo encontrado:', {
          id: flowMeta.id,
          name: flowMeta.name,
          slug: flowMeta.slug,
          isPublished: flowMeta.isPublished
        });

        // Verificar se está publicado
        if (!flowMeta.isPublished) {
          console.log('[Form] Formulário não publicado');
          setError("not-published");
          setLoading(false);
          return;
        }

        // Usar os dados do fluxo
        if (!flowMeta.data) {
          console.error('[Form] ❌ Dados do fluxo não encontrados');
          setError("load-error");
          setLoading(false);
          return;
        }

        console.log('[Form] ✓ Fluxo carregado com sucesso:', {
          groups: flowMeta.data.groups?.length || 0,
          variables: flowMeta.data.variables?.length || 0
        });

        setFlowData(flowMeta.data);
      } catch (err) {
        console.error("[Form] ❌ Erro ao carregar flow:", err);
        setError("load-error");
      } finally {
        setLoading(false);
      }
    };

    loadFlowData();
  }, [formId]);

  const {
    currentBlock,
    goToNextBlock,
    addResponse,
    responses,
    resetFlow,
    isFlowComplete,
    interpolateText
  } = useFlowNavigation(flowData);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const extractTextFromBlock = (block: TextBlock): string => {
    const text = block.content.richText
      .map(rt => rt.children.map(c => c.text).join(' '))
      .join('\n');
    return interpolateText(text);
  };

  const showBotMessage = async (richText?: RichTextElement[], image?: string) => {
    setIsTyping(true);
    await new Promise(resolve => setTimeout(resolve, 800));
    setIsTyping(false);
    
    if (richText) {
      console.log('[Form] Original richText:', richText);
      
      // Interpolate variables in rich text - substitui {{variableName}} pelos valores
      const interpolatedRichText = richText.map(element => ({
        ...element,
        children: element.children.map(child => {
          const originalText = child.text;
          const interpolatedText = interpolateText(child.text);
          
          console.log('[Form] Interpolating:', {
            original: originalText,
            interpolated: interpolatedText,
            changed: originalText !== interpolatedText
          });
          
          return {
            ...child,
            text: interpolatedText // Substitui {{var}} pelo valor da variável
          };
        })
      }));
      
      console.log('[Form] Interpolated richText:', interpolatedRichText);
      setMessages(prev => [...prev, { richText: interpolatedRichText, isBot: true, image }]);
    }
  };

  const processBlock = async () => {
    if (!currentBlock) {
      if (isFlowComplete()) {
        setScreen('summary');
      }
      return;
    }

    setWaitingForInput(false);

    switch (currentBlock.type) {
      case 'text':
        const textBlock = currentBlock as TextBlock;
        await showBotMessage(textBlock.content.richText);
        setTimeout(() => goToNextBlock(), 1500);
        break;

      case 'image':
        const imageBlock = currentBlock as ImageBlockType;
        setMessages(prev => [...prev, { 
          content: '', 
          isBot: true, 
          image: imageBlock.content.url 
        }]);
        setTimeout(() => goToNextBlock(), 1000);
        break;

      case 'text input':
      case 'number input':
        setWaitingForInput(true);
        break;

      case 'choice input':
        setWaitingForInput(true);
        break;

      case 'file upload':
        setWaitingForInput(true);
        break;

      case 'rating':
        setWaitingForInput(true);
        break;

      case 'Redirect':
        const redirectBlock = currentBlock as RedirectBlock;
        setRedirectUrl(redirectBlock.options.url);
        setScreen('redirect');
        break;

      case 'Set variable':
        // Handle set variable silently and continue
        goToNextBlock();
        break;

      default:
        console.log('Tipo de bloco não implementado:', (currentBlock as any).type);
        goToNextBlock();
        break;
    }
  };

  useEffect(() => {
    if (screen === 'chat' && currentBlock) {
      processBlock();
    }
  }, [currentBlock, screen]);

  const handleStart = () => {
    setScreen('chat');
    resetFlow();
    setMessages([]);
  };

  const handleTextInput = (value: string) => {
    const inputBlock = currentBlock as TextInputBlock | NumberInputBlock;
    setMessages(prev => [...prev, { content: value, isBot: false }]);
    addResponse(inputBlock.id, value, inputBlock.options?.variableId);
    setWaitingForInput(false);
    setTimeout(() => goToNextBlock(), 500);
  };

  const handleFileUpload = (files: string[]) => {
    const fileBlock = currentBlock as FileUploadBlock;
    setMessages(prev => [...prev, { 
      content: `${files.length} foto(s) enviada(s)`, 
      isBot: false 
    }]);
    addResponse(fileBlock.id, files, fileBlock.options?.variableId);
    setWaitingForInput(false);
    setTimeout(() => goToNextBlock(), 500);
  };

  const handleRatingSelect = (value: number) => {
    const ratingBlock = currentBlock as RatingBlock;
    setMessages(prev => [...prev, { content: value.toString(), isBot: false }]);
    addResponse(ratingBlock.id, value.toString(), ratingBlock.options?.variableId);
    setWaitingForInput(false);
    setTimeout(() => goToNextBlock(), 500);
  };

  const handleChoiceInput = (choice: string, itemId?: string) => {
    const choiceBlock = currentBlock as ChoiceInputBlock;
    setMessages(prev => [...prev, { content: choice, isBot: false }]);
    
    // ✅ FIX: Passar o variableId do choice block (se existir)
    addResponse(
      choiceBlock.id, 
      choice, 
      choiceBlock.options?.variableId // Usar optional chaining
    );
    
    setWaitingForInput(false);
    
    // ✅ FIX: Aumentar delay para garantir que o estado seja atualizado
    setTimeout(() => {
      const item = choiceBlock.items.find(i => i.id === itemId);
      goToNextBlock(item?.outgoingEdgeId);
    }, 100); // Delay maior para garantir atualização do estado
  };

  const handleSummarySubmit = () => {
    setScreen('thank-you');
    toast.success("Suas respostas foram enviadas!");
  };

  const handleRestart = () => {
    setScreen('welcome');
    resetFlow();
    setMessages([]);
  };

  if (loading) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center"
        style={{ 
          backgroundColor: theme.backgroundColor,
          fontFamily: theme.fontFamily 
        }}
      >
        <div className="text-center">
          <div 
            className="w-16 h-16 border-4 border-t-transparent rounded-full animate-spin mx-auto mb-4" 
            style={{ borderColor: `${theme.primaryColor}40`, borderTopColor: theme.primaryColor }}
          />
          <p style={{ color: theme.textColor }}>Carregando formulário...</p>
        </div>
      </div>
    );
  }

  if (error === "not-found") {
    return (
      <div 
        className="min-h-screen flex items-center justify-center p-4"
        style={{ 
          backgroundColor: theme.backgroundColor,
          fontFamily: theme.fontFamily 
        }}
      >
        <Card 
          className={`max-w-md w-full ${getShadowClass()}`}
          style={{ borderRadius: theme.borderRadius }}
        >
          <CardContent className="pt-6 text-center space-y-4">
            <div className="w-16 h-16 mx-auto bg-destructive/10 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-destructive" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold" style={{ color: theme.textColor }}>
              Formulário não encontrado
            </h2>
            <p style={{ color: theme.textColor, opacity: 0.7 }}>
              Este formulário não existe ou foi excluído.
            </p>
            {formId && (
              <div className="space-y-2">
                <p className="text-xs font-mono bg-muted p-2 rounded" style={{ color: theme.textColor, opacity: 0.7 }}>
                  ID buscado: {formId}
                </p>
                {import.meta.env.DEV && (
                  <p className="text-xs" style={{ color: theme.textColor, opacity: 0.7 }}>
                    💡 Abra o console e digite <code className="bg-muted px-1 rounded">debugStorage()</code> para diagnosticar
                  </p>
                )}
              </div>
            )}
            <Button 
              onClick={() => navigate("/admin/dashboard")}
              style={{ 
                backgroundColor: theme.primaryColor,
                borderRadius: getButtonRadius()
              }}
            >
              Voltar ao Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error === "not-published") {
    return (
      <div 
        className="min-h-screen flex items-center justify-center p-4"
        style={{ 
          backgroundColor: theme.backgroundColor,
          fontFamily: theme.fontFamily 
        }}
      >
        <Card 
          className={`max-w-md w-full ${getShadowClass()}`}
          style={{ borderRadius: theme.borderRadius }}
        >
          <CardContent className="pt-6 text-center space-y-4">
            <div className="w-16 h-16 mx-auto bg-muted rounded-full flex items-center justify-center">
              <svg className="w-8 h-8" style={{ color: theme.textColor, opacity: 0.5 }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold" style={{ color: theme.textColor }}>
              Formulário não publicado
            </h2>
            <p style={{ color: theme.textColor, opacity: 0.7 }}>
              Este formulário não está disponível no momento.
            </p>
            <Button 
              onClick={() => navigate("/")}
              style={{ 
                backgroundColor: theme.primaryColor,
                borderRadius: getButtonRadius()
              }}
            >
              Voltar ao início
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center p-4"
        style={{ 
          backgroundColor: theme.backgroundColor,
          fontFamily: theme.fontFamily 
        }}
      >
        <Card 
          className={`max-w-md w-full ${getShadowClass()}`}
          style={{ borderRadius: theme.borderRadius }}
        >
          <CardContent className="pt-6 text-center space-y-4">
            <div className="w-16 h-16 mx-auto bg-destructive/10 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-destructive" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold" style={{ color: theme.textColor }}>
              Erro ao Carregar
            </h2>
            <p style={{ color: theme.textColor, opacity: 0.7 }}>
              Erro ao carregar o formulário. Tente novamente.
            </p>
            <Button 
              onClick={() => window.location.reload()}
              style={{ 
                backgroundColor: theme.primaryColor,
                borderRadius: getButtonRadius()
              }}
            >
              Tentar Novamente
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen"
      style={{ 
        backgroundColor: theme.backgroundColor,
        fontFamily: theme.fontFamily 
      }}
    >
      <AnimatePresence mode="wait">
        {screen === 'welcome' && (
          <WelcomeScreen 
            formName={flowData.name} 
            onStart={handleStart}
          />
        )}

        {screen === 'chat' && (
          <div className="max-w-3xl mx-auto min-h-screen flex flex-col">
            <div className={`flex-1 overflow-y-auto p-4 pt-20 pb-32 ${getSpacingClass()}`}>
              {messages.map((msg, idx) => (
                <div key={idx}>
                  {msg.image && !msg.richText && !msg.content ? (
                    <ImageBlock url={msg.image} />
                  ) : (
                    <ChatMessage
                      content={msg.content}
                      richText={msg.richText}
                      isBot={msg.isBot}
                    />
                  )}
                </div>
              ))}
              {isTyping && <ChatMessage isBot isTyping />}
              <div ref={messagesEndRef} />
            </div>

            <div 
              className="fixed bottom-0 left-0 right-0 p-4 pb-6"
              style={{
                background: `linear-gradient(to top, ${theme.backgroundColor}, ${theme.backgroundColor}ee, transparent)`
              }}
            >
              <div className="max-w-3xl mx-auto">
                {waitingForInput && currentBlock?.type === 'text input' && (
                  <ChatInput
                    onSubmit={handleTextInput}
                    placeholder={(currentBlock as TextInputBlock).options?.labels?.placeholder || 'Digite sua resposta'}
                    buttonLabel={(currentBlock as TextInputBlock).options?.labels?.button || 'Enviar'}
                    isLong={(currentBlock as TextInputBlock).options?.isLong}
                  />
                )}

                {waitingForInput && currentBlock?.type === 'number input' && (
                  <NumberInput
                    onSubmit={handleTextInput}
                    placeholder={(currentBlock as NumberInputBlock).options?.labels?.placeholder || 'Digite um número'}
                    buttonLabel={(currentBlock as NumberInputBlock).options?.labels?.button || 'Enviar'}
                  />
                )}

                {waitingForInput && currentBlock?.type === 'file upload' && (
                  <FileUploadInput
                    onSubmit={handleFileUpload}
                    placeholder={(currentBlock as FileUploadBlock).options?.labels?.placeholder || 'Enviar arquivo'}
                    buttonLabel={(currentBlock as FileUploadBlock).options?.labels?.button || 'Enviar'}
                    isMultiple={(currentBlock as FileUploadBlock).options?.isMultipleAllowed}
                  />
                )}

                {waitingForInput && currentBlock?.type === 'rating' && (
                  <RatingInput
                    length={(currentBlock as RatingBlock).options?.length || 5}
                    leftLabel={(currentBlock as RatingBlock).options?.labels?.left}
                    rightLabel={(currentBlock as RatingBlock).options?.labels?.right}
                    onSelect={handleRatingSelect}
                  />
                )}

                {waitingForInput && currentBlock?.type === 'choice input' && (
                  <div className="space-y-2">
                    {(currentBlock as ChoiceInputBlock).items.map((item) => (
                      <ChoiceButton
                        key={item.id}
                        label={interpolateText(item.content || '')}
                        onClick={() => handleChoiceInput(item.content || '', item.id)}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {screen === 'summary' && (
          <SummaryScreen
            responses={responses}
            onSubmit={handleSummarySubmit}
          />
        )}

        {screen === 'thank-you' && (
          <ThankYouScreen
            message="Obrigado por completar o check-in! Em breve você receberá seu feedback personalizado."
            onRestart={handleRestart}
          />
        )}

        {screen === 'redirect' && (
          <RedirectScreen
            url={redirectUrl}
            message="Redirecionando..."
            autoRedirect
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Index;
