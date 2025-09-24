// app/actions.ts
'use server'

import { PositionSideV5 } from "bybit-api";


 interface PositionSummary {
  symbol: string;
  side: PositionSideV5;
  entryPrice: number;
  markPrice: number;
  size: number;
  takeProfit?: number;
  stopLoss?: number;
  unrealisedPnl: number;
}

const API_BASE_URL = process.env.BAKEND_URL || 'http://localhost:3000';

export async function tradingGetOperationOpen(symbol: string) : Promise<PositionSummary | null> {
  try {
    const datos = await fetch(`${API_BASE_URL}/internal/bybit/positions?symbol=${symbol}`, {
      headers: {
        "x-internal-key": process.env.INTERNAL_API_KEY!
      }
    });
    
  const result = await datos.json();
  console.log(result)
  return result
  } catch (error) {
    console.error("Error fetching open operations:", error);
    return null;
  }

}
