import { describe, it, expect } from 'vitest';
import {
  validateEmail,
  validateUrl,
  validatePhone,
  validateNumber,
  validateDate,
  validateText,
  validate
} from '../validators';

describe('validators', () => {
  describe('validateEmail', () => {
    it('deve validar email correto', () => {
      const result = validateEmail('usuario@exemplo.com');
      expect(result.isValid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('deve rejeitar email sem @', () => {
      const result = validateEmail('usuarioexemplo.com');
      expect(result.isValid).toBe(false);
      expect(result.error).toBeDefined();
    });

    it('deve rejeitar email sem domínio', () => {
      const result = validateEmail('usuario@');
      expect(result.isValid).toBe(false);
      expect(result.error).toBeDefined();
    });

    it('deve rejeitar email vazio', () => {
      const result = validateEmail('');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Email é obrigatório');
    });

    it('deve validar emails com subdomínios', () => {
      const result = validateEmail('usuario@mail.exemplo.com.br');
      expect(result.isValid).toBe(true);
    });
  });

  describe('validateUrl', () => {
    it('deve validar URL com https', () => {
      const result = validateUrl('https://exemplo.com');
      expect(result.isValid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('deve validar URL com http', () => {
      const result = validateUrl('http://exemplo.com');
      expect(result.isValid).toBe(true);
    });

    it('deve rejeitar URL sem protocolo', () => {
      const result = validateUrl('exemplo.com');
      expect(result.isValid).toBe(false);
      expect(result.error).toBeDefined();
    });

    it('deve rejeitar URL com protocolo inválido', () => {
      const result = validateUrl('ftp://exemplo.com');
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('http://');
    });

    it('deve rejeitar URL vazia', () => {
      const result = validateUrl('');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('URL é obrigatória');
    });

    it('deve validar URL com path e query', () => {
      const result = validateUrl('https://exemplo.com/path?query=value');
      expect(result.isValid).toBe(true);
    });
  });

  describe('validatePhone', () => {
    it('deve validar telefone com 10 dígitos', () => {
      const result = validatePhone('1198765432');
      expect(result.isValid).toBe(true);
    });

    it('deve validar telefone com 11 dígitos', () => {
      const result = validatePhone('11987654321');
      expect(result.isValid).toBe(true);
    });

    it('deve validar telefone formatado', () => {
      const result = validatePhone('(11) 98765-4321');
      expect(result.isValid).toBe(true);
    });

    it('deve validar telefone internacional', () => {
      const result = validatePhone('+55 11 98765-4321');
      expect(result.isValid).toBe(true);
    });

    it('deve rejeitar telefone com menos de 10 dígitos', () => {
      const result = validatePhone('119876543');
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('10 e 15 dígitos');
    });

    it('deve rejeitar telefone vazio', () => {
      const result = validatePhone('');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Telefone é obrigatório');
    });
  });

  describe('validateNumber', () => {
    it('deve validar número inteiro', () => {
      const result = validateNumber('42');
      expect(result.isValid).toBe(true);
    });

    it('deve validar número decimal', () => {
      const result = validateNumber('3.14');
      expect(result.isValid).toBe(true);
    });

    it('deve validar número negativo', () => {
      const result = validateNumber('-10');
      expect(result.isValid).toBe(true);
    });

    it('deve rejeitar texto', () => {
      const result = validateNumber('abc');
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('número válido');
    });

    it('deve validar número dentro do range', () => {
      const result = validateNumber('50', { min: 0, max: 100 });
      expect(result.isValid).toBe(true);
    });

    it('deve rejeitar número abaixo do mínimo', () => {
      const result = validateNumber('5', { min: 10 });
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('maior ou igual a 10');
    });

    it('deve rejeitar número acima do máximo', () => {
      const result = validateNumber('150', { max: 100 });
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('menor ou igual a 100');
    });
  });

  describe('validateDate', () => {
    it('deve validar data no formato DD/MM/YYYY', () => {
      const result = validateDate('25/12/2024');
      expect(result.isValid).toBe(true);
    });

    it('deve validar data no formato YYYY-MM-DD', () => {
      const result = validateDate('2024-12-25');
      expect(result.isValid).toBe(true);
    });

    it('deve rejeitar data em formato inválido', () => {
      const result = validateDate('25-12-2024');
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('formato');
    });

    it('deve rejeitar data inválida', () => {
      const result = validateDate('32/13/2024');
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('inválida');
    });

    it('deve validar data dentro do range', () => {
      const minDate = new Date('2024-01-01');
      const maxDate = new Date('2024-12-31');
      const result = validateDate('15/06/2024', { minDate, maxDate });
      expect(result.isValid).toBe(true);
    });

    it('deve rejeitar data antes do mínimo', () => {
      const minDate = new Date('2024-01-01');
      const result = validateDate('31/12/2023', { minDate });
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('posterior');
    });

    it('deve rejeitar data depois do máximo', () => {
      const maxDate = new Date('2024-12-31');
      const result = validateDate('01/01/2025', { maxDate });
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('anterior');
    });
  });

  describe('validateText', () => {
    it('deve validar texto simples', () => {
      const result = validateText('Olá mundo');
      expect(result.isValid).toBe(true);
    });

    it('deve rejeitar texto vazio quando obrigatório', () => {
      const result = validateText('', { required: true });
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Este campo é obrigatório');
    });

    it('deve validar comprimento mínimo', () => {
      const result = validateText('abc', { minLength: 3 });
      expect(result.isValid).toBe(true);
    });

    it('deve rejeitar texto menor que o mínimo', () => {
      const result = validateText('ab', { minLength: 3 });
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('Mínimo de 3 caracteres');
    });

    it('deve validar comprimento máximo', () => {
      const result = validateText('abc', { maxLength: 5 });
      expect(result.isValid).toBe(true);
    });

    it('deve rejeitar texto maior que o máximo', () => {
      const result = validateText('abcdef', { maxLength: 5 });
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('Máximo de 5 caracteres');
    });

    it('deve validar padrão regex', () => {
      const pattern = /^[A-Z]+$/;
      const result = validateText('ABC', { pattern });
      expect(result.isValid).toBe(true);
    });

    it('deve rejeitar texto que não corresponde ao padrão', () => {
      const pattern = /^[A-Z]+$/;
      const result = validateText('abc', { pattern });
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Formato inválido');
    });
  });

  describe('validate (função genérica)', () => {
    it('deve validar email usando tipo', () => {
      const result = validate('usuario@exemplo.com', 'email');
      expect(result.isValid).toBe(true);
    });

    it('deve validar URL usando tipo', () => {
      const result = validate('https://exemplo.com', 'url');
      expect(result.isValid).toBe(true);
    });

    it('deve validar telefone usando tipo', () => {
      const result = validate('11987654321', 'phone');
      expect(result.isValid).toBe(true);
    });

    it('deve validar número usando tipo', () => {
      const result = validate('42', 'number');
      expect(result.isValid).toBe(true);
    });

    it('deve validar data usando tipo', () => {
      const result = validate('25/12/2024', 'date');
      expect(result.isValid).toBe(true);
    });

    it('deve validar texto usando tipo', () => {
      const result = validate('Olá mundo', 'text');
      expect(result.isValid).toBe(true);
    });
  });
});
