import { describe, it, expect, vi, beforeEach } from 'vitest';
import { sendToWebhook, WebhookPayload } from '../webhookSender';

describe('webhookSender', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    global.fetch = vi.fn();
  });

  const mockPayload: WebhookPayload = {
    responses: [
      { blockId: '1', value: 'test', variableId: 'var1' }
    ],
    timestamp: new Date().toISOString(),
    flowName: 'Test Flow',
  };

  describe('sendToWebhook', () => {
    it('deve enviar payload com sucesso', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        status: 200,
      });

      const result = await sendToWebhook('https://example.com/webhook', mockPayload);

      expect(result).toBe(true);
      expect(global.fetch).toHaveBeenCalledWith(
        'https://example.com/webhook',
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(mockPayload),
        })
      );
    });

    it('deve retornar false em caso de erro HTTP', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: false,
        status: 500,
      });

      const result = await sendToWebhook('https://example.com/webhook', mockPayload);

      expect(result).toBe(false);
    });

    it('deve retornar false em caso de erro de rede', async () => {
      (global.fetch as any).mockRejectedValueOnce(new Error('Network error'));

      const result = await sendToWebhook('https://example.com/webhook', mockPayload);

      expect(result).toBe(false);
    });

    it('deve validar URL antes de enviar', async () => {
      // BUG: Atualmente não valida URL
      const invalidUrls = [
        'not-a-url',
        'javascript:alert(1)',
        'file:///etc/passwd',
      ];

      for (const url of invalidUrls) {
        const result = await sendToWebhook(url, mockPayload);
        // Deveria retornar false para URLs inválidas
        expect(result).toBe(false);
      }
    });
  });
});
