import { Injectable, Logger } from '@nestjs/common';
import { openai } from '@ai-sdk/openai';
import { generateObject } from 'ai';
import { LlmPayload } from '@/analysis/type';
import { LlmDecision } from './type';
import z from 'zod';

export const LlmDecisionSchema = z.object({
  action: z.enum(['SHORT', 'LONG', 'HOLD', 'WAIT']),
  confidence: z.number().min(0).max(100),
  entryPrice: z.number(),
  stopLoss: z.number(),
  takeProfit: z.number(),
  rrRatio: z.number(),
});

@Injectable()
export class LlmService {
  private readonly logger = new Logger(LlmService.name);

  async analyze(payload: LlmPayload): Promise<LlmDecision | null> {
    const systemPrompt = `
      Eres un analista de trading muy arriesgado (apalancamiento 3-5X).
      Recibirás un JSON con datos de mercado.

      Debes decidir UNA acción de trading entre:
      - SHORT
      - LONG
      - HOLD
      - WAIT

      ⚠️ Reglas obligatorias para los valores numéricos:
      - "entryPrice" debe estar siempre cercano a "currentPrice" (±1% como máximo).
      - Si la acción es "LONG":
        - "stopLoss" < "entryPrice"
        - "takeProfit" > "entryPrice"
      - Si la acción es "SHORT":
        - "stopLoss" > "entryPrice"
        - "takeProfit" < "entryPrice"
      - "rrRatio" = |takeProfit - entryPrice| / |entryPrice - stopLoss| (calcula o aproxima un valor coherente).
      - Todos los precios deben ser valores positivos y consistentes con el rango (entre "low" y "high").

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

    console.log('Payload LLM:', JSON.stringify(payload, null, 2));

    try {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-ignore
      const { object } = await generateObject({
        model: openai('gpt-4o-mini'), // ⚡ rápido y barato
        system: systemPrompt,
        prompt: JSON.stringify(payload),
        temperature: 0.6,
        schema: LlmDecisionSchema,
      });

      const parsed = object as LlmDecision;
      this.logger.log(`✅ Análisis LLM completado: ${JSON.stringify(parsed)}`);
      return parsed;
    } catch (error) {
      this.logger.error(`❌ Error analizando con LLM: ${error}`);
      return null;
    }
  }
}
