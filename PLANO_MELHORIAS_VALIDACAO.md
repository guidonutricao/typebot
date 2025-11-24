# 🔧 PLANO DE MELHORIAS: VALIDAÇÃO DE INPUTS

## 📋 PROBLEMAS ATUAIS

### ChatInput.tsx
- ✅ Aceita qualquer texto sem validação de formato
- ❌ Não valida email
- ❌ Não valida URL
- ❌ Não valida telefone
- ❌ Não valida números com range
- ❌ Não mostra mensagens de erro
- ❌ Não tem máscaras de input

## 🎯 SOLUÇÃO PROPOSTA

### 1. Adicionar Prop de Tipo de Validação

```typescript
interface ChatInputProps {
  onSubmit: (value: string) => void;
  placeholder?: string;
  buttonLabel?: string;
  disabled?: boolean;
  isLong?: boolean;
  // NOVO
  inputType?: 'text' | 'email' | 'url' | 'phone' | 'number';
  validation?: {
    required?: boolean;
    min?: number;
    max?: number;
    pattern?: RegExp;
    customValidator?: (value: string) => boolean;
  };
}
```

### 2. Funções de Validação

```typescript
// utils/validators.ts
export const validators = {
  email: (value: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value);
  },
  
  url: (value: string): boolean => {
    try {
      new URL(value);
      return value.startsWith('http://') || value.startsWith('https://');
    } catch {
      return false;
    }
  },
  
  phone: (value: string): boolean => {
    // Remove caracteres não numéricos
    const cleaned = value.replace(/\D/g, '');
    // Aceita 10-15 dígitos (com código de país)
    return cleaned.length >= 10 && cleaned.length <= 15;
  },
  
  number: (value: string, min?: number, max?: number): boolean => {
    const num = parseFloat(value);
    if (isNaN(num)) return false;
    if (min !== undefined && num < min) return false;
    if (max !== undefined && num > max) return false;
    return true;
  }
};

export const getErrorMessage = (type: string, value: string): string => {
  switch (type) {
    case 'email':
      return 'Por favor, insira um email válido (exemplo@dominio.com)';
    case 'url':
      return 'Por favor, insira uma URL válida (https://exemplo.com)';
    case 'phone':
      return 'Por favor, insira um telefone válido';
    case 'number':
      return 'Por favor, insira um número válido';
    default:
      return 'Valor inválido';
  }
};
```

### 3. Máscaras de Input

```typescript
// utils/inputMasks.ts
export const masks = {
  phone: (value: string): string => {
    const cleaned = value.replace(/\D/g, '');
    
    // Formato brasileiro: (XX) XXXXX-XXXX
    if (cleaned.length <= 11) {
      return cleaned
        .replace(/^(\d{2})(\d)/, '($1) $2')
        .replace(/(\d{5})(\d)/, '$1-$2');
    }
    
    // Formato internacional: +XX (XX) XXXXX-XXXX
    return cleaned
      .replace(/^(\d{2})(\d{2})(\d)/, '+$1 ($2) $3')
      .replace(/(\d{5})(\d)/, '$1-$2');
  },
  
  date: (value: string): string => {
    const cleaned = value.replace(/\D/g, '');
    // Formato: DD/MM/YYYY
    return cleaned
      .replace(/^(\d{2})(\d)/, '$1/$2')
      .replace(/(\d{2})(\d)/, '$1/$2')
      .slice(0, 10);
  }
};
```

## 🚀 IMPLEMENTAÇÃO PRIORITÁRIA

### Fase 1: Validação Básica (URGENTE)

#### 1.1. Criar arquivo de validadores
```bash
src/utils/validators.ts
```

#### 1.2. Atualizar ChatInput.tsx
- Adicionar estado de erro
- Adicionar validação no submit
- Mostrar mensagem de erro

#### 1.3. Atualizar tipos em flow.ts
- Adicionar propriedades de validação nos inputs existentes

### Fase 2: Novos Tipos de Input (ALTA PRIORIDADE)

#### 2.1. Email Input
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

#### 2.2. URL Input
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

#### 2.3. Phone Input
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

#### 2.4. Date Input
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
    format?: 'DD/MM/YYYY' | 'MM/DD/YYYY' | 'YYYY-MM-DD';
    minDate?: string;
    maxDate?: string;
  };
  outgoingEdgeId?: string;
}
```

### Fase 3: Bubbles Multimídia (MÉDIA PRIORIDADE)

#### 3.1. Video Bubble
```typescript
export interface VideoBlock {
  id: string;
  type: 'video';
  content: {
    url: string;
    autoplay?: boolean;
    controls?: boolean;
    muted?: boolean;
  };
  outgoingEdgeId?: string;
}
```

#### 3.2. Audio Bubble
```typescript
export interface AudioBlock {
  id: string;
  type: 'audio';
  content: {
    url: string;
    autoplay?: boolean;
    controls?: boolean;
  };
  outgoingEdgeId?: string;
}
```

#### 3.3. Embed Bubble
```typescript
export interface EmbedBlock {
  id: string;
  type: 'embed';
  content: {
    html: string;
    height?: string;
    width?: string;
  };
  outgoingEdgeId?: string;
}
```

### Fase 4: Inputs Avançados (BAIXA PRIORIDADE)

#### 4.1. Picture Choice
```typescript
export interface PictureChoiceBlock {
  id: string;
  type: 'picture choice';
  options: {
    isMultipleChoice?: boolean;
    variableId?: string;
    columns?: number;
  };
  items: Array<{
    id: string;
    type: string;
    blockId: string;
    content?: string;
    imageUrl: string;
    description?: string;
    outgoingEdgeId?: string;
  }>;
  outgoingEdgeId?: string;
}
```

## 📝 CHECKLIST DE IMPLEMENTAÇÃO

### Validadores (Fase 1)
- [ ] Criar `src/utils/validators.ts`
- [ ] Implementar validador de email
- [ ] Implementar validador de URL
- [ ] Implementar validador de telefone
- [ ] Implementar validador de número com range
- [ ] Criar função de mensagens de erro
- [ ] Adicionar testes unitários

### ChatInput Melhorado (Fase 1)
- [ ] Adicionar prop `inputType`
- [ ] Adicionar prop `validation`
- [ ] Adicionar estado de erro
- [ ] Adicionar validação no submit
- [ ] Mostrar mensagem de erro visual
- [ ] Adicionar feedback de erro acessível

### Novos Tipos (Fase 2)
- [ ] Adicionar EmailInputBlock em flow.ts
- [ ] Adicionar UrlInputBlock em flow.ts
- [ ] Adicionar PhoneInputBlock em flow.ts
- [ ] Adicionar DateInputBlock em flow.ts
- [ ] Atualizar type union Block
- [ ] Adicionar cases no Form.tsx
- [ ] Testar cada tipo

### Bubbles Multimídia (Fase 3)
- [ ] Adicionar VideoBlock em flow.ts
- [ ] Adicionar AudioBlock em flow.ts
- [ ] Adicionar EmbedBlock em flow.ts
- [ ] Criar componente VideoPlayer
- [ ] Criar componente AudioPlayer
- [ ] Criar componente EmbedViewer (com sanitização)
- [ ] Atualizar type union Block
- [ ] Adicionar cases no Form.tsx

### Inputs Avançados (Fase 4)
- [ ] Adicionar PictureChoiceBlock em flow.ts
- [ ] Criar componente PictureChoice
- [ ] Implementar grid de imagens
- [ ] Adicionar seleção múltipla
- [ ] Atualizar type union Block
- [ ] Adicionar case no Form.tsx

## 🔒 SEGURANÇA

### Sanitização de HTML (Embed)
```typescript
import DOMPurify from 'dompurify';

export const sanitizeHtml = (html: string): string => {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['iframe', 'div', 'span', 'p'],
    ALLOWED_ATTR: ['src', 'width', 'height', 'frameborder', 'allow', 'class']
  });
};
```

### Validação de URLs
```typescript
export const isSafeUrl = (url: string): boolean => {
  try {
    const parsed = new URL(url);
    // Apenas HTTP/HTTPS
    return ['http:', 'https:'].includes(parsed.protocol);
  } catch {
    return false;
  }
};
```

## 📊 IMPACTO ESTIMADO

### Fase 1 (Validadores)
- **Tempo**: 2-3 horas
- **Impacto**: Alto - Previne dados inválidos
- **Risco**: Baixo

### Fase 2 (Novos Inputs)
- **Tempo**: 4-6 horas
- **Impacto**: Alto - Melhora UX significativamente
- **Risco**: Médio - Requer testes extensivos

### Fase 3 (Bubbles Multimídia)
- **Tempo**: 3-4 horas
- **Impacto**: Médio - Enriquece conteúdo
- **Risco**: Médio - Problemas de performance

### Fase 4 (Inputs Avançados)
- **Tempo**: 4-5 horas
- **Impacto**: Médio - Melhora visual
- **Risco**: Baixo

## 🎯 PRÓXIMOS PASSOS RECOMENDADOS

1. **IMEDIATO**: Implementar validadores básicos (Fase 1)
2. **ESTA SEMANA**: Adicionar Email e URL inputs (Fase 2.1 e 2.2)
3. **PRÓXIMA SEMANA**: Adicionar Phone e Date inputs (Fase 2.3 e 2.4)
4. **FUTURO**: Implementar bubbles multimídia e inputs avançados
