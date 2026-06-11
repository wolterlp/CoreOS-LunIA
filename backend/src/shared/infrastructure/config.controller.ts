import { Request, Response } from 'express';
import { config } from '../../config';
import { ResponseHelper } from '../response.helper';

export class ConfigController {
  static getStatus(req: Request, res: Response) {
    const status = {
      app: {
        name: config.server.appName,
        env: config.server.env,
        version: '0.2.0',
      },
      ai: {
        openai: !!config.ai.openai,
        gemini: !!config.ai.gemini,
        anthropic: !!config.ai.anthropic,
        defaultModel: config.ai.defaultModel,
      },
      communication: {
        email: !!(config.communication.email.host && config.communication.email.user),
        telegram: !!config.communication.telegram.botToken,
        whatsapp: !!config.communication.whatsapp.apiKey,
        slack: !!config.communication.slack.webhookUrl,
      },
      auth: {
        jwtConfigured: !!config.jwt.secret,
        defaultAdmin: config.admin.defaultEmail || 'Not set',
      }
    };

    ResponseHelper.success(res, status, 'Configuration status retrieved');
  }
}
