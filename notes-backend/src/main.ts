import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { MongoDuplicateFilter } from './filters/mongo-duplicate.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe());

  const { httpAdapter } = app.get(HttpAdapterHost);
  app.useGlobalFilters(new MongoDuplicateFilter(httpAdapter));

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
