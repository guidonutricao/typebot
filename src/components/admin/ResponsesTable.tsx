import { useEffect, useState } from 'react';
import { getFlowResponses } from '@/utils/supabaseStorage';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Loader2 } from 'lucide-react';

interface ResponsesTableProps {
  flowId: string;
}

export const ResponsesTable = ({ flowId }: ResponsesTableProps) => {
  const [responses, setResponses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadResponses();
  }, [flowId]);

  const loadResponses = async () => {
    setLoading(true);
    try {
      const data = await getFlowResponses(flowId);
      setResponses(data);
    } catch (error) {
      console.error('Erro ao carregar respostas:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  if (responses.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Nenhuma resposta ainda
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Data</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Respostas</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {responses.map((response) => (
            <TableRow key={response.id}>
              <TableCell>
                {new Date(response.created_at).toLocaleString('pt-BR')}
              </TableCell>
              <TableCell>
                <Badge variant={response.completed ? 'default' : 'secondary'}>
                  {response.completed ? 'Completo' : 'Incompleto'}
                </Badge>
              </TableCell>
              <TableCell>
                <pre className="text-xs max-w-md overflow-auto">
                  {JSON.stringify(response.responses, null, 2)}
                </pre>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
