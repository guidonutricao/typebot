/**
 * Extrai variáveis de um fluxo Typebot
 * Busca por padrões {{variavel}} em todo o fluxo
 */

import { FlowData } from '@/types/flow';

export const extractVariablesFromFlow = (flowData: FlowData): string[] => {
  const variables = new Set<string>();
  const variableRegex = /\{\{([^}]+)\}\}/g;

  const extractFromString = (text: string) => {
    const matches = text.matchAll(variableRegex);
    for (const match of matches) {
      const variable = match[1].trim();
      if (variable) {
        variables.add(variable);
      }
    }
  };

  const extractFromObject = (obj: any) => {
    if (!obj || typeof obj !== 'object') return;

    if (typeof obj === 'string') {
      extractFromString(obj);
      return;
    }

    if (Array.isArray(obj)) {
      obj.forEach(item => extractFromObject(item));
      return;
    }

    Object.values(obj).forEach(value => {
      if (typeof value === 'string') {
        extractFromString(value);
      } else if (typeof value === 'object') {
        extractFromObject(value);
      }
    });
  };

  // Extrai variáveis de todos os grupos e blocos
  if (flowData.groups) {
    extractFromObject(flowData.groups);
  }

  // Extrai variáveis das edges
  if (flowData.edges) {
    extractFromObject(flowData.edges);
  }

  // Extrai variáveis das variáveis definidas
  if (flowData.variables) {
    flowData.variables.forEach((variable) => {
      if (variable.name) {
        variables.add(variable.name);
      }
    });
  }

  return Array.from(variables).sort();
};

export const getVariableValue = (
  responses: Record<string, any>,
  variableName: string
): string => {
  const value = responses[variableName];
  
  if (value === null || value === undefined) {
    return '';
  }
  
  if (typeof value === 'object') {
    return JSON.stringify(value);
  }
  
  return String(value);
};
