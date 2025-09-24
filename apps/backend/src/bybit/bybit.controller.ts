import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { InternalBybitGuard } from './guards/internal-bybit/internal-bybit.guard';
import { BybitService } from './bybit.service';

@Controller('internal/bybit')
@UseGuards(InternalBybitGuard)
export class BybitController {
  constructor(private readonly bybitService: BybitService) {}

  @Get('positions')
  async getPosition(@Query('symbol') symbol: string) {
    return this.bybitService.checkPositions(symbol);
  }
}
