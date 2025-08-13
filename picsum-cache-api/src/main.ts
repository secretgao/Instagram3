import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // 启用 CORS
  app.enableCors({
    origin: true,
    credentials: true,
  });
  
  // 设置全局前缀（在 Vercel 中会被 /api 路由处理）
  app.setGlobalPrefix('api');
  
  // 适配 Vercel 环境
  const port = process.env.PORT || 3001;
  await app.listen(port);
  console.log(`服务运行在 http://localhost:${port}`);
  console.log('图片列表接口: http://localhost:3001/api/images');
  console.log('缓存目录: ./cache');
}

// 导出 bootstrap 函数供 Vercel 使用
export default bootstrap;
