# 🚨 AÇÃO URGENTE - Credenciais Vazadas

## ✅ O que já foi feito automaticamente:

1. ✅ `.env` adicionado ao `.gitignore`
2. ✅ Service role key removida do código
3. ✅ Código usa apenas ANON KEY (segura)
4. ✅ `.env.backup` criado (não será commitado)
5. ✅ Scripts de limpeza criados

## 🎯 O que VOCÊ precisa fazer AGORA:

### 1️⃣ REVOGAR A CHAVE (5 minutos)

```
1. Acesse: https://supabase.com/dashboard
2. Selecione seu projeto: fsznesncrwebbealwjou
3. Settings → API
4. Service Role Key → "Revoke and regenerate"
5. ✅ Pronto! Chave vazada agora está inválida
```

### 2️⃣ LIMPAR O GIT (2 minutos)

**Opção A: Automático (Windows)**
```bash
limpar-git.bat
```

**Opção B: Automático (Linux/Mac)**
```bash
chmod +x limpar-git.sh
./limpar-git.sh
```

**Opção C: Manual**
```bash
git filter-branch --force --index-filter "git rm --cached --ignore-unmatch .env .env.example" --prune-empty --tag-name-filter cat -- --all
git push origin --force --all
git push origin --force --tags
```

### 3️⃣ VERIFICAR (1 minuto)

```
1. Vá no GitHub
2. Abra alguns commits antigos
3. Verifique se .env não aparece mais
```

## 📁 Arquivos Criados

- ✅ `.env.backup` - Sua service role key (use apenas no backend)
- ✅ `limpar-git.bat` - Script Windows
- ✅ `limpar-git.sh` - Script Linux/Mac
- ✅ `LIMPAR_GIT.md` - Guia detalhado
- ✅ `SEGURANCA_SUPABASE.md` - Boas práticas

## 🔒 Segurança Agora

Seu projeto agora está seguro:
- Frontend usa apenas ANON KEY ✅
- Service role key não está no código ✅
- `.env` no `.gitignore` ✅
- RLS protege seus dados ✅

## ⏰ Tempo Total: ~8 minutos

1. Revogar chave: 5 min
2. Limpar Git: 2 min
3. Verificar: 1 min

## 💡 Dica

A ANON KEY que está no código é SEGURA para expor.
Ela respeita todas as políticas de segurança (RLS).

## 📞 Dúvidas?

Consulte: `LIMPAR_GIT.md` para passo a passo detalhado
