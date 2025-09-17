import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { TasksService } from '@/tasks/tasks.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);

  const tasksService = app.get(TasksService);

  console.log('▶️ Ejecutando syncLastFourHourCandle() manualmente...');
  await tasksService.syncLastFourHourCandle();

  await app.close();
}

bootstrap();
