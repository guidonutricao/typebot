import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Download, Eye, Trash2, Search, Calendar, CheckCircle2, Clock, TrendingUp } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { getFlowResponses, listFlows, deleteFormResponse } from "@/utils/supabaseStorage";
import { useAuthStore } from "@/stores/authStore";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface FormResponse {
  id: string;
  flow_id: string;
  user_id: string | null;
  responses: Record<string, any>;
  completed: boolean;
  created_at: string;
  updated_at: string;
}

interface Flow {
  id: string;
  name: string;
}

export default function Results() {
  const { user } = useAuthStore();
  const [responses, setResponses] = useState<FormResponse[]>([]);
  const [flows, setFlows] = useState<Flow[]>([]);
  const [selectedFlowId, setSelectedFlowId] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFlows();
  }, [user]);

  useEffect(() => {
    if (selectedFlowId) {
      loadResponses(selectedFlowId);
    }
  }, [selectedFlowId]);

  const loadFlows = async () => {
    try {
      const flowsList = await listFlows();
      setFlows(flowsList.map(f => ({ id: f.id, name: f.name })));
      if (flowsList.length > 0) {
        setSelectedFlowId(flowsList[0].id);
      }
    } catch (error) {
      console.error("Erro ao carregar fluxos:", error);
      toast.error("Erro ao carregar fluxos");
    }
  };

  const loadResponses = async (flowId: string) => {
    setLoading(true);
    try {
      const data = await getFlowResponses(flowId);
      setResponses(data);
    } catch (error) {
      console.error("Erro ao carregar respostas:", error);
      toast.error("Erro ao carregar respostas");
    } finally {
      setLoading(false);
    }
  };

  const filteredResponses = responses.filter((r) => {
    const searchLower = searchTerm.toLowerCase();
    const responsesText = JSON.stringify(r.responses).toLowerCase();
    return responsesText.includes(searchLower) || r.id.toLowerCase().includes(searchLower);
  });

  const completedResponses = responses.filter(r => r.completed).length;
  const completionRate = responses.length > 0 
    ? Math.round((completedResponses / responses.length) * 100) 
    : 0;

  const todayResponses = responses.filter(r => {
    const today = new Date().toDateString();
    const responseDate = new Date(r.created_at).toDateString();
    return today === responseDate;
  }).length;

  const handleExportCSV = () => {
    if (responses.length === 0) {
      toast.error("Nenhuma resposta para exportar");
      return;
    }

    // Coletar todas as chaves únicas das respostas
    const allKeys = new Set<string>();
    responses.forEach(r => {
      Object.keys(r.responses).forEach(key => allKeys.add(key));
    });

    const headers = ["ID", "Data", "Status", "Completo", ...Array.from(allKeys)];
    const rows = responses.map((r) => [
      r.id,
      new Date(r.created_at).toLocaleString('pt-BR'),
      r.completed ? "Completo" : "Incompleto",
      r.completed ? "Sim" : "Não",
      ...Array.from(allKeys).map(key => {
        const value = r.responses[key];
        return typeof value === 'object' ? JSON.stringify(value) : value || '';
      })
    ]);

    const csv = [headers, ...rows]
      .map((row) => row.map(cell => `"${cell}"`).join(","))
      .join("\n");

    const blob = new Blob(["\ufeff" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `respostas-${selectedFlowId}-${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);

    toast.success("CSV exportado com sucesso!");
  };

  const handleExportJSON = () => {
    if (responses.length === 0) {
      toast.error("Nenhuma resposta para exportar");
      return;
    }

    const json = JSON.stringify(responses, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `respostas-${selectedFlowId}-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);

    toast.success("JSON exportado com sucesso!");
  };

  const handleDeleteResponse = async (id: string) => {
    try {
      const success = await deleteFormResponse(id);
      if (success) {
        toast.success("Resposta deletada com sucesso!");
        setResponses(responses.filter(r => r.id !== id));
      } else {
        toast.error("Erro ao deletar resposta");
      }
    } catch (error) {
      console.error("Erro ao deletar resposta:", error);
      toast.error("Erro ao deletar resposta");
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-amber-600 bg-clip-text text-transparent">
          Resultados & Analytics
        </h1>
        <p className="text-muted-foreground mt-2">
          Visualize e analise as respostas coletadas dos seus formulários
        </p>
      </div>

      {/* Seletor de Fluxo */}
      <Card className="border-2">
        <CardHeader>
          <CardTitle className="text-lg">Selecione um Formulário</CardTitle>
        </CardHeader>
        <CardContent>
          <Select value={selectedFlowId} onValueChange={setSelectedFlowId}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Selecione um formulário" />
            </SelectTrigger>
            <SelectContent>
              {flows.map((flow) => (
                <SelectItem key={flow.id} value={flow.id}>
                  {flow.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Cards de Estatísticas */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="border-l-4 border-l-primary hover:shadow-lg transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total de Respostas
              </CardTitle>
              <TrendingUp className="w-4 h-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-primary">{responses.length}</p>
            <p className="text-xs text-muted-foreground mt-1">
              Todas as submissões
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500 hover:shadow-lg transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Taxa de Conclusão
              </CardTitle>
              <CheckCircle2 className="w-4 h-4 text-green-600" />
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-green-600">{completionRate}%</p>
            <p className="text-xs text-muted-foreground mt-1">
              {completedResponses} de {responses.length} completas
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500 hover:shadow-lg transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Respostas Hoje
              </CardTitle>
              <Calendar className="w-4 h-4 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-blue-600">{todayResponses}</p>
            <p className="text-xs text-muted-foreground mt-1">
              Nas últimas 24 horas
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-amber-500 hover:shadow-lg transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Última Resposta
              </CardTitle>
              <Clock className="w-4 h-4 text-amber-600" />
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-bold text-amber-600">
              {responses.length > 0 
                ? new Date(responses[0].created_at).toLocaleDateString('pt-BR')
                : "N/A"
              }
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {responses.length > 0 
                ? new Date(responses[0].created_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
                : "Sem respostas"
              }
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tabela de Respostas */}
      <Card className="border-2">
        <CardHeader>
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar nas respostas..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                onClick={handleExportCSV}
                disabled={responses.length === 0}
              >
                <Download className="w-4 h-4 mr-2" />
                CSV
              </Button>
              <Button 
                variant="outline" 
                onClick={handleExportJSON}
                disabled={responses.length === 0}
              >
                <Download className="w-4 h-4 mr-2" />
                JSON
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : filteredResponses.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              {responses.length === 0 
                ? "Nenhuma resposta ainda. Compartilhe seu formulário para começar a receber respostas!"
                : "Nenhuma resposta encontrada com os filtros aplicados."
              }
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]">ID</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Respostas</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredResponses.map((response) => (
                    <TableRow key={response.id} className="hover:bg-muted/50">
                      <TableCell className="font-mono text-xs">
                        {response.id.substring(0, 8)}...
                      </TableCell>
                      <TableCell className="text-sm">
                        {formatDate(response.created_at)}
                      </TableCell>
                      <TableCell>
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            response.completed
                              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                              : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                          }`}
                        >
                          {response.completed ? "Completo" : "Incompleto"}
                        </span>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {Object.keys(response.responses).length} campo(s) preenchido(s)
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="ghost" size="icon" title="Ver detalhes">
                                <Eye className="w-4 h-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                              <DialogHeader>
                                <DialogTitle>Detalhes da Resposta</DialogTitle>
                                <DialogDescription>
                                  Resposta enviada em {formatDate(response.created_at)}
                                </DialogDescription>
                              </DialogHeader>
                              <div className="space-y-4 mt-4">
                                <div className="grid grid-cols-2 gap-4 p-4 bg-muted rounded-lg">
                                  <div>
                                    <p className="text-xs font-medium text-muted-foreground">ID</p>
                                    <p className="text-sm font-mono">{response.id}</p>
                                  </div>
                                  <div>
                                    <p className="text-xs font-medium text-muted-foreground">Status</p>
                                    <p className="text-sm">{response.completed ? "Completo" : "Incompleto"}</p>
                                  </div>
                                </div>
                                
                                <div className="border-t pt-4">
                                  <h4 className="font-semibold mb-3">Respostas do Formulário</h4>
                                  <div className="space-y-3">
                                    {Object.entries(response.responses).map(([key, value]) => (
                                      <div key={key} className="p-3 bg-muted/50 rounded-lg">
                                        <p className="text-sm font-medium text-muted-foreground mb-1">
                                          {key}
                                        </p>
                                        <p className="text-sm break-words">
                                          {typeof value === 'object' 
                                            ? JSON.stringify(value, null, 2) 
                                            : String(value)
                                          }
                                        </p>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteResponse(response.id)}
                            title="Deletar resposta"
                          >
                            <Trash2 className="w-4 h-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
