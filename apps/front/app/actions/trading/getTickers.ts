'use server'


type Ticker = {
  symbol: string
  price: string
  change24h: string,
  icon: string
}

const COINS = ["BTCUSD", "ETHUSDT", "BNBUSDT"]

export async function getTickers(): Promise<Ticker[]> {
  try {
    const results = await Promise.all(
      COINS.map(async (symbol) => {
        const res = await fetch(
          `https://api.bybit.com/v5/market/tickers?category=linear&symbol=${symbol}`,
          { cache: "no-store" } // siempre datos frescos
        )

        const json = await res.json()

        if (json.retCode === 0 && json.result.list.length > 0) {
          const d = json.result.list[0]
          return {
            symbol: d.symbol,
            price: Number(d.lastPrice).toFixed(2),
            change24h: (Number(d.price24hPcnt) * 100).toFixed(2),
            icon:  d.symbol.includes("BTC") ? "/btc.png" : d.symbol.includes("ETH") ? "/eth.png" : "/bnb.png",
          } as Ticker
        }

        return { symbol, price: "-", change24h: "-" } as Ticker
      })
    )

    return results
  } catch (err) {
    console.error("❌ Error en getTickers:", err)
    return []
  }
}
