# pic project 
一个基于 NestJS 的后端 API 项目，用于请求 [pic project](https://picsum.photos/v2/list?page=2&limit=100) 并实现文件缓存功能。

##  功能特性

 
- **文件缓存**: 自动缓存 API 响应到本地文件
- **缓存管理**: 支持缓存过期、清理和统计
- **智能缓存**: 相同参数请求直接从缓存返回
- **RESTful API**: 提供完整的 REST API 接口

## 📁 项目结构

```
picsum-cache-api/
├── src/
│   ├── main.ts                 # 应用入口
│   ├── app.module.ts           # 主模块
│   ├── cache/
│   │   └── cache.service.ts    # 缓存服务
│   └── images/
│       ├── images.controller.ts # 图片控制器
│       └── images.service.ts   # 图片服务
├── cache/                      # 缓存文件目录
├── package.json
└── README.md
```

##  安装和运行

### 1. 安装依赖

```bash
npm install
```

### 2. 启动开发服务器

```bash
npm run start:dev
```

服务将在 http://localhost:3001 运行

##  API 接口

### 获取图片列表
- **GET** `/images?page=2&limit=100`
- **功能**: 获取指定页码和数量的图片列表
- **缓存**:  支持缓存
- **参数**:
  - `page`: 页码 (默认: 1)
  - `limit`: 每页数量 (默认: 100)

### 获取单张图片信息
- **GET** `/images/:id`
- **功能**: 根据 ID 获取单张图片的详细信息
- **参数**:
  - `id`: 图片 ID

### 获取随机图片
- **GET** `/images/random?count=10`
- **功能**: 获取指定数量的随机图片
- **参数**:
  - `count`: 图片数量 (默认: 10)

### 获取图片 URL
- **GET** `/images/:id/url?width=400&height=400`
- **功能**: 获取指定尺寸的图片 URL
- **参数**:
  - `id`: 图片 ID
  - `width`: 宽度 (默认: 400)
  - `height`: 高度 (默认: 400)

### 缓存管理

#### 清理过期缓存
- **GET** `/images/cache/clean`
- **功能**: 清理所有过期的缓存文件

#### 获取缓存统计
- **GET** `/images/cache/stats`
- **功能**: 获取缓存统计信息
- **返回**:
  ```json
  {
    "totalFiles": 5,
    "totalSize": 10240
  }
  ```

##  缓存机制

### 缓存策略
- **缓存键**: 基于请求参数的 MD5 哈希
- **缓存位置**: `./cache/` 目录
- **缓存格式**: JSON 文件
- **过期时间**: 24 小时

 
 
