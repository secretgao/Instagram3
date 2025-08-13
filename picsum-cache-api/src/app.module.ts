import { Module } from '@nestjs/common';
import { ImagesController } from './images/images.controller';
import { ImagesService } from './images/images.service';
import { CacheService } from './cache/cache.service';

@Module({
  controllers: [ImagesController],
  providers: [ImagesService, CacheService],
})
export class AppModule {}
