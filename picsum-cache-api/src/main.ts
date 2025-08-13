import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // 启用 CORS
  app.enableCors({
    origin: true,
    credentials: true,
  });
  
  await app.listen(3001);
  console.log('服务运行在 http://localhost:3001');
  console.log('图片列表接口: http://localhost:3001/images');
  console.log('缓存目录: ./cache');
}
bootstrap();
