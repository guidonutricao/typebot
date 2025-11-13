import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, CheckCircle2, XCircle, AlertTriangle } from 'lucide-react';
import {
  migrateLocalStorageToSupabase,
  clearLocalStorage,
  hasLocalStorageData,
} from '@/utils/migrateToSupabase';
import { useAuthStore } from '@/stores/authStore';

export const MigrationDialog = () => {
  const [open, setOpen] = useState(false);
  const [migrating, setMigrating] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [result, setResult] = useState<any>(null);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  useEffect(() => {
    // Verificar se há dados para migrar quando usuário faz login
    if (isAuthenticated && hasLocalStorageData()) {
      const migrationDismissed = localStorage.getItem('migration-dismissed');
      if (!migrationDismissed) {
        setOpen(true);
      }
    }
  }, [isAuthenticated]);

  const handleMigrate = async () => {
    setMigrating(true);
    try {
      const migrationResult = await migrateLocalStorageToSupabase();
      setResult(migrationResult);
      setCompleted(true);

      if (migrationResult.success) {
        // Limpar localStorage após migração bem-sucedida
        clearLocalStorage();
      }
    } catch (error) {
      console.error('Erro na migração:', error);
      setResult({
        success: false,
        migratedCount: 0,
        failedCount: 0,
        errors: ['Erro inesperado na migração'],
      });
      setCompleted(true);
    } finally {
      setMigrating(false);
    }
  };

  const handleDismiss = () => {
    localStorage.setItem('migration-dismissed', 'true');
    setOpen(false);
  };

  const handleClose = () => {
    if (completed && result?.success) {
      window.location.reload(); // Recarregar para atualizar dados
    } else {
      setOpen(false);
    }
  };

  if (!open) return null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {completed ? 'Migração Concluída' : 'Migrar Dados para a Nuvem'}
          </DialogTitle>
          <DialogDescription>
            {!completed && (
              <>
                Detectamos fluxos salvos localmente no seu navegador. 
                Deseja migrar esses dados para a nuvem (Supabase)?
              </>
            )}
          </DialogDescription>
        </DialogHeader>

        {!completed && (
          <div className="space-y-4">
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                Seus dados estão salvos apenas neste navegador. 
                Migre para a nuvem para acessá-los de qualquer lugar.
              </AlertDescription>
            </Alert>
          </div>
        )}

        {completed && result && (
          <div className="space-y-4">
            {result.success ? (
              <Alert className="border-green-500 bg-green-50">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800">
                  {result.migratedCount} fluxo(s) migrado(s) com sucesso!
                </AlertDescription>
              </Alert>
            ) : (
              <Alert className="border-red-500 bg-red-50">
                <XCircle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-800">
                  Migração concluída com {result.failedCount} erro(s).
                  {result.migratedCount > 0 && ` ${result.migratedCount} fluxo(s) migrado(s).`}
                </AlertDescription>
              </Alert>
            )}

            {result.errors.length > 0 && (
              <div className="text-sm text-red-600 max-h-32 overflow-y-auto">
                <p className="font-semibold mb-1">Erros:</p>
                <ul className="list-disc list-inside space-y-1">
                  {result.errors.map((error: string, i: number) => (
                    <li key={i}>{error}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        <DialogFooter className="flex-col sm:flex-row gap-2">
          {!completed ? (
            <>
              <Button
                variant="outline"
                onClick={handleDismiss}
                disabled={migrating}
              >
                Agora Não
              </Button>
              <Button
                onClick={handleMigrate}
                disabled={migrating}
              >
                {migrating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {migrating ? 'Migrando...' : 'Migrar Dados'}
              </Button>
            </>
          ) : (
            <Button onClick={handleClose} className="w-full">
              {result?.success ? 'Concluir e Recarregar' : 'Fechar'}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
