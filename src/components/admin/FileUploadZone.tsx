import { useCallback, useState } from 'react';
import { Upload, FileJson, CheckCircle2, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FileUploadZoneProps {
  onFileSelect: (data: any) => void;
  currentFileName?: string;
  currentFileDate?: string;
}

export function FileUploadZone({ onFileSelect, currentFileName, currentFileDate }: FileUploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const validateJSON = (data: any): boolean => {
    if (!data || typeof data !== 'object') return false;
    if (!data.groups || !Array.isArray(data.groups)) return false;
    return true;
  };

  const handleFile = useCallback((file: File) => {
    if (file.type !== 'application/json') {
      setUploadStatus('error');
      setErrorMessage('Tipo de arquivo inválido. Use apenas .json');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const json = JSON.parse(e.target?.result as string);
        
        if (!validateJSON(json)) {
          setUploadStatus('error');
          setErrorMessage('JSON inválido. Certifique-se de exportar do Typebot.');
          return;
        }

        setUploadStatus('success');
        setErrorMessage('');
        onFileSelect(json);
        
        setTimeout(() => setUploadStatus('idle'), 3000);
      } catch (error) {
        setUploadStatus('error');
        setErrorMessage('Erro ao ler arquivo JSON');
      }
    };
    reader.readAsText(file);
  }, [onFileSelect]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, [handleFile]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  }, [handleFile]);

  return (
    <div className="space-y-4">
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={cn(
          "border-2 border-dashed rounded-lg p-12 text-center transition-colors",
          isDragging && "border-primary bg-primary/5",
          uploadStatus === 'success' && "border-green-500 bg-green-500/5",
          uploadStatus === 'error' && "border-destructive bg-destructive/5",
          uploadStatus === 'idle' && "border-muted-foreground/25 hover:border-primary/50"
        )}
      >
        <input
          type="file"
          accept=".json"
          onChange={handleFileInput}
          className="hidden"
          id="json-upload"
        />
        
        <label htmlFor="json-upload" className="cursor-pointer block">
          <div className="flex flex-col items-center gap-4">
            {uploadStatus === 'success' ? (
              <CheckCircle2 className="w-12 h-12 text-green-500" />
            ) : uploadStatus === 'error' ? (
              <XCircle className="w-12 h-12 text-destructive" />
            ) : (
              <Upload className="w-12 h-12 text-muted-foreground" />
            )}
            
            <div>
              <p className="text-lg font-medium">
                {uploadStatus === 'success' ? 'Arquivo carregado!' : 'Arraste o arquivo JSON aqui'}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                ou clique para selecionar
              </p>
            </div>
            
            {uploadStatus === 'error' && (
              <p className="text-sm text-destructive">{errorMessage}</p>
            )}
          </div>
        </label>
      </div>

      {currentFileName && (
        <div className="flex items-center gap-3 p-4 bg-muted rounded-lg">
          <FileJson className="w-5 h-5 text-primary" />
          <div className="flex-1">
            <p className="text-sm font-medium">{currentFileName}</p>
            {currentFileDate && (
              <p className="text-xs text-muted-foreground">
                Atualizado: {new Date(currentFileDate).toLocaleString('pt-BR')}
              </p>
            )}
          </div>
          <CheckCircle2 className="w-5 h-5 text-green-500" />
        </div>
      )}

      <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-4">
        <p className="text-sm text-amber-700 dark:text-amber-400">
          ⚠️ <strong>Importante:</strong> Exporte o JSON do Typebot e faça upload aqui para atualizar o fluxo.
        </p>
      </div>
    </div>
  );
}
