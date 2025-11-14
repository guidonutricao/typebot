# 🧪 Teste Rápido - Interpolação de Variáveis

## 🚀 Como Testar Agora

### Passo 1: Abra o Console
1. Pressione **F12** no navegador
2. Vá na aba **Console**
3. Limpe o console (ícone 🚫 ou Ctrl+L)

### Passo 2: Acesse o Formulário
1. Abra seu formulário no navegador
2. Comece a preencher

### Passo 3: Observe os Logs

Você verá logs como estes:

#### Quando você responde uma pergunta:
```javascript
[useFlowNavigation] Adding variable: {
  variableId: "v1",
  variableName: "Quantidade de treinos",
  value: "5",
  allVariableNames: { ... }
}

[useFlowNavigation] Updated variables: {
  v1: "5",
  "Quantidade de treinos": "5"
}
```

#### Quando aparece uma mensagem com variável:
```javascript
[Form] Original richText: [...]

[Interpolation] Input text: "Show, {{Quantidade de treinos}} treinos!"
[Interpolation] Available variables: { "Quantidade de treinos": "5" }
[Interpolation] Looking for variable: "Quantidade de treinos"
[Interpolation] Found value: "5"
[Interpolation] Result: "Show, 5 treinos!"

[Form] Interpolating: {
  original: "Show, {{Quantidade de treinos}} treinos!",
  interpolated: "Show, 5 treinos!",
  changed: true
}

[Form] Interpolated richText: [...]
```

## 🔍 O que Procurar

### ✅ Se estiver funcionando:
- `changed: true` ← Texto foi modificado
- `interpolated: "Show, 5 treinos!"` ← Variável substituída
- Na tela aparece: **"Show, 5 treinos!"**

### ❌ Se NÃO estiver funcionando:
- `changed: false` ← Texto não foi modificado
- `interpolated: "Show, {{Quantidade de treinos}} treinos!"` ← Variável não substituída
- Na tela aparece: **"Show, {{Quantidade de treinos}} treinos!"**

## 🐛 Diagnóstico Rápido

### Problema 1: Variável não está sendo salva
**Sintoma:**
```javascript
[useFlowNavigation] Updated variables: {}
```

**Causa:** O input não tem `variableId` configurado

**Como verificar:**
- Veja se o log `[useFlowNavigation] Adding variable` aparece
- Se não aparecer, o problema está no fluxo Typebot

### Problema 2: Nome da variável não corresponde
**Sintoma:**
```javascript
[Interpolation] Looking for variable: "Quantidade de treinos"
[Interpolation] Found value: undefined
```

**Causa:** O nome no texto não corresponde ao nome salvo

**Como verificar:**
- Compare `Looking for variable` com as chaves em `Available variables`
- Devem ser exatamente iguais (case sensitive)

### Problema 3: Interpolação não está sendo chamada
**Sintoma:**
- Não aparece nenhum log `[Interpolation]`

**Causa:** A função `interpolateText` não está sendo chamada

**Como verificar:**
- Veja se o log `[Form] Original richText` aparece
- Se aparecer mas não aparecer `[Interpolation]`, há um problema no hook

## 📸 Me Envie

Por favor, tire um screenshot do console mostrando:

1. **Todos os logs desde que você respondeu a pergunta até a mensagem aparecer**
2. **O que aparece na tela** (se está com `{{}}` ou com o valor)

## 🎯 Teste Simples

Crie um fluxo bem simples para testar:

```
Bloco 1: Text Input
  - Pergunta: "Qual seu nome?"
  - Salvar em: {{nome}}

Bloco 2: Text
  - Mensagem: "Olá, {{nome}}!"
```

**Resultado esperado:**
- Você digita: "João"
- Aparece: "Olá, João!"

**Se aparecer:** "Olá, {{nome}}!"
- ❌ Não está funcionando
- 📸 Me envie os logs do console

## 🔧 Comandos Úteis no Console

Para ver apenas os logs relevantes, digite no console:

```javascript
// Ver todas as variáveis atuais
console.log(window.localStorage.getItem('flow-progress'))

// Limpar progresso e recomeçar
localStorage.removeItem('flow-progress')
location.reload()
```

## ⚡ Teste Rápido de 30 Segundos

1. **F12** → Console
2. **Acesse o formulário**
3. **Responda a primeira pergunta**
4. **Veja se aparece:** `[useFlowNavigation] Updated variables`
5. **Avance para próxima mensagem**
6. **Veja se aparece:** `[Interpolation] Result`
7. **Verifique na tela** se a variável foi substituída

✅ **Se os logs aparecerem e o texto estiver correto** → Está funcionando!
❌ **Se os logs não aparecerem ou o texto estiver errado** → Me envie os logs

## 📝 Template para Reportar

Se não funcionar, me envie assim:

```
❌ Problema: Variável não está sendo substituída

📸 Screenshot do console: [anexar]

🖥️ O que aparece na tela:
"Show, {{Quantidade de treinos}} treinos!"

📋 Logs do console:
[copiar e colar os logs aqui]

📄 Fluxo usado:
[descrever ou anexar JSON]
```

Com essas informações, vou conseguir identificar e corrigir o problema exato! 🚀
