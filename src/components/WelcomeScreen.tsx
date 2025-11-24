import { motion } from "framer-motion";
import { Button } from "@/components/design-system";
import { MessageSquare } from "lucide-react";
import { useThemeStore } from "@/stores/themeStore";

interface WelcomeScreenProps {
  formName: string;
  onStart: () => void;
}

export const WelcomeScreen = ({ formName, onStart }: WelcomeScreenProps) => {
  const { theme } = useThemeStore();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col items-center justify-center min-h-screen p-6 text-center bg-[#0f172a]"
      style={{ fontFamily: theme.fontFamily }}
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="mb-8"
      >
        <div 
          className="w-20 h-20 mx-auto mb-6 flex items-center justify-center bg-gradient-to-r from-[#06b6d4] to-[#0369a1] rounded-lg shadow-[0_10px_15px_-3px_rgba(6,182,212,0.5)]"
        >
          <MessageSquare className="w-10 h-10 text-white" />
        </div>
        
        <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-white via-[#22d3ee] to-white bg-clip-text text-transparent">
          {formName}
        </h1>
        
        <p className="text-lg text-[rgba(165,243,252,0.7)] max-w-md mx-auto">
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
          variant="primary"
          size="lg"
          className="px-8 py-6 text-lg font-semibold"
        >
          Começar 🚀
        </Button>
      </motion.div>
    </motion.div>
  );
};
