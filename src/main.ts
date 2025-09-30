import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const cfg = app.get(ConfigService);

 app.enableCors({
    origin: '*', // ทุก origin
  });
 app.setGlobalPrefix(cfg.get<string>('BASE_PATH', ''))

  const port = cfg.get<number>('PORT', 3000);
  const env = cfg.get('ENV')

  await app.listen(port, () => {
    console.log(`🚀 Server running on ${env} ${port}`);
  });
}
bootstrap();
