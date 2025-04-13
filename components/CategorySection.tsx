// components/CategorySection.tsx
import React from 'react';
import Link from 'next/link';
import NewsPostLayout from './NewsPostLayout';
import { PostType } from '../models/Post';
import { ArrowRight } from 'lucide-react';

type CategorySectionProps = {
  title: string;
  posts: PostType[];
  categorySlug: string;
  accentColor?: string;
  icon?: React.ReactNode;
};

export default function CategorySection({
  title,
  posts,
  categorySlug,
  accentColor = 'blue-600',
  icon
}: CategorySectionProps) {
  if (!posts || posts.length === 0) {
    return null;
  }

  return (
    <div className="mb-12">
      <div className="flex items-center justify-between border-b pb-2 mb-6">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          {icon && <span className="text-gray-700">{icon}</span>}
          <span className={`border-b-2 border-${accentColor} pb-2`}>{title}</span>
        </h2>
        <Link 
          href={`/${categorySlug}`}
          className="text-sm text-gray-500 hover:text-gray-700"
        >
          Xem tất cả
        </Link>
      </div>
      
      <NewsPostLayout posts={posts} />
      
      <div className="text-center mt-8">
        <Link 
          href={`/${categorySlug}`} 
          className={`inline-flex items-center px-5 py-2.5 border border-${accentColor} text-${accentColor} rounded-lg hover:bg-${accentColor} hover:text-white transition-colors font-medium`}
        >
          Xem thêm tin {title}
          <ArrowRight size={16} className="ml-2" />
        </Link>
      </div>
    </div>
  );
}