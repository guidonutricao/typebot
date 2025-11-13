import { useState } from "react";
import { motion } from "framer-motion";
import { ImageOff } from "lucide-react";

interface ImageBlockProps {
  url: string;
}

export const ImageBlock = ({ url }: ImageBlockProps) => {
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-center w-full max-w-md mx-auto p-8 mb-4 bg-muted rounded-xl"
      >
        <div className="text-center">
          <ImageOff className="w-12 h-12 mx-auto mb-2 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">Imagem não disponível</p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-md mx-auto mb-4"
    >
      {loading && (
        <div className="w-full h-48 bg-muted animate-pulse rounded-xl" />
      )}
      <img
        src={url}
        alt="Content"
        className={`w-full rounded-xl shadow-md ${loading ? 'hidden' : 'block'}`}
        onLoad={() => setLoading(false)}
        onError={() => {
          setError(true);
          setLoading(false);
        }}
      />
    </motion.div>
  );
};
