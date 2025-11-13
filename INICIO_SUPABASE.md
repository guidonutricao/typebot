# 🚀 Início Rápido - Supabase

## Passo 1: Configurar Supabase

1. **Criar conta no Supabase**
   - Acesse: https://supabase.com
   - Crie uma conta gratuita

2. **Criar novo projeto**
   - Clique em "New Project"
   - Escolha um nome e senha forte
   - Selecione a região mais próxima
   - Aguarde ~2 minutos para o projeto ser criado

3. **Obter credenciais**
   - Vá em **Settings** → **API**
   - Copie:
     - `Project URL`
     - `anon public` key
     - `service_role` key (aba "Project API keys")

## Passo 2: Configurar o Projeto

1. **Editar arquivo `.env`**
   ```env
   VITE_SUPABASE_URL=https://xxxxx.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGc...
   VITE_SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...
   ```

2. **Executar migrations no Supabase**
   - No dashboard, vá em **SQL Editor**
   - Clique em "New query"
   - Cole o conteúdo de `supabase/migrations/001_initial_schema.sql`
   - Clique em "Run"
   - Aguarde a confirmação "Success"

## Passo 3: Testar

1. **Iniciar o projeto**
   ```bash
   npm run dev
   ```

2. **Criar uma conta**
   - Acesse http://localhost:8080/auth
   - Clique em "Criar conta"
   - Preencha os dados
   - Faça login

3. **Verificar no Supabase**
   - Vá em **Authentication** → **Users**
   - Você deve ver seu usuário criado
   - Vá em **Table Editor** → **profiles**
   - Seu perfil foi criado automaticamente!

## Passo 4: Migrar Dados (se tiver)

Se você já tinha fluxos salvos localmente:

1. Faça login no sistema
2. Um diálogo de migração aparecerá automaticamente
3. Clique em "Migrar Dados"
4. Aguarde a conclusão
5. Seus dados agora estão na nuvem! ☁️

## Verificar se Funcionou

### ✅ Checklist

- [ ] Consegui criar uma conta
- [ ] Consegui fazer login
- [ ] Meu perfil aparece no Supabase (Table Editor → profiles)
- [ ] Consigo criar um novo fluxo
- [ ] O fluxo aparece no Supabase (Table Editor → flows)
- [ ] Consigo publicar/despublicar fluxos
- [ ] Consigo editar e salvar fluxos

### 🐛 Problemas Comuns

**Erro: "Missing Supabase environment variables"**
- Verifique se o `.env` está na raiz do projeto
- Reinicie o servidor (`npm run dev`)

**Erro ao criar conta: "Invalid API key"**
- Verifique se copiou as chaves corretas
- Use a `anon public` key, não a `service_role`

**Tabelas não existem**
- Execute a migration SQL no dashboard do Supabase
- Verifique se não houve erros na execução

**Não consigo ver meus fluxos**
- Recarregue a página
- Verifique o console do navegador (F12)
- Verifique se está logado

## Próximos Passos

Agora que está tudo funcionando:

1. **Personalize seu perfil** em `/profile`
2. **Crie seus fluxos** no admin
3. **Publique e compartilhe** com o mundo!

## Recursos Úteis

- 📚 [Documentação Supabase](https://supabase.com/docs)
- 🎓 [Tutoriais Supabase](https://supabase.com/docs/guides)
- 💬 [Discord Supabase](https://discord.supabase.com)
- 📖 [Guia completo de migração](./MIGRACAO_SUPABASE.md)

## Suporte

Problemas? Abra uma issue no GitHub ou consulte o arquivo `MIGRACAO_SUPABASE.md` para mais detalhes.
