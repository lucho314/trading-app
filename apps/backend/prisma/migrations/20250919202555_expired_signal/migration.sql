-- AlterTable
ALTER TABLE "public"."TradingSignal" ADD COLUMN     "expiresAt" TIMESTAMP(3) NOT NULL DEFAULT now() + interval '1 hour';
