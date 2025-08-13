import React from 'react';

interface Post {
  id: string;
  imageUrl: string;
  author: string;
  likes: number;
  caption: string;
}

interface PostsGridProps {
  posts: Post[];
  lastPostRef?: (node: HTMLDivElement) => void;
  onImageClick: (post: Post) => void;
}

const PostsGrid: React.FC<PostsGridProps> = ({ posts, lastPostRef, onImageClick }) => {
  return (
    <div className="grid grid-cols-3 gap-1">
      {posts.map((post, index) => {
        // 输出每个帖子的 imageUrl 到控制台
        console.log(`🖼️ 图片 ${post.id} 的 src URL:`, post.imageUrl);
        
        // 如果是最后一个帖子，添加 ref 用于无限滚动
        const isLastPost = index === posts.length - 1;
        
        return (
          <div 
            key={post.id} 
            className="relative group cursor-pointer"
            ref={isLastPost ? lastPostRef : undefined}
            onClick={() => onImageClick(post)}
          >
            <div className="aspect-square relative overflow-hidden">
              <img
                src={post.imageUrl}
                alt={post.caption}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              
              {/* 悬停时的覆盖层 - 默认隐藏，悬停时显示 */}
              <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-30 transition-opacity duration-300 flex items-center justify-center">
                <div className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-center">
                  <div className="flex items-center justify-center space-x-4 mb-2">
                    <div className="flex items-center space-x-1">
                      <span className="text-lg">❤️</span>
                      <span className="font-semibold">{post.likes.toLocaleString()}</span>
                    </div>
                  </div>
                  <p className="text-sm max-w-xs truncate">{post.caption}</p>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default PostsGrid;
