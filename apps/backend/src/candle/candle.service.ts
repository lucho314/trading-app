import { CandleDTO } from '@/bybit/type';
import { PrismaService } from '@/prisma.service';
import { Injectable, Logger } from '@nestjs/common';
import { Candle } from '@prisma/client';

import { Decimal } from '@prisma/client/runtime/library';

@Injectable()
export class CandleService {
  private readonly logger = new Logger(CandleService.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Inicializa la DB con un set de velas (ej: últimas 1000)
   */
  async initialize(candles: CandleDTO[], symbol: string, interval: string) {
    this.logger.log(
      `Inicializando ${candles.length} velas para ${symbol} (${interval})`,
    );

    for (const c of candles) {
      try {
        //truncar los datos de la tabla
        void this.prisma.$executeRaw`TRUNCATE TABLE Candle`;

        await this.prisma.candle.upsert({
          where: {
            symbol_interval_openTime: {
              symbol,
              interval,
              openTime: new Date(c.openTime),
            },
          },
          update: {}, // no actualizamos nada si ya existe
          create: {
            symbol,
            interval,
            openTime: new Date(c.openTime),
            closeTime: new Date(c.closeTime),
            open: new Decimal(c.open),
            high: new Decimal(c.high),
            low: new Decimal(c.low),
            close: new Decimal(c.close),
            volume: new Decimal(c.volume),
          },
        });
      } catch (err) {
        this.logger.error(
          `Error insertando vela ${c.openTime.toISOString()}`,
          err,
        );
      }
    }
  }

  /**
   * Inserta la última vela cerrada si no existe
   */
  async insertLastClosedCandle(
    candle: CandleDTO,
    symbol: string,
    interval: string,
  ) {
    const exists = await this.prisma.candle.findUnique({
      where: {
        symbol_interval_openTime: {
          symbol,
          interval,
          openTime: new Date(candle.openTime),
        },
      },
    });

    if (!exists) {
      await this.prisma.candle.create({
        data: {
          symbol,
          interval,
          openTime: new Date(candle.openTime),
          closeTime: new Date(candle.closeTime),
          open: new Decimal(candle.open),
          high: new Decimal(candle.high),
          low: new Decimal(candle.low),
          close: new Decimal(candle.close),
          volume: new Decimal(candle.volume),
        },
      });

      this.logger.log(
        `✅ Insertada nueva vela ${symbol} ${interval} - ${candle.openTime.toISOString()}`,
      );
    } else {
      this.logger.log(
        `ℹ️ Vela ya existente ${symbol} ${interval} - ${candle.openTime.toISOString()}`,
      );
    }
  }

  /**
   * Obtiene las últimas N velas (por defecto 1000) de un símbolo/intervalo
   */
  async getLastCandles(
    symbol = 'BTCUSDT',
    interval = '240',
    limit = 1000,
  ): Promise<Candle[]> {
    return this.prisma.candle.findMany({
      where: { symbol, interval },
      orderBy: { openTime: 'desc' },
      take: limit,
    });
  }
}
