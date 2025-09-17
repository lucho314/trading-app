import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { BybitKlineResponse, CandleDTO, KlineRaw } from './type';

@Injectable()
export class BybitService {
  private readonly logger = new Logger(BybitService.name);
  private readonly baseUrl = 'https://api.bybit.com/v5/market/kline';

  constructor(private readonly http: HttpService) {}

  /**
   * Convierte una vela cruda (Bybit array) a CandleDTO
   */
  private mapToCandleDTO(kline: KlineRaw, interval: number): CandleDTO {
    const [start, open, high, low, close, volume, turnover] = kline;

    const openTime = Number(start);
    const closeTime = openTime + interval * 60 * 1000;

    return {
      openTime: new Date(openTime),
      closeTime: new Date(closeTime),
      open: parseFloat(open),
      high: parseFloat(high),
      low: parseFloat(low),
      close: parseFloat(close),
      volume: parseFloat(volume),
      turnover: parseFloat(turnover),
    };
  }

  /**
   * Obtiene las últimas N velas (por defecto 1000)
   */
  async getCandles(
    symbol: string,
    interval: number,
    limit = 1000,
  ): Promise<CandleDTO[]> {
    this.logger.log(
      `Obteniendo últimas ${limit} velas de ${symbol} (${interval}m)`,
    );

    const url = `${this.baseUrl}?category=linear&symbol=${symbol}&interval=${interval}&limit=${limit}`;
    const response = await firstValueFrom(
      this.http.get<BybitKlineResponse>(url),
    );

    if (response.data.retCode !== 0) {
      throw new Error(`Bybit error: ${response.data.retMsg}`);
    }

    return response.data.result.list
      .map((k) => this.mapToCandleDTO(k, interval))
      .reverse(); // Bybit devuelve descendente, lo invertimos
  }

  /**
   * Obtiene la última vela cerrada
   */
  async getLastClosedCandle(
    symbol: string,
    interval: number,
  ): Promise<CandleDTO | null> {
    this.logger.log(
      `Obteniendo última vela cerrada de ${symbol} (${interval}m)`,
    );

    const url = `${this.baseUrl}?category=linear&symbol=${symbol}&interval=${interval}&limit=2`;
    const response = await firstValueFrom(
      this.http.get<BybitKlineResponse>(url),
    );

    if (response.data.retCode !== 0) {
      throw new Error(`Bybit error: ${response.data.retMsg}`);
    }

    const candles = response.data.result.list.map((k) =>
      this.mapToCandleDTO(k, interval),
    );

    // Bybit devuelve descendente: [vela actual (abierta), vela cerrada anterior]
    return candles.length > 1 ? candles[1] : (candles[0] ?? null);
  }
}
