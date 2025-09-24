"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Play, X, Clock, TrendingUp, TrendingDown } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { es } from "date-fns/locale"
import { Signal } from "@/app/type"



interface SignalsGridProps {
  signals: Signal[]
}

export function SignalsGrid({ signals }: SignalsGridProps) {
  const [loadingSignal, setLoadingSignal] = useState<string | null>(null)

  const isExpired = (expiresAt: string) => {
    return new Date(expiresAt) < new Date()
  }

  const handleExecuteSignal = async (signalId: string) => {
    setLoadingSignal(signalId)
    // Aquí implementarías la lógica para ejecutar la señal
    console.log("Ejecutando señal:", signalId)
    setTimeout(() => setLoadingSignal(null), 2000)
  }

  const handleCancelSignal = async (signalId: string) => {
    setLoadingSignal(signalId)
    // Aquí implementarías la lógica para cancelar la señal
    console.log("Cancelando señal:", signalId)
    setTimeout(() => setLoadingSignal(null), 2000)
  }

  const pendingSignals = signals.filter((signal) => signal.status === "PENDING")

  if (pendingSignals.length === 0) {
    return (
      <div className="text-center py-8">
        <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <p className="text-muted-foreground">No hay señales pendientes</p>
      </div>
    )
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Símbolo</TableHead>
            <TableHead>Acción</TableHead>
            <TableHead>Confianza</TableHead>
            <TableHead>Precio Entrada</TableHead>
            <TableHead>Stop Loss</TableHead>
            <TableHead>Take Profit</TableHead>
            <TableHead>R/R</TableHead>
            <TableHead>Timeframe</TableHead>
            <TableHead>Expira</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead>Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {pendingSignals.map((signal) => {
            const expired = isExpired(String(signal.expiresAt))

            return (
              <TableRow key={signal.id}>
                <TableCell className="font-medium">{signal.symbol}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {signal.action === "LONG" ? (
                      <TrendingUp className="h-4 w-4 text-green-500" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-red-500" />
                    )}
                    <Badge variant={signal.action === "LONG" ? "default" : "destructive"}>{signal.action}</Badge>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{signal.confidence}%</Badge>
                </TableCell>
                <TableCell className="font-mono">${signal.entryPrice?.toLocaleString("en-US")}</TableCell>
                <TableCell className="font-mono text-red-600">${signal.stopLoss?.toLocaleString("en-US")}</TableCell>
                <TableCell className="font-mono text-green-600">${signal.takeProfit?.toLocaleString("en-US")}</TableCell>
                <TableCell>
                  <Badge variant="secondary">{signal.rrRatio}:1</Badge>
                </TableCell>
                <TableCell>{signal.timeframe}</TableCell>
                <TableCell>
                  <span className={expired ? "text-red-500" : "text-muted-foreground"}>
                    {formatDistanceToNow(new Date(signal.expiresAt), {
                      addSuffix: true,
                      locale: es,
                    })}
                  </span>
                </TableCell>
                <TableCell>
                  <Badge variant={expired ? "destructive" : "default"}>{expired ? "EXPIRADA" : signal.status}</Badge>
                </TableCell>
                <TableCell>
                  {!expired && (
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => handleExecuteSignal(signal.id)}
                        disabled={loadingSignal === signal.id}
                        className="h-8"
                      >
                        <Play className="h-3 w-3 mr-1" />
                        Ejecutar
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleCancelSignal(signal.id)}
                        disabled={loadingSignal === signal.id}
                        className="h-8"
                      >
                        <X className="h-3 w-3 mr-1" />
                        Cancelar
                      </Button>
                    </div>
                  )}
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}
