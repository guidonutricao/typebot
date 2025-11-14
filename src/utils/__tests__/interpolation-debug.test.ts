import { describe, it, expect, beforeEach } from 'vitest';
import { interpolateVariables } from '../variableInterpolation';

describe('Debug - Interpolação Real', () => {
  it('deve substituir "Quantidade de treinos" exatamente como no fluxo', () => {
    const text = 'Show, {{Quantidade de treinos}} treinos!';
    const variables = {
      'Quantidade de treinos': '5'
    };
    
    const result = interpolateVariables(text, variables);
    
    console.log('=== DEBUG TEST ===');
    console.log('Input:', text);
    console.log('Variables:', variables);
    console.log('Result:', result);
    console.log('Expected:', 'Show, 5 treinos!');
    console.log('Match:', result === 'Show, 5 treinos!');
    
    expect(result).toBe('Show, 5 treinos!');
  });

  it('deve funcionar com variável salva por ID e por nome', () => {
    const text = 'Show, {{Quantidade de treinos}} treinos!';
    const variables = {
      'v1': '5',  // Salvo por ID
      'Quantidade de treinos': '5'  // Salvo por nome
    };
    
    const result = interpolateVariables(text, variables);
    expect(result).toBe('Show, 5 treinos!');
  });

  it('deve falhar se variável estiver apenas por ID', () => {
    const text = 'Show, {{Quantidade de treinos}} treinos!';
    const variables = {
      'v1': '5'  // Apenas por ID
    };
    
    const result = interpolateVariables(text, variables);
    
    console.log('=== TESTE FALHA ESPERADA ===');
    console.log('Result:', result);
    console.log('Should keep original:', result === text);
    
    // Deve manter o texto original pois não encontrou a variável
    expect(result).toBe('Show, {{Quantidade de treinos}} treinos!');
  });

  it('deve mostrar o que está acontecendo no hook', () => {
    // Simular o que o hook faz
    const variableId = 'v1';
    const variableName = 'Quantidade de treinos';
    const value = '5';
    
    const variables: Record<string, any> = {};
    variables[variableId] = value;
    variables[variableName] = value;
    
    console.log('=== SIMULAÇÃO DO HOOK ===');
    console.log('Variables após addResponse:', variables);
    
    const text = 'Show, {{Quantidade de treinos}} treinos!';
    const result = interpolateVariables(text, variables);
    
    console.log('Text:', text);
    console.log('Result:', result);
    
    expect(result).toBe('Show, 5 treinos!');
    expect(variables).toHaveProperty('Quantidade de treinos');
    expect(variables['Quantidade de treinos']).toBe('5');
  });
});
