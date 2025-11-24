import { 
  Button, 
  Card, 
  Badge, 
  Heading, 
  Text, 
  Container, 
  Navbar 
} from "@/components/design-system";
import { Star, Heart, Send, Settings } from "lucide-react";

export default function DesignSystemDemo() {
  return (
    <div className="min-h-screen bg-[#0f172a]">
      <Navbar>
        <Heading level={2}>Design System Demo</Heading>
        <div className="flex gap-2">
          <Button variant="icon-small">
            <Settings className="w-3 h-3" />
          </Button>
          <Button variant="secondary" size="sm">Cancelar</Button>
          <Button variant="primary" size="sm">Salvar</Button>
        </div>
      </Navbar>

      <Container className="py-8 space-y-8">
        {/* Typography Section */}
        <Card>
          <Heading level={1}>Tipografia</Heading>
          <div className="mt-4 space-y-4">
            <div>
              <Text variant="label-smaller">HEADING 1</Text>
              <Heading level={1}>Este é um título principal</Heading>
            </div>
            <div>
              <Text variant="label-smaller">HEADING 2</Text>
              <Heading level={2}>Este é um título secundário</Heading>
            </div>
            <div>
              <Text variant="label-smaller">HEADING 3</Text>
              <Heading level={3}>Este é um título terciário</Heading>
            </div>
            <div>
              <Text variant="label-smaller">TEXT LEAD</Text>
              <Text variant="lead">
                Este é um texto de destaque usado para introduções e descrições importantes.
              </Text>
            </div>
            <div>
              <Text variant="label-smaller">TEXT DEFAULT</Text>
              <Text>
                Este é o texto padrão usado para conteúdo regular e parágrafos.
              </Text>
            </div>
            <div>
              <Text variant="label-smaller">LABEL SMALL</Text>
              <Text variant="label-small">Label pequeno para formulários</Text>
            </div>
            <div>
              <Text variant="label-smaller">LABEL SMALLER</Text>
              <Text variant="label-smaller">Label extra pequeno</Text>
            </div>
          </div>
        </Card>

        {/* Buttons Section */}
        <Card>
          <Heading level={2}>Botões</Heading>
          <div className="mt-4 space-y-6">
            <div>
              <Text variant="label-small" className="mb-2">Primary Buttons</Text>
              <div className="flex gap-2 flex-wrap">
                <Button variant="primary" size="sm">Small</Button>
                <Button variant="primary" size="md">Medium</Button>
                <Button variant="primary" size="lg">Large</Button>
                <Button variant="primary" size="md" icon={<Send />}>Com Ícone</Button>
                <Button variant="primary" size="md" disabled>Disabled</Button>
              </div>
            </div>

            <div>
              <Text variant="label-small" className="mb-2">Secondary Buttons</Text>
              <div className="flex gap-2 flex-wrap">
                <Button variant="secondary" size="sm">Small</Button>
                <Button variant="secondary" size="md">Medium</Button>
                <Button variant="secondary" size="lg">Large</Button>
                <Button variant="secondary" size="md" icon={<Heart />}>Com Ícone</Button>
                <Button variant="secondary" size="md" disabled>Disabled</Button>
              </div>
            </div>

            <div>
              <Text variant="label-small" className="mb-2">Icon Buttons</Text>
              <div className="flex gap-2 flex-wrap items-center">
                <Button variant="icon-small">
                  <Star className="w-3 h-3" />
                </Button>
                <Button variant="icon-small">
                  <Heart className="w-3 h-3" />
                </Button>
                <Button variant="icon-small">
                  <Send className="w-3 h-3" />
                </Button>
                <Button variant="icon-small" disabled>
                  <Settings className="w-3 h-3" />
                </Button>
              </div>
            </div>
          </div>
        </Card>

        {/* Cards Section */}
        <Card>
          <Heading level={2}>Cards</Heading>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <Card>
              <Heading level={3}>Card Simples</Heading>
              <Text className="mt-2">
                Este é um card básico com título e texto.
              </Text>
            </Card>
            <Card>
              <Heading level={3}>Card com Badge</Heading>
              <Badge className="mt-2">Novo</Badge>
              <Text className="mt-2">
                Card com badge de destaque.
              </Text>
            </Card>
          </div>
        </Card>

        {/* Badges Section */}
        <Card>
          <Heading level={2}>Badges</Heading>
          <div className="mt-4 flex gap-2 flex-wrap">
            <Badge>Novo</Badge>
            <Badge>Em Progresso</Badge>
            <Badge>Concluído</Badge>
            <Badge>Premium</Badge>
            <Badge>Beta</Badge>
          </div>
        </Card>

        {/* Colors Section */}
        <Card>
          <Heading level={2}>Paleta de Cores</Heading>
          <div className="mt-4 space-y-4">
            <div>
              <Text variant="label-small" className="mb-2">Cores Principais</Text>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <div className="h-20 bg-[#0369a1] rounded-lg mb-2"></div>
                  <Text variant="label-smaller">Primária</Text>
                  <Text variant="label-smaller">#0369a1</Text>
                </div>
                <div>
                  <div className="h-20 bg-[#06b6d4] rounded-lg mb-2"></div>
                  <Text variant="label-smaller">Secundária</Text>
                  <Text variant="label-smaller">#06b6d4</Text>
                </div>
                <div>
                  <div className="h-20 bg-[#0891b2] rounded-lg mb-2"></div>
                  <Text variant="label-smaller">Terciária</Text>
                  <Text variant="label-smaller">#0891b2</Text>
                </div>
              </div>
            </div>

            <div>
              <Text variant="label-small" className="mb-2">Fundos</Text>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <div className="h-20 bg-[#0f172a] rounded-lg mb-2 border border-[rgba(6,182,212,0.125)]"></div>
                  <Text variant="label-smaller">Principal</Text>
                  <Text variant="label-smaller">#0f172a</Text>
                </div>
                <div>
                  <div className="h-20 bg-[#1e293b] rounded-lg mb-2 border border-[rgba(6,182,212,0.125)]"></div>
                  <Text variant="label-smaller">Secundário</Text>
                  <Text variant="label-smaller">#1e293b</Text>
                </div>
                <div>
                  <div className="h-20 bg-[rgba(14,41,63,0.31)] rounded-lg mb-2 border border-[rgba(6,182,212,0.125)]"></div>
                  <Text variant="label-smaller">Card</Text>
                  <Text variant="label-smaller">rgba(14,41,63,0.31)</Text>
                </div>
              </div>
            </div>

            <div>
              <Text variant="label-small" className="mb-2">Texto</Text>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="h-20 bg-white rounded-lg mb-2"></div>
                  <Text variant="label-smaller">Principal</Text>
                  <Text variant="label-smaller">#ffffff</Text>
                </div>
                <div>
                  <div className="h-20 bg-[#a5f3fc] rounded-lg mb-2"></div>
                  <Text variant="label-smaller">Secundário</Text>
                  <Text variant="label-smaller">#a5f3fc</Text>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Spacing Section */}
        <Card>
          <Heading level={2}>Espaçamento</Heading>
          <div className="mt-4 space-y-2">
            <div className="flex items-center gap-4">
              <div className="w-0 h-4 bg-[#06b6d4]"></div>
              <Text variant="label-smaller">0 (0rem)</Text>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-1 h-4 bg-[#06b6d4]"></div>
              <Text variant="label-smaller">1 (0.25rem)</Text>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-2 h-4 bg-[#06b6d4]"></div>
              <Text variant="label-smaller">2 (0.5rem)</Text>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-4 h-4 bg-[#06b6d4]"></div>
              <Text variant="label-smaller">4 (1rem)</Text>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-6 h-4 bg-[#06b6d4]"></div>
              <Text variant="label-smaller">6 (1.5rem)</Text>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-8 h-4 bg-[#06b6d4]"></div>
              <Text variant="label-smaller">8 (2rem)</Text>
            </div>
          </div>
        </Card>
      </Container>
    </div>
  );
}
