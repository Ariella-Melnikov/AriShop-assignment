import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { config } from 'dotenv';


if (process.env.RENDER) {
  config({ path: '/etc/secrets/.env' });
} else {
  config();
}

async function bootstrap() {
  config();
  
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.enableCors({
    origin: process.env.RENDER
    ? 'https://your-frontend-service.onrender.com'
    : 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
  });
  await app.listen(3030);
}
bootstrap(); 