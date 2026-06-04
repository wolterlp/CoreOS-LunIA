import { CommunicationAdapter } from '../../domain/communication-adapter.port';
import { Message } from '../../domain/message.entity';
import { SmtpAdapter } from './smtp.adapter';
import { TelegramAdapter } from './telegram.adapter';

export class CommunicationProviderFactory {
  private static adapters: Record<string, CommunicationAdapter> = {
    'EMAIL': new SmtpAdapter(),
    'TELEGRAM': new TelegramAdapter(),
  };

  static getAdapter(channel: string): CommunicationAdapter {
    const adapter = this.adapters[channel];
    if (!adapter) {
      // Fallback or No-op adapter if preferred
      return {
        send: async () => ({ success: false, error: `No adapter implemented for channel ${channel}` })
      };
    }
    return adapter;
  }
}
