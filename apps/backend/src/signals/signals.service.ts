import { Injectable } from '@nestjs/common';
import { TradingSignal } from './type';
import { IndicatorsResult } from '@/indicators/type';

@Injectable()
export class SignalsService {
  evaluateIndicators(ind: IndicatorsResult): TradingSignal[] {
    if (!ind) return [];

    const signals: TradingSignal[] = [];

    signals.push(...this.evaluateRsi(ind));
    signals.push(...this.evaluateSmaEma(ind));
    signals.push(...this.evaluateMacd(ind));
    signals.push(...this.evaluateBollinger(ind));
    signals.push(...this.evaluateAtr(ind));
    signals.push(...this.evaluateAdx(ind));
    signals.push(...this.evaluateStochastic(ind));
    signals.push(...this.evaluateObv(ind));

    return signals;
  }

  private evaluateRsi(ind: IndicatorsResult): TradingSignal[] {
    if (ind.rsi14 === undefined) return [];
    if (ind.rsi14 < 30) {
      return [
        {
          type: 'RSI Oversold',
          strength: 'potential',
          details: { value: ind.rsi14 },
        },
      ];
    }
    if (ind.rsi14 > 70) {
      return [
        {
          type: 'RSI Overbought',
          strength: 'potential',
          details: { value: ind.rsi14 },
        },
      ];
    }
    return [
      { type: 'RSI Neutral', strength: 'weak', details: { value: ind.rsi14 } },
    ];
  }

  private evaluateSmaEma(ind: IndicatorsResult): TradingSignal[] {
    if (!ind.sma20 || !ind.ema20) return [];
    if (ind.ema20 > ind.sma20) {
      return [
        {
          type: 'EMA above SMA (bullish short-term)',
          strength: 'potential',
          details: { sma20: ind.sma20, ema20: ind.ema20 },
        },
      ];
    }
    return [
      {
        type: 'EMA below SMA (bearish short-term)',
        strength: 'weak',
        details: { sma20: ind.sma20, ema20: ind.ema20 },
      },
    ];
  }

  private evaluateMacd(ind: IndicatorsResult): TradingSignal[] {
    if (!ind.macd) return [];
    const { MACD, signal, histogram } = ind.macd;
    if (MACD === undefined || signal === undefined || histogram === undefined)
      return [];
    if (MACD > signal && histogram > 0) {
      return [
        {
          type: 'MACD Bullish Crossover',
          strength: 'potential',
          details: { MACD, signal, histogram },
        },
      ];
    }
    if (MACD < signal && histogram < 0) {
      return [
        {
          type: 'MACD Bearish Crossover',
          strength: 'potential',
          details: { MACD, signal, histogram },
        },
      ];
    }
    return [
      {
        type: 'MACD Neutral',
        strength: 'weak',
        details: { MACD, signal, histogram },
      },
    ];
  }

  private evaluateBollinger(ind: IndicatorsResult): TradingSignal[] {
    if (!ind.bollinger) return [];
    const { lower, upper } = ind.bollinger;
    const price = ind.close ?? ind.sma20;
    if (price && price > upper) {
      return [
        {
          type: 'Price above Bollinger Upper Band (overbought)',
          strength: 'potential',
          details: ind.bollinger,
        },
      ];
    }
    if (price && price < lower) {
      return [
        {
          type: 'Price below Bollinger Lower Band (oversold)',
          strength: 'potential',
          details: ind.bollinger,
        },
      ];
    }
    return [
      {
        type: 'Price inside Bollinger Bands',
        strength: 'weak',
        details: ind.bollinger,
      },
    ];
  }

  private evaluateAtr(ind: IndicatorsResult): TradingSignal[] {
    if (!ind.atr14) return [];
    return [
      {
        type: 'ATR Volatility',
        strength: 'weak',
        details: { atr14: ind.atr14 },
      },
    ];
  }

  private evaluateAdx(ind: IndicatorsResult): TradingSignal[] {
    if (!ind.adx14) return [];
    const { adx, mdi, pdi } = ind.adx14;
    if (adx > 25) {
      if (pdi > mdi) {
        return [
          {
            type: 'ADX Strong Uptrend',
            strength: 'potential',
            details: ind.adx14,
          },
        ];
      }
      return [
        {
          type: 'ADX Strong Downtrend',
          strength: 'potential',
          details: ind.adx14,
        },
      ];
    }
    return [{ type: 'ADX Weak Trend', strength: 'weak', details: ind.adx14 }];
  }

  private evaluateStochastic(ind: IndicatorsResult): TradingSignal[] {
    if (!ind.stochastic) return [];
    const { k, d } = ind.stochastic;
    if (k > 80 && d > 80) {
      return [
        {
          type: 'Stochastic Overbought',
          strength: 'potential',
          details: ind.stochastic,
        },
      ];
    }
    if (k < 20 && d < 20) {
      return [
        {
          type: 'Stochastic Oversold',
          strength: 'potential',
          details: ind.stochastic,
        },
      ];
    }
    return [
      { type: 'Stochastic Neutral', strength: 'weak', details: ind.stochastic },
    ];
  }

  private evaluateObv(ind: IndicatorsResult): TradingSignal[] {
    if (!ind.obv) return [];
    return [
      { type: 'OBV Activity', strength: 'weak', details: { obv: ind.obv } },
    ];
  }

  shouldCallModel(ind: IndicatorsResult): boolean {
    const signals = this.evaluateIndicators(ind);

    // Filtramos solo los "principales"
    const primarySignals = signals.filter((s) =>
      [
        'RSI Oversold',
        'RSI Overbought',
        'MACD Bullish Crossover',
        'MACD Bearish Crossover',
        'Price above Bollinger Upper Band (overbought)',
        'Price below Bollinger Lower Band (oversold)',
        'ADX Strong Uptrend',
        'ADX Strong Downtrend',
      ].includes(s.type),
    );

    // Solo si hay alguna señal "potencial" en los principales → llamamos al LLM
    return primarySignals.some((s) => s.strength === 'potential');
  }
}
