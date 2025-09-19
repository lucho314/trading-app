-- CreateEnum
CREATE TYPE "public"."Action" AS ENUM ('SHORT', 'LONG', 'HOLD', 'WAIT', 'ADD', 'CLOSE', 'MOVE_SL', 'TAKE_PROFIT');

-- CreateEnum
CREATE TYPE "public"."SignalStatus" AS ENUM ('PENDING', 'EXECUTED', 'CANCELLED', 'FAILED', 'EXPIRED');

-- CreateEnum
CREATE TYPE "public"."TradeResult" AS ENUM ('WIN', 'LOSS', 'BE');

-- CreateTable
CREATE TABLE "public"."TradingSignal" (
    "id" BIGSERIAL NOT NULL,
    "symbol" TEXT NOT NULL,
    "action" "public"."Action" NOT NULL,
    "confidence" DOUBLE PRECISION,
    "entryPrice" DOUBLE PRECISION,
    "stopLoss" DOUBLE PRECISION,
    "takeProfit" DOUBLE PRECISION,
    "rrRatio" DOUBLE PRECISION,
    "timeframe" TEXT NOT NULL DEFAULT '4H',
    "payload" JSONB NOT NULL,
    "status" "public"."SignalStatus" NOT NULL DEFAULT 'PENDING',
    "executedAt" TIMESTAMP(3),
    "executionOrderId" TEXT,
    "closePrice" DOUBLE PRECISION,
    "pnl" DOUBLE PRECISION,
    "result" "public"."TradeResult",
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TradingSignal_pkey" PRIMARY KEY ("id")
);
