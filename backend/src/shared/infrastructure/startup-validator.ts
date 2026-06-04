import { config } from '../../config';

export function validateStartupConfig() {
  const warnings: string[] = [];

  // AI
  if (!config.ai.openai && !config.ai.gemini && !config.ai.anthropic) {
    warnings.push('No AI provider keys (OpenAI, Gemini, Anthropic) found. AI features will fail.');
  }

  // Communication
  if (!config.communication.email.host) {
    warnings.push('SMTP not configured. Email notifications will not be sent.');
  }
  if (!config.communication.telegram.botToken) {
    warnings.push('Telegram Bot Token not configured. Telegram channel disabled.');
  }

  // Auth
  if (config.jwt.secret === 'super-secret-key-for-testing') {
    warnings.push('WARNING: Using default JWT_SECRET. Change it for production!');
  }

  if (warnings.length > 0) {
    console.log('\n--- SYSTEM STARTUP WARNINGS ---');
    warnings.forEach(w => console.warn(`⚠️  ${w}`));
    console.log('-------------------------------\n');
  } else {
    console.log('✅ System configuration validated successfully.\n');
  }
}
