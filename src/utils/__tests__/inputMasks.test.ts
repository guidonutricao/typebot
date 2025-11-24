import { describe, it, expect } from 'vitest';
import {
  phoneMask,
  internationalPhoneMask,
  dateMask,
  cpfMask,
  cnpjMask,
  cepMask,
  creditCardMask,
  currencyMask,
  customMask,
  unmask,
  applyMask
} from '../inputMasks';

describe('inputMasks', () => {
  describe('phoneMask', () => {
    it('deve formatar telefone com 11 dígitos', () => {
      expect(phoneMask('11987654321')).toBe('(11) 98765-4321');
    });

    it('deve formatar telefone com 10 dígitos', () => {
      expect(phoneMask('1187654321')).toBe('(11) 8765-4321');
    });

    it('deve formatar parcialmente durante digitação', () => {
      expect(phoneMask('11')).toBe('11');
      expect(phoneMask('119')).toBe('(11) 9');
      expect(phoneMask('11987')).toBe('(11) 987');
      expect(phoneMask('119876543')).toBe('(11) 9876-543');
    });

    it('deve remover caracteres não numéricos', () => {
      expect(phoneMask('(11) 98765-4321')).toBe('(11) 98765-4321');
      expect(phoneMask('11 98765 4321')).toBe('(11) 98765-4321');
    });

    it('deve limitar a 11 dígitos', () => {
      expect(phoneMask('119876543219999')).toBe('(11) 98765-4321');
    });
  });

  describe('internationalPhoneMask', () => {
    it('deve formatar telefone internacional completo', () => {
      expect(internationalPhoneMask('5511987654321')).toBe('+55 (11) 98765-4321');
    });

    it('deve formatar parcialmente durante digitação', () => {
      expect(internationalPhoneMask('55')).toBe('+55');
      expect(internationalPhoneMask('5511')).toBe('+55 (11');
      expect(internationalPhoneMask('551198')).toBe('+55 (11) 98');
    });
  });

  describe('dateMask', () => {
    it('deve formatar data completa', () => {
      expect(dateMask('25122024')).toBe('25/12/2024');
    });

    it('deve formatar parcialmente durante digitação', () => {
      expect(dateMask('25')).toBe('25');
      expect(dateMask('2512')).toBe('25/12');
      expect(dateMask('251220')).toBe('25/12/20');
    });

    it('deve remover caracteres não numéricos', () => {
      expect(dateMask('25/12/2024')).toBe('25/12/2024');
    });

    it('deve limitar a 8 dígitos', () => {
      expect(dateMask('251220249999')).toBe('25/12/2024');
    });
  });

  describe('cpfMask', () => {
    it('deve formatar CPF completo', () => {
      expect(cpfMask('12345678900')).toBe('123.456.789-00');
    });

    it('deve formatar parcialmente durante digitação', () => {
      expect(cpfMask('123')).toBe('123');
      expect(cpfMask('123456')).toBe('123.456');
      expect(cpfMask('123456789')).toBe('123.456.789');
    });

    it('deve limitar a 11 dígitos', () => {
      expect(cpfMask('123456789009999')).toBe('123.456.789-00');
    });
  });

  describe('cnpjMask', () => {
    it('deve formatar CNPJ completo', () => {
      expect(cnpjMask('12345678000190')).toBe('12.345.678/0001-90');
    });

    it('deve formatar parcialmente durante digitação', () => {
      expect(cnpjMask('12')).toBe('12');
      expect(cnpjMask('12345')).toBe('12.345');
      expect(cnpjMask('12345678')).toBe('12.345.678');
      expect(cnpjMask('123456780001')).toBe('12.345.678/0001');
    });

    it('deve limitar a 14 dígitos', () => {
      expect(cnpjMask('123456780001909999')).toBe('12.345.678/0001-90');
    });
  });

  describe('cepMask', () => {
    it('deve formatar CEP completo', () => {
      expect(cepMask('12345678')).toBe('12345-678');
    });

    it('deve formatar parcialmente durante digitação', () => {
      expect(cepMask('12345')).toBe('12345');
      expect(cepMask('123456')).toBe('12345-6');
    });

    it('deve limitar a 8 dígitos', () => {
      expect(cepMask('123456789999')).toBe('12345-678');
    });
  });

  describe('creditCardMask', () => {
    it('deve formatar cartão de crédito completo', () => {
      expect(creditCardMask('1234567890123456')).toBe('1234 5678 9012 3456');
    });

    it('deve formatar parcialmente durante digitação', () => {
      expect(creditCardMask('1234')).toBe('1234');
      expect(creditCardMask('12345678')).toBe('1234 5678');
      expect(creditCardMask('123456789012')).toBe('1234 5678 9012');
    });

    it('deve limitar a 16 dígitos', () => {
      expect(creditCardMask('12345678901234569999')).toBe('1234 5678 9012 3456');
    });
  });

  describe('currencyMask', () => {
    it('deve formatar moeda simples', () => {
      const result = currencyMask('1000');
      expect(result).toContain('10,00');
      expect(result).toContain('R$');
    });

    it('deve formatar moeda com centavos', () => {
      const result = currencyMask('123456');
      expect(result).toContain('1.234,56');
      expect(result).toContain('R$');
    });

    it('deve formatar valores grandes', () => {
      const result = currencyMask('123456789');
      expect(result).toContain('1.234.567,89');
      expect(result).toContain('R$');
    });

    it('deve retornar vazio para entrada vazia', () => {
      expect(currencyMask('')).toBe('');
    });
  });

  describe('customMask', () => {
    it('deve aplicar máscara customizada de CPF', () => {
      expect(customMask('000.000.000-00', '12345678900')).toBe('123.456.789-00');
    });

    it('deve aplicar máscara customizada de telefone', () => {
      expect(customMask('(00) 00000-0000', '11987654321')).toBe('(11) 98765-4321');
    });

    it('deve parar quando acabam os dígitos', () => {
      expect(customMask('000.000.000-00', '123')).toBe('123');
    });
  });

  describe('unmask', () => {
    it('deve remover máscara de telefone', () => {
      expect(unmask('(11) 98765-4321')).toBe('11987654321');
    });

    it('deve remover máscara de CPF', () => {
      expect(unmask('123.456.789-00')).toBe('12345678900');
    });

    it('deve remover máscara de data', () => {
      expect(unmask('25/12/2024')).toBe('25122024');
    });

    it('deve retornar vazio para entrada vazia', () => {
      expect(unmask('')).toBe('');
    });
  });

  describe('applyMask', () => {
    it('deve aplicar máscara de telefone', () => {
      expect(applyMask('11987654321', 'phone')).toBe('(11) 98765-4321');
    });

    it('deve aplicar máscara de telefone internacional', () => {
      expect(applyMask('5511987654321', 'international-phone')).toBe('+55 (11) 98765-4321');
    });

    it('deve aplicar máscara de data', () => {
      expect(applyMask('25122024', 'date')).toBe('25/12/2024');
    });

    it('deve aplicar máscara de CPF', () => {
      expect(applyMask('12345678900', 'cpf')).toBe('123.456.789-00');
    });

    it('deve aplicar máscara de CNPJ', () => {
      expect(applyMask('12345678000190', 'cnpj')).toBe('12.345.678/0001-90');
    });

    it('deve aplicar máscara de CEP', () => {
      expect(applyMask('12345678', 'cep')).toBe('12345-678');
    });

    it('deve aplicar máscara de cartão de crédito', () => {
      expect(applyMask('1234567890123456', 'credit-card')).toBe('1234 5678 9012 3456');
    });

    it('deve aplicar máscara de moeda', () => {
      const result = applyMask('1000', 'currency');
      expect(result).toContain('10,00');
      expect(result).toContain('R$');
    });
  });
});
