import { Module } from '@nestjs/common';
import { LlmService } from './llm.service';
import { TradingSignalsModule } from '@/trading-signals/trading-signals.module';
import { PrismaModule } from '@/prisma/prisma.module';

@Module({
  imports: [TradingSignalsModule, PrismaModule],
  providers: [LlmService],
  exports: [LlmService],
})
export class LlmModule {}
