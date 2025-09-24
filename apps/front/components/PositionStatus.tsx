// app/components/trading/PositionStatus.tsx
import { tradingGetOperationOpen } from "@/app/actions/trading/get-operation-open"



export default async function PositionStatus({ symbol }: { symbol: string }) {
  const position = await tradingGetOperationOpen(symbol);

  if (!position) {
    return (
      <div className="p-4 rounded-2xl shadow bg-white text-center">
        <p className="text-gray-500">No hay posiciones abiertas en {symbol}</p>
      </div>
    )
  }

  return (
    <div className="p-4 rounded-2xl shadow bg-white">
      <h3 className="font-bold text-lg mb-2">Posición abierta en {position.symbol}</h3>
      <ul className="space-y-1 text-sm">
        <li>📈 <strong>Side:</strong> {position.side}</li>
        <li>💵 <strong>Entry:</strong> {position.entryPrice}</li>
        <li>🏷️ <strong>Mark:</strong> {position.markPrice}</li>
        <li>📊 <strong>Size:</strong> {position.size}</li>
        {position.takeProfit && <li>🎯 <strong>TP:</strong> {position.takeProfit}</li>}
        {position.stopLoss && <li>🛑 <strong>SL:</strong> {position.stopLoss}</li>}
        <li>⚡ <strong>Unrealised PnL:</strong> {position.unrealisedPnl}</li>
      </ul>
    </div>
  )
}
