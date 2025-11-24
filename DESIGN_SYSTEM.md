# Design System - Paleta Azul Profundo e Cyan

## Paleta de Cores

### Cores Principais
- **Primária**: `#0369a1` (Azul profundo)
- **Secundária**: `#06b6d4` (Cyan claro)
- **Terciária**: `#0891b2` (Cyan médio)

### Fundos
- **Principal**: `#0f172a` (Slate quase preto)
- **Secundário**: `#1e293b` (Slate escuro)
- **Card**: `rgba(14,41,63,0.31)`

### Texto
- **Principal**: `#ffffff` (Branco)
- **Secundário**: `#a5f3fc` (Cyan claro 70%)

### Bordas
- **Padrão**: `rgba(6,182,212,0.125)` (Cyan 12.5%)

### Accent
- **Accent**: `#f0f9ff` (Azul muito claro)

## Tipografia

### Família de Fontes
- `system-ui, sans-serif`

### Pesos
- **Medium**: 500
- **Bold**: 700

### Tamanhos
- **xs**: 0.75rem
- **sm**: 0.875rem
- **base**: 1rem
- **lg**: 1.125rem
- **xl**: 1.25rem
- **2xl**: 1.5rem
- **3xl**: 1.875rem
- **4xl**: 2.25rem

### Altura de Linha
- **Padrão**: 1.5
- **Compacta**: 1

## Espaçamento

Escala: 0, 0.25rem, 0.5rem, 0.75rem, 1rem, 1.25rem, 1.5rem, 2rem, 2.5rem, 4rem, 5rem, 6rem, 8rem

## Componentes

### Button

#### Variante Primary
- Background: Gradiente de cyan claro para azul profundo
- Texto: Branco, 0.875rem, peso 500
- Padding: 0.5rem vertical, 1rem horizontal
- Border radius: 6px
- Box shadow: `0 10px 15px -3px rgba(6,182,212,0.5)`
- Hover: Gradiente mais escuro (cyan médio para azul profundo)
- Focus: Outline 2px cyan claro, offset 2px
- Disabled: Opacidade 50%, pointer-events none

#### Variante Secondary
- Background: Transparente
- Borda: 1px `rgba(6,182,212,0.2)`
- Texto: gray-300
- Hover: Background `rgba(15,23,42,0.3)`, texto branco
- Focus: Outline 2px cyan claro, offset 2px
- Disabled: Opacidade 50%, pointer-events none

#### Variante Icon Small
- Tamanho: 1.25rem (20px)
- Background: `rgba(30,41,59,0.56)`
- Cor: `#22d3ee` (Cyan claro)
- Borda: 1px `rgba(55,65,81,0.5)`
- Hover: Background `rgba(30,41,59,0.69)`, cor `#a5f3fc`
- Padding: 0

### Card
- Background: `rgba(14,41,63,0.31)`
- Borda: 1px `rgba(6,182,212,0.125)`
- Border radius: 8px
- Box shadow: `0 1px 2px rgba(0,0,0,0.05)`
- Padding: 1.5rem
- Cor do texto: Branco

### Navbar
- Position: Sticky top
- Background: `rgba(15,23,42,0.95)` com backdrop-filter blur 10px
- Borda inferior: 1px `rgba(6,182,212,0.125)`
- Altura: 4rem (64px)
- Padding horizontal: 1rem
- Display: Flex, align-items center, justify-content space-between

### Badge
- Display: Inline-flex
- Padding: 0.5rem vertical, 1.5rem horizontal
- Border radius: 9999px (completamente arredondado)
- Background: Gradiente `rgba(6,182,212,0.125)` até `rgba(3,105,161,0.125)`
- Backdrop filter: Blur 6px
- Borda: 1px `rgba(6,182,212,0.188)`
- Tamanho de fonte: 0.875rem, peso 500
- Cor: `#a5f3fc`

### Heading Nível 1
- Tamanho: 2.25rem (36px)
- Peso: 700 (bold)
- Background gradiente: Esquerda para direita, branco → cyan claro → branco
- Background-clip: text
- Cor: transparent

### Text

#### Variante Lead
- Tamanho: 1.125rem
- Cor: `rgba(165,243,252,0.7)`

#### Variante Label Small
- Tamanho: 0.875rem
- Peso: 500
- Cor: `#a5f3fc`

#### Variante Label Smaller
- Tamanho: 0.75rem
- Cor: `#5eead4`

## Layout e Utilities

### Container Principal
- Max-width: 72rem
- Margin: Auto (centralizado)
- Padding: 1.5rem

### Grid
- Colunas: 2 (padrão), 4 (breakpoint médio)
- Gap: 1rem

### Flex Centrado
- Display: Flex
- Align-items: Center
- Justify-content: Center

### Flex com Espaço Entre
- Display: Flex
- Align-items: Center
- Justify-content: Space-between

### Gaps
- **Pequeno**: 0.5rem
- **Médio**: 1rem

## Uso dos Componentes

```tsx
import { Button, Card, Badge, Heading, Text, Container, Navbar } from "@/components/design-system";

// Button
<Button variant="primary" size="md">Clique aqui</Button>
<Button variant="secondary">Cancelar</Button>
<Button variant="icon-small"><Icon /></Button>

// Card
<Card>Conteúdo do card</Card>

// Badge
<Badge>Novo</Badge>

// Typography
<Heading level={1}>Título Principal</Heading>
<Text variant="lead">Texto de destaque</Text>
<Text variant="label-small">Label pequeno</Text>

// Layout
<Container>
  <Navbar>Conteúdo da navbar</Navbar>
</Container>
```

## Implementação

Todos os componentes estão em `src/components/design-system/` e podem ser importados através do index:

```tsx
import { Button, Card, Badge, Heading, Text, Container, Navbar } from "@/components/design-system";
```

As cores e variáveis CSS estão definidas em:
- `src/index.css` - Variáveis CSS globais
- `tailwind.config.ts` - Configuração do Tailwind

## Acessibilidade

- Contraste mínimo WCAG AA garantido
- Elementos focusáveis com outline visível
- Cores de texto legíveis sobre fundos escuros
- Estados hover e focus claramente definidos
