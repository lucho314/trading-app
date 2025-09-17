import { ADXOutput } from 'technicalindicators/declarations/directionalmovement/ADX';
import { MACDOutput } from 'technicalindicators/declarations/moving_averages/MACD';

interface MACDResult {
  MACD: number;
  signal: number;
  histogram: number;
}

interface BollingerBandsResult {
  upper: number;
  middle: number;
  lower: number;
  pb: number;
}

interface StochasticResult {
  k: number;
  d: number;
}

interface IndicatorsResult {
  sma20: number | undefined;
  ema20: number | undefined;
  rsi14: number | undefined;
  macd: MACDOutput | undefined;
  bollinger: BollingerBandsResult | undefined;
  atr14: number | undefined;
  adx14: ADXOutput | undefined;
  stochastic: StochasticResult | undefined;
  obv: number | undefined;
  close: number | undefined;
}
