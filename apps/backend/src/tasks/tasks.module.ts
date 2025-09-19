import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { BybitModule } from '@/bybit/bybit.module';
import { CandleModule } from '@/candle/candle.module';
import { IndicatorsModule } from '@/indicators/indicators.module';
import { AnalysisService } from '@/analysis/analysis.service';
import { SignalsService } from '@/signals/signals.service';
import { LlmModule } from '@/llm/llm.module';
import { TelegramService } from '@/telegram/telegram.service';
import { TradingSignalsService } from '@/trading-signals/trading-signals.service';

@Module({
  imports: [BybitModule, CandleModule, IndicatorsModule, LlmModule],
  providers: [
    TasksService,
    AnalysisService,
    SignalsService,
    TelegramService,
    TradingSignalsService,
  ],
})
export class TasksModule {}
