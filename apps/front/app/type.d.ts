import { Indicator as PrismaIndicator, TradingSignal } from "@prisma/client"
export type Indicator = PrismaIndicator & {
  adx14: {
    adx: number
    pdi: number
    mdi: number
  }
  macd: {
    MACD: number
    signal: number
  }
  bollinger: {
    upper: number
    middle: number
    lower: number
    pb: number
  }
  stochastic: {
    k: number
    d: number
  }
}
type Signal = Omit<TradingSignal, "id"> & { id: string };



type Paginate =  {
  q?: string;
  page?: number;
  pageSize?: number;
};