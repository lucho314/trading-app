import { Module } from '@nestjs/common';
import { IndicatorsService } from './indicators.service';
import { CandleModule } from '@/candle/candle.module';
import { PrismaService } from '@/prisma.service';

@Module({
  imports: [CandleModule],
  providers: [IndicatorsService, PrismaService],
  exports: [IndicatorsService],
})
export class IndicatorsModule {}
