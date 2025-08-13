import React, { useState, useEffect, useCallback, useRef } from 'react';
import Header from './components/Header';
import HashtagProfile from './components/HashtagProfile';
import PostsGrid from './components/PostsGrid';
import ImageModal from './components/ImageModal';
import './App.css';

interface PicsumImage {
  id: string;
  author: string;
  width: number;
  height: number;
  url: string;
  download_url: string;
}

interface Post {
  id: string;
  imageUrl: string;
  author: string;
  likes: number;
  caption: string;
}

function App() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const observer = useRef<IntersectionObserver | null>(null);

  // 获取图片数据的函数
  const fetchPosts = useCallback(async (page: number, isLoadMore: boolean = false) => {
    try {
      if (isLoadMore) {
        setLoadingMore(true);
      } else {
        setLoading(true);
      }
      setError(null);
      
      // 调用后端 API 获取图片数据
      const response = await fetch(`http://localhost:3001/images?page=${page}&limit=9`);
      
      if (!response.ok) {
        throw new Error('获取图片失败');
      }
      
      const data = await response.json();
      console.log(`📊 第${page}页数据详情:`, data);
      
      // 将 Picsum 图片数据转换为 Post 格式，使用 download_url 作为图片地址
      const convertedPosts: Post[] = data.images.map((image: PicsumImage, index: number) => ({
        id: `${image.id}-${page}-${index}`, // 确保 ID 唯一
        imageUrl: image.download_url, // 使用 download_url 字段作为图片地址
        author: image.author,
        likes: Math.floor(Math.random() * 3000) + 500, // 随机生成点赞数
        caption: `Beautiful photo by ${image.author} 📸`
      }));
      
      if (isLoadMore) {
        setPosts(prevPosts => [...prevPosts, ...convertedPosts]);
      } else {
        setPosts(convertedPosts);
      }
      
      console.log('✅ 从后端获取图片成功:', data.fromCache ? '来自缓存' : '来自API');
      
      // 检查是否还有更多数据
      setHasMore(data.images.length === 9);
      
    } catch (error) {
      console.error('❌ 获取图片失败:', error);
      setError(error instanceof Error ? error.message : '获取图片失败');
      
      // 如果后端不可用，使用备用数据
      const fallbackPosts: Post[] = [
        {
          id: `fallback-${page}-1`,
          imageUrl: `https://picsum.photos/400/400?random=${page * 10 + 1}`,
          author: 'plant_lover',
          likes: 1247,
          caption: 'Beautiful red flower blooming! 🌺'
        },
        {
          id: `fallback-${page}-2`,
          imageUrl: `https://picsum.photos/400/400?random=${page * 10 + 2}`,
          author: 'green_thumb',
          likes: 892,
          caption: 'Variegated leaves are my favorite! 🍃'
        },
        {
          id: `fallback-${page}-3`,
          imageUrl: `https://picsum.photos/400/400?random=${page * 10 + 3}`,
          author: 'nature_photographer',
          likes: 2156,
          caption: 'Spring when birds are building their nests! 🐦'
        },
        {
          id: `fallback-${page}-4`,
          imageUrl: `https://picsum.photos/400/400?random=${page * 10 + 4}`,
          author: 'bonsai_master',
          likes: 743,
          caption: 'Perfect bonsai tree in my collection 🌳'
        },
        {
          id: `fallback-${page}-5`,
          imageUrl: `https://picsum.photos/400/400?random=${page * 10 + 5}`,
          author: 'leaf_collector',
          likes: 1567,
          caption: 'Close-up of this stunning variegation ✨'
        },
        {
          id: `fallback-${page}-6`,
          imageUrl: `https://picsum.photos/400/400?random=${page * 10 + 6}`,
          author: 'plant_shop_owner',
          likes: 3421,
          caption: 'Our cozy plant-filled cafe ☕🌿'
        },
        {
          id: `fallback-${page}-7`,
          imageUrl: `https://picsum.photos/400/400?random=${page * 10 + 7}`,
          author: 'indoor_gardener',
          likes: 987,
          caption: 'Another beautiful variegated leaf 💚'
        },
        {
          id: `fallback-${page}-8`,
          imageUrl: `https://picsum.photos/400/400?random=${page * 10 + 8}`,
          author: 'plant_mom',
          likes: 2789,
          caption: 'Me and my favorite plant! 🌱'
        },
        {
          id: `fallback-${page}-9`,
          imageUrl: `https://picsum.photos/400/400?random=${page * 10 + 9}`,
          author: 'home_decor_lover',
          likes: 1892,
          caption: 'Living room goals with all these plants 🏠'
        }
      ];
      
      if (isLoadMore) {
        setPosts(prevPosts => [...prevPosts, ...fallbackPosts]);
      } else {
        setPosts(fallbackPosts);
      }
      
      setHasMore(true); // 备用数据总是有更多
    } finally {
      if (isLoadMore) {
        setLoadingMore(false);
      } else {
        setLoading(false);
      }
    }
  }, []);

  // 初始加载
  useEffect(() => {
    fetchPosts(1, false);
  }, [fetchPosts]);

  // 无限滚动观察器
  const lastPostElementRef = useCallback((node: HTMLDivElement) => {
    if (loading || loadingMore) return;
    
    if (observer.current) observer.current.disconnect();
    
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        console.log('🔄 触发无限滚动，加载下一页');
        const nextPage = currentPage + 1;
        setCurrentPage(nextPage);
        fetchPosts(nextPage, true);
      }
    });
    
    if (node) observer.current.observe(node);
  }, [loading, loadingMore, hasMore, currentPage, fetchPosts]);

  // 处理图片点击
  const handleImageClick = (post: Post) => {
    setSelectedPost(post);
    setIsModalOpen(true);
  };

  // 关闭模态框
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedPost(null);
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 py-8">
        <HashtagProfile />
        
        {error && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <span className="text-yellow-600 mr-2">⚠️</span>
              <span className="text-yellow-800 text-sm">
                后端连接失败，使用备用数据。错误: {error}
              </span>
            </div>
          </div>
        )}
        
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <>
            <PostsGrid 
              posts={posts} 
              lastPostRef={lastPostElementRef} 
              onImageClick={handleImageClick}
            />
            
            {/* 加载更多指示器 */}
            {loadingMore && (
              <div className="flex justify-center items-center py-8">
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                  <span className="text-gray-600 text-sm">加载更多图片...</span>
                </div>
              </div>
            )}
            
            {/* 没有更多数据的提示 */}
            {!hasMore && posts.length > 0 && (
              <div className="text-center py-8">
                <p className="text-gray-500 text-sm">🎉 已经加载完所有图片了！</p>
              </div>
            )}
          </>
        )}
      </main>

      {/* 图片模态框 */}
      <ImageModal
        post={selectedPost}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
}

export default App;
