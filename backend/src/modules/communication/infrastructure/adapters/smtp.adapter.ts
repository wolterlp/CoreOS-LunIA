import nodemailer from 'nodemailer';
import { CommunicationAdapter } from '../../domain/communication-adapter.port';
import { Message } from '../../domain/message.entity';
import { config } from '../../../../config';
import { ConfigService } from '../../../../shared/infrastructure/config.service';

export class SmtpAdapter implements CommunicationAdapter {
  private transporter: nodemailer.Transporter | null = null;

  constructor() {
    this.init();
  }

  private async init() {
    const configService = ConfigService.getInstance();
    const host = await configService.get('SMTP_HOST') || config.communication.email.host;
    const port = Number(await configService.get('SMTP_PORT')) || config.communication.email.port;
    const user = await configService.get('SMTP_USER') || config.communication.email.user;
    const pass = await configService.get('SMTP_PASS') || config.communication.email.pass;

    if (host && port && user && pass) {
      this.transporter = nodemailer.createTransport({
        host,
        port,
        secure: port === 465,
        auth: { user, pass },
      });
    }
  }

  async send(message: Message): Promise<{ success: boolean; externalId?: string; error?: string }> {
    if (!this.transporter) {
      await this.init();
    }
    if (!this.transporter) {
      return { success: false, error: 'SMTP not configured' };
    }

    try {
      const info = await this.transporter.sendMail({
        from: config.communication.email.from || `"${config.server.appName}" <noreply@cerebro.com>`,
        to: message.metadata?.to || '', // metadata should contain destination
        subject: message.metadata?.subject || `Mensaje de ${config.server.appName}`,
        text: message.content,
      });

      return { success: true, externalId: info.messageId };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }
}
