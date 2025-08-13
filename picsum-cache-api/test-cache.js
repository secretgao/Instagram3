const axios = require('axios');

const BASE_URL = 'http://localhost:3001';

async function testCache() {
  console.log('🧪 测试 Picsum Cache API...\n');

  try {
    // 第一次请求 - 应该从 API 获取并缓存
    console.log('1️⃣ 第一次请求 (page=2, limit=3):');
    const start1 = Date.now();
    const response1 = await axios.get(`${BASE_URL}/images?page=2&limit=3`);
    const time1 = Date.now() - start1;
    
    console.log(`✅ 响应时间: ${time1}ms`);
    console.log(`📊 数据来源: ${response1.data.fromCache ? '缓存' : 'API'}`);
    console.log(`📸 图片数量: ${response1.data.total}`);
    console.log('');

    // 第二次请求相同参数 - 应该从缓存获取
    console.log('2️⃣ 第二次请求相同参数 (page=2, limit=3):');
    const start2 = Date.now();
    const response2 = await axios.get(`${BASE_URL}/images?page=2&limit=3`);
    const time2 = Date.now() - start2;
    
    console.log(`✅ 响应时间: ${time2}ms`);
    console.log(`📊 数据来源: ${response2.data.fromCache ? '缓存' : 'API'}`);
    console.log(`📸 图片数量: ${response2.data.total}`);
    console.log('');

    // 请求不同参数 - 应该从 API 获取
    console.log('3️⃣ 请求不同参数 (page=3, limit=2):');
    const start3 = Date.now();
    const response3 = await axios.get(`${BASE_URL}/images?page=3&limit=2`);
    const time3 = Date.now() - start3;
    
    console.log(`✅ 响应时间: ${time3}ms`);
    console.log(`📊 数据来源: ${response3.data.fromCache ? '缓存' : 'API'}`);
    console.log(`📸 图片数量: ${response3.data.total}`);
    console.log('');

    // 获取缓存统计
    console.log('4️⃣ 获取缓存统计:');
    const statsResponse = await axios.get(`${BASE_URL}/images/cache/stats`);
    console.log(`📁 缓存文件数: ${statsResponse.data.totalFiles}`);
    console.log(`💾 缓存总大小: ${(statsResponse.data.totalSize / 1024).toFixed(2)} KB`);
    console.log('');

    // 测试单张图片缓存
    console.log('5️⃣ 测试单张图片缓存 (ID: 102):');
    const start4 = Date.now();
    const imageResponse = await axios.get(`${BASE_URL}/images/102`);
    const time4 = Date.now() - start4;
    
    console.log(`✅ 响应时间: ${time4}ms`);
    console.log(`👤 作者: ${imageResponse.data.author}`);
    console.log(`📐 尺寸: ${imageResponse.data.width}x${imageResponse.data.height}`);
    console.log('');

    console.log('🎉 所有测试完成！');
    console.log('\n📱 API 地址: http://localhost:3001');
    console.log('🗂️  缓存目录: ./cache');

  } catch (error) {
    console.error('❌ 测试失败:', error.message);
  }
}

testCache();
