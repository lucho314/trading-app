export interface LlmDecision {
  action: 'SHORT' | 'LONG' | 'HOLD' | 'WAIT';
  confidence: number; // porcentaje 0-100
  entryPrice: number;
  stopLoss: number;
  takeProfit: number;
  rrRatio: number;
}
