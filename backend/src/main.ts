import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();  // 启用 CORS
  await app.listen(8082);
  app.setGlobalPrefix('api');
}
bootstrap();
