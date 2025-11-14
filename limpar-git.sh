#!/bin/bash

echo "🧹 Limpeza de Credenciais do Git"
echo "================================"
echo ""
echo "⚠️  ATENÇÃO: Este script vai:"
echo "   1. Remover .env do histórico do Git"
echo "   2. Fazer force push para o GitHub"
echo ""
read -p "Você JÁ REVOGOU a service role key no Supabase? (s/n) " -n 1 -r
echo ""

if [[ ! $REPLY =~ ^[Ss]$ ]]
then
    echo "❌ Por favor, revogue a chave primeiro em:"
    echo "   https://supabase.com/dashboard → Settings → API → Revoke and regenerate"
    exit 1
fi

echo ""
echo "📦 Criando backup..."
cd ..
cp -r "$(basename "$OLDPWD")" "$(basename "$OLDPWD")-backup-$(date +%Y%m%d-%H%M%S)"
cd -
echo "✅ Backup criado!"

echo ""
echo "🔍 Verificando arquivos no Git..."
git ls-files | grep .env

echo ""
echo "🧹 Removendo do histórico..."
git filter-branch --force --index-filter \
  "git rm --cached --ignore-unmatch .env .env.example .env.backup" \
  --prune-empty --tag-name-filter cat -- --all

echo ""
echo "🗑️  Limpando cache..."
git reflog expire --expire=now --all
git gc --prune=now --aggressive

echo ""
echo "📤 Fazendo force push..."
git push origin --force --all
git push origin --force --tags

echo ""
echo "✅ Limpeza concluída!"
echo ""
echo "📋 Próximos passos:"
echo "   1. Verifique no GitHub se .env não aparece mais"
echo "   2. Commit as correções: git add .gitignore && git commit -m 'chore: adicionar .env ao .gitignore'"
echo "   3. Push: git push origin main"
