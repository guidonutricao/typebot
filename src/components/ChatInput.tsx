import { useState } from "react";
import { motion } from "framer-motion";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value.trim()) {
      onSubmit(value.trim());
      setValue("");
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
          className="flex-1 rounded-2xl border-2 border-border focus-visible:ring-primary min-h-[100px] resize-none"
        />
      ) : (
        <Input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          className="flex-1 rounded-full border-2 border-border focus-visible:ring-primary"
        />
      )}
      <Button
        type="submit"
        disabled={disabled || !value.trim()}
        size="icon"
        className="rounded-full h-10 w-10 shrink-0"
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
        variant="outline"
        className={cn(
          "w-full rounded-xl border-2 hover:border-primary hover:bg-accent",
          "transition-all duration-200 text-left justify-start h-auto py-3 px-4"
        )}
      >
        {label}
      </Button>
    </motion.div>
  );
};
