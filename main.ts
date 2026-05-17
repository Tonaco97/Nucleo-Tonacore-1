import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { initializeOpenTelemetry } from './config/otel.config';

async function bootstrap() {
  // Inicializa OpenTelemetry ANTES de tudo
  initializeOpenTelemetry();

  const app = await NestFactory.create(AppModule);

  app.enableCors();
  app.setGlobalPrefix('api');

  await app.listen(process.env.PORT || 3000);
  console.log(`Tonacore Cyber rodando na porta ${process.env.PORT || 3000}`);
}

bootstrap();
