/**
 * Validadores para diferentes tipos de input
 * Garante que os dados capturados estejam no formato correto
 */

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

export interface ValidationOptions {
  required?: boolean;
  min?: number;
  max?: number;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
}

/**
 * Valida email no formato padrão
 * Exemplo: usuario@dominio.com
 */
export const validateEmail = (value: string): ValidationResult => {
  if (!value || !value.trim()) {
    return { isValid: false, error: 'Email é obrigatório' };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  if (!emailRegex.test(value)) {
    return { 
      isValid: false, 
      error: 'Por favor, insira um email válido (exemplo@dominio.com)' 
    };
  }

  return { isValid: true };
};

/**
 * Valida URL no formato HTTP/HTTPS
 * Exemplo: https://exemplo.com
 */
export const validateUrl = (value: string): ValidationResult => {
  if (!value || !value.trim()) {
    return { isValid: false, error: 'URL é obrigatória' };
  }

  try {
    const url = new URL(value);
    
    if (!['http:', 'https:'].includes(url.protocol)) {
      return { 
        isValid: false, 
        error: 'URL deve começar com http:// ou https://' 
      };
    }

    return { isValid: true };
  } catch {
    return { 
      isValid: false, 
      error: 'Por favor, insira uma URL válida (https://exemplo.com)' 
    };
  }
};

/**
 * Valida telefone (formato flexível)
 * Aceita: (11) 98765-4321, +55 11 98765-4321, 11987654321
 */
export const validatePhone = (value: string): ValidationResult => {
  if (!value || !value.trim()) {
    return { isValid: false, error: 'Telefone é obrigatório' };
  }

  // Remove caracteres não numéricos
  const cleaned = value.replace(/\D/g, '');
  
  // Aceita 10-15 dígitos (com ou sem código de país)
  if (cleaned.length < 10 || cleaned.length > 15) {
    return { 
      isValid: false, 
      error: 'Telefone deve ter entre 10 e 15 dígitos' 
    };
  }

  return { isValid: true };
};

/**
 * Valida número com opções de range
 */
export const validateNumber = (
  value: string, 
  options?: { min?: number; max?: number }
): ValidationResult => {
  if (!value || !value.trim()) {
    return { isValid: false, error: 'Número é obrigatório' };
  }

  const num = parseFloat(value);
  
  if (isNaN(num)) {
    return { 
      isValid: false, 
      error: 'Por favor, insira um número válido' 
    };
  }

  if (options?.min !== undefined && num < options.min) {
    return { 
      isValid: false, 
      error: `Número deve ser maior ou igual a ${options.min}` 
    };
  }

  if (options?.max !== undefined && num > options.max) {
    return { 
      isValid: false, 
      error: `Número deve ser menor ou igual a ${options.max}` 
    };
  }

  return { isValid: true };
};

/**
 * Valida data no formato DD/MM/YYYY
 */
export const validateDate = (
  value: string,
  options?: { minDate?: Date; maxDate?: Date }
): ValidationResult => {
  if (!value || !value.trim()) {
    return { isValid: false, error: 'Data é obrigatória' };
  }

  // Aceita DD/MM/YYYY ou YYYY-MM-DD
  const dateRegex = /^(\d{2})\/(\d{2})\/(\d{4})$|^(\d{4})-(\d{2})-(\d{2})$/;
  
  if (!dateRegex.test(value)) {
    return { 
      isValid: false, 
      error: 'Data deve estar no formato DD/MM/YYYY ou YYYY-MM-DD' 
    };
  }

  let date: Date;
  let day: number, month: number, year: number;

  // Parse DD/MM/YYYY
  if (value.includes('/')) {
    [day, month, year] = value.split('/').map(Number);
    date = new Date(year, month - 1, day);
    
    // Verifica se a data foi criada corretamente (detecta 32/13/2024)
    if (date.getDate() !== day || date.getMonth() !== month - 1 || date.getFullYear() !== year) {
      return { 
        isValid: false, 
        error: 'Data inválida' 
      };
    }
  } else {
    // Parse YYYY-MM-DD
    date = new Date(value);
  }

  // Verifica se é uma data válida
  if (isNaN(date.getTime())) {
    return { 
      isValid: false, 
      error: 'Data inválida' 
    };
  }

  if (options?.minDate && date < options.minDate) {
    return { 
      isValid: false, 
      error: `Data deve ser posterior a ${options.minDate.toLocaleDateString('pt-BR')}` 
    };
  }

  if (options?.maxDate && date > options.maxDate) {
    return { 
      isValid: false, 
      error: `Data deve ser anterior a ${options.maxDate.toLocaleDateString('pt-BR')}` 
    };
  }

  return { isValid: true };
};

/**
 * Valida texto com opções de comprimento
 */
export const validateText = (
  value: string,
  options?: ValidationOptions
): ValidationResult => {
  if (options?.required && (!value || !value.trim())) {
    return { isValid: false, error: 'Este campo é obrigatório' };
  }

  if (options?.minLength && value.length < options.minLength) {
    return { 
      isValid: false, 
      error: `Mínimo de ${options.minLength} caracteres` 
    };
  }

  if (options?.maxLength && value.length > options.maxLength) {
    return { 
      isValid: false, 
      error: `Máximo de ${options.maxLength} caracteres` 
    };
  }

  if (options?.pattern && !options.pattern.test(value)) {
    return { 
      isValid: false, 
      error: 'Formato inválido' 
    };
  }

  return { isValid: true };
};

/**
 * Validador genérico que escolhe o validador correto baseado no tipo
 */
export const validate = (
  value: string,
  type: 'text' | 'email' | 'url' | 'phone' | 'number' | 'date',
  options?: ValidationOptions & { min?: number; max?: number; minDate?: Date; maxDate?: Date }
): ValidationResult => {
  switch (type) {
    case 'email':
      return validateEmail(value);
    case 'url':
      return validateUrl(value);
    case 'phone':
      return validatePhone(value);
    case 'number':
      return validateNumber(value, { min: options?.min, max: options?.max });
    case 'date':
      return validateDate(value, { minDate: options?.minDate, maxDate: options?.maxDate });
    case 'text':
    default:
      return validateText(value, options);
  }
};

/**
 * Retorna mensagem de erro amigável baseada no tipo
 */
export const getErrorMessage = (type: string): string => {
  switch (type) {
    case 'email':
      return 'Email inválido';
    case 'url':
      return 'URL inválida';
    case 'phone':
      return 'Telefone inválido';
    case 'number':
      return 'Número inválido';
    case 'date':
      return 'Data inválida';
    default:
      return 'Valor inválido';
  }
};
