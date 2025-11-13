import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  saveFormFile,
  getFormMeta,
  getFileEntry,
  updatePublishStatus,
  deleteForm,
  base64ToString,
  generateId,
} from '../formStorage';

describe('formStorage', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  describe('generateId', () => {
    it('deve gerar IDs únicos', () => {
      const id1 = generateId();
      const id2 = generateId();
      
      expect(id1).toMatch(/^flow_\d+_[a-z0-9]+$/);
      expect(id2).toMatch(/^flow_\d+_[a-z0-9]+$/);
      expect(id1).not.toBe(id2);
    });
  });

  describe('base64ToString', () => {
    it('deve decodificar base64 corretamente', () => {
      const text = 'Hello World';
      const base64 = btoa(text);
      
      expect(base64ToString(base64)).toBe(text);
    });

    it('deve lançar erro para base64 inválido', () => {
      expect(() => base64ToString('invalid!@#$')).toThrow();
    });
  });

  describe('saveFormFile', () => {
    it('deve salvar arquivo e retornar metadados', async () => {
      const content = JSON.stringify({ groups: [], edges: [] });
      const file = new File([content], 'test.json', { type: 'application/json' });
      
      const meta = await saveFormFile(file, 'Test Flow');
      
      expect(meta.id).toMatch(/^flow_/);
      expect(meta.name).toBe('Test Flow');
      expect(meta.isPublished).toBe(false);
      expect(meta.filePath).toContain('/storage/forms/');
    });

    it('deve usar ID existente quando fornecido', async () => {
      const content = JSON.stringify({ groups: [] });
      const file = new File([content], 'test.json', { type: 'application/json' });
      const existingId = 'flow_test_123';
      
      const meta = await saveFormFile(file, 'Test', existingId);
      
      expect(meta.id).toBe(existingId);
    });
  });

  describe('getFormMeta', () => {
    it('deve retornar null para ID inexistente', () => {
      const meta = getFormMeta('nonexistent');
      expect(meta).toBeNull();
    });

    it('deve retornar metadados salvos', async () => {
      const file = new File(['{}'], 'test.json', { type: 'application/json' });
      const saved = await saveFormFile(file, 'Test');
      
      const meta = getFormMeta(saved.id);
      
      expect(meta).not.toBeNull();
      expect(meta?.id).toBe(saved.id);
      expect(meta?.name).toBe('Test');
    });
  });

  describe('updatePublishStatus', () => {
    it('deve atualizar status de publicação', async () => {
      const file = new File(['{}'], 'test.json', { type: 'application/json' });
      const meta = await saveFormFile(file, 'Test');
      
      const result = updatePublishStatus(meta.id, true);
      
      expect(result).toBe(true);
      
      const updated = getFormMeta(meta.id);
      expect(updated?.isPublished).toBe(true);
    });

    it('deve retornar false para ID inexistente', () => {
      const result = updatePublishStatus('nonexistent', true);
      expect(result).toBe(false);
    });
  });

  describe('deleteForm', () => {
    it('deve remover formulário completamente', async () => {
      const file = new File(['{}'], 'test.json', { type: 'application/json' });
      const meta = await saveFormFile(file, 'Test');
      
      const result = deleteForm(meta.id);
      
      expect(result).toBe(true);
      expect(getFormMeta(meta.id)).toBeNull();
      expect(getFileEntry(meta.id)).toBeNull();
    });
  });

  describe('localStorage quota', () => {
    it('deve lidar com erro de quota excedida', async () => {
      // Mock localStorage.setItem para simular quota excedida
      const originalSetItem = Storage.prototype.setItem;
      Storage.prototype.setItem = vi.fn(() => {
        throw new DOMException('QuotaExceededError');
      });

      const largeContent = 'x'.repeat(10 * 1024 * 1024); // 10MB
      const file = new File([largeContent], 'large.json', { type: 'application/json' });
      
      await expect(saveFormFile(file, 'Large')).rejects.toThrow();
      
      Storage.prototype.setItem = originalSetItem;
    });
  });
});
