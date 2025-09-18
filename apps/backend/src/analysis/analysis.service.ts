import { IndicatorsResult } from '@/indicators/type';
import { PrismaService } from '@/prisma.service';
import { Injectable } from '@nestjs/common';
import { LlmPayload } from './type';
import { Candle } from '@prisma/client';

@Injectable()
export class AnalysisService {
  constructor(private readonly prisma: PrismaService) {}

  async buildLlmPayload(
    indicators: IndicatorsResult,
    candles: Candle[],
    symbol: string,
    interval: string,
  ): Promise<LlmPayload> {
    const closes = candles.map((c) => Number(c.close));
    const highs = candles.map((c) => Number(c.high));
    const lows = candles.map((c) => Number(c.low));

    const currentPrice = indicators.close ?? 0;
    const high = Math.max(...highs);
    const low = Math.min(...lows);

    const firstClose = closes[0] ?? currentPrice;
    const changePercent =
      firstClose !== 0 ? ((currentPrice - firstClose) / firstClose) * 100 : 0;

    // 📌 Traer últimos 10 indicadores de la DB
    const history = await this.prisma.indicator.findMany({
      where: { symbol, interval },
      orderBy: { calculatedAt: 'desc' },
      take: 10,
    });

    const rsiHistory = history
      .map((h) => h.rsi14)
      .filter((v): v is number => v !== null && v !== undefined);

    const macdHistory = history
      .map((h) => h.macd)
      .filter((v): v is object => v !== null);

    return {
      symbol,
      interval,
      timeframe: 'last 4h',
      currentPrice,
      high,
      low,
      changePercent,
      indicators,
      history: {
        rsi14: rsiHistory,
        macd: macdHistory,
        last10: history, // podés mandarlo entero si te sirve
      },
    };
  }
}
