import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { parseRichText } from "@/utils/richTextParser";
import { RichTextElement } from "@/types/flow";

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
      <div className={cn(
        "max-w-[85%] md:max-w-[70%] rounded-2xl px-4 py-3 shadow-sm",
        isBot 
          ? "bg-card text-card-foreground border border-border" 
          : "bg-primary text-primary-foreground"
      )}>
        {image && (
          <img 
            src={image} 
            alt="Context" 
            className="w-full rounded-xl mb-2"
          />
        )}
        
        {isTyping ? (
          <div className="flex space-x-1 py-1">
            <motion.div
              className="w-2 h-2 bg-muted-foreground rounded-full"
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
            />
            <motion.div
              className="w-2 h-2 bg-muted-foreground rounded-full"
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
            />
            <motion.div
              className="w-2 h-2 bg-muted-foreground rounded-full"
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
