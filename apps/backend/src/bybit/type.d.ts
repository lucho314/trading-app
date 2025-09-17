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
