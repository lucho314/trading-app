-- CreateTable
CREATE TABLE "public"."Indicator" (
    "id" TEXT NOT NULL,
    "symbol" TEXT NOT NULL,
    "interval" TEXT NOT NULL,
    "calculatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "sma20" DOUBLE PRECISION,
    "ema20" DOUBLE PRECISION,
    "rsi14" DOUBLE PRECISION,
    "macd" JSONB,
    "bollinger" JSONB,
    "atr14" DOUBLE PRECISION,
    "adx14" JSONB,
    "stochastic" JSONB,
    "obv" DOUBLE PRECISION,
    "close" DOUBLE PRECISION,

    CONSTRAINT "Indicator_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "idx_symbol_interval_date" ON "public"."Indicator"("symbol", "interval", "calculatedAt");

-- CreateIndex
CREATE INDEX "idx_calculatedAt" ON "public"."Indicator"("calculatedAt");
