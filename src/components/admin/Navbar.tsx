import { NavLink } from "@/components/NavLink";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import { LayoutDashboard, Palette, Settings, Share2, BarChart3, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useFlowStore } from "@/stores/flowStore";

export function Navbar() {
  const location = useLocation();
  const { flowId } = useParams();
  const navigate = useNavigate();
  const getFlow = useFlowStore((state) => state.getFlow);
  const currentPath = location.pathname;
  const flow = flowId ? getFlow(flowId) : null;

  const getTabValue = (path: string) => {
    if (path.includes('/theme')) return 'theme';
    if (path.includes('/settings')) return 'settings';
    if (path.includes('/share')) return 'share';
    if (path.includes('/results')) return 'results';
    return 'flow';
  };

  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container flex h-16 items-center px-4 gap-4">
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => navigate("/admin/dashboard")}
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        
        {flow && (
          <div className="flex-1">
            <h2 className="font-semibold text-lg">{flow.name}</h2>
          </div>
        )}

        {flowId && (
          <Tabs value={getTabValue(currentPath)} className="flex-1">
            <TabsList className="grid w-full max-w-2xl grid-cols-5">
              <TabsTrigger value="flow" asChild>
                <NavLink to={`/admin/flow/${flowId}`} className="flex items-center gap-2">
                  <LayoutDashboard className="w-4 h-4" />
                  <span className="hidden sm:inline">Fluxo</span>
                </NavLink>
              </TabsTrigger>
              <TabsTrigger value="theme" asChild>
                <NavLink to={`/admin/flow/${flowId}/theme`} className="flex items-center gap-2">
                  <Palette className="w-4 h-4" />
                  <span className="hidden sm:inline">Tema</span>
                </NavLink>
              </TabsTrigger>
              <TabsTrigger value="settings" asChild>
                <NavLink to={`/admin/flow/${flowId}/settings`} className="flex items-center gap-2">
                  <Settings className="w-4 h-4" />
                  <span className="hidden sm:inline">Config</span>
                </NavLink>
              </TabsTrigger>
              <TabsTrigger value="share" asChild>
                <NavLink to={`/admin/flow/${flowId}/share`} className="flex items-center gap-2">
                  <Share2 className="w-4 h-4" />
                  <span className="hidden sm:inline">Share</span>
                </NavLink>
              </TabsTrigger>
              <TabsTrigger value="results" asChild>
                <NavLink to={`/admin/flow/${flowId}/results`} className="flex items-center gap-2">
                  <BarChart3 className="w-4 h-4" />
                  <span className="hidden sm:inline">Results</span>
                </NavLink>
              </TabsTrigger>
            </TabsList>
          </Tabs>
        )}
      </div>
    </header>
  );
}
