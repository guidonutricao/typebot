import { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Edit2, Eye, Copy, Trash2, MoreVertical, Check, X, Power, PowerOff } from 'lucide-react';
import { Flow } from '@/stores/flowStore';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

interface FlowCardProps {
  flow: Flow;
  onEdit: () => void;
  onPreview: () => void;
  onDelete: () => void;
  onDuplicate: () => void;
  onTogglePublish: () => void;
  onUpdateName: (name: string) => void;
}

export function FlowCard({
  flow,
  onEdit,
  onPreview,
  onDelete,
  onDuplicate,
  onTogglePublish,
  onUpdateName,
}: FlowCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(flow.name);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const handleSaveName = () => {
    if (editedName.trim() && editedName !== flow.name) {
      onUpdateName(editedName.trim());
      toast.success('Nome atualizado');
    }
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditedName(flow.name);
    setIsEditing(false);
  };

  const totalBlocks = flow.data.groups.reduce((acc, g) => acc + g.blocks.length, 0);
  const lastUpdated = new Date(flow.updatedAt).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        whileHover={{ y: -4 }}
        transition={{ duration: 0.2 }}
      >
        <Card className="h-full hover:shadow-lg transition-shadow">
          <CardHeader className="space-y-2">
            <div className="flex items-start justify-between gap-2">
              {isEditing ? (
                <div className="flex-1 flex items-center gap-2">
                  <Input
                    value={editedName}
                    onChange={(e) => setEditedName(e.target.value)}
                    className="h-8"
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleSaveName();
                      if (e.key === 'Escape') handleCancelEdit();
                    }}
                  />
                  <Button size="icon" variant="ghost" className="h-8 w-8" onClick={handleSaveName}>
                    <Check className="h-4 w-4" />
                  </Button>
                  <Button size="icon" variant="ghost" className="h-8 w-8" onClick={handleCancelEdit}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg line-clamp-1">{flow.name}</h3>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => setIsEditing(true)}>
                        <Edit2 className="h-4 w-4 mr-2" />
                        Renomear
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={onDuplicate}>
                        <Copy className="h-4 w-4 mr-2" />
                        Duplicar
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={onTogglePublish}>
                        {flow.isPublished ? (
                          <>
                            <PowerOff className="h-4 w-4 mr-2" />
                            Despublicar
                          </>
                        ) : (
                          <>
                            <Power className="h-4 w-4 mr-2" />
                            Publicar
                          </>
                        )}
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => setShowDeleteDialog(true)}
                        className="text-destructive focus:text-destructive"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Excluir
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
              )}
            </div>
            <Badge variant={flow.isPublished ? 'default' : 'secondary'} className="w-fit">
              {flow.isPublished ? 'Publicado' : 'Rascunho'}
            </Badge>
          </CardHeader>

          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Grupos</p>
                <p className="font-semibold">{flow.data.groups.length}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Blocos</p>
                <p className="font-semibold">{totalBlocks}</p>
              </div>
            </div>
            <div className="text-xs text-muted-foreground">
              Atualizado em {lastUpdated}
            </div>
          </CardContent>

          <CardFooter className="flex gap-2">
            <Button variant="outline" size="sm" className="flex-1" onClick={onEdit}>
              <Edit2 className="h-4 w-4 mr-2" />
              Editar
            </Button>
            <Button variant="outline" size="sm" className="flex-1" onClick={onPreview}>
              <Eye className="h-4 w-4 mr-2" />
              Preview
            </Button>
          </CardFooter>
        </Card>
      </motion.div>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir formulário?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. O formulário "{flow.name}" será excluído permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                onDelete();
                setShowDeleteDialog(false);
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
