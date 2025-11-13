import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";
import { useEffect } from "react";

interface RedirectScreenProps {
  url: string;
  message?: string;
  autoRedirect?: boolean;
}

export const RedirectScreen = ({ url, message, autoRedirect = false }: RedirectScreenProps) => {
  useEffect(() => {
    if (autoRedirect) {
      setTimeout(() => {
        window.open(url, '_blank');
      }, 2000);
    }
  }, [url, autoRedirect]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-2xl mx-auto p-6 text-center"
    >
      {message && (
        <motion.p
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-lg mb-6"
        >
          {message}
        </motion.p>
      )}

      <Button
        onClick={() => window.open(url, '_blank')}
        size="lg"
        className="rounded-full px-8 py-6 text-lg"
      >
        <ExternalLink className="mr-2 h-5 w-5" />
        Abrir link
      </Button>
    </motion.div>
  );
};
