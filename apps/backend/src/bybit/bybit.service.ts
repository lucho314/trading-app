import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import {
  BybitKlineResponse,
  CandleDTO,
  ClosePositionParams,
  KlineRaw,
  OpenPositionParams,
  PositionSummary,
} from './type';
import { RestClientV5 } from 'bybit-api';

@Injectable()
export class BybitService {
  private readonly logger = new Logger(BybitService.name);
  private readonly baseUrl = 'https://api.bybit.com/v5/market/kline';
  private client: RestClientV5;

  constructor(private readonly http: HttpService) {
    this.client = new RestClientV5({
      key: process.env.BYBIT_API_KEY,
      secret: process.env.BYBIT_API_SECRET,
      testnet: true, // true si usás el entorno de pruebas
    });
  }

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

  async getOpenOrders(symbol: string) {
    const res = await this.client.getActiveOrders({
      category: 'linear', // ⚡️ para BTCUSDT perps
      symbol,
      openOnly: 1, // 1 = solo órdenes abiertas
      limit: 50,
    });
    return res.result.list;
  }

  async hasOpenOrder(symbol: string): Promise<boolean> {
    const orders = await this.getOpenOrders(symbol);
    return orders.some(
      (o) =>
        o.orderStatus === 'New' ||
        o.orderStatus === 'PartiallyFilled' ||
        o.orderStatus === 'Active',
    );
  }

  async checkPositions(symbol: string): Promise<PositionSummary> {
    const response = await this.client.getPositionInfo({
      category: 'linear', // o 'inverse' / 'spot' / 'option'
      symbol: symbol,
    });

    const { result } = response;
    if (!result || result.list.length === 0) {
      throw new Error(`No hay posiciones abiertas para ${symbol}`);
    }

    const position = result.list.at(0); // Asumimos que solo hay una posición por símbolo
    if (!position || Number(position.size) === 0) {
      throw new Error(`No hay posiciones abiertas para ${symbol}`);
    }
    const summary: PositionSummary = {
      symbol: position.symbol,
      side: position.side,
      entryPrice: Number(position.avgPrice),
      markPrice: Number(position.markPrice),
      size: Number(position.size),
      takeProfit: position.takeProfit ? Number(position.takeProfit) : undefined,
      stopLoss: position.stopLoss ? Number(position.stopLoss) : undefined,
      unrealisedPnl: Number(position.unrealisedPnl),
    };

    return summary;
  }

  async closePosition(params: ClosePositionParams) {
    // lado contrario para cerrar
    const closeSide = params.side === 'Buy' ? 'Sell' : 'Buy';

    const res = await this.client.submitOrder({
      category: 'linear',
      symbol: params.symbol,
      side: closeSide,
      orderType: 'Market',
      qty: params.size.toString(),
      reduceOnly: true, // 🔑 importantísimo para cerrar la posición
      timeInForce: 'IOC',
    });

    return res;
  }

  async openPosition(params: OpenPositionParams) {
    // setear leverage si viene
    if (params.leverage) {
      await this.client.setLeverage({
        category: 'linear',
        symbol: params.symbol,
        buyLeverage: params.side === 'Buy' ? params.leverage.toString() : '0',
        sellLeverage: params.side === 'Sell' ? params.leverage.toString() : '0',
      });
    }

    // crear orden market
    const res = await this.client.submitOrder({
      category: 'linear',
      symbol: params.symbol,
      side: params.side,
      orderType: 'Market',
      qty: params.size.toString(),
      timeInForce: 'IOC',
      reduceOnly: false,
      takeProfit: params.takeProfit?.toString(),
      stopLoss: params.stopLoss?.toString(),
    });

    return res;
  }
}
