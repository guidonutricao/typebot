# Tabela Dinâmica de Resultados

## 🎯 Objetivo

Criar uma tabela onde as **colunas são as variáveis do fluxo** (tudo entre `{{` e `}}`) e as **linhas são as respostas dos usuários**.

## ✨ Implementação

### 1. Extração de Variáveis (`src/utils/extractVariables.ts`)

Criamos uma função que percorre todo o fluxo Typebot e extrai todas as variáveis usando regex:

```typescript
const variableRegex = /\{\{([^}]+)\}\}/g;
```

A função:
- Busca em todos os grupos e blocos do fluxo
- Busca nas edges (conexões)
- Inclui variáveis definidas explicitamente no fluxo
- Retorna um array ordenado de nomes de variáveis únicos

### 2. Estrutura da Tabela

#### Colunas Fixas (Sticky)
- **ID**: Identificador único da resposta (8 primeiros caracteres)
- **Data**: Data e hora da submissão
- **Status**: Completo (✓) ou Incompleto (○)

#### Colunas Dinâmicas
- Uma coluna para cada variável encontrada no fluxo
- Header mostra: `{{ nome_variavel }}`
- Células mostram o valor da variável ou "-" se vazio

#### Coluna de Ações (Sticky)
- Botão para ver detalhes completos
- Botão para deletar resposta

### 3. Features da Tabela

#### Scroll Horizontal com Colunas Fixas
```css
sticky left-0 bg-background z-10  /* ID e Data */
sticky right-0 bg-background z-10 /* Ações */
```

#### Truncamento de Texto Longo
```css
max-w-[200px] truncate
```

#### Hover Effects
```css
hover:bg-muted/50
```

### 4. Modal de Detalhes

Quando o usuário clica no ícone de olho, abre um modal mostrando:

- **Informações Gerais**: ID completo e status
- **Variáveis do Fluxo**: Lista todas as variáveis com seus valores
  - Mostra `{{ variavel }}` como header
  - Valor abaixo (ou "Sem resposta" se vazio)
  - Design com cards e bordas

### 5. Exportação

#### CSV
- Colunas: ID, Data, Status, [todas as variáveis]
- Usa as variáveis do fluxo como headers
- Valores formatados corretamente

#### JSON
- Exporta o objeto completo de respostas
- Mantém estrutura original

## 🎨 Design com Magic UI

### Cards de Estatísticas
- Bordas coloridas à esquerda (`border-l-4`)
- Ícones contextuais
- Hover com shadow
- Cores temáticas:
  - Primary: Total de respostas
  - Green: Taxa de conclusão
  - Blue: Respostas hoje
  - Amber: Última resposta

### Tabela
- Headers com ícones `{{ }}`
- Status com badges coloridos
- Scroll horizontal suave
- Colunas fixas para navegação

### Modal
- Layout em grid para info geral
- Cards para cada variável
- Bordas e backgrounds sutis
- Scroll vertical para muitas variáveis

## 📊 Fluxo de Dados

```
1. Usuário seleciona um formulário
   ↓
2. Sistema carrega o fluxo do Supabase
   ↓
3. Extrai variáveis do fluxo ({{ }})
   ↓
4. Carrega respostas do formulário
   ↓
5. Monta tabela dinâmica
   - Colunas = variáveis
   - Linhas = respostas
   ↓
6. Usuário pode:
   - Ver detalhes
   - Exportar (CSV/JSON)
   - Deletar respostas
```

## 🗄️ Estrutura do Banco (Supabase)

### Tabela: `flows`
```sql
- id: TEXT (PK)
- user_id: UUID (FK)
- name: TEXT
- data: JSONB  ← Contém o fluxo completo
- is_published: BOOLEAN
- created_at: TIMESTAMPTZ
- updated_at: TIMESTAMPTZ
```

### Tabela: `form_responses`
```sql
- id: UUID (PK)
- flow_id: TEXT (FK)
- user_id: UUID (FK, nullable)
- responses: JSONB  ← Contém { variavel: valor }
- completed: BOOLEAN
- created_at: TIMESTAMPTZ
- updated_at: TIMESTAMPTZ
```

## 🔒 Segurança (RLS)

- Usuários só veem respostas de seus próprios fluxos
- Políticas do Supabase garantem isolamento
- Queries automáticas com `auth.uid()`

## 🚀 Queries Úteis

Veja o arquivo `supabase/queries_results.sql` para:
- Buscar respostas por fluxo
- Calcular estatísticas
- Filtrar por data
- Extrair variáveis únicas
- Exportar dados

## 💡 Vantagens da Abordagem

1. **Agnóstico ao Fluxo**: Funciona com qualquer estrutura de Typebot
2. **Dinâmico**: Colunas se adaptam automaticamente
3. **Performático**: Usa índices do Supabase
4. **Escalável**: Suporta muitas variáveis e respostas
5. **Intuitivo**: Interface clara e fácil de usar

## 🎯 Casos de Uso

### Formulário de Cadastro
Variáveis: `nome`, `email`, `telefone`, `cidade`
→ Tabela com 4 colunas dinâmicas

### Quiz/Avaliação
Variáveis: `pergunta1`, `pergunta2`, `pergunta3`, `pontuacao`
→ Tabela com 4 colunas dinâmicas

### Pesquisa de Satisfação
Variáveis: `nps`, `comentario`, `recomendaria`
→ Tabela com 3 colunas dinâmicas

## 🔧 Manutenção

### Adicionar Nova Coluna Fixa
1. Adicionar no `<TableHead>` do header
2. Adicionar no `<TableCell>` do body
3. Ajustar larguras e sticky positions

### Modificar Extração de Variáveis
1. Editar `src/utils/extractVariables.ts`
2. Ajustar regex ou lógica de busca
3. Testar com diferentes fluxos

### Customizar Exportação
1. Editar funções `handleExportCSV` e `handleExportJSON`
2. Adicionar/remover colunas
3. Modificar formatação

## 📱 Responsividade

- Scroll horizontal em telas pequenas
- Colunas fixas mantêm contexto
- Modal adapta-se ao tamanho da tela
- Cards empilham em mobile

## 🎨 Personalização

### Cores
- Modificar classes Tailwind nos cards
- Ajustar badges de status
- Customizar bordas e backgrounds

### Layout
- Ajustar larguras de colunas (`min-w-[150px]`)
- Modificar sticky positions
- Alterar grid do modal

### Ícones
- Trocar ícones do Lucide React
- Adicionar novos ícones nas colunas
- Customizar tamanhos e cores
