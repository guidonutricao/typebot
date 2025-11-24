# 📚 GUIA DE USO: VALIDADORES E MÁSCARAS

## 🎯 Como Usar os Validadores

### Importação
```typescript
import { 
  validate, 
  validateEmail, 
  validateUrl, 
  validatePhone,
  validateNumber,
  validateDate,
  validateText 
} from '@/utils/validators';
```

### Uso Básico

#### 1. Validar Email
```typescript
const result = validateEmail('usuario@exemplo.com');

if (result.isValid) {
  console.log('Email válido!');
} else {
  console.error(result.error); // "Por favor, insira um email válido"
}
```

#### 2. Validar URL
```typescript
const result = validateUrl('https://exemplo.com');

if (result.isValid) {
  console.log('URL válida!');
} else {
  console.error(result.error); // "URL deve começar com http:// ou https://"
}
```

#### 3. Validar Telefone
```typescript
const result = validatePhone('(11) 98765-4321');

if (result.isValid) {
  console.log('Telefone válido!');
} else {
  console.error(result.error); // "Telefone deve ter entre 10 e 15 dígitos"
}
```

#### 4. Validar Número com Range
```typescript
const result = validateNumber('50', { min: 0, max: 100 });

if (result.isValid) {
  console.log('Número válido!');
} else {
  console.error(result.error); // "Número deve ser maior ou igual a 0"
}
```

#### 5. Validar Data
```typescript
const result = validateDate('25/12/2024');

if (result.isValid) {
  console.log('Data válida!');
} else {
  console.error(result.error); // "Data inválida"
}
```

#### 6. Validar Data com Range
```typescript
const minDate = new Date('2024-01-01');
const maxDate = new Date('2024-12-31');

const result = validateDate('15/06/2024', { minDate, maxDate });

if (result.isValid) {
  console.log('Data dentro do range!');
} else {
  console.error(result.error);
}
```

#### 7. Validar Texto com Opções
```typescript
const result = validateText('Olá mundo', {
  required: true,
  minLength: 3,
  maxLength: 100,
  pattern: /^[A-Za-z\s]+$/ // Apenas letras e espaços
});

if (result.isValid) {
  console.log('Texto válido!');
} else {
  console.error(result.error);
}
```

### Uso com Função Genérica

```typescript
// Escolhe automaticamente o validador correto
const emailResult = validate('usuario@exemplo.com', 'email');
const urlResult = validate('https://exemplo.com', 'url');
const phoneResult = validate('11987654321', 'phone');
const numberResult = validate('42', 'number', { min: 0, max: 100 });
const dateResult = validate('25/12/2024', 'date');
const textResult = validate('Olá', 'text', { required: true });
```

---

## 🎨 Como Usar as Máscaras

### Importação
```typescript
import { 
  applyMask,
  phoneMask,
  dateMask,
  cpfMask,
  cnpjMask,
  cepMask,
  creditCardMask,
  currencyMask,
  unmask
} from '@/utils/inputMasks';
```

### Uso Básico

#### 1. Máscara de Telefone
```typescript
const formatted = phoneMask('11987654321');
console.log(formatted); // "(11) 98765-4321"

// Durante digitação
console.log(phoneMask('11'));        // "11"
console.log(phoneMask('119'));       // "(11) 9"
console.log(phoneMask('11987'));     // "(11) 987"
console.log(phoneMask('119876543')); // "(11) 9876-543"
```

#### 2. Máscara de Data
```typescript
const formatted = dateMask('25122024');
console.log(formatted); // "25/12/2024"

// Durante digitação
console.log(dateMask('25'));     // "25"
console.log(dateMask('2512'));   // "25/12"
console.log(dateMask('251220')); // "25/12/20"
```

#### 3. Máscara de CPF
```typescript
const formatted = cpfMask('12345678900');
console.log(formatted); // "123.456.789-00"
```

#### 4. Máscara de CNPJ
```typescript
const formatted = cnpjMask('12345678000190');
console.log(formatted); // "12.345.678/0001-90"
```

#### 5. Máscara de CEP
```typescript
const formatted = cepMask('12345678');
console.log(formatted); // "12345-678"
```

#### 6. Máscara de Cartão de Crédito
```typescript
const formatted = creditCardMask('1234567890123456');
console.log(formatted); // "1234 5678 9012 3456"
```

#### 7. Máscara de Moeda
```typescript
const formatted = currencyMask('123456');
console.log(formatted); // "R$ 1.234,56"
```

### Uso com Função Genérica

```typescript
// Escolhe automaticamente a máscara correta
const phone = applyMask('11987654321', 'phone');
const date = applyMask('25122024', 'date');
const cpf = applyMask('12345678900', 'cpf');
const cnpj = applyMask('12345678000190', 'cnpj');
const cep = applyMask('12345678', 'cep');
const card = applyMask('1234567890123456', 'credit-card');
const money = applyMask('123456', 'currency');
```

### Remover Máscara

```typescript
const unmasked = unmask('(11) 98765-4321');
console.log(unmasked); // "11987654321"

const unmaskedCpf = unmask('123.456.789-00');
console.log(unmaskedCpf); // "12345678900"
```

---

## 🔧 Integração com React

### Exemplo: Input com Validação

```typescript
import { useState } from 'react';
import { validateEmail } from '@/utils/validators';

function EmailInput() {
  const [value, setValue] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setValue(newValue);
    
    // Validar em tempo real
    const result = validateEmail(newValue);
    setError(result.isValid ? '' : result.error || '');
  };

  const handleSubmit = () => {
    const result = validateEmail(value);
    
    if (result.isValid) {
      // Enviar dados
      console.log('Email válido:', value);
    } else {
      setError(result.error || 'Email inválido');
    }
  };

  return (
    <div>
      <input
        type="text"
        value={value}
        onChange={handleChange}
        placeholder="Digite seu email"
      />
      {error && <span className="error">{error}</span>}
      <button onClick={handleSubmit}>Enviar</button>
    </div>
  );
}
```

### Exemplo: Input com Máscara

```typescript
import { useState } from 'react';
import { phoneMask, unmask } from '@/utils/inputMasks';

function PhoneInput() {
  const [value, setValue] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    const masked = phoneMask(rawValue);
    setValue(masked);
  };

  const handleSubmit = () => {
    // Remover máscara antes de enviar
    const cleanValue = unmask(value);
    console.log('Telefone sem máscara:', cleanValue);
  };

  return (
    <div>
      <input
        type="text"
        value={value}
        onChange={handleChange}
        placeholder="(00) 00000-0000"
      />
      <button onClick={handleSubmit}>Enviar</button>
    </div>
  );
}
```

### Exemplo: Input com Validação e Máscara

```typescript
import { useState } from 'react';
import { validatePhone } from '@/utils/validators';
import { phoneMask, unmask } from '@/utils/inputMasks';

function PhoneInputComplete() {
  const [value, setValue] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    const masked = phoneMask(rawValue);
    setValue(masked);
    
    // Validar com valor sem máscara
    const cleanValue = unmask(masked);
    const result = validatePhone(cleanValue);
    setError(result.isValid ? '' : result.error || '');
  };

  const handleSubmit = () => {
    const cleanValue = unmask(value);
    const result = validatePhone(cleanValue);
    
    if (result.isValid) {
      console.log('Telefone válido:', cleanValue);
    } else {
      setError(result.error || 'Telefone inválido');
    }
  };

  return (
    <div>
      <input
        type="text"
        value={value}
        onChange={handleChange}
        placeholder="(00) 00000-0000"
        className={error ? 'error' : ''}
      />
      {error && <span className="error">{error}</span>}
      <button onClick={handleSubmit} disabled={!!error}>
        Enviar
      </button>
    </div>
  );
}
```

---

## 🎯 Integração com ChatInput

### Atualizar ChatInput.tsx

```typescript
import { useState } from "react";
import { validate, ValidationResult } from "@/utils/validators";
import { applyMask, unmask } from "@/utils/inputMasks";

interface ChatInputProps {
  onSubmit: (value: string) => void;
  placeholder?: string;
  buttonLabel?: string;
  disabled?: boolean;
  isLong?: boolean;
  // NOVO
  inputType?: 'text' | 'email' | 'url' | 'phone' | 'number' | 'date';
  maskType?: 'phone' | 'date' | 'cpf' | 'cnpj' | 'cep';
  validation?: {
    required?: boolean;
    min?: number;
    max?: number;
    minLength?: number;
    maxLength?: number;
  };
}

export const ChatInput = ({ 
  onSubmit, 
  placeholder = "Digite sua resposta...", 
  buttonLabel = "Enviar",
  disabled = false,
  isLong = false,
  inputType = 'text',
  maskType,
  validation
}: ChatInputProps) => {
  const [value, setValue] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    let newValue = e.target.value;
    
    // Aplicar máscara se especificada
    if (maskType) {
      newValue = applyMask(newValue, maskType);
    }
    
    setValue(newValue);
    
    // Validar em tempo real
    if (newValue.trim()) {
      const cleanValue = maskType ? unmask(newValue) : newValue;
      const result = validate(cleanValue, inputType, validation);
      setError(result.isValid ? '' : result.error || '');
    } else {
      setError('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!value.trim()) return;
    
    // Validar antes de enviar
    const cleanValue = maskType ? unmask(value) : value;
    const result = validate(cleanValue, inputType, validation);
    
    if (result.isValid) {
      onSubmit(cleanValue);
      setValue("");
      setError("");
    } else {
      setError(result.error || 'Valor inválido');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2">
      <div className="flex gap-2">
        {isLong ? (
          <textarea
            value={value}
            onChange={handleChange}
            placeholder={placeholder}
            disabled={disabled}
            className={`flex-1 ${error ? 'border-red-500' : ''}`}
          />
        ) : (
          <input
            type="text"
            value={value}
            onChange={handleChange}
            placeholder={placeholder}
            disabled={disabled}
            className={`flex-1 ${error ? 'border-red-500' : ''}`}
          />
        )}
        <button
          type="submit"
          disabled={disabled || !value.trim() || !!error}
        >
          {buttonLabel}
        </button>
      </div>
      {error && (
        <span className="text-red-500 text-sm">{error}</span>
      )}
    </form>
  );
};
```

### Usar no Form.tsx

```typescript
// Para email input
<ChatInput
  onSubmit={handleTextInput}
  placeholder="Digite seu email"
  inputType="email"
/>

// Para telefone com máscara
<ChatInput
  onSubmit={handleTextInput}
  placeholder="(00) 00000-0000"
  inputType="phone"
  maskType="phone"
/>

// Para número com range
<ChatInput
  onSubmit={handleTextInput}
  placeholder="Digite um número de 1 a 10"
  inputType="number"
  validation={{ min: 1, max: 10 }}
/>

// Para data com máscara
<ChatInput
  onSubmit={handleTextInput}
  placeholder="DD/MM/YYYY"
  inputType="date"
  maskType="date"
/>

// Para URL
<ChatInput
  onSubmit={handleTextInput}
  placeholder="https://exemplo.com"
  inputType="url"
/>
```

---

## 🧪 Testes

### Testar Validadores
```bash
npm test -- validators.test.ts --run
```

### Testar Máscaras
```bash
npm test -- inputMasks.test.ts --run
```

### Testar Tudo
```bash
npm test -- --run
```

---

## 📝 Notas Importantes

### Validação
- Sempre valide antes de enviar dados
- Mostre feedback visual ao usuário
- Use mensagens de erro em português
- Valide em tempo real para melhor UX

### Máscaras
- Aplique máscaras durante digitação
- Remova máscaras antes de enviar
- Limite o comprimento do input
- Permita apenas caracteres válidos

### Performance
- Validadores são síncronos e rápidos
- Máscaras são aplicadas em tempo real
- Não há impacto significativo na performance

### Acessibilidade
- Adicione `aria-invalid` quando houver erro
- Use `aria-describedby` para mensagens de erro
- Garanta que erros sejam anunciados por leitores de tela

---

## 🎓 Exemplos Completos

### Email Input Completo
```typescript
<ChatInput
  onSubmit={(value) => {
    console.log('Email válido:', value);
    // Enviar para API
  }}
  placeholder="exemplo@dominio.com"
  inputType="email"
  validation={{ required: true }}
/>
```

### Telefone Input Completo
```typescript
<ChatInput
  onSubmit={(value) => {
    console.log('Telefone sem máscara:', value);
    // Enviar para API
  }}
  placeholder="(00) 00000-0000"
  inputType="phone"
  maskType="phone"
  validation={{ required: true }}
/>
```

### Data Input Completo
```typescript
<ChatInput
  onSubmit={(value) => {
    console.log('Data:', value);
    // Enviar para API
  }}
  placeholder="DD/MM/YYYY"
  inputType="date"
  maskType="date"
  validation={{ 
    required: true,
    minDate: new Date('2024-01-01'),
    maxDate: new Date('2024-12-31')
  }}
/>
```

---

## 🚀 Próximos Passos

1. Integrar validadores no ChatInput
2. Adicionar feedback visual de erros
3. Implementar novos tipos de input
4. Criar testes de integração
5. Documentar casos de uso específicos
