// lib/bybit.ts
import { RestClientV5 } from "bybit-api"

const bybitApiKey = process.env.BYBIT_API_KEY as string
const bybitApiSecret = process.env.BYBIT_API_SECRET as string

export const bybitClient = new RestClientV5({
  key: bybitApiKey,
  secret: bybitApiSecret,
  testnet: process.env.BYBIT_TESTNET === "true", // opcional: usar testnet si la var está en true
})
