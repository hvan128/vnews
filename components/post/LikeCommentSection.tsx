import { HeartIcon, MessageCircle } from 'lucide-react';

export function LikeCommentSection() {
  return (
    <div className="mt-10 pt-6 border-t border-gray-100 px-6 lg:px-8">
      <div className="flex justify-between items-center">
        <button className="flex items-center gap-2 text-gray-600 hover:text-red-500 transition-colors">
          <HeartIcon className="w-6 h-6" />
          <span>29 Thích</span>
        </button>
        <button className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors">
          <MessageCircle className="w-6 h-6" />
          <span>5 Bình luận</span>
        </button>
      </div>
    </div>
  );
}