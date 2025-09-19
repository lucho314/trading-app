import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { BybitService } from '@/bybit/bybit.service';
import { CandleService } from '@/candle/candle.service';
import { IndicatorsService } from '@/indicators/indicators.service';
import { AnalysisService } from '@/analysis/analysis.service';
import { SignalsService } from '@/signals/signals.service';
import { LlmService } from '@/llm/llm.service';
import { TelegramService } from '@/telegram/telegram.service';
import { TradingSignalsService } from '@/trading-signals/trading-signals.service';

@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);
  private readonly symbol = 'BTCUSDT';
  private readonly intervalMinutes = 240;
  private readonly interval = '240';
  private readonly candlesLimit = 1000;

  constructor(
    private readonly bybitService: BybitService,
    private readonly candleService: CandleService,
    private readonly indicatorsService: IndicatorsService,
    private readonly analysisService: AnalysisService,
    private readonly signalsService: SignalsService,
    private readonly llmService: LlmService,
    private readonly telegramService: TelegramService,
    private readonly tradingSignalsService: TradingSignalsService,
  ) {}

  @Cron(CronExpression.EVERY_4_HOURS, {
    timeZone: 'Etc/UTC',
  })
  async syncLastFourHourCandle() {
    this.logger.log(
      `Sincronizando vela ${this.symbol} ${this.intervalMinutes}m cerrada`,
    );

    try {
      const candle = await this.bybitService.getLastClosedCandle(
        this.symbol,
        this.intervalMinutes,
      );

      if (!candle) {
        this.logger.warn(
          `No se obtuvo una vela cerrada para ${this.symbol} ${this.intervalMinutes}m`,
        );
        return;
      }

      await this.candleService.insertLastClosedCandle(
        candle,
        this.symbol,
        this.interval,
      );

      const candles = await this.candleService.getLastCandles(
        this.symbol,
        this.interval,
        this.candlesLimit,
      );

      if (!candles.length) {
        this.logger.warn(
          `No hay velas registradas para ${this.symbol} ${this.interval}m`,
        );
        return;
      }

      const indicators = await this.indicatorsService.calculateAll(
        this.symbol,
        this.interval,
        this.candlesLimit,
        candles,
      );

      if (!indicators) {
        this.logger.warn(
          `No se pudieron calcular indicadores para ${this.symbol} ${this.interval}m`,
        );
        return;
      }

      this.logger.log(
        `Indicadores calculados ${this.symbol} ${this.interval}m: ${JSON.stringify(indicators)}`,
      );

      //verificamos si tenemos operacion abierta
      const openPositon = await this.bybitService.checkPositions(this.symbol);
      if (!openPositon) {
        if (!this.signalsService.shouldCallModel(indicators)) {
          this.logger.log(
            `No se cumplen las condiciones para llamar al modelo LLM para ${this.symbol} ${this.interval}m`,
          );
          return;
        }
      }

      const payload = await this.analysisService.buildLlmPayload(
        indicators,
        candles,
        this.symbol,
        this.interval,
      );

      const decision = await this.llmService.analyze(payload, openPositon);

      if (decision) {
        const { id } = await this.tradingSignalsService.create(decision); // Guardar decisión en BD
        await this.telegramService.notify(decision, id);
      }
    } catch (error) {
      if (error instanceof Error) {
        this.logger.error(
          `Error sincronizando vela ${this.symbol} ${this.intervalMinutes}m: ${error.message}`,
          error.stack,
        );
      } else {
        this.logger.error(
          `Error desconocido sincronizando vela ${this.symbol} ${this.intervalMinutes}m: ${JSON.stringify(error)}`,
        );
      }
    }
  }
}
