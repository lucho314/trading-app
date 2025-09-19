import { OrderSideV5, PositionSideV5 } from 'bybit-api';

export interface BybitKlineResponse {
  retCode: number;
  retMsg: string;
  result: {
    symbol: string;
    category: string;
    list: KlineRaw[];
  };
  retExtInfo?: any;
  time?: number;
}

export type KlineRaw = [
  string, // start time (ms)
  string, // open
  string, // high
  string, // low
  string, // close
  string, // volume
  string, // turnover
];

export interface CandleDTO {
  openTime: Date;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  turnover: number;
  closeTime: Date;
}

export interface PositionSummary {
  symbol: string;
  side: PositionSideV5;
  entryPrice: number;
  markPrice: number;
  size: number;
  takeProfit?: number;
  stopLoss?: number;
  unrealisedPnl: number;
}

export interface ClosePositionParams {
  symbol: string;
  side: PositionSideV5; // lado de la posición abierta
  size: number; // cantidad abierta
}

export interface OpenPositionParams {
  symbol: string;
  side: OrderSideV5;
  size: number; // tamaño en contratos / cantidad
  leverage?: number; // opcional, default 3
  takeProfit?: number; // opcional
  stopLoss?: number; // opcional
}
