import { Eye, MessageCircle } from 'lucide-react';

export function PostEngagement() {
  return (
    <div className="flex items-center space-x-4 text-sm text-gray-500 mb-6 px-6 lg:px-8">
      <div className="flex items-center">
        <Eye className="w-4 h-4 mr-1" />
        <span>1.2K lượt xem</span>
      </div>
      <div className="flex items-center">
        <MessageCircle className="w-4 h-4 mr-1" />
        <span>5 bình luận</span>
      </div>
    </div>
  );
}