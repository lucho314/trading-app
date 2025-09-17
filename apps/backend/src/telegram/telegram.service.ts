import { LlmDecision } from '@/llm/type';
import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class TelegramService {
  private readonly logger = new Logger(TelegramService.name);
  private readonly apiUrl: string;
  private readonly chatId: string;

  constructor() {
    const token = process.env.TELEGRAM_BOT_TOKEN;
    this.chatId = process.env.TELEGRAM_CHAT_ID!;
    this.apiUrl = `https://api.telegram.org/bot${token}`;
  }

  async notify(decision: LlmDecision): Promise<void> {
    const message = this.formatDecision(decision);

    try {
      await axios.post(`${this.apiUrl}/sendMessage`, {
        chat_id: this.chatId,
        text: message,
        parse_mode: 'Markdown',
      });
      this.logger.log(`📩 Notificación enviada a Telegram`);
    } catch (error) {
      this.logger.error(`❌ Error enviando mensaje a Telegram: ${error}`);
    }
  }

  private formatDecision(d: LlmDecision): string {
    return `
    📊 *Nueva señal de trading*
    Acción: *${d.action}*
    Confianza: *${d.confidence}%*
    Entrada: \`${d.entryPrice}\`
    Stop Loss: \`${d.stopLoss}\`
    Take Profit: \`${d.takeProfit}\`
    R/R Ratio: *${d.rrRatio}*
    `;
  }
}
