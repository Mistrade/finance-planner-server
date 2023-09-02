import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
import { setupDayjsPlugins } from './utils/date.utils';
import { AllExceptionFilter } from './utils/exception/filter.exception';
import { SwaggerBuilder } from './utils/swagger/swagger.builder';

async function bootstrap() {
  setupDayjsPlugins();
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.use(cookieParser());

  const httpAdapterHost = app.get(HttpAdapterHost);
  app.useGlobalFilters(new AllExceptionFilter(httpAdapterHost));

  const swagger = new SwaggerBuilder(app);

  await app.listen(3000, () => {
  
  });
}

bootstrap();
