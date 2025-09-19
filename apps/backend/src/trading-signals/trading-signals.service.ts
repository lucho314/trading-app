import { LlmDecision } from '@/llm/type';
import { PrismaService } from '@/prisma.service';
import { Injectable } from '@nestjs/common';
import {
  Action,
  SignalStatus,
  TradeResult,
  TradingSignal,
} from '@prisma/client';

@Injectable()
export class TradingSignalsService {
  constructor(private readonly prisma: PrismaService) {}
  // Crear señal nueva
  async create(data: LlmDecision): Promise<TradingSignal> {
    return this.prisma.tradingSignal.create({
      data: {
        action: data.action as Action,
        confidence: data.confidence,
        entryPrice: data.entryPrice,
        stopLoss: data.stopLoss,
        takeProfit: data.takeProfit,
        rrRatio: data.rrRatio,
        status: SignalStatus.PENDING,
        createdAt: new Date(),
        updatedAt: new Date(),
        symbol: 'BTCUSDT',
        payload: JSON.stringify(data),
      },
    });
  }

  // Listar todas
  async findAll(): Promise<TradingSignal[]> {
    return this.prisma.tradingSignal.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  // Buscar por ID
  async findOne(id: bigint): Promise<TradingSignal | null> {
    return this.prisma.tradingSignal.findUnique({ where: { id } });
  }

  // Marcar como ejecutada
  async execute(id: bigint, orderId: string): Promise<TradingSignal> {
    return this.prisma.tradingSignal.update({
      where: { id },
      data: {
        status: SignalStatus.EXECUTED,
        executedAt: new Date(),
        executionOrderId: orderId,
      },
    });
  }

  // Cerrar señal con resultado
  async close(
    id: bigint,
    closePrice: number,
    pnl: number,
    result: TradeResult,
  ): Promise<TradingSignal> {
    return this.prisma.tradingSignal.update({
      where: { id },
      data: {
        closePrice,
        pnl,
        result,
        status: SignalStatus.EXECUTED,
        updatedAt: new Date(),
      },
    });
  }

  // Cancelar
  async cancel(id: bigint): Promise<TradingSignal> {
    return this.prisma.tradingSignal.update({
      where: { id },
      data: { status: SignalStatus.CANCELLED },
    });
  }
}
