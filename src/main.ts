import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { TransformResponseInterceptor } from './infrastructure/http/interceptors/transform-response.interceptor';
import { AllExceptionsFilter } from './infrastructure/http/filters/all-exceptions.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalInterceptors(new TransformResponseInterceptor());
  app.useGlobalFilters(new AllExceptionsFilter());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const configService = app.get(ConfigService);

  // CORS configuration via ConfigService
  const allowedOrigins = configService.get<string[]>('cors.origins') ?? [];
  const credentials = configService.get<boolean>('cors.credentials') ?? true;

  app.enableCors({
    origin: allowedOrigins.length ? allowedOrigins : true,
    credentials,
  });

  // Swagger setup via ConfigService
  const swaggerEnabled = configService.get<boolean>('swagger.enable') ?? true;
  if (swaggerEnabled) {
    const title =
      configService.get<string>('swagger.title') ??
      configService.get<string>('app.name') ??
      'API';
    const description =
      configService.get<string>('swagger.desc') ?? 'API documentation';
    const version =
      configService.get<string>('swagger.version') ??
      configService.get<string>('app.version') ??
      '1.0';
    const swaggerPath = (
      configService.get<string>('swagger.path') ?? 'docs'
    ).replace(/^\//, '');

    const config = new DocumentBuilder()
      .setTitle(title)
      .setDescription(description)
      .setVersion(version)
      .addBearerAuth()
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup(swaggerPath, app, document, {
      swaggerOptions: { persistAuthorization: true },
    });

    const port = configService.get<number>('app.port') ?? 3000;
    console.log(
      `[Swagger] Docs available at http://localhost:${port}/${swaggerPath}`,
    );
  }

  const port = configService.get<number>('app.port') ?? 3000;
  await app.listen(port);
}
bootstrap();
