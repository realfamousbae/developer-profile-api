import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module.ts';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: true,
    methods: ['GET', 'POST', 'OPTIONS'],
  });
  app.enableShutdownHooks();

  await app.listen(process.env.PORT ?? 3000, '0.0.0.0');
}

void bootstrap();
