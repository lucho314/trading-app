import { Module } from '@nestjs/common';
import { TradingSignalsService } from './trading-signals.service';
import { TradingSignalsController } from './trading-signals.controller';
import { PrismaModule } from '@/prisma/prisma.module';

@Module({
  imports: [PrismaModule], // 👈 lo traés desde el PrismaModule
  providers: [TradingSignalsService],
  controllers: [TradingSignalsController],
  exports: [TradingSignalsService],
})
export class TradingSignalsModule {}
