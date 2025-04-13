import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';

export function PostNavigation() {
  return (
    <div className="mt-8 flex justify-between max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <Link 
        href="/"
        className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
      >
        <ChevronLeft className="w-5 h-5 mr-1" />
        <span>Quay lại danh sách</span>
      </Link>
      
      <button className="flex items-center text-blue-600 hover:text-blue-800 transition-colors">
        <span>Bài tiếp theo</span>
        <ChevronLeft className="w-5 h-5 ml-1 rotate-180" />
      </button>
    </div>
  );
}