# Quick Start - Novo Design System

## 🚀 Início Rápido

### Ver o Design System
```bash
npm run dev
```
Acesse: `http://localhost:5173/design-system`

### Usar nos Componentes

```tsx
import { Button, Card, Heading, Text } from "@/components/design-system";

function MeuComponente() {
  return (
    <Card>
      <Heading level={1}>Título</Heading>
      <Text variant="lead">Descrição</Text>
      <Button variant="primary">Ação</Button>
    </Card>
  );
}
```

## 🎨 Componentes Disponíveis

| Componente | Variantes | Uso |
|------------|-----------|-----|
| **Button** | primary, secondary, icon-small | Ações e navegação |
| **Card** | - | Containers de conteúdo |
| **Badge** | - | Labels e tags |
| **Heading** | level 1-4 | Títulos |
| **Text** | default, lead, label-small, label-smaller | Texto |
| **Container** | - | Layout centralizado |
| **Navbar** | - | Navegação sticky |

## 🎯 Cores Principais

```css
/* Primária */
#0369a1

/* Secundária */
#06b6d4

/* Fundo */
#0f172a

/* Texto */
#ffffff
```

## 📦 Importação

```tsx
// Importar tudo
import * as DS from "@/components/design-system";

// Ou individual
import { Button } from "@/components/design-system";
```

## 📚 Documentação Completa

- `DESIGN_SYSTEM.md` - Especificações completas
- `NOVO_DESIGN_APLICADO.md` - O que foi implementado
- `/design-system` - Demonstração visual

## ✅ Componentes Já Atualizados

- ChatMessage
- WelcomeScreen
- ChatInput
- admin/Navbar
- admin/Dashboard

## 🔄 Migrar Componente Antigo

**Antes:**
```tsx
import { Button } from "@/components/ui/button";

<Button className="bg-primary">Click</Button>
```

**Depois:**
```tsx
import { Button } from "@/components/design-system";

<Button variant="primary">Click</Button>
```

## 💡 Dicas

1. Use `variant` prop para estilos diferentes
2. Use `size` prop para tamanhos (sm, md, lg)
3. Use `className` para customizações extras
4. Todos os componentes são responsivos
5. Suporte completo a TypeScript

## 🎨 Gradientes Prontos

```tsx
// Botão com gradiente (automático no primary)
<Button variant="primary">Gradiente Cyan → Azul</Button>

// Título com gradiente (automático no H1)
<Heading level={1}>Gradiente Branco → Cyan → Branco</Heading>
```

## 🔍 Troubleshooting

**Componente não aparece?**
- Verifique se importou de `@/components/design-system`
- Confirme que o fundo da página é escuro

**Cores não aparecem?**
- Verifique se `src/index.css` foi atualizado
- Confirme que `tailwind.config.ts` tem as novas cores

**TypeScript reclama?**
- Execute `npm run build` para verificar tipos
- Verifique se todas as props estão corretas
