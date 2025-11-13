import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";

interface NumberInputProps {
  placeholder: string;
  buttonLabel: string;
  onSubmit: (value: string) => void;
}

export const NumberInput = ({ placeholder, buttonLabel, onSubmit }: NumberInputProps) => {
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
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={handleSubmit}
      className="flex gap-2 w-full"
    >
      <Input
        type="text"
        inputMode="decimal"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        className="flex-1 rounded-full px-4 py-6 text-base"
      />
      <Button
        type="submit"
        size="lg"
        disabled={!value.trim()}
        className="rounded-full px-6 shadow-lg"
      >
        <Send className="w-5 h-5" />
      </Button>
    </motion.form>
  );
};
