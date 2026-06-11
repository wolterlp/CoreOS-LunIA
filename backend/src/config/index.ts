
import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
  // Server
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.string().transform(Number).default('3000' as any),
  APP_NAME: z.string().default('Cerebro Empresarial IA'),
  FRONTEND_URL: z.string().url().default('http://localhost:5173'),

  // DB
  DATABASE_URL: z.string(),

  // Auth
  JWT_SECRET: z.string(),
  JWT_EXPIRES_IN: z.string().default('7d'),
  DEFAULT_ADMIN_EMAIL: z.string().email().optional(),

  // AI
  OPENAI_API_KEY: z.string().optional(),
  GEMINI_API_KEY: z.string().optional(),
  ANTHROPIC_API_KEY: z.string().optional(),
  COREDB_PATH: z.string().optional(),
  AI_DEFAULT_MODEL: z.string().default('gpt-4o'),
  AI_MAX_TOKENS: z.string().transform(Number).default('2048' as any),

  // Communication - Email
  SMTP_HOST: z.string().optional(),
  SMTP_PORT: z.string().transform(Number).optional(),
  SMTP_USER: z.string().optional(),
  SMTP_PASS: z.string().optional(),
  SMTP_FROM: z.string().optional(),

  // Communication - Telegram
  TELEGRAM_BOT_TOKEN: z.string().optional(),

  // Communication - WhatsApp
  WHATSAPP_API_KEY: z.string().optional(),
  WHATSAPP_PHONE_NUMBER_ID: z.string().optional(),

  // Communication - Slack
  SLACK_WEBHOOK_URL: z.string().optional(),
});

const envVars = envSchema.safeParse(process.env);

if (!envVars.success) {
  console.error('❌ Invalid environment variables:', JSON.stringify(envVars.error.format(), null, 2));
  // In development, we might want to continue even with some missing non-critical vars
  if (process.env.NODE_ENV === 'production') {
    throw new Error('Invalid environment variables');
  }
}

const data = envVars.success ? envVars.data : ({} as any);

export const config = {
  server: {
    env: data.NODE_ENV || 'development',
    port: data.PORT || 3000,
    appName: data.APP_NAME || 'Cerebro Empresarial IA',
    frontendUrl: data.FRONTEND_URL || 'http://localhost:5173',
  },
  db: {
    url: data.DATABASE_URL,
  },
  jwt: {
    secret: data.JWT_SECRET,
    expiresIn: data.JWT_EXPIRES_IN || '7d',
  },
  admin: {
    defaultEmail: data.DEFAULT_ADMIN_EMAIL,
  },
  ai: {
    openai: data.OPENAI_API_KEY,
    gemini: data.GEMINI_API_KEY,
    anthropic: data.ANTHROPIC_API_KEY,
    defaultModel: data.AI_DEFAULT_MODEL,
    maxTokens: data.AI_MAX_TOKENS,
  },
  coreDb: {
    path: data.COREDB_PATH || undefined,
  },
  communication: {
    email: {
      host: data.SMTP_HOST,
      port: data.SMTP_PORT,
      user: data.SMTP_USER,
      pass: data.SMTP_PASS,
      from: data.SMTP_FROM,
    },
    telegram: {
      botToken: data.TELEGRAM_BOT_TOKEN,
    },
    whatsapp: {
      apiKey: data.WHATSAPP_API_KEY,
      phoneNumberId: data.WHATSAPP_PHONE_NUMBER_ID,
    },
    slack: {
      webhookUrl: data.SLACK_WEBHOOK_URL,
    }
  }
};
