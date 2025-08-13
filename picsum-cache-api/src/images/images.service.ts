import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import axios from 'axios';
import { CacheService } from '../cache/cache.service';

export interface PicsumImage {
  id: string;
  author: string;
  width: number;
  height: number;
  url: string;
  download_url: string;
}

export interface ImageListResponse {
  images: PicsumImage[];
  total: number;
  page: number;
  limit: number;
  fromCache: boolean;
}

@Injectable()
export class ImagesService {
  private readonly baseUrl = 'https://picsum.photos/v2';

  constructor(private readonly cacheService: CacheService) {}

  /**
   * 获取图片列表（带缓存）
   * @param page 页码
   * @param limit 每页数量
   * @returns 图片列表
   */
  async getImages(page: number = 1, limit: number = 100): Promise<ImageListResponse> {
    const params = { page, limit };
    
    try {
      // 首先尝试从缓存获取
      const cachedData = await this.cacheService.getFromCache(params);
      
      if (cachedData) {
        return {
          ...cachedData,
          fromCache: true
        };
      }

      // 缓存中没有，从 API 获取
      console.log(`从 API 获取数据: page=${page}, limit=${limit}`);
      const url = `${this.baseUrl}/list?page=${page}&limit=${limit}`;
      
      const response = await axios.get<PicsumImage[]>(url);
      console.log(response.data);
      const images = response.data;

      const result: ImageListResponse = {
        images,
        total: images.length,
        page,
        limit,
        fromCache: false
      };

      // 保存到缓存
      await this.cacheService.saveToCache(params, result);

      return result;
    } catch (error) {
      console.error('获取图片列表失败:', error.message);
      throw new HttpException(
        '获取图片列表失败',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  /**
   * 根据 ID 获取单张图片信息
   * @param id 图片 ID
   * @returns 图片信息
   */
  async getImageById(id: string): Promise<PicsumImage> {
    const params = { id };
    
    try {
      // 首先尝试从缓存获取
      const cachedData = await this.cacheService.getFromCache(params);
      
      if (cachedData) {
        return cachedData;
      }

      // 缓存中没有，从 API 获取
      console.log(` 从 API 获取图片信息: id=${id}`);
      const url = `${this.baseUrl}/id/${id}/info`;
      
      const response = await axios.get<PicsumImage>(url);
      const imageData = response.data;

      // 保存到缓存
      await this.cacheService.saveToCache(params, imageData);

      return imageData;
    } catch (error) {
      console.error(` 获取图片 ID ${id} 失败:`, error.message);
      throw new HttpException(
        `图片 ID ${id} 不存在`,
        HttpStatus.NOT_FOUND
      );
    }
  }

  /**
   * 获取随机图片
   * @param count 图片数量
   * @returns 随机图片列表
   */
  async getRandomImages(count: number = 10): Promise<PicsumImage[]> {
    const params = { count, type: 'random' };
    
    try {
      // 首先尝试从缓存获取
      const cachedData = await this.cacheService.getFromCache(params);
      
      if (cachedData) {
        return cachedData;
      }

      // 缓存中没有，从 API 获取
      console.log(` 从 API 获取随机图片: count=${count}`);
      const url = `${this.baseUrl}/list?limit=${count}`;
      
      const response = await axios.get<PicsumImage[]>(url);
      const images = response.data;

      // 保存到缓存
      await this.cacheService.saveToCache(params, images);

      return images;
    } catch (error) {
      console.error(' 获取随机图片失败:', error.message);
      throw new HttpException(
        '获取随机图片失败',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  /**
   * 获取指定尺寸的图片 URL
   * @param id 图片 ID
   * @param width 宽度
   * @param height 高度
   * @returns 图片 URL
   */
  getImageUrl(id: string, width: number = 400, height: number = 400): string {
    return `https://picsum.photos/id/${id}/${width}/${height}`;
  }

  /**
   * 清理缓存
   */
  async cleanCache(): Promise<void> {
    await this.cacheService.cleanExpiredCache();
  }

  /**
   * 获取缓存统计
   */
  async getCacheStats(): Promise<{ totalFiles: number; totalSize: number }> {
    return await this.cacheService.getCacheStats();
  }
}
