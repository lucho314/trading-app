import { Injectable, Logger } from '@nestjs/common';
import { openai } from '@ai-sdk/openai';
import { generateText } from 'ai';
import { LlmPayload } from '@/analysis/type';
import { LlmDecision } from './type';

@Injectable()
export class LlmService {
  private readonly logger = new Logger(LlmService.name);

  async analyze(payload: LlmPayload): Promise<LlmDecision | null> {
    const systemPrompt = `
      Eres un analista de trading muy arriesgado (apalancamiento 3-5X).
      Recibirás un JSON con los siguientes datos:

      - symbol: par de trading (ej: BTCUSDT).
      - interval: intervalo en minutos (ej: 240 para 4h).
      - timeframe: descripción del rango de tiempo.
      - currentPrice: último precio de cierre.
      - high: precio máximo del rango.
      - low: precio mínimo del rango.
      - changePercent: variación porcentual en el rango.
      - indicators: valores técnicos (SMA20, EMA20, RSI14, MACD, Bollinger, ATR14, ADX, Stochastic, OBV, etc).
      - signals: lista de señales clasificadas como 'potential' o 'weak' con sus detalles.
      - history: últimos cálculos de indicadores (ej: rsi14, macd, últimos 10 registros).

      Con toda esa información, decide UNA acción de trading entre:
      - SHORT
      - LONG
      - HOLD
      - WAIT

      Responde siempre en JSON válido con este formato exacto:

      {
        "action": "SHORT | LONG | HOLD | WAIT",
        "confidence": 0-100,
        "entryPrice": number,
        "stopLoss": number,
        "takeProfit": number,
        "rrRatio": number
      }

      No devuelvas explicación, solo el JSON.
      `;

    try {
      const { text } = await generateText({
        model: openai('gpt-4o-mini'), // ⚡ rápido y barato
        system: systemPrompt,
        prompt: JSON.stringify(payload),
        temperature: 0.6,
      });

      const parsed = JSON.parse(text) as LlmDecision;
      return parsed;
    } catch (error) {
      this.logger.error(`❌ Error analizando con LLM: ${error}`);
      return null;
    }
  }
}
