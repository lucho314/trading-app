import { NestFactory } from '@nestjs/core';
import { BybitService } from '../src/bybit/bybit.service';
import { CandleService } from '../src/candle/candle.service';
import { AppModule } from '../src/app.module';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);

  const bybitService = app.get(BybitService);
  const candleService = app.get(CandleService);

  const symbol = 'BTCUSDT';
  const interval = 240; // 240 minutos = 4h

  console.log(`🚀 Seed: obteniendo velas de ${symbol} (${interval}m) ...`);
  const candles = await bybitService.getCandles(symbol, interval);

  console.log(`📥 Insertando ${candles.length} velas en la DB...`);
  await candleService.initialize(candles, symbol, `${interval}`);

  console.log(`✅ Seed completado`);
  await app.close();
}

bootstrap().catch((err) => {
  console.error('❌ Seed error', err);
  process.exit(1);
});
