# Migração para Supabase

Este guia explica como configurar e usar a integração com Supabase.

## 1. Configuração Inicial

### 1.1 Criar Projeto no Supabase

1. Acesse https://supabase.com/dashboard
2. Crie um novo projeto
3. Anote a **Project URL** e as chaves de API

### 1.2 Configurar Variáveis de Ambiente

Edite o arquivo `.env` com suas credenciais:

```env
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua_anon_key_aqui
VITE_SUPABASE_SERVICE_ROLE_KEY=sua_service_role_key_aqui
```

### 1.3 Executar Migrations

No dashboard do Supabase:

1. Vá em **SQL Editor**
2. Copie o conteúdo de `supabase/migrations/001_initial_schema.sql`
3. Execute o SQL

Isso criará:
- Tabela `profiles` (perfis de usuário)
- Tabela `flows` (fluxos/formulários)
- Tabela `form_responses` (respostas dos formulários)
- Políticas de segurança (RLS)
- Triggers automáticos

## 2. Funcionalidades

### 2.1 Autenticação

O sistema agora usa Supabase Auth:

- ✅ Registro de usuários
- ✅ Login com email/senha
- ✅ Sessão persistente
- ✅ Logout
- ✅ Criação automática de perfil

### 2.2 Armazenamento de Fluxos

Os fluxos são salvos no banco de dados Supabase:

- ✅ Criar fluxos
- ✅ Editar fluxos
- ✅ Deletar fluxos
- ✅ Publicar/despublicar
- ✅ Slugs únicos para URLs amigáveis
- ✅ Sincronização em tempo real

### 2.3 Respostas de Formulários

As respostas são salvas no Supabase:

- ✅ Salvar respostas
- ✅ Visualizar respostas por fluxo
- ✅ Associar respostas a usuários (opcional)

## 3. Migração de Dados Locais

### 3.1 Migração Automática

Quando você fizer login pela primeira vez após a integração:

1. Um diálogo aparecerá automaticamente
2. Clique em "Migrar Dados"
3. Aguarde a conclusão
4. Os dados locais serão movidos para o Supabase

### 3.2 Migração Manual

Se precisar migrar manualmente:

```typescript
import { migrateLocalStorageToSupabase, clearLocalStorage } from '@/utils/migrateToSupabase';

// Executar migração
const result = await migrateLocalStorageToSupabase();

// Se bem-sucedida, limpar localStorage
if (result.success) {
  clearLocalStorage();
}
```

## 4. Estrutura do Banco de Dados

### Tabela: profiles

```sql
- id (UUID) - FK para auth.users
- email (TEXT)
- name (TEXT)
- avatar_url (TEXT)
- created_at (TIMESTAMPTZ)
- updated_at (TIMESTAMPTZ)
```

### Tabela: flows

```sql
- id (TEXT) - PK
- user_id (UUID) - FK para auth.users
- name (TEXT)
- slug (TEXT) - Único
- data (JSONB) - Dados do fluxo
- is_published (BOOLEAN)
- file_content (TEXT)
- mime_type (TEXT)
- original_file_name (TEXT)
- settings (JSONB)
- created_at (TIMESTAMPTZ)
- updated_at (TIMESTAMPTZ)
```

### Tabela: form_responses

```sql
- id (UUID) - PK
- flow_id (TEXT) - FK para flows
- user_id (UUID) - FK para auth.users (nullable)
- responses (JSONB)
- completed (BOOLEAN)
- ip_address (TEXT)
- user_agent (TEXT)
- created_at (TIMESTAMPTZ)
- updated_at (TIMESTAMPTZ)
```

## 5. Segurança (RLS)

As políticas de Row Level Security garantem:

- ✅ Usuários só veem seus próprios fluxos
- ✅ Fluxos publicados são visíveis para todos
- ✅ Apenas donos podem editar/deletar seus fluxos
- ✅ Qualquer um pode responder fluxos publicados
- ✅ Apenas donos veem respostas de seus fluxos

## 6. APIs Disponíveis

### supabaseStorage

```typescript
import * as supabaseStorage from '@/utils/supabaseStorage';

// Salvar fluxo
await supabaseStorage.saveFlow(name, data, id?, slug?, settings?);

// Obter fluxo
await supabaseStorage.getFlow(id);

// Obter por slug
await supabaseStorage.getFlowBySlug(slug);

// Listar fluxos do usuário
await supabaseStorage.listFlows();

// Atualizar publicação
await supabaseStorage.updatePublishStatus(id, isPublished);

// Deletar fluxo
await supabaseStorage.deleteFlow(id);

// Salvar resposta
await supabaseStorage.saveFormResponse(flowId, responses, completed);

// Obter respostas
await supabaseStorage.getFlowResponses(flowId);
```

## 7. Desenvolvimento Local

Para testar localmente:

```bash
# Instalar dependências
npm install

# Configurar .env
# (adicionar credenciais do Supabase)

# Executar dev server
npm run dev
```

## 8. Troubleshooting

### Erro: "Missing Supabase environment variables"

- Verifique se o `.env` está configurado corretamente
- Reinicie o servidor de desenvolvimento

### Erro: "Usuário não autenticado"

- Faça login novamente
- Verifique se o Supabase Auth está configurado

### Erro na migração

- Verifique se as tabelas foram criadas no Supabase
- Verifique as políticas RLS
- Tente migrar manualmente

### Dados não aparecem

- Verifique se está logado
- Recarregue a página
- Verifique o console do navegador

## 9. Próximos Passos

- [ ] Configurar email templates no Supabase
- [ ] Adicionar autenticação social (Google, GitHub)
- [ ] Implementar real-time subscriptions
- [ ] Adicionar Supabase Storage para uploads
- [ ] Configurar backup automático
