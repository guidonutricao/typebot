# Correções de Erros do Supabase

## Problemas Identificados e Corrigidos

### 1. Erro "Cannot coerce the result to a single JSON object"

**Causa**: O método `.single()` do Supabase falha quando:
- A query retorna múltiplos resultados
- A query não retorna nenhum resultado
- Há conflito de slug único

**Correções aplicadas**:

#### `src/utils/supabaseStorage.ts`

1. **Verificação de slug duplicado**: Mudado de `.single()` para `.limit(1)` para evitar erro quando não há resultados
2. **Função saveFlow melhorada**: Adicionado verificação se o fluxo existe antes de fazer update
3. **Tratamento de slug único**: Adiciona timestamp ao slug se já existir
4. **Função testConnection**: Nova função para verificar conexão antes de operações

### 2. Erro ao importar fluxos

**Causa**: O componente `CreateFlowDialog` estava usando `formStorage` (localStorage) em vez do Supabase

**Correções aplicadas**:

#### `src/components/admin/CreateFlowDialog.tsx`

1. **Migrado para Supabase**: Substituído `saveFormFile` por `useFlowStore.addFlow`
2. **Teste de conexão**: Adicionado verificação de conexão antes de salvar
3. **Verificação de autenticação**: Melhorado tratamento de erros de autenticação
4. **Mensagens de erro específicas**: Adicionado mensagens mais claras para diferentes tipos de erro

### 3. Melhorias na migração

#### `src/utils/migrateToSupabase.ts`

1. **Tratamento de erros detalhado**: Separado erros de parse, validação e salvamento
2. **Logs melhorados**: Mais informações sobre cada etapa da migração
3. **Validação de dados**: Verifica se os dados são válidos antes de salvar

## Como Testar

### Teste 1: Criar nova conta e migrar dados
```bash
1. Faça logout se estiver logado
2. Crie uma nova conta
3. A migração deve ocorrer automaticamente
4. Verifique se os fluxos foram migrados corretamente
```

### Teste 2: Importar novo fluxo
```bash
1. Faça login
2. Vá para Dashboard
3. Clique em "Criar Novo Formulário"
4. Selecione um arquivo JSON válido
5. Clique em "Criar Formulário"
6. Verifique se o fluxo foi criado no Supabase
```

### Teste 3: Publicar e acessar formulário
```bash
1. Faça login
2. Vá para Dashboard
3. Clique em um formulário
4. Vá para a aba "Compartilhar"
5. Clique em "Publicar"
6. Copie o link público
7. Abra o link em uma aba anônima (sem login)
8. O formulário deve carregar normalmente
```

### Teste 4: Verificar conexão
```bash
# Abra o console do navegador e execute:
import { testConnection } from '@/utils/supabaseStorage';
const isConnected = await testConnection();
console.log('Conectado:', isConnected);
```

## Verificações no Supabase

1. **Acesse o Supabase Dashboard**: https://fsznesncrwebbealwjou.supabase.co
2. **Verifique a tabela flows**:
   - Deve ter os fluxos migrados
   - Slugs devem ser únicos
   - user_id deve estar preenchido

3. **Verifique as políticas RLS**:
   - Usuários devem ver apenas seus próprios fluxos
   - Fluxos publicados devem ser visíveis para todos

### 4. Formulário público não carregando

**Causa**: A página `Form.tsx` estava usando `formStorage` (localStorage) em vez do Supabase

**Correções aplicadas**:

#### `src/pages/Form.tsx`

1. **Migrado para Supabase**: Substituído `getFormMeta` e `getFileEntry` por `getFlow` e `getFlowBySlug`
2. **Suporte a slug**: Agora aceita tanto ID quanto slug na URL
3. **Busca pública**: Usa `getFlowBySlug` para formulários publicados (não requer autenticação)

#### `src/pages/admin/Share.tsx`

1. **Link correto**: Agora gera link com `/forms/:formId` ou `/forms/:slug`
2. **Toggle de publicação**: Botão agora realmente publica/despublica no Supabase
3. **Status em tempo real**: Mostra status correto de publicação do fluxo

## Possíveis Problemas Restantes

Se ainda houver erros:

1. **Erro de autenticação**: Faça logout e login novamente
2. **Erro de conexão**: Verifique se as variáveis de ambiente estão corretas no `.env`
3. **Erro de permissão**: Verifique as políticas RLS no Supabase
4. **Erro de dados**: Verifique se o JSON do fluxo está válido
5. **Formulário não carrega**: Certifique-se de que o formulário está publicado

## Comandos Úteis

```bash
# Limpar cache do navegador
Ctrl + Shift + Delete

# Ver logs do Supabase
# Abra o console do navegador (F12) e vá para a aba Console

# Reiniciar servidor de desenvolvimento
npm run dev
```
