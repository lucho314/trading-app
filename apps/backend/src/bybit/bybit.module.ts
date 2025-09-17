import { Module } from '@nestjs/common';
import { BybitService } from './bybit.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule], // 👈 importante!
  providers: [BybitService],
  exports: [BybitService],
})
export class BybitModule {}
