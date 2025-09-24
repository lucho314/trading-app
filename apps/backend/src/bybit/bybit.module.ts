import { Module } from '@nestjs/common';
import { BybitService } from './bybit.service';
import { HttpModule } from '@nestjs/axios';
import { BybitController } from './bybit.controller';

@Module({
  imports: [HttpModule], // 👈 importante!
  providers: [BybitService],
  exports: [BybitService],
  controllers: [BybitController],
})
export class BybitModule {}
