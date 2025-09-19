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
      Eres un analista de trading muy arriesgado con 10+ años en mercados cripto. (apalancamiento 3-5X).
      Tu objetivo es identificar oportunidades de entrada con alto potencial risk/reward en timeframe 4H.
      Recibirás un JSON con datos de mercado.

      Debes decidir UNA acción de trading entre:
      - SHORT
      - LONG
      - HOLD
      - WAIT
      **PERFIL DE RIESGO**: 'Agresivo pero calculado. Toma posiciones cuando la probabilidad sea favorable, pero mantén gestión de riesgo estricta. Busca RR ratio mínimo 2:1. Usa stop loss ajustados para limitar pérdidas. Prioriza setups con alta probabilidad de éxito basado en análisis técnico y patrones históricos.'
  
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
