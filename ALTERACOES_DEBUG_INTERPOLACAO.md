# 🔧 Alterações para Debug - Interpolação de Variáveis

## 📝 Resumo

Adicionei **logs de debug** em 3 arquivos para identificar onde está o problema com a interpolação de variáveis.

## 📁 Arquivos Modificados

### 1. `src/utils/variableInterpolation.ts`

**O que foi adicionado:**
- Logs mostrando o texto de entrada
- Logs mostrando as variáveis disponíveis
- Logs para cada variável encontrada
- Logs mostrando o resultado final

**Exemplo de log:**
```javascript
[Interpolation] Input text: "Show, {{Quantidade de treinos}} treinos!"
[Interpolation] Available variables: { "Quantidade de treinos": "5" }
[Interpolation] Looking for variable: "Quantidade de treinos"
[Interpolation] Found value: "5"
[Interpolation] Result: "Show, 5 treinos!"
```

### 2. `src/hooks/useFlowNavigation.ts`

**O que foi adicionado:**
- Logs quando uma variável é adicionada
- Logs mostrando o mapeamento de IDs para nomes
- Logs mostrando o estado completo das variáveis

**Exemplo de log:**
```javascript
[useFlowNavigation] Adding variable: {
  variableId: "v1",
  variableName: "Quantidade de treinos",
  value: "5",
  allVariableNames: { v1: "Quantidade de treinos" }
}

[useFlowNavigation] Updated variables: {
  v1: "5",
  "Quantidade de treinos": "5"
}
```

### 3. `src/pages/Form.tsx`

**O que foi adicionado:**
- Logs mostrando o richText original
- Logs para cada texto sendo interpolado
- Logs mostrando se o texto mudou
- Logs mostrando o richText final

**Exemplo de log:**
```javascript
[Form] Original richText: [...]

[Form] Interpolating: {
  original: "Show, {{Quantidade de treinos}} treinos!",
  interpolated: "Show, 5 treinos!",
  changed: true
}

[Form] Interpolated richText: [...]
```

## 🎯 Objetivo dos Logs

Com esses logs, podemos identificar:

1. **Se as variáveis estão sendo salvas corretamente**
   - Verificar: `[useFlowNavigation] Updated variables`

2. **Se as variáveis estão disponíveis na interpolação**
   - Verificar: `[Interpolation] Available variables`

3. **Se o nome da variável corresponde**
   - Verificar: `[Interpolation] Looking for variable`

4. **Se o valor está sendo encontrado**
   - Verificar: `[Interpolation] Found value`

5. **Se o texto está sendo modificado**
   - Verificar: `[Form] Interpolating: { changed: true }`

## 🧪 Como Usar

1. **Abra o console do navegador** (F12)
2. **Acesse o formulário**
3. **Preencha as respostas**
4. **Observe os logs**

## 🔍 Diagnóstico

### Cenário A: Logs aparecem e texto é interpolado
```javascript
[Interpolation] Result: "Show, 5 treinos!"
[Form] Interpolating: { changed: true }
```
✅ **Está funcionando!** O problema pode ser visual/CSS

### Cenário B: Logs aparecem mas texto não muda
```javascript
[Interpolation] Result: "Show, {{Quantidade de treinos}} treinos!"
[Form] Interpolating: { changed: false }
```
❌ **Problema:** Variável não está sendo encontrada
- Verificar nome da variável
- Verificar se está salva corretamente

### Cenário C: Logs não aparecem
❌ **Problema:** Função não está sendo chamada
- Verificar se o fluxo está correto
- Verificar se há erros no console

## 📋 Documentos Criados

1. **`DEBUG_INTERPOLACAO.md`**
   - Guia completo de debug
   - Explicação detalhada dos logs
   - Checklist de verificação

2. **`TESTE_RAPIDO_INTERPOLACAO.md`**
   - Guia rápido de teste
   - Passo a passo simples
   - Template para reportar problemas

3. **`ALTERACOES_DEBUG_INTERPOLACAO.md`** (este arquivo)
   - Resumo das alterações
   - Arquivos modificados
   - Como usar os logs

## 🚀 Próximos Passos

1. **Teste o formulário** com os logs ativos
2. **Tire screenshots** do console
3. **Me envie os logs** se o problema persistir

Com os logs, vou conseguir identificar exatamente onde está o problema e corrigi-lo!

## ⚠️ Importante

Esses logs são **temporários** para debug. Depois de identificar e corrigir o problema, vou removê-los para não poluir o console em produção.

## 🎯 Teste Simples

Crie um fluxo mínimo:
```
1. Input: "Nome?" → {{nome}}
2. Text: "Olá, {{nome}}!"
```

**Logs esperados:**
```javascript
// Ao responder "João":
[useFlowNavigation] Adding variable: { variableName: "nome", value: "João" }
[useFlowNavigation] Updated variables: { nome: "João" }

// Ao mostrar a mensagem:
[Form] Original richText: [...]
[Interpolation] Input text: "Olá, {{nome}}!"
[Interpolation] Available variables: { nome: "João" }
[Interpolation] Looking for variable: "nome"
[Interpolation] Found value: "João"
[Interpolation] Result: "Olá, João!"
[Form] Interpolating: { original: "Olá, {{nome}}!", interpolated: "Olá, João!", changed: true }
```

**Resultado na tela:** "Olá, João!"

Se não funcionar, me envie os logs! 🚀
