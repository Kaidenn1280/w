import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';

async function bootstrap() {
  dotenv.config(); // 👈 loads .env from the project root

  const app = await NestFactory.create(AppModule);

  // CORS configuration - allow frontend URLs
  app.enableCors({
    origin: process.env.CORS_ORIGIN || '*', // Configure in production
    credentials: true,
  });

  // Use PORT from environment variable (Railway provides this)
  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`🚀 Server running on port ${port}`);
}
bootstrap();

