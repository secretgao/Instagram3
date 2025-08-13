import React from 'react';

interface Post {
  id: string;
  imageUrl: string;
  author: string;
  likes: number;
  caption: string;
}


interface ImageModalProps {
  post: Post | null;
  isOpen: boolean;
  onClose: () => void;
}

const ImageModal: React.FC<ImageModalProps> = ({ post, isOpen, onClose }) => {
  if (!isOpen || !post) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      <div className="relative max-w-4xl max-h-full bg-white rounded-lg overflow-hidden">
        {/* 关闭按钮 */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 bg-black bg-opacity-50 text-white rounded-full w-10 h-10 flex items-center justify-center hover:bg-opacity-70 transition-all"
        >
          ✕
        </button>

        {/* 图片 */}
        <div className="relative">
          <img
            src={post.imageUrl}
            alt={post.caption}
            className="w-full h-auto max-h-[80vh] object-contain"
          />
          
          {/* 图片信息覆盖层 */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-6">
            <div className="text-white">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold">by {post.author}</h3>
                <div className="flex items-center space-x-2">
                  <span className="text-lg">❤️</span>
                  <span className="font-semibold">{post.likes.toLocaleString()}</span>
                </div>
              </div>
              <p className="text-sm opacity-90">{post.caption}</p>
            </div>
          </div>
        </div>

        {/* 操作按钮 */}
        <div className="p-4 bg-gray-50 flex items-center justify-between">
          <div className="flex space-x-2">
            <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors">
              ❤️ 点赞
            </button>
            <button className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors">
              💬 评论
            </button>
          </div>
          <a
            href={post.imageUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
          >
            📥 下载
          </a>
        </div>
      </div>
    </div>
  );
};

export default ImageModal;
