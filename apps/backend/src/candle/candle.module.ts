import { Module } from '@nestjs/common';
import { CandleService } from './candle.service';
import { PrismaService } from '@/prisma.service';

@Module({
  providers: [CandleService, PrismaService],
  exports: [CandleService],
})
export class CandleModule {}
