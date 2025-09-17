import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BybitModule } from './bybit/bybit.module';
import { IndicatorsModule } from './indicators/indicators.module';
import { TelegramModule } from './telegram/telegram.module';
import { LlmModule } from './llm/llm.module';
import { TasksModule } from './tasks/tasks.module';
import { CandleModule } from './candle/candle.module';
import { SignalsModule } from './signals/signals.module';
import { AnalysisModule } from './analysis/analysis.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    BybitModule,
    IndicatorsModule,
    TelegramModule,
    LlmModule,
    TasksModule,
    CandleModule,
    SignalsModule,
    AnalysisModule,
    PrismaModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
