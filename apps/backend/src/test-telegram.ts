// apps/backend/src/test-telegram.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { TelegramService } from './telegram/telegram.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);

  const telegram = app.get(TelegramService);

  await telegram.notify({
    action: 'LONG',
    confidence: 85,
    entryPrice: 950,
    stopLoss: 930,
    takeProfit: 980,
    rrRatio: 1.5,
  });

  await app.close();
}

bootstrap().catch((err) => {
  console.error('❌ Error en test-telegram:', err);
});
