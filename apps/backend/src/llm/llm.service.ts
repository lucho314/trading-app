import { Injectable, Logger } from '@nestjs/common';
import { openai } from '@ai-sdk/openai';
import { generateObject } from 'ai';
import { LlmPayload } from '@/analysis/type';
import { LlmDecision } from './type';
import z from 'zod';
import { PositionSummary } from '@/bybit/type';
import { TradingSignalsService } from '@/trading-signals/trading-signals.service';

export const LlmDecisionSchema = z.object({
  action: z.enum([
    'SHORT',
    'LONG',
    'HOLD',
    'WAIT',
    'ADD',
    'CLOSE',
    'MOVE_SL',
    'TAKE_PROFIT',
  ]),
  confidence: z.number().min(0).max(100),
  entryPrice: z.number(),
  stopLoss: z.number(),
  takeProfit: z.number(),
  rrRatio: z.number(),
  symbol: z.string(),
});

@Injectable()
export class LlmService {
  private readonly logger = new Logger(LlmService.name);
  async analyze(
    payload: LlmPayload,
    openPosition: PositionSummary | null,
  ): Promise<LlmDecision | null> {
    let systemPrompt = `
    Eres un analista de trading muy arriesgado con 10+ años en mercados cripto (apalancamiento 3-5X).
    Tu objetivo es identificar oportunidades de entrada con alto potencial risk/reward en timeframe 4H.
    Recibirás un JSON con datos de mercado.
    
    Debes decidir UNA acción de trading entre:
    - SHORT
    - LONG
    - HOLD
    - WAIT
    - ADD
    - CLOSE
    - MOVE_SL
    - TAKE_PROFIT
    
    **PERFIL DE RIESGO**: 'Agresivo pero calculado. Toma posiciones cuando la probabilidad sea favorable, pero mantén gestión de riesgo estricta. 
    Busca RR ratio mínimo 2:1. Usa stop loss ajustados para limitar pérdidas. Prioriza setups con alta probabilidad de éxito basado en análisis técnico y patrones históricos.'
  `;

    if (openPosition) {
      systemPrompt += `
      ⚠️ Ya existe una posición abierta con los siguientes datos:
      - Símbolo: ${openPosition.symbol}
      - Lado: ${openPosition.side}
      - Entrada: ${openPosition.entryPrice}
      - Precio actual: ${openPosition.markPrice}
      - Tamaño: ${openPosition.size}
      - PnL no realizado: ${openPosition.unrealisedPnl}
      - TP: ${openPosition.takeProfit ?? 'no definido'}
      - SL: ${openPosition.stopLoss ?? 'no definido'}
      
      En este caso, tu decisión debe estar enfocada en la GESTIÓN DE LA POSICIÓN existente.
      Elige para la action: HOLD, CLOSE, MOVE_SL, TAKE_PROFIT o ADD.
    `;
    }

    systemPrompt += `
    Responde SOLO con un JSON que siga este esquema EXACTO:
    {
      action: 'SHORT' | 'LONG' | 'HOLD' | 'WAIT' | 'ADD' | 'CLOSE' | 'MOVE_SL' | 'TAKE_PROFIT',
      confidence: number (0-100),
      entryPrice: number (precio sugerido de entrada),
      stopLoss: number (precio sugerido de stop loss),
      takeProfit: number (precio sugerido de take profit),
      rrRatio: number (risk/reward ratio calculado, mínimo 2.0),
      symbol: string (símbolo asociado, ej. 'BTCUSDT')
    }
    Asegúrate que los precios de entryPrice, stopLoss y takeProfit sean REALISTAS y alcanzables según los datos de mercado proporcionados.
    Si no hay una oportunidad clara, elige 'WAIT' con baja confianza.
    `;

    console.log('Payload LLM:', JSON.stringify(payload, null, 2));

    try {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-ignore
      const { object } = await generateObject({
        model: openai('gpt-5-mini'), // ⚡ rápido y barato
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
