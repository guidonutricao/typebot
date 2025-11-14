import { describe, it, expect } from 'vitest';
import { interpolateVariables } from '../variableInterpolation';

describe('variableInterpolation', () => {
  describe('interpolateVariables', () => {
    it('deve substituir variável simples', () => {
      const text = 'Olá, {{nome}}!';
      const variables = { nome: 'João' };
      const result = interpolateVariables(text, variables);
      expect(result).toBe('Olá, João!');
    });

    it('deve substituir múltiplas variáveis', () => {
      const text = 'Show, {{treinos}} treinos! Você treina {{dias}} dias.';
      const variables = { treinos: '5', dias: '3' };
      const result = interpolateVariables(text, variables);
      expect(result).toBe('Show, 5 treinos! Você treina 3 dias.');
    });

    it('deve substituir variável com espaços no nome', () => {
      const text = 'Seu objetivo é {{Objetivo principal}}.';
      const variables = { 'Objetivo principal': 'emagrecer' };
      const result = interpolateVariables(text, variables);
      expect(result).toBe('Seu objetivo é emagrecer.');
    });

    it('deve fazer trim em espaços extras dentro das chaves', () => {
      const text = 'Olá, {{ nome }}!';
      const variables = { nome: 'Maria' };
      const result = interpolateVariables(text, variables);
      expect(result).toBe('Olá, Maria!');
    });

    it('deve manter variável não encontrada', () => {
      const text = 'Olá, {{nome_inexistente}}!';
      const variables = { nome: 'João' };
      const result = interpolateVariables(text, variables);
      expect(result).toBe('Olá, {{nome_inexistente}}!');
    });

    it('deve manter formatação ao redor', () => {
      const text = 'Parabéns! Você completou {{progresso}}% do desafio.';
      const variables = { progresso: '80' };
      const result = interpolateVariables(text, variables);
      expect(result).toBe('Parabéns! Você completou 80% do desafio.');
    });

    it('deve substituir variável no início do texto', () => {
      const text = '{{nome}}, bem-vindo!';
      const variables = { nome: 'Carlos' };
      const result = interpolateVariables(text, variables);
      expect(result).toBe('Carlos, bem-vindo!');
    });

    it('deve substituir variável no final do texto', () => {
      const text = 'Bem-vindo, {{nome}}';
      const variables = { nome: 'Ana' };
      const result = interpolateVariables(text, variables);
      expect(result).toBe('Bem-vindo, Ana');
    });

    it('deve substituir mesma variável múltiplas vezes', () => {
      const text = '{{nome}}, olá {{nome}}! Como vai, {{nome}}?';
      const variables = { nome: 'Pedro' };
      const result = interpolateVariables(text, variables);
      expect(result).toBe('Pedro, olá Pedro! Como vai, Pedro?');
    });

    it('deve converter número para string', () => {
      const text = 'Você tem {{idade}} anos.';
      const variables = { idade: 25 };
      const result = interpolateVariables(text, variables);
      expect(result).toBe('Você tem 25 anos.');
    });

    it('deve converter boolean para string', () => {
      const text = 'Ativo: {{ativo}}';
      const variables = { ativo: true };
      const result = interpolateVariables(text, variables);
      expect(result).toBe('Ativo: true');
    });

    it('deve lidar com texto sem variáveis', () => {
      const text = 'Olá! Bem-vindo.';
      const variables = { nome: 'João' };
      const result = interpolateVariables(text, variables);
      expect(result).toBe('Olá! Bem-vindo.');
    });

    it('deve lidar com texto vazio', () => {
      const text = '';
      const variables = { nome: 'João' };
      const result = interpolateVariables(text, variables);
      expect(result).toBe('');
    });

    it('deve lidar com variáveis vazias', () => {
      const text = 'Olá, {{nome}}!';
      const variables = {};
      const result = interpolateVariables(text, variables);
      expect(result).toBe('Olá, {{nome}}!');
    });

    it('deve substituir variável com valor vazio', () => {
      const text = 'Olá, {{nome}}!';
      const variables = { nome: '' };
      const result = interpolateVariables(text, variables);
      expect(result).toBe('Olá, !');
    });

    it('deve substituir variável com valor zero', () => {
      const text = 'Você tem {{pontos}} pontos.';
      const variables = { pontos: 0 };
      const result = interpolateVariables(text, variables);
      expect(result).toBe('Você tem 0 pontos.');
    });

    it('deve lidar com caracteres especiais no nome da variável', () => {
      const text = 'Valor: {{valor-total}}';
      const variables = { 'valor-total': '100' };
      const result = interpolateVariables(text, variables);
      expect(result).toBe('Valor: 100');
    });

    it('deve lidar com underscores no nome da variável', () => {
      const text = 'Email: {{email_usuario}}';
      const variables = { email_usuario: 'teste@email.com' };
      const result = interpolateVariables(text, variables);
      expect(result).toBe('Email: teste@email.com');
    });

    it('deve lidar com números no nome da variável', () => {
      const text = 'Resposta: {{pergunta1}}';
      const variables = { pergunta1: 'A' };
      const result = interpolateVariables(text, variables);
      expect(result).toBe('Resposta: A');
    });

    it('deve lidar com acentos no nome da variável', () => {
      const text = 'Situação: {{situação}}';
      const variables = { situação: 'ativa' };
      const result = interpolateVariables(text, variables);
      expect(result).toBe('Situação: ativa');
    });

    it('deve lidar com case sensitive', () => {
      const text = '{{Nome}} e {{nome}} são diferentes';
      const variables = { Nome: 'João', nome: 'Maria' };
      const result = interpolateVariables(text, variables);
      expect(result).toBe('João e Maria são diferentes');
    });

    it('deve lidar com variável dentro de frase complexa', () => {
      const text = 'Com {{Quantidade de treinos}} treinos por semana, você alcançará {{Meta de peso}}kg em {{tempo}} meses!';
      const variables = {
        'Quantidade de treinos': '4',
        'Meta de peso': '75',
        tempo: '6'
      };
      const result = interpolateVariables(text, variables);
      expect(result).toBe('Com 4 treinos por semana, você alcançará 75kg em 6 meses!');
    });

    it('deve lidar com pontuação ao redor da variável', () => {
      const text = 'Olá, {{nome}}! Como vai? Tudo bem, {{nome}}?';
      const variables = { nome: 'João' };
      const result = interpolateVariables(text, variables);
      expect(result).toBe('Olá, João! Como vai? Tudo bem, João?');
    });

    it('deve lidar com quebras de linha', () => {
      const text = 'Olá, {{nome}}!\nBem-vindo.';
      const variables = { nome: 'João' };
      const result = interpolateVariables(text, variables);
      expect(result).toBe('Olá, João!\nBem-vindo.');
    });
  });
});
