import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { parseRichText } from "@/utils/richTextParser";
import { RichTextElement } from "@/types/flow";
import { useThemeStore } from "@/stores/themeStore";

interface ChatMessageProps {
  content?: string;
  richText?: RichTextElement[];
  isBot?: boolean;
  isTyping?: boolean;
  image?: string;
}

export const ChatMessage = ({ 
  content, 
  richText,
  isBot = true, 
  isTyping = false, 
  image 
}: ChatMessageProps) => {
  const { theme } = useThemeStore();

  const getShadowClass = () => {
    switch (theme.shadowIntensity) {
      case 'none': return '';
      case 'sm': return 'shadow-sm';
      case 'md': return 'shadow-md';
      case 'lg': return 'shadow-lg';
      default: return 'shadow-md';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className={cn(
        "flex w-full mb-4",
        isBot ? "justify-start" : "justify-end"
      )}
    >
      <div 
        className={cn(
          "max-w-[85%] md:max-w-[70%] px-4 py-3",
          getShadowClass()
        )}
        style={{
          backgroundColor: isBot ? theme.chatBubbleBot : theme.chatBubbleUser,
          color: isBot ? theme.textColor : '#ffffff',
          borderRadius: theme.borderRadius
        }}
      >
        {image && (
          <img 
            src={image} 
            alt="Context" 
            className="w-full mb-2"
            style={{ borderRadius: theme.borderRadius }}
          />
        )}
        
        {isTyping ? (
          <div className="flex space-x-1 py-1">
            <motion.div
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: theme.textColor, opacity: 0.5 }}
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
            />
            <motion.div
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: theme.textColor, opacity: 0.5 }}
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
            />
            <motion.div
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: theme.textColor, opacity: 0.5 }}
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
            />
          </div>
        ) : richText ? (
          <div className="text-sm md:text-base leading-relaxed">
            {parseRichText(richText)}
          </div>
        ) : (
          <p className="text-sm md:text-base leading-relaxed whitespace-pre-wrap">
            {content}
          </p>
        )}
      </div>
    </motion.div>
  );
};
