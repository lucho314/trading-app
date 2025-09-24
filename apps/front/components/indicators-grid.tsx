"use client"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, TrendingDown, Minus } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { es } from "date-fns/locale"
import { Indicator } from "@/app/type"



type variant = "default" | "secondary" | "destructive" | "outline"


interface IndicatorsGridProps {
  indicators: Indicator[]
}

export function IndicatorsGrid({ indicators }: IndicatorsGridProps) {
  const getRSISignal = (rsi: number) => {
    if (rsi > 70) return { signal: "SOBRECOMPRA", color: "destructive", icon: TrendingDown }
    if (rsi < 30) return { signal: "SOBREVENTA", color: "default", icon: TrendingUp }
    return { signal: "NEUTRAL", color: "secondary", icon: Minus }
  }

  const getMACDSignal = (macd: number, signal: number) => {
    if (macd > signal) return { signal: "ALCISTA", color: "default", icon: TrendingUp }
    if (macd < signal) return { signal: "BAJISTA", color: "destructive", icon: TrendingDown }
    return { signal: "NEUTRAL", color: "secondary", icon: Minus }
  }

  const getADXSignal = (adx: number) => {
    if (adx > 25) return { signal: "FUERTE", color: "default" }
    if (adx > 20) return { signal: "MODERADA", color: "secondary" }
    return { signal: "DÉBIL", color: "outline" }
  }

  if (indicators.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No hay indicadores disponibles</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {indicators.map((indicator) => {
        const rsiSignal = getRSISignal(indicator.rsi14!)
        const macdSignal = getMACDSignal(indicator.macd.MACD, indicator.macd.signal)
        const adxSignal = getADXSignal(indicator.adx14.adx)
        const RSIIcon = rsiSignal.icon
        const MACDIcon = macdSignal.icon

        return (
          <Card key={indicator.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  {indicator.symbol}
                  <Badge variant="outline">{indicator.interval}m</Badge>
                </CardTitle>
                <div className="text-sm text-muted-foreground">
                  Actualizado{" "}
                  {formatDistanceToNow(new Date(indicator.calculatedAt), {
                    addSuffix: true,
                    locale: es,
                  })}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Precio y Medias Móviles */}
                <div className="space-y-3">
                  <h4 className="font-semibold text-sm">Precio y Medias</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Precio Actual:</span>
                      <span className="font-mono font-semibold">${indicator.close?.toLocaleString("en-US")}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">SMA 20:</span>
                      <span className="font-mono">${indicator.sma20?.toLocaleString("en-US")}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">EMA 20:</span>
                      <span className="font-mono">${indicator.ema20?.toLocaleString("en-US")}</span>
                    </div>
                  </div>
                </div>

                {/* RSI */}
                <div className="space-y-3">
                  <h4 className="font-semibold text-sm">RSI (14)</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Valor:</span>
                      <span className="font-mono font-semibold">{indicator.rsi14?.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Señal:</span>
                      <Badge variant={rsiSignal.color as variant } className="flex items-center gap-1">
                        <RSIIcon className="h-3 w-3" />
                        {rsiSignal.signal}
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* MACD */}
                <div className="space-y-3">
                  <h4 className="font-semibold text-sm">MACD</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">MACD:</span>
                      <span className="font-mono">{indicator.macd.MACD.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Signal:</span>
                      <span className="font-mono">{indicator.macd.signal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Señal:</span>
                      <Badge variant={macdSignal.color as variant} className="flex items-center gap-1">
                        <MACDIcon className="h-3 w-3" />
                        {macdSignal.signal}
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Bollinger Bands */}
                <div className="space-y-3">
                  <h4 className="font-semibold text-sm">Bollinger Bands</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Superior:</span>
                      <span className="font-mono">${indicator.bollinger.upper.toLocaleString("en-US")}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Media:</span>
                      <span className="font-mono">${indicator.bollinger.middle.toLocaleString("en-US")}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Inferior:</span>
                      <span className="font-mono">${indicator.bollinger.lower.toLocaleString("en-US")}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">%B:</span>
                      <span className="font-mono">{indicator.bollinger.pb.toFixed(3)}</span>
                    </div>
                  </div>
                </div>

                {/* ADX */}
                <div className="space-y-3">
                  <h4 className="font-semibold text-sm">ADX (14)</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">ADX:</span>
                      <span className="font-mono">{indicator.adx14.adx.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">+DI:</span>
                      <span className="font-mono">{indicator.adx14.pdi.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">-DI:</span>
                      <span className="font-mono">{indicator.adx14.mdi.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Tendencia:</span>
                      <Badge variant={adxSignal.color as variant}>{adxSignal.signal}</Badge>
                    </div>
                  </div>
                </div>

                {/* Stochastic y otros */}
                <div className="space-y-3">
                  <h4 className="font-semibold text-sm">Otros Indicadores</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Stoch %K:</span>
                      <span className="font-mono">{indicator.stochastic.k.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Stoch %D:</span>
                      <span className="font-mono">{indicator.stochastic.d.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">ATR:</span>
                      <span className="font-mono">{indicator.atr14?.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">OBV:</span>
                      <span className="font-mono">{indicator.obv?.toLocaleString("en-US")}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
