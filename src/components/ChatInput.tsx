import { useState } from "react";
import { motion } from "framer-motion";
import { Send } from "lucide-react";
import { Button } from "@/components/design-system";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { useThemeStore } from "@/stores/themeStore";

interface ChatInputProps {
  onSubmit: (value: string) => void;
  placeholder?: string;
  buttonLabel?: string;
  disabled?: boolean;
  isLong?: boolean;
}

export const ChatInput = ({ 
  onSubmit, 
  placeholder = "Digite sua resposta...", 
  buttonLabel = "Enviar",
  disabled = false,
  isLong = false
}: ChatInputProps) => {
  const [value, setValue] = useState("");
  const { theme } = useThemeStore();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value.trim()) {
      onSubmit(value.trim());
      setValue("");
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
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      onSubmit={handleSubmit}
      className="flex gap-2 w-full items-end"
    >
      {isLong ? (
        <Textarea
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          className="flex-1 border-2 min-h-[100px] resize-none"
          style={{ 
            borderRadius: theme.borderRadius,
            fontFamily: theme.fontFamily,
            borderColor: theme.secondaryColor + '40'
          }}
        />
      ) : (
        <Input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          className="flex-1 border-2"
          style={{ 
            borderRadius: getButtonRadius(),
            fontFamily: theme.fontFamily,
            borderColor: theme.secondaryColor + '40'
          }}
        />
      )}
      <Button
        type="submit"
        disabled={disabled || !value.trim()}
        variant="primary"
        className="h-10 w-10 shrink-0 px-0"
      >
        <Send className="h-4 w-4" />
      </Button>
    </motion.form>
  );
};

interface ChoiceButtonProps {
  label: string;
  onClick: () => void;
  disabled?: boolean;
}

export const ChoiceButton = ({ label, onClick, disabled }: ChoiceButtonProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2 }}
      className="w-full"
    >
      <Button
        onClick={onClick}
        disabled={disabled}
        variant="secondary"
        className="w-full text-left justify-start h-auto py-3 px-4"
      >
        {label}
      </Button>
    </motion.div>
  );
};
