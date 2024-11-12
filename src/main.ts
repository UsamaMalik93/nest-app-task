import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors()//for cross origin platform integraton enabled cors
  await app.listen(process.env.PORT);
}
bootstrap();
