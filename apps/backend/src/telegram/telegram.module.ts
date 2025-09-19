import { Module } from '@nestjs/common';
import { TelegramService } from './telegram.service';
import { TelegramController } from './telegram.controller';
import { TradingSignalsService } from '@/trading-signals/trading-signals.service';
import { BybitModule } from '@/bybit/bybit.module';

@Module({
  imports: [BybitModule],
  providers: [TelegramService, TradingSignalsService],
  controllers: [TelegramController],
})
export class TelegramModule {}
