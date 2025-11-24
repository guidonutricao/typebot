# 📋 REVISÃO COMPLETA: BUBBLES E INPUTS

## Status da Implementação Atual

### ✅ BUBBLES IMPLEMENTADOS

#### 1. Text Bubble ✅
- **Status**: Totalmente implementado
- **Tipo**: `'text'`
- **Interface**: `TextBlock`
- **Estrutura**:
```typescript
{
  id: string;
  type: 'text';
  content: {
    richText: RichTextElement[];
  };
  outgoingEdgeId?: string;
}
```
- **Funcionalidades**:
  - Suporta rich text (negrito, itálico)
  - Interpolação de variáveis
  - Renderização com parseRichText()
- **Localização**: `src/types/flow.ts`, `src/pages/Form.tsx` (linha 238)

#### 2. Image Bubble ✅
- **Status**: Totalmente implementado
- **Tipo**: `'image'`
- **Interface**: `ImageBlock`
- **Estrutura**:
```typescript
{
  id: string;
  type: 'image';
  content: {
    url: string;
  };
  outgoingEdgeId?: string;
}
```
- **Funcionalidades**:
  - Exibe imagens via URL
  - Renderização no ChatMessage
- **Localização**: `src/types/flow.ts`, `src/pages/Form.tsx` (linha 244)

### ❌ BUBBLES NÃO IMPLEMENTADOS

#### 3. Video Bubble ❌
- **Status**: NÃO implementado
- **Tipo esperado**: `'video'`
- **Estrutura sugerida**:
```typescript
export interface VideoBlock {
  id: string;
  type: 'video';
  content: {
    url: string;
    autoplay?: boolean;
    controls?: boolean;
  };
  outgoingEdgeId?: string;
}
```
- **Ação necessária**: Adicionar tipo e renderização

#### 4. Audio Bubble ❌
- **Status**: NÃO implementado
- **Tipo esperado**: `'audio'`
- **Estrutura sugerida**:
```typescript
export interface AudioBlock {
  id: string;
  type: 'audio';
  content: {
    url: string;
    autoplay?: boolean;
  };
  outgoingEdgeId?: string;
}
```
- **Ação necessária**: Adicionar tipo e renderização

#### 5. Embed Bubble ❌
- **Status**: NÃO implementado
- **Tipo esperado**: `'embed'`
- **Estrutura sugerida**:
```typescript
export interface EmbedBlock {
  id: string;
  type: 'embed';
  content: {
    html: string;
    height?: string;
  };
  outgoingEdgeId?: string;
}
```
- **Ação necessária**: Adicionar tipo e renderização com sanitização

---

### ✅ INPUTS IMPLEMENTADOS

#### 1. Text Input ✅
- **Status**: Totalmente implementado
- **Tipo**: `'text input'`
- **Interface**: `TextInputBlock`
- **Estrutura**:
```typescript
{
  id: string;
  type: 'text input';
  options: {
    labels: {
      placeholder: string;
      button: string;
    };
    variableId?: string;
    isLong?: boolean;
  };
  outgoingEdgeId?: string;
}
```
- **Validação**: Aceita qualquer texto
- **Localização**: `src/types/flow.ts`, `src/pages/Form.tsx` (linha 254)

#### 2. Number Input ✅
- **Status**: Totalmente implementado
- **Tipo**: `'number input'`
- **Interface**: `NumberInputBlock`
- **Estrutura**:
```typescript
{
  id: string;
  type: 'number input';
  options: {
    labels: {
      placeholder: string;
      button: string;
    };
    variableId?: string;
  };
  outgoingEdgeId?: string;
}
```
- **Validação**: Aceita apenas números
- **Localização**: `src/types/flow.ts`, `src/pages/Form.tsx` (linha 255)

#### 3. Choice Input (Buttons) ✅
- **Status**: Totalmente implementado
- **Tipo**: `'choice input'`
- **Interface**: `ChoiceInputBlock`
- **Estrutura**:
```typescript
{
  id: string;
  type: 'choice input';
  options: {
    isMultipleChoice?: boolean;
    buttonLabel?: string;
    dynamicVariableId?: string;
    variableId?: string;
  };
  items: Array<{
    id: string;
    type: string;
    blockId: string;
    content?: string;
    outgoingEdgeId?: string;
  }>;
  outgoingEdgeId?: string;
}
```
- **Validação**: Seleção de opções predefinidas
- **Localização**: `src/types/flow.ts`, `src/pages/Form.tsx` (linha 258)

#### 4. File Upload ✅
- **Status**: Totalmente implementado
- **Tipo**: `'file upload'`
- **Interface**: `FileUploadBlock`
- **Estrutura**:
```typescript
{
  id: string;
  type: 'file upload';
  options: {
    labels: {
      placeholder: string;
      button: string;
    };
    variableId?: string;
    isMultipleAllowed?: boolean;
  };
  outgoingEdgeId?: string;
}
```
- **Validação**: Upload de arquivos
- **Localização**: `src/types/flow.ts`, `src/pages/Form.tsx` (linha 261)

#### 5. Rating Input ✅
- **Status**: Totalmente implementado
- **Tipo**: `'rating'`
- **Interface**: `RatingBlock`
- **Estrutura**:
```typescript
{
  id: string;
  type: 'rating';
  options: {
    length?: number;
    labels?: {
      left?: string;
      right?: string;
    };
    variableId?: string;
  };
  outgoingEdgeId?: string;
}
```
- **Validação**: Número entre 1 e N
- **Localização**: `src/types/flow.ts`, `src/pages/Form.tsx` (linha 264)

### ❌ INPUTS NÃO IMPLEMENTADOS

#### 6. Email Input ❌
- **Status**: NÃO implementado (usa text input genérico)
- **Tipo esperado**: `'email input'`
- **Estrutura sugerida**:
```typescript
export interface EmailInputBlock {
  id: string;
  type: 'email input';
  options: {
    labels: {
      placeholder: string;
      button: string;
    };
    variableId?: string;
  };
  outgoingEdgeId?: string;
}
```
- **Validação necessária**: Regex de email (xxx@xxx.xxx)
- **Ação necessária**: Adicionar tipo e validação específica

#### 7. Website/URL Input ❌
- **Status**: NÃO implementado (usa text input genérico)
- **Tipo esperado**: `'url input'` ou `'website input'`
- **Estrutura sugerida**:
```typescript
export interface UrlInputBlock {
  id: string;
  type: 'url input';
  options: {
    labels: {
      placeholder: string;
      button: string;
    };
    variableId?: string;
  };
  outgoingEdgeId?: string;
}
```
- **Validação necessária**: URL válida (https://...)
- **Ação necessária**: Adicionar tipo e validação específica

#### 8. Phone Input ❌
- **Status**: NÃO implementado (usa text input genérico)
- **Tipo esperado**: `'phone input'`
- **Estrutura sugerida**:
```typescript
export interface PhoneInputBlock {
  id: string;
  type: 'phone input';
  options: {
    labels: {
      placeholder: string;
      button: string;
    };
    variableId?: string;
    countryCode?: string;
  };
  outgoingEdgeId?: string;
}
```
- **Validação necessária**: Formato de telefone internacional
- **Ação necessária**: Adicionar tipo, máscara e validação

#### 9. Date Input ❌
- **Status**: NÃO implementado
- **Tipo esperado**: `'date input'`
- **Estrutura sugerida**:
```typescript
export interface DateInputBlock {
  id: string;
  type: 'date input';
  options: {
    labels: {
      placeholder: string;
      button: string;
    };
    variableId?: string;
    format?: string; // 'DD/MM/YYYY', 'MM/DD/YYYY', etc
    minDate?: string;
    maxDate?: string;
  };
  outgoingEdgeId?: string;
}
```
- **Validação necessária**: Data válida
- **Ação necessária**: Adicionar tipo e date picker

#### 10. Picture Choice Input ❌
- **Status**: NÃO implementado
- **Tipo esperado**: `'picture choice'` ou `'pic choice'`
- **Estrutura sugerida**:
```typescript
export interface PictureChoiceBlock {
  id: string;
  type: 'picture choice';
  options: {
    isMultipleChoice?: boolean;
    variableId?: string;
  };
  items: Array<{
    id: string;
    type: string;
    blockId: string;
    content?: string;
    imageUrl: string;
    outgoingEdgeId?: string;
  }>;
  outgoingEdgeId?: string;
}
```
- **Ação necessária**: Adicionar tipo e renderização com imagens

#### 11. Payment Input ❌
- **Status**: NÃO implementado
- **Tipo esperado**: `'payment'`
- **Estrutura sugerida**:
```typescript
export interface PaymentBlock {
  id: string;
  type: 'payment';
  options: {
    amount: number;
    currency: string;
    gateway: 'stripe' | 'paypal' | 'mercadopago';
    variableId?: string;
  };
  outgoingEdgeId?: string;
}
```
- **Ação necessária**: Integração com gateway de pagamento

---

## 📊 RESUMO ESTATÍSTICO

### Bubbles
- **Implementados**: 2/5 (40%)
  - ✅ Text
  - ✅ Image
- **Faltando**: 3/5 (60%)
  - ❌ Video
  - ❌ Audio
  - ❌ Embed

### Inputs
- **Implementados**: 5/11 (45%)
  - ✅ Text
  - ✅ Number
  - ✅ Choice (Buttons)
  - ✅ File Upload
  - ✅ Rating
- **Faltando**: 6/11 (55%)
  - ❌ Email
  - ❌ Website/URL
  - ❌ Phone
  - ❌ Date
  - ❌ Picture Choice
  - ❌ Payment

### Total Geral
- **Implementados**: 7/16 (44%)
- **Faltando**: 9/16 (56%)

---

## 🔧 BLOCOS ESPECIAIS IMPLEMENTADOS

### Set Variable ✅
- **Tipo**: `'Set variable'`
- **Interface**: `SetVariableBlock`
- **Função**: Define valores de variáveis dinamicamente
- **Status**: Implementado

### Redirect ✅
- **Tipo**: `'Redirect'`
- **Interface**: `RedirectBlock`
- **Função**: Redireciona para URL externa
- **Status**: Implementado

---

## 🎯 PRIORIDADES DE IMPLEMENTAÇÃO

### Alta Prioridade
1. **Email Input** - Validação essencial para formulários
2. **Date Input** - Comum em agendamentos
3. **Video Bubble** - Conteúdo multimídia importante

### Média Prioridade
4. **Phone Input** - Útil para contato
5. **URL Input** - Validação de links
6. **Picture Choice** - UX visual melhorada

### Baixa Prioridade
7. **Audio Bubble** - Menos usado
8. **Embed Bubble** - Casos específicos
9. **Payment Input** - Requer integração complexa

---

## 🐛 PROBLEMAS IDENTIFICADOS

### 1. Validação Insuficiente
- Text input aceita qualquer coisa (inclusive emails/URLs inválidos)
- Number input pode precisar de validação de range
- Falta validação de formato para tipos específicos

### 2. Type Union Incompleto
```typescript
// Em src/types/flow.ts
export type Block = 
  | TextBlock 
  | ImageBlock 
  | TextInputBlock 
  | NumberInputBlock
  | ChoiceInputBlock 
  | SetVariableBlock
  | RedirectBlock
  | FileUploadBlock
  | RatingBlock;
```
**Problema**: Faltam os novos tipos quando forem adicionados

### 3. Switch Case Incompleto
```typescript
// Em src/pages/Form.tsx
switch (currentBlock.type) {
  case 'text': // ✅
  case 'image': // ✅
  case 'text input': // ✅
  case 'number input': // ✅
  case 'choice input': // ✅
  case 'file upload': // ✅
  case 'rating': // ✅
  case 'Redirect': // ✅
  case 'Set variable': // ✅
  // ❌ Faltam: video, audio, embed, email, url, phone, date, picture choice, payment
  default:
    console.log('Tipo de bloco não implementado:', (currentBlock as any).type);
}
```

### 4. Componente ChatInput Limitado
- Precisa suportar diferentes tipos de validação
- Falta feedback visual para erros de validação
- Não tem máscaras de input (telefone, data)

---

## ✅ RECOMENDAÇÕES

### Imediatas
1. Adicionar validação de email no text input existente
2. Adicionar validação de URL no text input existente
3. Documentar tipos não implementados no código

### Curto Prazo
1. Implementar Email Input com validação
2. Implementar Date Input com date picker
3. Implementar Video Bubble

### Médio Prazo
1. Implementar Phone Input com máscara
2. Implementar Picture Choice
3. Implementar Audio e Embed Bubbles

### Longo Prazo
1. Implementar Payment Input
2. Adicionar testes para todos os tipos
3. Criar documentação de uso para cada tipo
