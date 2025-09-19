import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { BybitService } from './bybit/bybit.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const bybitService = app.get(BybitService);

  try {
    const orders = await bybitService.openPosition({
      symbol: 'BTCUSDT',
      side: 'Buy',
      size: 0.001,
      leverage: 3,
      takeProfit: 118082,
      stopLoss: 110082,
    });

    console.log('✅ Conexión exitosa con Bybit');
    console.log('Órdenes abiertas:', JSON.stringify(orders, null, 2));
  } catch (error) {
    console.error('❌ Error al conectar con Bybit:', error.message);
    console.error(error);
  } finally {
    await app.close();
  }
}

bootstrap();
