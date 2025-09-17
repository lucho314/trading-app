import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { BybitModule } from '@/bybit/bybit.module';
import { CandleModule } from '@/candle/candle.module';
import { IndicatorsModule } from '@/indicators/indicators.module';
import { AnalysisService } from '@/analysis/analysis.service';
import { SignalsService } from '@/signals/signals.service';
import { LlmService } from '@/llm/llm.service';
import { TelegramService } from '@/telegram/telegram.service';

@Module({
  imports: [BybitModule, CandleModule, IndicatorsModule],
  providers: [
    TasksService,
    AnalysisService,
    SignalsService,
    LlmService,
    TelegramService,
  ],
})
export class TasksModule {}
