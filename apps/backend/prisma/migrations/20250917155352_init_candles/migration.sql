-- CreateTable
CREATE TABLE "public"."Candle" (
    "id" BIGSERIAL NOT NULL,
    "symbol" TEXT NOT NULL,
    "interval" TEXT NOT NULL,
    "openTime" TIMESTAMP(3) NOT NULL,
    "closeTime" TIMESTAMP(3) NOT NULL,
    "open" DECIMAL(20,10) NOT NULL,
    "high" DECIMAL(20,10) NOT NULL,
    "low" DECIMAL(20,10) NOT NULL,
    "close" DECIMAL(20,10) NOT NULL,
    "volume" DECIMAL(30,10) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Candle_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Candle_symbol_interval_openTime_idx" ON "public"."Candle"("symbol", "interval", "openTime");

-- CreateIndex
CREATE UNIQUE INDEX "Candle_symbol_interval_openTime_key" ON "public"."Candle"("symbol", "interval", "openTime");
