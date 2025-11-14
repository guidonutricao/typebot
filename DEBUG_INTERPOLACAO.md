# 🐛 Debug - Interpolação de Variáveis

## 🔍 Logs Adicionados

Adicionei logs de debug no código para identificar o problema. Agora quando você testar o formulário, verá no console do navegador:

### 1. Quando uma variável é salva:
```
[useFlowNavigation] Adding variable: {
  variableId: "v1",
  variableName: "Quantidade de treinos",
  value: "5",
  allVariableNames: { v1: "Quantidade de treinos", ... }
}

[useFlowNavigation] Updated variables: {
  v1: "5",
  "Quantidade de treinos": "5"
}
```

### 2. Quando uma mensagem é interpolada:
```
[Interpolation] Input text: "Show, {{Quantidade de treinos}} treinos!"
[Interpolation] Available variables: { v1: "5", "Quantidade de treinos": "5" }
[Interpolation] Looking for variable: "Quantidade de treinos"
[Interpolation] Found value: "5"
[Interpolation] Result: "Show, 5 treinos!"
```

## 🧪 Como Testar

1. **Abra o console do navegador** (F12)
2. **Acesse seu formulário**
3. **Preencha as respostas**
4. **Observe os logs no console**

## 🔍 O que Verificar

### Cenário 1: Variável não está sendo salva
Se você ver:
```
[useFlowNavigation] Updated variables: {}
```
**Problema:** A variável não está sendo associada ao input

**Solução:** Verificar se o bloco de input tem `variableId` configurado

### Cenário 2: Variável salva com nome errado
Se você ver:
```
[Interpolation] Looking for variable: "Quantidade de treinos"
[Interpolation] Found value: undefined
```
Mas as variáveis disponíveis são:
```
{ v1: "5" }
```
**Problema:** A variável está sendo salva apenas pelo ID, não pelo nome

**Solução:** Verificar o mapeamento de `variableNames`

### Cenário 3: Texto não está sendo interpolado
Se você ver:
```
[Interpolation] Input text: "Show, {{Quantidade de treinos}} treinos!"
```
Mas não ver os logs de "Looking for variable"...

**Problema:** O regex não está encontrando as variáveis

**Solução:** Verificar se há caracteres especiais ou espaços extras

## 📋 Checklist de Debug

- [ ] Abrir console do navegador (F12)
- [ ] Acessar o formulário
- [ ] Preencher primeira pergunta
- [ ] Verificar log: `[useFlowNavigation] Adding variable`
- [ ] Verificar log: `[useFlowNavigation] Updated variables`
- [ ] Avançar para próxima mensagem com variável
- [ ] Verificar log: `[Interpolation] Input text`
- [ ] Verificar log: `[Interpolation] Available variables`
- [ ] Verificar log: `[Interpolation] Looking for variable`
- [ ] Verificar log: `[Interpolation] Found value`
- [ ] Verificar log: `[Interpolation] Result`

## 🎯 Exemplo de Teste

### Fluxo de Teste:
```
1. Input: "Quantos treinos por semana?" → variableId: "v1", name: "Quantidade de treinos"
2. User responde: "5"
3. Texto: "Show, {{Quantidade de treinos}} treinos!"
```

### Logs Esperados:

**Passo 1 - Salvando variável:**
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

**Passo 2 - Interpolando texto:**
```javascript
[Interpolation] Input text: "Show, {{Quantidade de treinos}} treinos!"
[Interpolation] Available variables: {
  v1: "5",
  "Quantidade de treinos": "5"
}
[Interpolation] Looking for variable: "Quantidade de treinos"
[Interpolation] Found value: "5"
[Interpolation] Result: "Show, 5 treinos!"
```

## 🚨 Possíveis Problemas

### Problema 1: variableNames está vazio
```javascript
[useFlowNavigation] allVariableNames: {}
```
**Causa:** O fluxo não tem a propriedade `variables` definida

**Solução:** Verificar se o JSON do fluxo tem:
```json
{
  "variables": [
    { "id": "v1", "name": "Quantidade de treinos" }
  ]
}
```

### Problema 2: Nome da variável não corresponde
```javascript
[Interpolation] Looking for variable: "Quantidade de treinos"
[Interpolation] Available variables: { "quantidade_de_treinos": "5" }
```
**Causa:** Nome no texto não corresponde ao nome salvo

**Solução:** Verificar se o nome está exatamente igual (case sensitive)

### Problema 3: Variável não está sendo passada
```javascript
[Interpolation] Available variables: {}
```
**Causa:** As variáveis não estão chegando na função de interpolação

**Solução:** Verificar se `interpolateText` está recebendo as variáveis corretas

## 📸 Tire Screenshots

Por favor, tire screenshots dos logs do console mostrando:

1. **Quando você responde a primeira pergunta**
   - Deve mostrar: `[useFlowNavigation] Adding variable`
   - Deve mostrar: `[useFlowNavigation] Updated variables`

2. **Quando aparece a mensagem com variável**
   - Deve mostrar: `[Interpolation] Input text`
   - Deve mostrar: `[Interpolation] Available variables`
   - Deve mostrar: `[Interpolation] Result`

3. **O que aparece na tela**
   - Mostre se está aparecendo `{{Quantidade de treinos}}` ou `5`

## 🔧 Próximos Passos

Depois de ver os logs, vou saber exatamente onde está o problema:

- Se as variáveis não estão sendo salvas → Problema no `addResponse`
- Se as variáveis estão salvas mas não interpoladas → Problema no `interpolateText`
- Se o texto não está sendo interpolado → Problema no `showBotMessage`

## 💡 Dica

Para ver os logs mais facilmente, filtre o console por:
- `[useFlowNavigation]` - para ver variáveis sendo salvas
- `[Interpolation]` - para ver interpolação acontecendo

## 📝 Informações Necessárias

Por favor, me envie:

1. **Screenshot dos logs do console**
2. **O texto que aparece na tela** (com ou sem interpolação)
3. **O JSON do seu fluxo** (especialmente a parte de `variables`)

Com essas informações, vou conseguir identificar e corrigir o problema exato!
