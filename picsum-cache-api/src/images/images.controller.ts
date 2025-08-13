import { Controller, Get, Param, Query, ParseIntPipe } from '@nestjs/common';
import { ImagesService, PicsumImage, ImageListResponse } from './images.service';

@Controller('images')
export class ImagesController {
  constructor(private readonly imagesService: ImagesService) {}

  /**
   * 获取图片列表（带缓存）
   * GET /images?page=2&limit=100
   */
  @Get()
  async getImages(
    @Query('page', new ParseIntPipe({ optional: true })) page: number = 1,
    @Query('limit', new ParseIntPipe({ optional: true })) limit: number = 10
  ): Promise<ImageListResponse> {
    return this.imagesService.getImages(page, limit);
  }

  /**
   * 根据 ID 获取单张图片信息（带缓存）
   * GET /images/:id
   */
  @Get(':id')
  async getImageById(@Param('id') id: string): Promise<PicsumImage> {
    return this.imagesService.getImageById(id);
  }

  /**
   * 获取随机图片（带缓存）
   * GET /images/random?count=10
   */
  @Get('random')
  async getRandomImages(
    @Query('count', new ParseIntPipe({ optional: true })) count: number = 10
  ): Promise<PicsumImage[]> {
    return this.imagesService.getRandomImages(count);
  }

  /**
   * 获取指定尺寸的图片 URL
   * GET /images/:id/url?width=400&height=400
   */
  @Get(':id/url')
  getImageUrl(
    @Param('id') id: string,
    @Query('width', new ParseIntPipe({ optional: true })) width: number = 400,
    @Query('height', new ParseIntPipe({ optional: true })) height: number = 400
  ): { url: string } {
    const url = this.imagesService.getImageUrl(id, width, height);
    return { url };
  }

  /**
   * 清理过期缓存
   * GET /images/cache/clean
   */
  @Get('cache/clean')
  async cleanCache(): Promise<{ message: string }> {
    await this.imagesService.cleanCache();
    return { message: '缓存清理完成' };
  }

  /**
   * 获取缓存统计信息
   * GET /images/cache/stats
   */
  @Get('cache/stats')
  async getCacheStats(): Promise<{ totalFiles: number; totalSize: number }> {
    return await this.imagesService.getCacheStats();
  }
}
