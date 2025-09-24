"use client"

import { useState,  useTransition } from "react"
import { Button } from "@/components/ui/button"
import { getTickers } from "@/app/actions/trading/getTickers"
import Image from "next/image"

type Ticker = {
  symbol: string
  price: string
  change24h: string,
  icon: string
}

export default function CryptoMarketClient({ initialData }: { initialData: Ticker[] }) {
  const [tickers, setTickers] = useState(initialData)
  const [isPending, startTransition] = useTransition()

  const refresh = () => {
    startTransition(async () => {
      const data = await getTickers()
      setTickers(data)
    })
  }

  return (
    <div>
      <div className="flex justify-between items-center border-b pb-2 mb-3">
        <h2 className="font-semibold">Popular</h2>
        <Button variant="outline" size="sm" onClick={refresh} disabled={isPending}>
          {isPending ? "Actualizando..." : "Refrescar"}
        </Button>
      </div>

      <ul className="space-y-3">
        {tickers.map((t) => (
          <li key={t.symbol} className="flex justify-between items-center">
            {/* Izquierda con icono */}
            <div className="flex items-center gap-3">
              <Image src={t.icon} alt={t.symbol} width={24} height={24} />
              <span className="font-medium">{t.symbol}</span>
            </div>

            {/* Derecha con precio y % */}
            <div className="text-right">
              <p className="font-semibold">${t.price}</p>
              <p className={Number(t.change24h) >= 0 ? "text-green-500" : "text-red-500"}>
                {t.change24h}%
              </p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
