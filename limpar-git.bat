@echo off
echo.
echo 🧹 Limpeza de Credenciais do Git
echo ================================
echo.
echo ⚠️  ATENCAO: Este script vai:
echo    1. Remover .env do historico do Git
echo    2. Fazer force push para o GitHub
echo.
set /p revoked="Voce JA REVOGOU a service role key no Supabase? (s/n): "

if /i not "%revoked%"=="s" (
    echo.
    echo ❌ Por favor, revogue a chave primeiro em:
    echo    https://supabase.com/dashboard - Settings - API - Revoke and regenerate
    pause
    exit /b 1
)

echo.
echo 🧹 Removendo do historico...
git filter-branch --force --index-filter "git rm --cached --ignore-unmatch .env .env.example .env.backup" --prune-empty --tag-name-filter cat -- --all

echo.
echo 🗑️  Limpando cache...
git reflog expire --expire=now --all
git gc --prune=now --aggressive

echo.
echo 📤 Fazendo force push...
git push origin --force --all
git push origin --force --tags

echo.
echo ✅ Limpeza concluida!
echo.
echo 📋 Proximos passos:
echo    1. Verifique no GitHub se .env nao aparece mais
echo    2. Commit as correcoes: git add .gitignore
echo    3. git commit -m "chore: adicionar .env ao .gitignore"
echo    4. git push origin main
echo.
pause
