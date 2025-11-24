/**
 * Máscaras de input para formatação automática
 * Melhora a UX aplicando formatação enquanto o usuário digita
 */

/**
 * Máscara de telefone brasileiro
 * Formatos: (11) 98765-4321 ou (11) 8765-4321
 */
export const phoneMask = (value: string): string => {
  // Remove tudo que não é dígito
  const cleaned = value.replace(/\D/g, '');
  
  // Limita a 11 dígitos (DDD + número)
  const limited = cleaned.slice(0, 11);
  
  // Aplica máscara progressivamente
  if (limited.length <= 2) {
    return limited;
  } else if (limited.length <= 6) {
    return `(${limited.slice(0, 2)}) ${limited.slice(2)}`;
  } else if (limited.length <= 10) {
    return `(${limited.slice(0, 2)}) ${limited.slice(2, 6)}-${limited.slice(6)}`;
  } else {
    return `(${limited.slice(0, 2)}) ${limited.slice(2, 7)}-${limited.slice(7)}`;
  }
};

/**
 * Máscara de telefone internacional
 * Formato: +55 (11) 98765-4321
 */
export const internationalPhoneMask = (value: string): string => {
  const cleaned = value.replace(/\D/g, '');
  const limited = cleaned.slice(0, 13); // +XX + 11 dígitos
  
  if (limited.length <= 2) {
    return `+${limited}`;
  } else if (limited.length <= 4) {
    return `+${limited.slice(0, 2)} (${limited.slice(2)}`;
  } else if (limited.length <= 8) {
    return `+${limited.slice(0, 2)} (${limited.slice(2, 4)}) ${limited.slice(4)}`;
  } else if (limited.length <= 12) {
    return `+${limited.slice(0, 2)} (${limited.slice(2, 4)}) ${limited.slice(4, 8)}-${limited.slice(8)}`;
  } else {
    return `+${limited.slice(0, 2)} (${limited.slice(2, 4)}) ${limited.slice(4, 9)}-${limited.slice(9)}`;
  }
};

/**
 * Máscara de data DD/MM/YYYY
 */
export const dateMask = (value: string): string => {
  const cleaned = value.replace(/\D/g, '');
  const limited = cleaned.slice(0, 8);
  
  if (limited.length <= 2) {
    return limited;
  } else if (limited.length <= 4) {
    return `${limited.slice(0, 2)}/${limited.slice(2)}`;
  } else {
    return `${limited.slice(0, 2)}/${limited.slice(2, 4)}/${limited.slice(4)}`;
  }
};

/**
 * Máscara de CPF: 000.000.000-00
 */
export const cpfMask = (value: string): string => {
  const cleaned = value.replace(/\D/g, '');
  const limited = cleaned.slice(0, 11);
  
  if (limited.length <= 3) {
    return limited;
  } else if (limited.length <= 6) {
    return `${limited.slice(0, 3)}.${limited.slice(3)}`;
  } else if (limited.length <= 9) {
    return `${limited.slice(0, 3)}.${limited.slice(3, 6)}.${limited.slice(6)}`;
  } else {
    return `${limited.slice(0, 3)}.${limited.slice(3, 6)}.${limited.slice(6, 9)}-${limited.slice(9)}`;
  }
};

/**
 * Máscara de CNPJ: 00.000.000/0000-00
 */
export const cnpjMask = (value: string): string => {
  const cleaned = value.replace(/\D/g, '');
  const limited = cleaned.slice(0, 14);
  
  if (limited.length <= 2) {
    return limited;
  } else if (limited.length <= 5) {
    return `${limited.slice(0, 2)}.${limited.slice(2)}`;
  } else if (limited.length <= 8) {
    return `${limited.slice(0, 2)}.${limited.slice(2, 5)}.${limited.slice(5)}`;
  } else if (limited.length <= 12) {
    return `${limited.slice(0, 2)}.${limited.slice(2, 5)}.${limited.slice(5, 8)}/${limited.slice(8)}`;
  } else {
    return `${limited.slice(0, 2)}.${limited.slice(2, 5)}.${limited.slice(5, 8)}/${limited.slice(8, 12)}-${limited.slice(12)}`;
  }
};

/**
 * Máscara de CEP: 00000-000
 */
export const cepMask = (value: string): string => {
  const cleaned = value.replace(/\D/g, '');
  const limited = cleaned.slice(0, 8);
  
  if (limited.length <= 5) {
    return limited;
  } else {
    return `${limited.slice(0, 5)}-${limited.slice(5)}`;
  }
};

/**
 * Máscara de cartão de crédito: 0000 0000 0000 0000
 */
export const creditCardMask = (value: string): string => {
  const cleaned = value.replace(/\D/g, '');
  const limited = cleaned.slice(0, 16);
  
  const parts = [];
  for (let i = 0; i < limited.length; i += 4) {
    parts.push(limited.slice(i, i + 4));
  }
  
  return parts.join(' ');
};

/**
 * Máscara de moeda brasileira: R$ 1.234,56
 */
export const currencyMask = (value: string): string => {
  // Remove tudo exceto dígitos
  const cleaned = value.replace(/\D/g, '');
  
  if (!cleaned) return '';
  
  // Converte para número e divide por 100 (centavos)
  const number = parseInt(cleaned) / 100;
  
  // Formata como moeda brasileira
  return number.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  });
};

/**
 * Máscara genérica customizável
 * Exemplo: mask('000.000.000-00', '12345678900') => '123.456.789-00'
 */
export const customMask = (pattern: string, value: string): string => {
  const cleaned = value.replace(/\D/g, '');
  let result = '';
  let valueIndex = 0;
  
  for (let i = 0; i < pattern.length && valueIndex < cleaned.length; i++) {
    if (pattern[i] === '0') {
      result += cleaned[valueIndex];
      valueIndex++;
    } else {
      result += pattern[i];
    }
  }
  
  return result;
};

/**
 * Remove máscara e retorna apenas os dígitos
 */
export const unmask = (value: string): string => {
  return value.replace(/\D/g, '');
};

/**
 * Aplica máscara baseada no tipo
 */
export const applyMask = (
  value: string,
  type: 'phone' | 'international-phone' | 'date' | 'cpf' | 'cnpj' | 'cep' | 'credit-card' | 'currency'
): string => {
  switch (type) {
    case 'phone':
      return phoneMask(value);
    case 'international-phone':
      return internationalPhoneMask(value);
    case 'date':
      return dateMask(value);
    case 'cpf':
      return cpfMask(value);
    case 'cnpj':
      return cnpjMask(value);
    case 'cep':
      return cepMask(value);
    case 'credit-card':
      return creditCardMask(value);
    case 'currency':
      return currencyMask(value);
    default:
      return value;
  }
};
