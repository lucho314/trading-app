// apps/backend/src/test-llm.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { LlmService } from './llm/llm.service';
import { LlmPayload } from './analysis/type';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const llm = app.get(LlmService);

  // Payload de prueba (mock)
  const payload: LlmPayload = {
    symbol: 'BTCUSDT',
    interval: '240',
    timeframe: 'last 4h',
    currentPrice: 945,
    high: 960,
    low: 920,
    changePercent: 2.3,
    indicators: {
      sma20: 940,
      ema20: 942,
      rsi14: 65,
      macd: { MACD: 1.2, signal: 0.8, histogram: 0.4 },
      bollinger: { lower: 910, middle: 940, upper: 970, pb: 0.6 },
      atr14: 15,
      adx14: { adx: 28, mdi: 18, pdi: 25 },
      stochastic: { k: 70, d: 68 },
      obv: 120000,
      close: 945,
    },
    history: {
      rsi14: [60, 62, 63, 65],
      macd: [
        { MACD: 0.8, signal: 0.6, histogram: 0.2 },
        { MACD: 1.0, signal: 0.7, histogram: 0.3 },
      ],
      last10: [],
    },
  };

  const decision = await llm.analyze(payload);
  console.log('📊 LLM Decision:', decision);

  await app.close();
}

bootstrap().catch((err) => {
  console.error('❌ Error en test-llm:', err);
});
