import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Upload, X, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";

interface FileUploadInputProps {
  placeholder: string;
  buttonLabel: string;
  isMultiple?: boolean;
  onSubmit: (files: string[]) => void;
}

export const FileUploadInput = ({ 
  placeholder, 
  buttonLabel, 
  isMultiple = true,
  onSubmit 
}: FileUploadInputProps) => {
  const [files, setFiles] = useState<Array<{ name: string; data: string }>>([]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (!selectedFiles) return;

    const newFiles: Array<{ name: string; data: string }> = [];

    for (let i = 0; i < selectedFiles.length; i++) {
      const file = selectedFiles[i];
      
      if (!file.type.startsWith('image/')) {
        toast.error("Apenas imagens são permitidas");
        continue;
      }

      if (file.size > 10 * 1024 * 1024) {
        toast.error("Arquivo muito grande (máx: 10MB)");
        continue;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          newFiles.push({
            name: file.name,
            data: event.target.result as string
          });

          if (newFiles.length === selectedFiles.length) {
            setFiles(prev => isMultiple ? [...prev, ...newFiles] : newFiles);
          }
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    if (files.length > 0) {
      onSubmit(files.map(f => f.data));
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      <div className="grid grid-cols-2 gap-2">
        {files.map((file, idx) => (
          <div key={idx} className="relative group">
            <img
              src={file.data}
              alt={file.name}
              className="w-full h-32 object-cover rounded-lg"
            />
            <button
              onClick={() => removeFile(idx)}
              className="absolute top-1 right-1 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <label className="flex-1">
          <input
            type="file"
            accept="image/*"
            multiple={isMultiple}
            onChange={handleFileChange}
            className="hidden"
          />
          <div className="flex items-center justify-center gap-2 px-4 py-6 border-2 border-dashed border-border rounded-full cursor-pointer hover:border-primary transition-colors">
            <Upload className="w-5 h-5" />
            <span>{placeholder}</span>
          </div>
        </label>
      </div>

      {files.length > 0 && (
        <Button
          onClick={handleSubmit}
          size="lg"
          className="w-full rounded-full py-6 shadow-lg"
        >
          <ImageIcon className="mr-2 h-5 w-5" />
          {buttonLabel} ({files.length})
        </Button>
      )}
    </motion.div>
  );
};
