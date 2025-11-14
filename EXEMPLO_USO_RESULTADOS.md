# 📋 Exemplo Prático - Tabela de Resultados

## Cenário: Formulário de Cadastro de Clientes

### 1. Fluxo Typebot Importado

```json
{
  "name": "Cadastro de Clientes",
  "groups": [
    {
      "id": "group1",
      "blocks": [
        {
          "type": "text",
          "content": "Olá! Vamos fazer seu cadastro?"
        },
        {
          "type": "text input",
          "options": {
            "variableId": "nome",
            "labels": { "placeholder": "Digite seu nome" }
          }
        },
        {
          "type": "text input",
          "options": {
            "variableId": "email",
            "labels": { "placeholder": "Digite seu email" }
          }
        },
        {
          "type": "text input",
          "options": {
            "variableId": "telefone",
            "labels": { "placeholder": "Digite seu telefone" }
          }
        },
        {
          "type": "choice input",
          "options": {
            "variableId": "interesse"
          },
          "items": [
            { "content": "Produto A" },
            { "content": "Produto B" },
            { "content": "Produto C" }
          ]
        }
      ]
    }
  ],
  "variables": [
    { "id": "v1", "name": "nome" },
    { "id": "v2", "name": "email" },
    { "id": "v3", "name": "telefone" },
    { "id": "v4", "name": "interesse" }
  ]
}
```

### 2. Sistema Extrai Variáveis

```typescript
// Resultado da função extractVariablesFromFlow()
variables = ["email", "interesse", "nome", "telefone"]
// Ordenado alfabeticamente
```

### 3. Respostas no Banco (Supabase)

```json
// form_responses table
[
  {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "flow_id": "flow_123",
    "responses": {
      "nome": "João Silva",
      "email": "joao@email.com",
      "telefone": "(11) 98765-4321",
      "interesse": "Produto A"
    },
    "completed": true,
    "created_at": "2025-11-14T10:30:00Z"
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440001",
    "flow_id": "flow_123",
    "responses": {
      "nome": "Maria Santos",
      "email": "maria@email.com",
      "telefone": "(21) 91234-5678",
      "interesse": "Produto B"
    },
    "completed": true,
    "created_at": "2025-11-14T11:45:00Z"
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440002",
    "flow_id": "flow_123",
    "responses": {
      "nome": "Pedro Costa",
      "email": "pedro@email.com"
    },
    "completed": false,
    "created_at": "2025-11-14T12:00:00Z"
  }
]
```

### 4. Tabela Renderizada

```
┌──────────┬─────────────────┬────────┬──────────────┬──────────────────┬──────────────────┬────────────┬─────────┐
│ ID       │ Data            │ Status │ {{email}}    │ {{interesse}}    │ {{nome}}         │ {{telefone}}│ Ações   │
├──────────┼─────────────────┼────────┼──────────────┼──────────────────┼──────────────────┼────────────┼─────────┤
│ 550e8400 │ 14/11 10:30     │   ✓    │ joao@email   │ Produto A        │ João Silva       │ (11) 98765 │ 👁️ 🗑️  │
│ 550e8400 │ 14/11 11:45     │   ✓    │ maria@email  │ Produto B        │ Maria Santos     │ (21) 91234 │ 👁️ 🗑️  │
│ 550e8400 │ 14/11 12:00     │   ○    │ pedro@email  │ -                │ Pedro Costa      │ -          │ 👁️ 🗑️  │
└──────────┴─────────────────┴────────┴──────────────┴──────────────────┴──────────────────┴────────────┴─────────┘
```

### 5. Cards de Estatísticas

```
┌─────────────────────┐  ┌─────────────────────┐  ┌─────────────────────┐  ┌─────────────────────┐
│ Total de Respostas  │  │ Taxa de Conclusão   │  │ Respostas Hoje      │  │ Última Resposta     │
│                     │  │                     │  │                     │  │                     │
│        3            │  │       67%           │  │        3            │  │    14/11/2025       │
│                     │  │                     │  │                     │  │      12:00          │
│ Todas as submissões │  │ 2 de 3 completas    │  │ Nas últimas 24h     │  │                     │
└─────────────────────┘  └─────────────────────┘  └─────────────────────┘  └─────────────────────┘
```

### 6. Modal de Detalhes (Clique no 👁️)

```
╔═══════════════════════════════════════════════════════════════╗
║ Detalhes da Resposta                                          ║
║ Resposta enviada em 14/11/2025 às 10:30                      ║
╠═══════════════════════════════════════════════════════════════╣
║                                                               ║
║ ┌─────────────────────────┬─────────────────────────┐        ║
║ │ ID                      │ Status                  │        ║
║ │ 550e8400-e29b-41d4...   │ Completo                │        ║
║ └─────────────────────────┴─────────────────────────┘        ║
║                                                               ║
║ Variáveis do Fluxo                                            ║
║                                                               ║
║ ┌─────────────────────────────────────────────────┐          ║
║ │ {{ email }}                                     │          ║
║ │      joao@email.com                             │          ║
║ └─────────────────────────────────────────────────┘          ║
║                                                               ║
║ ┌─────────────────────────────────────────────────┐          ║
║ │ {{ interesse }}                                 │          ║
║ │      Produto A                                  │          ║
║ └─────────────────────────────────────────────────┘          ║
║                                                               ║
║ ┌─────────────────────────────────────────────────┐          ║
║ │ {{ nome }}                                      │          ║
║ │      João Silva                                 │          ║
║ └─────────────────────────────────────────────────┘          ║
║                                                               ║
║ ┌─────────────────────────────────────────────────┐          ║
║ │ {{ telefone }}                                  │          ║
║ │      (11) 98765-4321                            │          ║
║ └─────────────────────────────────────────────────┘          ║
║                                                               ║
╚═══════════════════════════════════════════════════════════════╝
```

### 7. Exportação CSV

```csv
ID,Data,Status,email,interesse,nome,telefone
"550e8400-e29b-41d4-a716-446655440000","14/11/2025 10:30:00","Completo","joao@email.com","Produto A","João Silva","(11) 98765-4321"
"550e8400-e29b-41d4-a716-446655440001","14/11/2025 11:45:00","Completo","maria@email.com","Produto B","Maria Santos","(21) 91234-5678"
"550e8400-e29b-41d4-a716-446655440002","14/11/2025 12:00:00","Incompleto","pedro@email.com","","Pedro Costa",""
```

### 8. Exportação JSON

```json
[
  {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "flow_id": "flow_123",
    "user_id": null,
    "responses": {
      "nome": "João Silva",
      "email": "joao@email.com",
      "telefone": "(11) 98765-4321",
      "interesse": "Produto A"
    },
    "completed": true,
    "created_at": "2025-11-14T10:30:00Z",
    "updated_at": "2025-11-14T10:30:00Z"
  },
  ...
]
```

## 🎯 Casos de Uso Reais

### 1. Pesquisa de Satisfação (NPS)

**Variáveis**: `nps`, `comentario`, `recomendaria`

| ID | Data | Status | {{nps}} | {{comentario}} | {{recomendaria}} |
|----|------|--------|---------|----------------|------------------|
| abc | 14/11 | ✓ | 9 | Excelente serviço! | Sim |
| def | 14/11 | ✓ | 7 | Bom, mas pode melhorar | Talvez |
| ghi | 14/11 | ✓ | 10 | Perfeito! | Sim |

### 2. Quiz Educacional

**Variáveis**: `pergunta1`, `pergunta2`, `pergunta3`, `pontuacao_final`

| ID | Data | Status | {{pergunta1}} | {{pergunta2}} | {{pergunta3}} | {{pontuacao_final}} |
|----|------|--------|---------------|---------------|---------------|---------------------|
| abc | 14/11 | ✓ | A | B | C | 8/10 |
| def | 14/11 | ✓ | B | A | C | 6/10 |
| ghi | 14/11 | ○ | A | - | - | - |

### 3. Agendamento de Consultas

**Variáveis**: `nome`, `data_preferida`, `horario`, `tipo_consulta`

| ID | Data | Status | {{nome}} | {{data_preferida}} | {{horario}} | {{tipo_consulta}} |
|----|------|--------|----------|-------------------|-------------|-------------------|
| abc | 14/11 | ✓ | Ana | 20/11/2025 | 14:00 | Rotina |
| def | 14/11 | ✓ | Carlos | 21/11/2025 | 10:00 | Urgência |
| ghi | 14/11 | ○ | Beatriz | - | - | - |

### 4. Formulário de Feedback

**Variáveis**: `produto`, `avaliacao`, `sugestao`, `voltaria_comprar`

| ID | Data | Status | {{produto}} | {{avaliacao}} | {{sugestao}} | {{voltaria_comprar}} |
|----|------|--------|-------------|---------------|--------------|----------------------|
| abc | 14/11 | ✓ | Notebook | 5 estrelas | Ótima qualidade | Sim |
| def | 14/11 | ✓ | Mouse | 4 estrelas | Preço alto | Talvez |
| ghi | 14/11 | ✓ | Teclado | 3 estrelas | Barulhento | Não |

## 🔍 Busca e Filtros

### Buscar por Email
```
Digite: "maria"
Resultado: Mostra apenas a linha com maria@email.com
```

### Buscar por Produto
```
Digite: "Produto A"
Resultado: Mostra apenas respostas com interesse em Produto A
```

### Buscar por Status
```
Digite: "completo"
Resultado: Mostra apenas respostas completas
```

## 📊 Análise de Dados

### Query SQL para Análise
```sql
-- Contar interesse por produto
SELECT 
  responses->>'interesse' as produto,
  COUNT(*) as total
FROM form_responses
WHERE flow_id = 'flow_123'
  AND responses->>'interesse' IS NOT NULL
GROUP BY responses->>'interesse'
ORDER BY total DESC;

-- Resultado:
-- Produto A: 5
-- Produto B: 3
-- Produto C: 2
```

## 🎨 Personalização Visual

### Cores Personalizadas
```tsx
// Mudar cor do card de Total
border-l-purple-500  // Roxo
border-l-pink-500    // Rosa
border-l-indigo-500  // Índigo
```

### Ícones Personalizados
```tsx
import { Users, Mail, Phone, ShoppingCart } from "lucide-react";

// Adicionar ícone específico para cada variável
{varName === 'email' && <Mail className="w-3 h-3" />}
{varName === 'telefone' && <Phone className="w-3 h-3" />}
```

## ✅ Checklist de Uso

- [x] Importar fluxo Typebot
- [x] Publicar formulário
- [x] Receber respostas
- [x] Acessar página Resultados
- [x] Selecionar formulário
- [x] Ver tabela com variáveis
- [x] Clicar em 👁️ para detalhes
- [x] Exportar CSV/JSON
- [x] Deletar respostas indesejadas

## 🚀 Pronto para Usar!

A tabela dinâmica está **100% funcional** e se adapta automaticamente a qualquer fluxo Typebot que você importar!
