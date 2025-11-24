import { NavLink } from "@/components/NavLink";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import { LayoutDashboard, Palette, Share2, BarChart3, ArrowLeft } from "lucide-react";
import { Button } from "@/components/design-system";
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
    if (path.includes('/share')) return 'share';
    if (path.includes('/results')) return 'results';
    return 'flow';
  };

  return (
    <header className="sticky top-0 z-50 bg-[rgba(15,23,42,0.95)] backdrop-blur-[10px] border-b border-[rgba(6,182,212,0.125)]">
      <div className="container flex h-16 items-center px-4 gap-4">
        <Button 
          variant="icon-small"
          onClick={() => navigate("/admin/dashboard")}
          className="w-8 h-8"
        >
          <ArrowLeft className="w-4 h-4" />
        </Button>
        
        {flow && (
          <div className="flex-1">
            <h2 className="font-semibold text-lg text-white">{flow.name}</h2>
          </div>
        )}

        {flowId && (
          <Tabs value={getTabValue(currentPath)} className="flex-1">
            <TabsList className="grid w-full max-w-2xl grid-cols-4 bg-[rgba(30,41,59,0.56)] border border-[rgba(6,182,212,0.125)]">
              <TabsTrigger 
                value="flow" 
                asChild
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#06b6d4] data-[state=active]:to-[#0369a1] data-[state=active]:text-white text-[#a5f3fc]"
              >
                <NavLink to={`/admin/flow/${flowId}`} className="flex items-center gap-2">
                  <LayoutDashboard className="w-4 h-4" />
                  <span className="hidden sm:inline">Fluxo</span>
                </NavLink>
              </TabsTrigger>
              <TabsTrigger 
                value="theme" 
                asChild
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#06b6d4] data-[state=active]:to-[#0369a1] data-[state=active]:text-white text-[#a5f3fc]"
              >
                <NavLink to={`/admin/flow/${flowId}/theme`} className="flex items-center gap-2">
                  <Palette className="w-4 h-4" />
                  <span className="hidden sm:inline">Tema</span>
                </NavLink>
              </TabsTrigger>
              <TabsTrigger 
                value="share" 
                asChild
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#06b6d4] data-[state=active]:to-[#0369a1] data-[state=active]:text-white text-[#a5f3fc]"
              >
                <NavLink to={`/admin/flow/${flowId}/share`} className="flex items-center gap-2">
                  <Share2 className="w-4 h-4" />
                  <span className="hidden sm:inline">Share</span>
                </NavLink>
              </TabsTrigger>
              <TabsTrigger 
                value="results" 
                asChild
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#06b6d4] data-[state=active]:to-[#0369a1] data-[state=active]:text-white text-[#a5f3fc]"
              >
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
