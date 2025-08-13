import React from 'react';

const HashtagProfile: React.FC = () => {
  return (
    <div className="flex items-center space-x-8 mb-8">
      {/* 头像 */}
      <div className="relative">
        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center overflow-hidden">
          <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-green-500 flex items-center justify-center text-white text-xs font-bold">
              🌱
            </div>
          </div>
        </div>
      </div>

      {/* 话题信息 */}
      <div className="flex-1">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">#houseplants</h2>
        <div className="flex items-center space-x-8 text-sm text-gray-600 mb-4">
          <span className="font-semibold">10,690,626 posts</span>
        </div>
        <div className="text-sm text-gray-500">
          <span className="font-medium">Top posts</span>
        </div>
      </div>
    </div>
  );
};

export default HashtagProfile;
