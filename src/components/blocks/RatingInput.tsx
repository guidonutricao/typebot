import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

interface RatingInputProps {
  length?: number;
  leftLabel?: string;
  rightLabel?: string;
  onSelect: (value: number) => void;
}

export const RatingInput = ({ 
  length = 10, 
  leftLabel, 
  rightLabel,
  onSelect 
}: RatingInputProps) => {
  const ratings = Array.from({ length: length + 1 }, (_, i) => i);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-3"
    >
      {(leftLabel || rightLabel) && (
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>{leftLabel}</span>
          <span>{rightLabel}</span>
        </div>
      )}
      
      <div className="grid grid-cols-6 sm:grid-cols-11 gap-2">
        {ratings.map((rating) => (
          <Button
            key={rating}
            onClick={() => onSelect(rating)}
            variant="outline"
            className="aspect-square rounded-lg hover:bg-primary hover:text-primary-foreground transition-colors"
          >
            {rating}
          </Button>
        ))}
      </div>
    </motion.div>
  );
};
