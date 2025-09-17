// apps/backend/src/analysis/type.ts
import { IndicatorsResult } from '@/indicators/type';

export interface LlmPayload {
  symbol: string;
  interval: string;
  timeframe: string; // ej: "last 4h"
  currentPrice: number;
  high: number;
  low: number;
  changePercent: number;
  indicators: IndicatorsResult;
  history: {
    rsi14: number[];
    macd: object[];
    last10: any[];
  };
}
