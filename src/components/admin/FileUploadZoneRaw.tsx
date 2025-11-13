import { useState } from 'react';
import { Upload, CheckCircle, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FileUploadZoneRawProps {
  onFileSelect: (file: File) => void;
  currentFileName?: string;
  currentFileDate?: string;
}

export function FileUploadZoneRaw({
  onFileSelect,
  currentFileName,
  currentFileDate,
}: FileUploadZoneRawProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleFile = async (file: File) => {
    if (!file.name.match(/\.(json|js)$/i)) {
      setUploadStatus('error');
      setErrorMessage('Apenas arquivos .json ou .js são permitidos');
      return;
    }

    try {
      setUploadStatus('success');
      setErrorMessage('');
      onFileSelect(file);
      console.log('[FileUploadZoneRaw] Arquivo selecionado:', file.name);
    } catch (error) {
      setUploadStatus('error');
      setErrorMessage('Erro ao processar arquivo');
      console.error('[FileUploadZoneRaw] Erro:', error);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  return (
    <div className="space-y-4">
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={cn(
          'border-2 border-dashed rounded-lg p-8 text-center transition-all',
          isDragging && 'border-primary bg-primary/5 scale-105',
          uploadStatus === 'success' && 'border-green-500 bg-green-500/5',
          uploadStatus === 'error' && 'border-destructive bg-destructive/5',
          uploadStatus === 'idle' && 'border-border hover:border-primary/50'
        )}
      >
        <input
          id="file-upload-raw"
          type="file"
          accept=".json,.js"
          onChange={handleFileInput}
          className="hidden"
        />

        <label htmlFor="file-upload-raw" className="cursor-pointer space-y-4 block">
          {uploadStatus === 'success' ? (
            <CheckCircle className="w-12 h-12 mx-auto text-green-500" />
          ) : uploadStatus === 'error' ? (
            <XCircle className="w-12 h-12 mx-auto text-destructive" />
          ) : (
            <Upload className="w-12 h-12 mx-auto text-muted-foreground" />
          )}

          <div className="space-y-1">
            <p className="text-lg font-medium">
              {uploadStatus === 'success'
                ? 'Arquivo carregado!'
                : uploadStatus === 'error'
                ? 'Erro ao carregar'
                : 'Arraste um arquivo ou clique para selecionar'}
            </p>
            <p className="text-sm text-muted-foreground">
              {uploadStatus === 'error'
                ? errorMessage
                : 'Arquivos .json ou .js do Typebot'}
            </p>
          </div>
        </label>
      </div>

      {currentFileName && (
        <div className="bg-muted/50 p-4 rounded-lg">
          <p className="text-sm font-medium">Arquivo atual:</p>
          <p className="text-sm text-muted-foreground mt-1">{currentFileName}</p>
          {currentFileDate && (
            <p className="text-xs text-muted-foreground mt-1">
              Atualizado: {new Date(currentFileDate).toLocaleString('pt-BR')}
            </p>
          )}
        </div>
      )}

      <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 text-sm">
        <p className="font-medium text-blue-700 dark:text-blue-400 mb-2">
          ⚠️ Importante
        </p>
        <p className="text-muted-foreground">
          Certifique-se de exportar o JSON completo do Typebot incluindo todas as configurações
          dos grupos e blocos.
        </p>
      </div>
    </div>
  );
}
