# 🧹 Limpar Histórico do Git

## Passo a Passo Completo

### 1️⃣ Primeiro: Revogar a chave no Supabase

**FAÇA ISSO ANTES DE TUDO!**

1. Acesse: https://supabase.com/dashboard
2. Selecione seu projeto
3. Vá em **Settings** → **API**
4. Role até "Service Role Key"
5. Clique em **"Revoke and regenerate"**
6. ✅ Pronto! A chave vazada agora está inválida

### 2️⃣ Verificar o que será removido

```bash
# Ver se .env está no Git
git ls-files | grep .env
```

Se aparecer `.env` ou `.env.example`, continue.

### 3️⃣ Fazer backup do repositório (segurança)

```bash
# Criar backup local
cd ..
cp -r seu-projeto seu-projeto-backup
cd seu-projeto
```

### 4️⃣ Remover do histórico do Git

**Opção A: Usando filter-branch (seu comando)**

```bash
git filter-branch --force --index-filter "git rm --cached --ignore-unmatch .env .env.example" --prune-empty --tag-name-filter cat -- --all
```

**Opção B: Usando BFG (mais rápido e seguro)**

```bash
# Instalar BFG (se não tiver)
# Windows: choco install bfg
# Mac: brew install bfg
# Linux: apt-get install bfg

# Remover arquivos
bfg --delete-files .env
bfg --delete-files .env.example

# Limpar
git reflog expire --expire=now --all
git gc --prune=now --aggressive
```

### 5️⃣ Forçar push para o GitHub

```bash
# Forçar push de todos os branches
git push origin --force --all

# Forçar push de todas as tags
git push origin --force --tags
```

### 6️⃣ Verificar no GitHub

1. Vá no seu repositório no GitHub
2. Clique em "Commits"
3. Abra alguns commits antigos
4. Verifique se `.env` não aparece mais

### 7️⃣ Limpar cache local do Git

```bash
git reflog expire --expire=now --all
git gc --prune=now --aggressive
```

### 8️⃣ Verificar .gitignore

```bash
# Verificar se .env está ignorado
git check-ignore .env

# Deve retornar: .env
```

### 9️⃣ Commit das correções

```bash
git add .gitignore
git commit -m "chore: adicionar .env ao .gitignore e remover credenciais"
git push origin main
```

## ✅ Checklist Final

- [ ] Revogou a service role key no Supabase
- [ ] Executou o comando de limpeza do Git
- [ ] Fez force push para o GitHub
- [ ] Verificou que .env não aparece mais nos commits
- [ ] `.env` está no `.gitignore`
- [ ] Fez commit das correções

## 🎯 Comando Completo (Copie e Cole)

```bash
# 1. Remover do histórico
git filter-branch --force --index-filter "git rm --cached --ignore-unmatch .env .env.example" --prune-empty --tag-name-filter cat -- --all

# 2. Limpar cache
git reflog expire --expire=now --all
git gc --prune=now --aggressive

# 3. Force push
git push origin --force --all
git push origin --force --tags

# 4. Commit das correções
git add .gitignore
git commit -m "chore: adicionar .env ao .gitignore"
git push origin main
```

## ⚠️ Avisos Importantes

1. **Force push reescreve o histórico** - avise colaboradores
2. **Faça backup antes** - por segurança
3. **Revogue a chave PRIMEIRO** - antes de limpar o Git
4. **Pode demorar** - dependendo do tamanho do repositório

## 🆘 Se algo der errado

```bash
# Restaurar do backup
cd ..
rm -rf seu-projeto
mv seu-projeto-backup seu-projeto
cd seu-projeto
```

## 📞 Suporte

Se tiver problemas:
1. Verifique se tem backup
2. Tente a Opção B (BFG)
3. Consulte: https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/removing-sensitive-data-from-a-repository
