import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { UserResponse } from "@/types/flow";
import { CheckCircle, Send } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface SummaryScreenProps {
  responses: UserResponse[];
  onSubmit: () => void;
  webhookUrl?: string;
}

export const SummaryScreen = ({ responses, onSubmit, webhookUrl }: SummaryScreenProps) => {
  const [sending, setSending] = useState(false);

  const handleSubmit = async () => {
    setSending(true);
    
    if (webhookUrl) {
      try {
        await fetch(webhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ responses })
        });
        toast.success("Respostas enviadas com sucesso!");
      } catch (error) {
        toast.error("Erro ao enviar respostas");
      }
    }
    
    setSending(false);
    onSubmit();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-2xl mx-auto p-6"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="text-center mb-8"
      >
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
          <CheckCircle className="w-8 h-8 text-primary" />
        </div>
        <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
          Resumo das suas respostas
        </h2>
        <p className="text-muted-foreground">
          Revise suas informações antes de enviar
        </p>
      </motion.div>

      <div className="space-y-3 mb-8">
        {responses.map((response, index) => (
          <motion.div
            key={response.blockId}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card className="p-4">
              <p className="text-sm text-muted-foreground mb-1">
                Pergunta {index + 1}
              </p>
              <p className="font-medium text-foreground">
                {Array.isArray(response.value) 
                  ? response.value.join(", ") 
                  : response.value}
              </p>
            </Card>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <Button
          onClick={handleSubmit}
          disabled={sending}
          size="lg"
          className="w-full rounded-full py-6 text-lg font-semibold shadow-lg"
        >
          {sending ? (
            "Enviando..."
          ) : (
            <>
              <Send className="mr-2 h-5 w-5" />
              Enviar respostas
            </>
          )}
        </Button>
      </motion.div>
    </motion.div>
  );
};
