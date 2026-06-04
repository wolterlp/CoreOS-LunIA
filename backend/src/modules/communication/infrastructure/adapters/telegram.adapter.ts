import axios from 'axios';
import { CommunicationAdapter } from '../../domain/communication-adapter.port';
import { Message } from '../../domain/message.entity';
import { config } from '../../../../config';

export class TelegramAdapter implements CommunicationAdapter {
  private readonly token: string | undefined;

  constructor() {
    this.token = config.communication.telegram.botToken;
  }

  async send(message: Message): Promise<{ success: boolean; externalId?: string; error?: string }> {
    if (!this.token) {
      return { success: false, error: 'Telegram Bot Token not configured' };
    }

    const chatId = message.metadata?.chatId;
    if (!chatId) {
      return { success: false, error: 'Chat ID missing in message metadata' };
    }

    try {
      const response = await axios.post(`https://api.telegram.org/bot${this.token}/sendMessage`, {
        chat_id: chatId,
        text: message.content,
      });

      return { success: true, externalId: response.data.result.message_id.toString() };
    } catch (error: any) {
      return { success: false, error: error.response?.data?.description || error.message };
    }
  }
}
