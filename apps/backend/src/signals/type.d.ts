export interface TradingSignal {
  type: string;
  strength: 'weak' | 'potential' | 'strong';
  details: any;
}
