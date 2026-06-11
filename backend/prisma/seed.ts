import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('password123', 10);

  const user = await prisma.user.upsert({
    where: { email: 'admin@cerebro.com' },
    update: {},
    create: {
      email: 'admin@cerebro.com',
      name: 'Admin User',
      password: hashedPassword,
      role: 'ADMIN',
    },
  });

  console.log({ user });

  // Initial settings
  const settings = [
    { key: 'OPENAI_API_KEY', value: '', category: 'AI', description: 'OpenAI API Key', isSecret: true },
    { key: 'GEMINI_API_KEY', value: '', category: 'AI', description: 'Google Gemini API Key', isSecret: true },
    { key: 'ANTHROPIC_API_KEY', value: '', category: 'AI', description: 'Anthropic Claude API Key', isSecret: true },
    { key: 'SMTP_HOST', value: '', category: 'COMMUNICATION', description: 'SMTP Server Host', isSecret: false },
    { key: 'SMTP_PORT', value: '587', category: 'COMMUNICATION', description: 'SMTP Server Port', isSecret: false },
    { key: 'SMTP_USER', value: '', category: 'COMMUNICATION', description: 'SMTP Username', isSecret: false },
    { key: 'SMTP_PASS', value: '', category: 'COMMUNICATION', description: 'SMTP Password', isSecret: true },
    { key: 'TELEGRAM_BOT_TOKEN', value: '', category: 'COMMUNICATION', description: 'Telegram Bot Token', isSecret: true },
    { key: 'WHATSAPP_API_KEY', value: '', category: 'COMMUNICATION', description: 'WhatsApp API Key', isSecret: true },
    { key: 'SLACK_WEBHOOK_URL', value: '', category: 'COMMUNICATION', description: 'Slack Webhook URL', isSecret: true },
  ];

  for (const s of settings) {
    await prisma.systemSetting.upsert({
      where: { key: s.key },
      update: {},
      create: s,
    });
  }
  console.log('Default settings seeded');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
