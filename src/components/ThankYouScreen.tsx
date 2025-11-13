import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { CheckCircle2, RotateCcw } from "lucide-react";

interface ThankYouScreenProps {
  message?: string;
  onRestart: () => void;
}

export const ThankYouScreen = ({ 
  message = "Obrigado por suas respostas! Suas informações foram enviadas com sucesso.",
  onRestart 
}: ThankYouScreenProps) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center justify-center min-h-screen p-6 text-center"
    >
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ 
          type: "spring",
          stiffness: 200,
          damping: 15,
          delay: 0.1 
        }}
        className="mb-8"
      >
        <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-primary/10 flex items-center justify-center">
          <CheckCircle2 className="w-14 h-14 text-primary" />
        </div>
        
        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-3xl md:text-4xl font-bold text-foreground mb-4"
        >
          Tudo certo! ✨
        </motion.h1>
        
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-muted-foreground text-base md:text-lg max-w-md mx-auto"
        >
          {message}
        </motion.p>
      </motion.div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <Button
          onClick={onRestart}
          variant="outline"
          size="lg"
          className="rounded-full px-8 py-6 text-base font-semibold"
        >
          <RotateCcw className="mr-2 h-5 w-5" />
          Reiniciar formulário
        </Button>
      </motion.div>
    </motion.div>
  );
};
