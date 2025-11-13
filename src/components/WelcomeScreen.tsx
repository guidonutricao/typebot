import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { MessageSquare } from "lucide-react";

interface WelcomeScreenProps {
  formName: string;
  onStart: () => void;
}

export const WelcomeScreen = ({ formName, onStart }: WelcomeScreenProps) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col items-center justify-center min-h-screen p-6 text-center"
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="mb-8"
      >
        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-lg">
          <MessageSquare className="w-10 h-10 text-primary-foreground" />
        </div>
        
        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
          {formName}
        </h1>
        
        <p className="text-muted-foreground text-sm md:text-base max-w-md mx-auto">
          Vamos começar uma conversa interativa para coletar suas informações
        </p>
      </motion.div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <Button
          onClick={onStart}
          size="lg"
          className="rounded-full px-8 py-6 text-lg font-semibold shadow-lg hover:shadow-xl transition-all"
        >
          Começar 🚀
        </Button>
      </motion.div>
    </motion.div>
  );
};
