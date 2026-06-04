
import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.string().transform(Number).default('3000' as any),
  DATABASE_URL: z.string(),
  JWT_SECRET: z.string(),
  JWT_EXPIRES_IN: z.string().default('7d'),
  OPENAI_API_KEY: z.string().optional(),
  GEMINI_API_KEY: z.string().optional(),
  ANTHROPIC_API_KEY: z.string().optional(),
  COREDB_PATH: z.string().optional(),
});

const envVars = envSchema.safeParse(process.env);

if (!envVars.success) {
  console.error('❌ Invalid environment variables:', envVars.error.format());
  throw new Error('Invalid environment variables');
}

export const config = {
  env: envVars.data.NODE_ENV,
  port: envVars.data.PORT,
  db: {
    url: envVars.data.DATABASE_URL,
  },
  jwt: {
    secret: envVars.data.JWT_SECRET,
    expiresIn: envVars.data.JWT_EXPIRES_IN,
  },
  ai: {
    openai: envVars.data.OPENAI_API_KEY,
    gemini: envVars.data.GEMINI_API_KEY,
    anthropic: envVars.data.ANTHROPIC_API_KEY,
  },
  coreDb: {
    path: envVars.data.COREDB_PATH || undefined,
  },
};

