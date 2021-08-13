import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import * as helmet from 'helmet';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: true,
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
    preflightContinue: false,
    optionsSuccessStatus: 204,
    allowedHeaders: 'Content-Type, Accept, Authorization',
  });
  app.use(helmet());
  app.useGlobalPipes(new ValidationPipe());
  const PORT = process.env.PORT || 5000;
  await app.listen(PORT, () => {
    console.log(`Our app is running on port ${PORT}`);
  });
}
bootstrap();
