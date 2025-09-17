import { CandleService } from '@/candle/candle.service';
import { Injectable, Logger } from '@nestjs/common';
import { Candle } from '@prisma/client';

import {
  SMA,
  EMA,
  RSI,
  MACD,
  BollingerBands,
  ATR,
  ADX,
  Stochastic,
  OBV,
} from 'technicalindicators';
import { IndicatorsResult } from './type';
import { PrismaService } from '@/prisma.service';
import { InputJsonValue } from '@prisma/client/runtime/library';

@Injectable()
export class IndicatorsService {
  private readonly logger = new Logger(IndicatorsService.name);

  constructor(
    private readonly candleService: CandleService,
    private readonly prisma: PrismaService,
  ) {}

  /**
   * Calcula todos los indicadores posibles con las últimas N velas
   */
  async calculateAll(
    symbol: string,
    interval: string,
    limit = 1000,
    candles?: Candle[],
  ): Promise<IndicatorsResult | null> {
    const dataset =
      candles ??
      (await this.candleService.getLastCandles(symbol, interval, limit));

    if (!dataset.length) {
      this.logger.warn(`No hay velas para ${symbol} ${interval}`);
      return null;
    }

    // Arrays en orden ascendente (requerido por technicalindicators)
    const closes = dataset.map((c) => Number(c.close)).reverse();
    const highs = dataset.map((c) => Number(c.high)).reverse();
    const lows = dataset.map((c) => Number(c.low)).reverse();
    const volumes = dataset.map((c) => Number(c.volume)).reverse();

    // ===============================
    // 📊 Indicadores de tendencia
    // ===============================
    const sma20 = SMA.calculate({ values: closes, period: 20 });
    const ema20 = EMA.calculate({ values: closes, period: 20 });
    const rsi14 = RSI.calculate({ values: closes, period: 14 });

    const macd = MACD.calculate({
      values: closes,
      fastPeriod: 12,
      slowPeriod: 26,
      signalPeriod: 9,
      SimpleMAOscillator: false,
      SimpleMASignal: false,
    });

    // ===============================
    // 📊 Volatilidad
    // ===============================
    const bb20 = BollingerBands.calculate({
      values: closes,
      period: 20,
      stdDev: 2,
    });

    const atr14 = ATR.calculate({
      high: highs,
      low: lows,
      close: closes,
      period: 14,
    });

    const adx14 = ADX.calculate({
      high: highs,
      low: lows,
      close: closes,
      period: 14,
    });

    // ===============================
    // 📊 Osciladores
    // ===============================
    const stochastic14 = Stochastic.calculate({
      high: highs,
      low: lows,
      close: closes,
      period: 14,
      signalPeriod: 3,
    });

    // ===============================
    // 📊 Volumen
    // ===============================
    const obv = OBV.calculate({ close: closes, volume: volumes });

    // ===============================
    // 📊 Resultado
    // ===============================

    //insertamos

    const result = {
      sma20: sma20.at(-1),
      ema20: ema20.at(-1),
      rsi14: rsi14.at(-1),
      macd: macd.at(-1),
      bollinger: bb20.at(-1),
      atr14: atr14.at(-1),
      adx14: adx14.at(-1),
      stochastic: stochastic14.at(-1),
      obv: obv.at(-1),
      close: closes.at(-1),
    };

    await this.prisma.indicator.create({
      data: {
        symbol,
        interval,
        sma20: result.sma20 ?? undefined,
        ema20: result.ema20 ?? undefined,
        rsi14: result.rsi14 ?? undefined,
        macd: (result.macd as unknown as InputJsonValue) ?? undefined,
        bollinger: (result.bollinger as unknown as InputJsonValue) ?? undefined,
        atr14: result.atr14 ?? undefined,
        adx14: (result.adx14 as unknown as InputJsonValue) ?? undefined,
        stochastic:
          (result.stochastic as unknown as InputJsonValue) ?? undefined,
        obv: result.obv ?? undefined,
        close: result.close ?? undefined,
      },
    });

    return result;
  }
}
