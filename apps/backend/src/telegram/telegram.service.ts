import { LlmDecision } from '@/llm/type';
import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import { TelegramUpdate } from './type';
import { TradingSignalsService } from '@/trading-signals/trading-signals.service';
import { BybitService } from '@/bybit/bybit.service';

@Injectable()
export class TelegramService {
  private readonly logger = new Logger(TelegramService.name);
  private readonly apiUrl: string;
  private readonly chatId: string;

  constructor(
    private readonly tradingSignalsService: TradingSignalsService,
    private readonly bybitService: BybitService,
  ) {
    const token = process.env.TELEGRAM_BOT_TOKEN;
    this.chatId = process.env.TELEGRAM_CHAT_ID!;
    this.apiUrl = `https://api.telegram.org/bot${token}`;
  }

  async notify(decision: LlmDecision, id: bigint): Promise<void> {
    const message = this.formatDecision(decision);

    try {
      await axios.post(`${this.apiUrl}/sendMessage`, {
        chat_id: this.chatId,
        text: message,
        parse_mode: 'Markdown',
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: '🚀 Ejecutar transacción',
                callback_data: `execute_${id}`,
              },
              { text: '❌ Desestimar', callback_data: `discard_${id}` },
            ],
          ],
        },
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

  async handleUpdate(update: TelegramUpdate) {
    if (update.callback_query) {
      const chatId = update.callback_query.message?.chat?.id;
      if (!chatId) {
        this.logger.error('No chat ID found in callback query');
        return;
      }
      const data = update.callback_query.data ?? '';

      if (data.startsWith('execute_')) {
        const id = parseInt(data.replace('execute_', ''), 10);
        //obtener la señal
        const signal = await this.tradingSignalsService.findOne(BigInt(id));
        if (!signal) {
          return this.answer(chatId, `❌ Señal #${id} no encontrada`);
        }
        if (signal.status !== 'PENDING') {
          return this.answer(
            chatId,
            `❌ Señal #${id} ya fue procesada (estado: ${signal.status})`,
          );
        }

        await this.bybitService.openPosition({
          symbol: signal.symbol,
          side: signal.action === 'LONG' ? 'Buy' : 'Sell',
          size: 0.004, // cantidad fija por ahora
          leverage: signal.rrRatio ?? 3, // default 3 si no viene
          takeProfit: signal.takeProfit ?? undefined,
          stopLoss: signal.stopLoss ?? undefined,
        });

        await this.tradingSignalsService.execute(BigInt(id), 'telegram');
        return this.answer(chatId, `✅ Señal #${id} ejecutada`);
      }

      if (data.startsWith('discard_')) {
        const id = parseInt(data.replace('discard_', ''), 10);
        await this.tradingSignalsService.cancel(BigInt(id));
        return this.answer(chatId, `❌ Señal #${id} descartada`);
      }
    }

    if (update.message?.text) {
      this.logger.log(`📩 Mensaje recibido: ${update.message.text}`);
    }
  }

  private async answer(chatId: number, text: string) {
    try {
      await axios.post(`${this.apiUrl}/sendMessage`, {
        chat_id: chatId,
        text,
        parse_mode: 'Markdown',
      });
    } catch (error) {
      this.logger.error(`❌ Error enviando mensaje a Telegram: ${error}`);
    }
  }
}
