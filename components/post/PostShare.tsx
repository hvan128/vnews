import { Facebook, Twitter, Linkedin, Share2, Bookmark, Printer } from 'lucide-react';

export function PostShare() {
  return (
    <div className="flex justify-between items-center py-4 border-t border-b border-gray-100 mb-8 px-6 lg:px-8">
      <div className="flex items-center space-x-1">
        <span className="text-sm text-gray-600 mr-2">Chia sẻ:</span>
        <button className="p-2 rounded-full hover:bg-gray-100 text-blue-600 transition-colors">
          <Facebook className="w-5 h-5" />
        </button>
        <button className="p-2 rounded-full hover:bg-gray-100 text-blue-400 transition-colors">
          <Twitter className="w-5 h-5" />
        </button>
        <button className="p-2 rounded-full hover:bg-gray-100 text-blue-700 transition-colors">
          <Linkedin className="w-5 h-5" />
        </button>
        <button className="p-2 rounded-full hover:bg-gray-100 text-gray-600 transition-colors">
          <Share2 className="w-5 h-5" />
        </button>
        <button className="p-2 rounded-full hover:bg-gray-100 text-gray-600 transition-colors">
          <Printer className="w-5 h-5" />
        </button>
      </div>
      <button className="flex items-center gap-1 px-3 py-1 text-sm font-medium text-gray-600 hover:text-blue-600 border border-gray-200 rounded-full hover:border-blue-200 transition-all">
        <Bookmark className="w-4 h-4" />
        <span>Lưu</span>
      </button>
    </div>
  );
}