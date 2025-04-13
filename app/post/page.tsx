'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Calendar, Clock, User, Tag, ExternalLink } from 'lucide-react';

interface Post {
  _id: string;
  title: string;
  rewriteTitle: string;
  slug: string;
  content: string;
  rewritten: string;
  htmlContent: string;
  thumbnail: string;
  images: string[];
  description: string;
  author: string;
  publishedAt: Date;
  source: string;
  mainCategory: string;
  subCategory: string;
  tags: string[];
  readTime: number;
  originalUrl: string;
  published: boolean;
  createdAt: Date;
}

export default function PostsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const res = await fetch('/api/post');
        if (!res.ok) throw new Error('Failed to fetch posts');
        
        const data = await res.json();
        if (data.success) setPosts(data.posts);
      } catch (error) {
        console.error('Error fetching posts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  // Format date function
  const formatDate = (dateString: Date) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-5xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-6 pb-2 border-b border-gray-200">Tin tức mới nhất</h1>
        
        {posts.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-lg text-gray-600">Không có bài viết nào. Vui lòng quay lại sau.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <article 
                key={post._id} 
                className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300"
              >
                {post.thumbnail && (
                  <div className="relative h-48 overflow-hidden">
                    <img 
                      src={post.thumbnail} 
                      alt={post.rewriteTitle || post.title} 
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                    {post.mainCategory && (
                      <Link href={`/${post.mainCategory.toLowerCase()}`}>
                        <span className="absolute top-3 left-3 bg-blue-600 text-white text-xs font-semibold px-2 py-1 rounded">
                          {post.mainCategory}
                        </span>
                      </Link>
                    )}
                  </div>
                )}
                
                <div className="p-4">
                  <h2 className="text-xl font-bold mb-2 line-clamp-2 hover:text-blue-600 transition-colors">
                    <Link href={`/post/${post.slug}`}>
                      {post.rewriteTitle || post.title}
                    </Link>
                  </h2>
                  
                  <div className="flex items-center text-xs text-gray-500 mb-3 space-x-3">
                    {post.publishedAt && (
                      <div className="flex items-center">
                        <Calendar className="w-3 h-3 mr-1" />
                        <span>{formatDate(post.publishedAt)}</span>
                      </div>
                    )}
                    
                    {post.readTime && (
                      <div className="flex items-center">
                        <Clock className="w-3 h-3 mr-1" />
                        <span>{post.readTime} phút đọc</span>
                      </div>
                    )}
                    
                    {post.author && (
                      <div className="flex items-center">
                        <User className="w-3 h-3 mr-1" />
                        <span>{post.author}</span>
                      </div>
                    )}
                  </div>
                  
                  {post.description ? (
                    <p className="text-gray-600 text-sm mb-3 line-clamp-3">{post.description}</p>
                  ) : (
                    <div 
                      className="text-gray-600 text-sm mb-3 line-clamp-3"
                      dangerouslySetInnerHTML={{ 
                        __html: post.rewritten || post.content || ''
                      }} 
                    />
                  )}
                  
                  {post.tags && post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-3">
                      {post.tags.slice(0, 3).map((tag, index) => (
                        <Link 
                          key={index} 
                          href={`/tag/${tag}`}
                          className="inline-flex items-center text-xs bg-gray-100 hover:bg-gray-200 rounded px-2 py-1"
                        >
                          <Tag className="w-3 h-3 mr-1" />
                          {tag}
                        </Link>
                      ))}
                    </div>
                  )}
                  
                  <div className="flex justify-between items-center mt-4 pt-3 border-t border-gray-100">
                    <Link 
                      href={`/post/${post.slug}`}
                      className="text-sm font-medium text-blue-600 hover:text-blue-800"
                    >
                      Đọc tiếp
                    </Link>
                    
                    {post.source && (
                      <span className="text-xs text-gray-500 flex items-center">
                        <span className="mr-1">Nguồn:</span>
                        {post.originalUrl ? (
                          <a 
                            href={post.originalUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="hover:underline flex items-center"
                          >
                            {post.source}
                            <ExternalLink className="w-3 h-3 ml-1" />
                          </a>
                        ) : (
                          post.source
                        )}
                      </span>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
        
        {posts.length > 0 && (
          <div className="mt-10 text-center">
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition-colors">
              Xem thêm
            </button>
          </div>
        )}
      </div>
    </div>
  );
}