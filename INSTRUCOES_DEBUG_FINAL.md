# 🔍 Instruções de Debug - FINAL

## 🎯 O Que Fazer Agora

1. **Abra o console do navegador** (F12)
2. **Limpe o localStorage** (para começar do zero):
   ```javascript
   localStorage.clear()
   location.reload()
   ```
3. **Acesse o formulário**
4. **Observe os logs**

## 📋 Logs Esperados

### 1. Ao Carregar o Fluxo
```javascript
[useFlowNavigation] Loading flowData: {
  hasFlowData: true,
  hasVariables: true,  // ← DEVE SER TRUE!
  variablesCount: 1,   // ← DEVE SER > 0!
  variables: [{ id: "v1", name: "Quantidade de treinos" }]
}

[useFlowNavigation] Mapping variable: { id: "v1", name: "Quantidade de treinos" }
[useFlowNavigation] Variable name map created: { v1: "Quantidade de treinos" }
```

### 2. Ao Responder a Pergunta
```javascript
[useFlowNavigation] Adding variable: {
  variableId: "v1",
  variableName: "Quantidade de treinos",  // ← DEVE TER O NOME!
  value: "5",
  allVariableNames: { v1: "Quantidade de treinos" },
  flowDataVariables: [...]
}

[useFlowNavigation] Updated variables: {
  v1: "5",
  "Quantidade de treinos": "5"  // ← DEVE TER AMBOS!
}
```

### 3. Ao Mostrar a Mensagem
```javascript
[Form] Original richText: [...]

[Interpolation] Input text: "Show, {{Quantidade de treinos}} treinos!"
[Interpolation] Available variables: {
  v1: "5",
  "Quantidade de treinos": "5"  // ← DEVE TER O NOME!
}
[Interpolation] Looking for variable: "Quantidade de treinos"
[Interpolation] Found value: "5"  // ← DEVE ENCONTRAR!
[Interpolation] Result: "Show, 5 treinos!"  // ← DEVE ESTAR INTERPOLADO!

[Form] Interpolating: {
  original: "Show, {{Quantidade de treinos}} treinos!",
  interpolated: "Show, 5 treinos!",
  changed: true  // ← DEVE SER TRUE!
}
```

## 🚨 Problemas Possíveis

### Problema A: `hasVariables: false`
```javascript
[useFlowNavigation] Loading flowData: {
  hasFlowData: true,
  hasVariables: false,  // ❌ PROBLEMA!
  variablesCount: 0
}
```

**Causa:** O JSON do fluxo não tem a propriedade `variables`

**Solução:** Adicionar ao JSON:
```json
{
  "variables": [
    { "id": "v1", "name": "Quantidade de treinos" }
  ]
}
```

### Problema B: `variableName` é igual ao `variableId`
```javascript
[useFlowNavigation] Adding variable: {
  variableId: "v1",
  variableName: "v1",  // ❌ PROBLEMA! Deveria ser "Quantidade de treinos"
  ...
}
```

**Causa:** O mapeamento não encontrou o nome

**Solução:** Verificar se o `variableId` no input corresponde ao `id` na lista de variáveis

### Problema C: Variável não encontrada na interpolação
```javascript
[Interpolation] Available variables: { v1: "5" }  // ❌ Falta o nome!
[Interpolation] Looking for variable: "Quantidade de treinos"
[Interpolation] Found value: undefined  // ❌ PROBLEMA!
```

**Causa:** Variável foi salva apenas pelo ID, não pelo nome

**Solução:** Verificar o Problema A ou B acima

## 📸 Me Envie

Por favor, tire screenshots mostrando:

1. **Log ao carregar o fluxo** (procure por `[useFlowNavigation] Loading flowData`)
2. **Log ao responder** (procure por `[useFlowNavigation] Adding variable`)
3. **Log ao mostrar mensagem** (procure por `[Interpolation] Available variables`)
4. **O que aparece na tela** (se está com `{{}}` ou com o valor)

## 🎯 Teste Rápido

Se você ver:
- ✅ `hasVariables: true`
- ✅ `variableName: "Quantidade de treinos"`
- ✅ `Found value: "5"`
- ✅ `changed: true`

**Mas ainda assim não funcionar na tela**, o problema é no componente `ChatMessage` ou `richTextParser`.

Se você ver:
- ❌ `hasVariables: false`
- ❌ `variableName: "v1"` (igual ao ID)
- ❌ `Found value: undefined`
- ❌ `changed: false`

**O problema está no fluxo JSON** - falta a propriedade `variables` ou o mapeamento está errado.

## 🔧 Solução Rápida

Se o problema for que `flowData.variables` está vazio, você pode:

1. **Exportar o fluxo do Typebot** novamente
2. **Verificar se o JSON tem a propriedade `variables`**
3. **Se não tiver, adicionar manualmente:**

```json
{
  "name": "Meu Fluxo",
  "version": "6",
  "groups": [...],
  "edges": [...],
  "variables": [
    {
      "id": "v1",
      "name": "Quantidade de treinos"
    }
  ]
}
```

Com os logs, vou conseguir identificar exatamente onde está o problema! 🚀
