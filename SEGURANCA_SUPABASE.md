# 🔒 Segurança - Supabase

## ⚠️ ALERTA CRÍTICO

**NUNCA exponha a Service Role Key no código do cliente!**

## Diferença entre as Chaves

### 🟢 ANON KEY (Segura para frontend)
- ✅ Pode ser exposta no código do cliente
- ✅ Respeita Row Level Security (RLS)
- ✅ Acesso limitado pelas políticas
- ✅ Use esta no frontend!

### 🔴 SERVICE ROLE KEY (APENAS backend)
- ❌ NUNCA exponha no código do cliente
- ❌ Bypassa todas as políticas RLS
- ❌ Acesso total ao banco de dados
- ❌ Se vazada, seu banco está comprometido!

## ✅ Configuração Correta

### Frontend (React/Vue/etc)
```env
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGc...  # ✅ OK
```

### Backend (Node.js/API)
```env
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...  # ✅ OK (apenas servidor)
```

## 🚨 Se Você Expôs a Service Role Key

### 1. REVOGAR IMEDIATAMENTE

No dashboard do Supabase:
1. Vá em **Settings** → **API**
2. Role até "Service Role Key"
3. Clique em **"Revoke and regenerate"**
4. Copie a nova chave
5. Atualize APENAS no backend (se tiver)

### 2. Remover do Git

```bash
# Remover do histórico do Git
git filter-branch --force --index-filter \
  "git rm --cached --ignore-unmatch .env" \
  --prune-empty --tag-name-filter cat -- --all

# Forçar push
git push origin --force --all
```

### 3. Verificar .gitignore

Certifique-se que `.env` está no `.gitignore`:
```
.env
.env.local
.env.*.local
```

## 🛡️ Boas Práticas

### 1. Sempre use .env
- Nunca hardcode credenciais
- Use variáveis de ambiente
- Adicione `.env` no `.gitignore`

### 2. Use apenas ANON KEY no frontend
- A anon key é segura para expor
- RLS protege seus dados
- Configure políticas corretas

### 3. Service Role apenas no backend
- APIs Node.js/Express
- Serverless functions
- Scripts de migração
- NUNCA no código do cliente

### 4. Configure RLS corretamente
- Sempre ative Row Level Security
- Teste suas políticas
- Princípio do menor privilégio

## 📋 Checklist de Segurança

- [ ] `.env` está no `.gitignore`
- [ ] Usando apenas ANON KEY no frontend
- [ ] Service Role Key não está no código
- [ ] RLS ativado em todas as tabelas
- [ ] Políticas testadas e funcionando
- [ ] Credenciais não commitadas no Git

## 🔍 Como Verificar

```bash
# Verificar se .env está ignorado
git check-ignore .env

# Deve retornar: .env
```

## 📚 Recursos

- [Supabase Security Best Practices](https://supabase.com/docs/guides/auth/row-level-security)
- [Understanding RLS](https://supabase.com/docs/guides/database/postgres/row-level-security)
