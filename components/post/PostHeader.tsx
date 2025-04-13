// src/components/post/PostHeader.tsx
import { Calendar, Clock, ExternalLink, User } from 'lucide-react';
import Link from 'next/link';

type PostHeaderProps = {
  title: string;
  description?: string;
  publishedAt?: Date;
  readTime?: number;
  author?: string;
  source?: string;
  originalUrl?: string;
  mainCategory?: string;
  subCategory?: string;
};

export function PostHeader({
  title,
  description,
  publishedAt,
  readTime,
  author,
  source,
  originalUrl,
  mainCategory,
  subCategory
}: PostHeaderProps) {
  // Format date function
  const formatDate = (dateString: Date) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  return (
    <div>
      {/* Breadcrumbs */}
      <div className="px-6 lg:px-8 pt-6 pb-2">
        <div className="flex items-center text-sm text-gray-500">
          <Link href="/" className="hover:text-blue-600 transition-colors">Trang chủ</Link>
          <span className="mx-2">›</span>
          {mainCategory && (
            <>
              <Link href={`/${mainCategory.toLowerCase()}`} className="hover:text-blue-600 transition-colors">
                {mainCategory}
              </Link>
              <span className="mx-2">›</span>
            </>
          )}
          {subCategory && (
            <>
              <Link href={`/${mainCategory?.toLowerCase()}/${subCategory.toLowerCase()}`} className="hover:text-blue-600 transition-colors">
                {subCategory}
              </Link>
              <span className="mx-2">›</span>
            </>
          )}
          <span className="truncate text-gray-700">{title}</span>
        </div>
      </div>
      
      <div className="px-6 lg:px-8 pb-8">
        {/* Category badge */}
        {subCategory && (
          <Link 
            href={`/${mainCategory?.toLowerCase()}/${subCategory.toLowerCase()}`}
            className="inline-block px-3 py-1 text-xs font-medium text-blue-800 bg-blue-100 rounded-full mb-4 hover:bg-blue-200 transition-colors"
          >
            {subCategory}
          </Link>
        )}
        
        {/* Tiêu đề và thông tin bài viết */}
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mt-2 mb-4 text-gray-900 leading-tight">
          {title}
        </h1>
        
        {description && (
          <p className="text-lg text-gray-600 mb-6 font-medium border-l-4 border-blue-500 pl-4 italic">
            {description}
          </p>
        )}
        
        {/* Metadata */}
        <div className="flex flex-wrap items-center text-sm text-gray-500 mb-4 gap-x-6 gap-y-2">
          {publishedAt && (
            <div className="flex items-center">
              <Calendar className="w-4 h-4 mr-2 text-blue-600" />
              <span>{formatDate(publishedAt)}</span>
            </div>
          )}
          
          {readTime && (
            <div className="flex items-center">
              <Clock className="w-4 h-4 mr-2 text-blue-600" />
              <span>{readTime} phút đọc</span>
            </div>
          )}
          
          {author && (
            <div className="flex items-center">
              <User className="w-4 h-4 mr-2 text-blue-600" />
              <span>{author}</span>
            </div>
          )}
          
          {source && (
            <div className="flex items-center">
              <span className="mr-1">Nguồn:</span>
              {originalUrl ? (
                <a 
                  href={originalUrl}
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:underline flex items-center text-blue-600"
                >
                  {source}
                  <ExternalLink className="w-3 h-3 ml-1" />
                </a>
              ) : (
                <span>{source}</span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}