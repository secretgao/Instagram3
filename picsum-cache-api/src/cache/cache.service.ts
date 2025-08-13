import { Injectable } from '@nestjs/common';
import * as fs from 'fs-extra';
import * as path from 'path';
import * as crypto from 'crypto';

export interface CacheMetadata {
  timestamp: number;
  expiresAt: number;
  data: any;
}

@Injectable()
export class CacheService {
  private readonly cacheDir = './cache';
  private readonly cacheExpiry = 24 * 60 * 60 * 1000; // 24小时

  constructor() {
    this.ensureCacheDirectory();
  }

  /**
   * 确保缓存目录存在
   */
  private async ensureCacheDirectory(): Promise<void> {
    try {
      await fs.ensureDir(this.cacheDir);
      console.log(`缓存目录已创建: ${this.cacheDir}`);
    } catch (error) {
      console.error('创建缓存目录失败:', error);
    }
  }

  /**
   * 生成缓存键
   * @param params 请求参数
   * @returns 缓存键
   */
  private generateCacheKey(params: any): string {
    const paramString = JSON.stringify(params);
    return crypto.createHash('md5').update(paramString).digest('hex');
  }

  /**
   * 获取缓存文件路径
   * @param cacheKey 缓存键
   * @returns 缓存文件路径
   */
  private getCacheFilePath(cacheKey: string): string {
    return path.join(this.cacheDir, `${cacheKey}.json`);
  }

  /**
   * 从缓存获取数据
   * @param params 请求参数
   * @returns 缓存的数据或 null
   */
  async getFromCache(params: any): Promise<any | null> {
    try {
      const cacheKey = this.generateCacheKey(params);
      const cacheFilePath = this.getCacheFilePath(cacheKey);

      // 检查缓存文件是否存在
      if (!await fs.pathExists(cacheFilePath)) {
        console.log(`缓存不存在: ${cacheKey}`);
        return null;
      }

      // 读取缓存文件
      const cacheData: CacheMetadata = await fs.readJson(cacheFilePath);
      
      // 检查缓存是否过期
      if (Date.now() > cacheData.expiresAt) {
        console.log(`缓存已过期: ${cacheKey}`);
        await this.removeCache(cacheKey);
        return null;
      }

      console.log(`从缓存获取数据: ${cacheKey}`);
      return cacheData.data;
    } catch (error) {
      console.error('读取缓存失败:', error);
      return null;
    }
  }

  /**
   * 保存数据到缓存
   * @param params 请求参数
   * @param data 要缓存的数据
   */
  async saveToCache(params: any, data: any): Promise<void> {
    try {
      const cacheKey = this.generateCacheKey(params);
      const cacheFilePath = this.getCacheFilePath(cacheKey);

      const cacheData: CacheMetadata = {
        timestamp: Date.now(),
        expiresAt: Date.now() + this.cacheExpiry,
        data
      };

      await fs.writeJson(cacheFilePath, cacheData, { spaces: 2 });
      console.log(`数据已缓存: ${cacheKey}`);
    } catch (error) {
      console.error('保存缓存失败:', error);
    }
  }

  /**
   * 删除缓存
   * @param cacheKey 缓存键
   */
  async removeCache(cacheKey: string): Promise<void> {
    try {
      const cacheFilePath = this.getCacheFilePath(cacheKey);
      await fs.remove(cacheFilePath);
      console.log(`缓存已删除: ${cacheKey}`);
    } catch (error) {
      console.error('删除缓存失败:', error);
    }
  }

  /**
   * 清理过期缓存
   */
  async cleanExpiredCache(): Promise<void> {
    try {
      const files = await fs.readdir(this.cacheDir);
      let cleanedCount = 0;

      for (const file of files) {
        if (file.endsWith('.json')) {
          const filePath = path.join(this.cacheDir, file);
          const cacheData: CacheMetadata = await fs.readJson(filePath);
          
          if (Date.now() > cacheData.expiresAt) {
            await fs.remove(filePath);
            cleanedCount++;
          }
        }
      }

      if (cleanedCount > 0) {
        console.log(`清理了 ${cleanedCount} 个过期缓存文件`);
      }
    } catch (error) {
      console.error('清理过期缓存失败:', error);
    }
  }

  /**
   * 获取缓存统计信息
   */
  async getCacheStats(): Promise<{ totalFiles: number; totalSize: number }> {
    try {
      const files = await fs.readdir(this.cacheDir);
      let totalSize = 0;

      for (const file of files) {
        if (file.endsWith('.json')) {
          const filePath = path.join(this.cacheDir, file);
          const stats = await fs.stat(filePath);
          totalSize += stats.size;
        }
      }

      return {
        totalFiles: files.filter(f => f.endsWith('.json')).length,
        totalSize
      };
    } catch (error) {
      console.error('获取缓存统计失败:', error);
      return { totalFiles: 0, totalSize: 0 };
    }
  }
}
