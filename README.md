# Picsum 图片展示系统

一个完整的全栈项目，包含 NestJS 后端 API（带缓存功能）和 NextJS 前端展示页面。

## 🚀 项目结构

```
picsum-cache-api/
├── src/                    # 后端源码
│   ├── main.ts
│   ├── app.module.ts
│   ├── cache/             # 缓存服务
│   └── images/            # 图片服务
├── frontend/              # 前端项目
│   ├── src/
│   │   ├── app/
│   │   └── components/
│   └── package.json
├── cache/                 # 缓存文件目录
└── README.md
```

## 🛠️ 技术栈

### 后端
- **框架**: NestJS

### 前端
- **框架**: React

## 📦 安装和运行

### 1. 启动后端服务

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run start:dev
```

后端服务将在 http://localhost:3001 运行

### 2. 启动前端服务

```bash
# 进入前端目录
cd frontend

# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

前端服务将在 http://localhost:3000 运行
  
 
### API 调用示例
```bash
# 获取图片列表
curl "http://localhost:3001/images?page=1&limit=12"

# 获取缓存统计
curl "http://localhost:3001/images/cache/stats"

# 清理缓存
curl "http://localhost:3001/images/cache/clean"
``` 