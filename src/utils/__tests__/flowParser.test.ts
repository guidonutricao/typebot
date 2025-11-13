import { describe, it, expect } from 'vitest';
import { parseFlowString, validateFlowData } from '../flowParser';

describe('flowParser', () => {
  const validFlowData = {
    name: 'Test Flow',
    groups: [
      {
        id: 'group1',
        blocks: [
          { id: 'block1', type: 'text', content: { richText: [] } }
        ]
      }
    ],
    edges: [],
    variables: [],
  };

  describe('parseFlowString', () => {
    it('deve parsear JSON válido', async () => {
      const content = JSON.stringify(validFlowData);
      const result = await parseFlowString(content, 'test.json');

      expect(result.data).not.toBeNull();
      expect(result.data?.name).toBe('Test Flow');
      expect(result.error).toBeUndefined();
    });

    it('deve retornar erro para JSON inválido', async () => {
      const content = '{ invalid json }';
      const result = await parseFlowString(content, 'test.json');

      expect(result.data).toBeNull();
      expect(result.error).toBeDefined();
    });

    it('deve rejeitar fluxo sem groups', async () => {
      const invalidFlow = { name: 'Test' };
      const content = JSON.stringify(invalidFlow);
      const result = await parseFlowString(content, 'test.json');

      expect(result.data).toBeNull();
      expect(result.error).toContain('groups');
    });

    it('deve extrair nome do fluxo', async () => {
      const content = JSON.stringify(validFlowData);
      const result = await parseFlowString(content, 'test.json');

      expect(result.nameFromFlow).toBe('Test Flow');
    });
  });

  describe('validateFlowData', () => {
    it('deve validar fluxo correto', () => {
      const result = validateFlowData(validFlowData);
      expect(result.valid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('deve rejeitar fluxo sem groups', () => {
      const result = validateFlowData({ name: 'Test' });
      expect(result.valid).toBe(false);
      expect(result.error).toBeDefined();
    });

    it('deve rejeitar fluxo com groups vazio', () => {
      const result = validateFlowData({ groups: [] });
      expect(result.valid).toBe(false);
      expect(result.error).toContain('grupos');
    });

    it('deve rejeitar fluxo sem blocos', () => {
      const invalidFlow = {
        groups: [{ id: 'g1', blocks: [] }],
      };
      const result = validateFlowData(invalidFlow);
      expect(result.valid).toBe(false);
      expect(result.error).toContain('blocos');
    });
  });
});
