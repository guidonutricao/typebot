import { UserResponse } from "@/types/flow";

export interface WebhookPayload {
  responses: UserResponse[];
  timestamp: string;
  flowName: string;
}

// Valida se a URL é segura e válida
const isValidWebhookUrl = (url: string): boolean => {
  try {
    const parsed = new URL(url);
    // Apenas permite HTTP e HTTPS
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
};

export const sendToWebhook = async (
  webhookUrl: string,
  payload: WebhookPayload
): Promise<boolean> => {
  // Validação de URL antes de enviar
  if (!isValidWebhookUrl(webhookUrl)) {
    console.error('URL de webhook inválida ou insegura:', webhookUrl);
    return false;
  }

  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      console.error('Webhook retornou erro:', response.status, response.statusText);
    }

    return response.ok;
  } catch (error) {
    console.error('Erro ao enviar para webhook:', error);
    return false;
  }
};
