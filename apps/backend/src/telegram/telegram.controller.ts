import { Body, Controller, Post } from '@nestjs/common';
import { TelegramService } from './telegram.service';
import { TelegramUpdate } from './type';

@Controller('telegram')
export class TelegramController {
  constructor(private readonly telegramService: TelegramService) {}

  @Post('webhook')
  handleUpdate(@Body() update: TelegramUpdate) {
    return this.telegramService.handleUpdate(update);
  }
}
