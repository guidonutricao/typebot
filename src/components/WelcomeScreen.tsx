import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { MessageSquare } from "lucide-react";
import { useThemeStore } from "@/stores/themeStore";

interface WelcomeScreenProps {
  formName: string;
  onStart: () => void;
}

export const WelcomeScreen = ({ formName, onStart }: WelcomeScreenProps) => {
  const { theme } = useThemeStore();

  const getShadowClass = () => {
    switch (theme.shadowIntensity) {
      case 'none': return '';
      case 'sm': return 'shadow-sm';
      case 'md': return 'shadow-md';
      case 'lg': return 'shadow-lg';
      default: return 'shadow-lg';
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

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col items-center justify-center min-h-screen p-6 text-center"
      style={{ fontFamily: theme.fontFamily }}
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="mb-8"
      >
        <div 
          className={`w-20 h-20 mx-auto mb-6 flex items-center justify-center ${getShadowClass()}`}
          style={{ 
            backgroundColor: theme.primaryColor,
            borderRadius: theme.borderRadius
          }}
        >
          <MessageSquare className="w-10 h-10 text-white" />
        </div>
        
        <h1 
          className="text-3xl md:text-4xl font-bold mb-3"
          style={{ color: theme.primaryColor }}
        >
          {formName}
        </h1>
        
        <p 
          className="text-sm md:text-base max-w-md mx-auto"
          style={{ color: theme.textColor, opacity: 0.7 }}
        >
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
          className={`px-8 py-6 text-lg font-semibold transition-all ${getShadowClass()}`}
          style={{ 
            backgroundColor: theme.primaryColor,
            borderRadius: getButtonRadius()
          }}
        >
          Começar 🚀
        </Button>
      </motion.div>
    </motion.div>
  );
};
