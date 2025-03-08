import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const port = process.env.PORT || 3001;
  const app = await NestFactory.create(AppModule);

  app.enableCors();
  
  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true }),
  );
  await app.listen(port);

}
bootstrap();