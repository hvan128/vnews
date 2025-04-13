export function RelatedArticles() {
    return (
      <div className="mt-12 pt-6 border-t border-gray-200 px-6 lg:px-8">
        <h3 className="text-xl font-bold mb-6">Bài viết liên quan</h3>
        <div className="grid sm:grid-cols-2 gap-6">
          <div className="group">
            <div className="aspect-video relative rounded-lg overflow-hidden bg-gray-100 mb-3">
              <div className="absolute inset-0 bg-gray-200 animate-pulse"></div>
            </div>
            <h4 className="font-medium group-hover:text-blue-600 line-clamp-2 transition-colors">6 món ăn lúc đói giúp ổn định đường huyết</h4>
            <p className="text-sm text-gray-500 mt-1">10/04/2025 • 3 phút đọc</p>
          </div>
          <div className="group">
            <div className="aspect-video relative rounded-lg overflow-hidden bg-gray-100 mb-3">
              <div className="absolute inset-0 bg-gray-200 animate-pulse"></div>
            </div>
            <h4 className="font-medium group-hover:text-blue-600 line-clamp-2 transition-colors">Điều gì xảy ra khi người tiểu đường nhịn ăn gián đoạn</h4>
            <p className="text-sm text-gray-500 mt-1">08/04/2025 • 4 phút đọc</p>
          </div>
        </div>
      </div>
    );
  }