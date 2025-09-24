import { WebSocketServer } from "ws"
import WebSocket from "ws"
import crypto from "crypto"
import { configDotenv } from "dotenv"

configDotenv() // leer .env

const apiKey = process.env.BYBIT_API_KEY
const apiSecret = process.env.BYBIT_API_SECRET


function getSignature(apiKey, apiSecret) {
  const expires = Math.floor(Date.now() / 1000) + 60 // segundos
  const prehash = apiKey + expires
  const signature = crypto
    .createHmac("sha256", apiSecret)
    .update(prehash)
    .digest("hex")
  return { expires, signature }
}

export function createWsServer(server) {
  console.log("🔐 Usando API Key:", apiKey)
  const wss = new WebSocketServer({ server })

  // Ticker público
  const tickerWs = new WebSocket("wss://stream.bybit.com/v5/public/linear")
  tickerWs.on("open", () => {
    tickerWs.send(
      JSON.stringify({
        op: "subscribe",
        args: ["tickers.BTCUSDT"],
        update_frequency: "1000ms",
      })
    )
  })

  // WS privado para posiciones
  const privateWs = new WebSocket("wss://stream.bybit.com/v5/private")
  privateWs.on("open", () => {
    console.log("🔐 Conectando al WS privado Bybit…", apiKey, apiSecret)
    const { expires, signature } = getSignature(apiKey, apiSecret)

    privateWs.send(
      JSON.stringify({
        op: "auth",
        args: [apiKey, expires, signature],
      })
    )

    // Suscribirse a posiciones
    privateWs.send(
      JSON.stringify({
        op: "subscribe",
        args: ["position"],
      })
    )
  })

  // Manejo de mensajes
  tickerWs.on("message", (raw) => {
    const data = JSON.parse(raw.toString())

    if (data.topic === "tickers.BTCUSDT" && data.data) {
      const price = data.data.lastPrice || data.data.markPrice || data.data.indexPrice
      if (price) {
        console.log("📈 BTCUSDT:", price)

        wss.clients.forEach((client) => {
          if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({ type: "ticker", price }))
          }
        })
      }
    }
  })

  privateWs.on("message", (raw) => {
    const data = JSON.parse(raw.toString())

    console.log("🔐 Mensaje WS privado:", data)

    if (data.topic === "position.linear" && data.data?.length) {
      const pos = data.data.find((p) => p.symbol === "BTCUSDT")
      if (pos && Number(pos.size) > 0) {
        const pl = pos.unrealisedPnl
        console.log("📊 Posición BTCUSDT abierta, PnL:", pl)

        wss.clients.forEach((client) => {
          if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({ type: "position", pnl: pl }))
          }
        })
      } else {
        console.log("ℹ️ Mensaje de posición:", data.data)
      }
    }
  })

  // Cliente local
  wss.on("connection", (client) => {
    console.log("📡 Cliente conectado")
    client.send(JSON.stringify({ hello: "Conectado a la pasarela WS" }))
  })
}
