export interface LlmDecision {
  action:
    | 'SHORT'
    | 'LONG'
    | 'HOLD'
    | 'WAIT'
    | 'ADD'
    | 'CLOSE'
    | 'MOVE_SL'
    | 'TAKE_PROFIT';
  confidence: number; // porcentaje 0-100
  entryPrice: number;
  stopLoss: number;
  takeProfit: number;
  rrRatio: number;
  symbol?: string; // Opcional, puede añadirse para registrar el símbolo asociado
}
