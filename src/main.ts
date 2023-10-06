import { NestFactory } from '@nestjs/core';
import * as compression from 'compression';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { VersioningType } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bodyParser: true });
  const appPort = app.get(ConfigService).get<number>('APP_PORT') || 3000;

  app.use(
    compression({
      encodings: ['gzip', 'deflate'],
      filter: () => true,
      threshold: 0,
    }),
  );
  app.setGlobalPrefix('api');
  app.enableVersioning({
    type: VersioningType.URI,
  });

  const docOptions = new DocumentBuilder()
    .setTitle('riot test api')
    .setDescription('RiotGames API experiment')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, docOptions);
  SwaggerModule.setup('swagger', app, document);

  await app.listen(appPort);

  console.log(
    `Application is running on: ${await app.getUrl()}, port: ${appPort}`,
  );
}
bootstrap();
