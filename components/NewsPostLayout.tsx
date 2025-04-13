"use client"
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { PostType } from '../models/Post';
import { format } from 'date-fns';
import { Clock, Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';

type Props = {
  posts: PostType[];
  pagination?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
  onPageChange?: (page: number) => void;
  categorySlug?: string;
  subCategorySlug?: string;
  fetchPosts?: (page: number) => Promise<{
    data: PostType[];
    pagination: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
      hasNextPage: boolean;
      hasPrevPage: boolean;
    };
  }>;
};

export default function NewsPostLayout({
  posts: initialPosts,
  pagination: initialPagination,
  onPageChange,
  categorySlug,
  subCategorySlug,
  fetchPosts
}: Props) {
  // Client-side state
  const [posts, setPosts] = useState<PostType[]>(initialPosts);
  const [pagination, setPagination] = useState(initialPagination);
  const [isLoading, setIsLoading] = useState(false);
  
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Handle page changes client-side
  const handlePageChange = async (page: number) => {
    if (onPageChange) {
      onPageChange(page);
      return;
    }
    
    if (fetchPosts) {
      setIsLoading(true);
      try {
        const result = await fetchPosts(page);
        setPosts(result.data);
        setPagination(result.pagination);
        
        // Update URL without full page reload
        const params = new URLSearchParams(searchParams.toString());
        params.set('page', page.toString());
        
        // Update the URL without a full page reload
        router.push(`?${params.toString()}`, { scroll: false });
      } catch (error) {
        console.error('Error fetching posts:', error);
      } finally {
        setIsLoading(false);
      }
    } else {
      // Fallback to URL-based navigation if fetchPosts not provided
      const baseUrl = getPageUrl(page);
      router.push(baseUrl);
    }
  };

  // Sync state with props when they change
  useEffect(() => {
    setPosts(initialPosts);
    setPagination(initialPagination);
  }, [initialPosts, initialPagination]);

  // Nếu không có bài viết nào
  if (!posts || posts.length === 0) {
    return <div className="text-center py-10">Không có bài viết nào</div>;
  }

  // Phân chia bài viết
  const featuredPost = posts[0]; // Bài nổi bật nhất
  const secondaryPosts = posts.slice(1, 3); // 2 bài nổi bật tiếp theo
  const remainingPosts = posts.slice(3); // Các bài còn lại

  // Tạo URL cho liên kết phân trang
  const getPageUrl = (page: number) => {
    let baseUrl = '/post';
    if (categorySlug) {
      baseUrl += `/${categorySlug}`;
      if (subCategorySlug) {
        baseUrl += `/${subCategorySlug}`;
      }
    }
    return `${baseUrl}?page=${page}`;
  };

  return (
    <div className={`max-w-7xl mx-auto px-4 ${isLoading ? 'opacity-60' : ''}`}>
      {/* Bài viết nổi bật */}
      {featuredPost && (
        <div className="mb-10">
          <Link
            href={`/post/${featuredPost.slug}`}
            className="block group"
          >
            <div className="grid md:grid-cols-5 gap-6 items-center">
              <div className="md:col-span-3 overflow-hidden rounded-lg">
                <img
                  src={featuredPost.thumbnail || '/placeholder-image.jpg'}
                  alt={featuredPost.title}
                  className="w-full h-[400px] object-cover transform group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
              </div>
              <div className="md:col-span-2 space-y-4">
                <div className="flex items-center space-x-2 text-blue-600">
                  <span className="font-medium uppercase text-sm">Nổi bật</span>
                </div>
                <h2 className="text-3xl font-bold group-hover:text-blue-600 transition-colors">
                  {featuredPost.rewriteTitle || featuredPost.title}
                </h2>
                <div className="flex items-center text-gray-500 text-sm space-x-4">
                  <div className="flex items-center space-x-1">
                    <Clock size={16} />
                    <span>{featuredPost.readTime ? `${featuredPost.readTime} phút đọc` : 'Đọc ngay'}</span>
                  </div>
                  {featuredPost.publishedAt && (
                    <div className="flex items-center space-x-1">
                      <Calendar size={16} />
                      <span>{format(new Date(featuredPost.publishedAt), 'dd/MM/yyyy')}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Link>
        </div>
      )}

      {/* 2 bài viết phụ */}
      {secondaryPosts.length > 0 && (
        <div className="grid md:grid-cols-2 gap-8 mb-10">
          {secondaryPosts.map((post) => (
            <Link
              key={post._id}
              href={`/post/${post.slug}`}
              className="block group"
            >
              <div className="space-y-4">
                <div className="overflow-hidden rounded-lg">
                  <img
                    src={post.thumbnail || '/placeholder-image.jpg'}
                    alt={post.title}
                    className="w-full h-[250px] object-cover transform group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                </div>
                <h3 className="text-xl font-semibold group-hover:text-blue-600 transition-colors">
                  {post.rewriteTitle || post.title}
                </h3>
                <div className="flex items-center text-gray-500 text-sm space-x-4">
                  <div className="flex items-center space-x-1">
                    <Clock size={16} />
                    <span>{post.readTime ? `${post.readTime} phút đọc` : 'Đọc ngay'}</span>
                  </div>
                  {post.publishedAt && (
                    <div className="flex items-center space-x-1">
                      <Calendar size={16} />
                      <span>{format(new Date(post.publishedAt), 'dd/MM/yyyy')}</span>
                    </div>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Phần còn lại của các bài viết */}
      {remainingPosts.length > 0 && (
        <div className="border-t pt-8">
          <h2 className="text-2xl font-bold mb-6">Bài viết mới nhất</h2>
          <div className="space-y-6">
            {remainingPosts.map((post) => (
              <Link
                key={post._id}
                href={`/post/${post.slug}`}
                className="flex flex-col sm:flex-row gap-4 group border-b pb-6"
              >
                <div className="sm:w-1/4 overflow-hidden rounded-lg">
                  <img
                    src={post.thumbnail || '/placeholder-image.jpg'}
                    alt={post.title}
                    className="w-full h-[140px] object-cover transform group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                </div>
                <div className="sm:w-3/4 space-y-2">
                  <h3 className="text-lg font-semibold group-hover:text-blue-600 transition-colors">
                    {post.rewriteTitle || post.title}
                  </h3>
                  <div className="flex items-center text-gray-500 text-sm space-x-4">
                    <div className="flex items-center space-x-1">
                      <Clock size={16} />
                      <span>{post.readTime ? `${post.readTime} phút đọc` : 'Đọc ngay'}</span>
                    </div>
                    {post.publishedAt && (
                      <div className="flex items-center space-x-1">
                        <Calendar size={16} />
                        <span>{format(new Date(post.publishedAt), 'dd/MM/yyyy')}</span>
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Phân trang - đã cập nhật để sử dụng client-side pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex justify-center items-center space-x-2 mt-12 mb-6">
          {/* Nút trang trước */}
          <button
            onClick={() => pagination.hasPrevPage && handlePageChange(pagination.page - 1)}
            disabled={!pagination.hasPrevPage}
            className={`px-3 py-2 rounded-md flex items-center ${
              pagination.hasPrevPage
                ? 'bg-gray-100 hover:bg-gray-200'
                : 'bg-gray-50 text-gray-400 cursor-not-allowed'
            }`}
            aria-label="Trang trước"
          >
            <ChevronLeft size={16} />
            <span className="ml-1">Trước</span>
          </button>

          {/* Các nút số trang */}
          <div className="flex space-x-1">
            {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
              // Hiển thị trang đầu, trang cuối và các trang xung quanh trang hiện tại
              .filter(pageNum =>
                pageNum === 1 ||
                pageNum === pagination.totalPages ||
                Math.abs(pageNum - pagination.page) <= 1
              )
              .map((pageNum, index, array) => {
                // Hiển thị dấu ... khi có khoảng cách giữa các trang
                if (index > 0 && pageNum - array[index - 1] > 1) {
                  return (
                    <span
                      key={`ellipsis-${pageNum}`}
                      className="px-3 py-2 text-gray-500"
                    >
                      ...
                    </span>
                  );
                }

                // Hiển thị nút trang
                return (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className={`px-3 py-2 rounded-md ${
                      pagination.page === pageNum
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 hover:bg-gray-200'
                    }`}
                    aria-label={`Trang ${pageNum}`}
                    aria-current={pagination.page === pageNum ? 'page' : undefined}
                  >
                    {pageNum}
                  </button>
                );
              })}
          </div>

          {/* Nút trang tiếp theo */}
          <button
            onClick={() => pagination.hasNextPage && handlePageChange(pagination.page + 1)}
            disabled={!pagination.hasNextPage}
            className={`px-3 py-2 rounded-md flex items-center ${
              pagination.hasNextPage
                ? 'bg-gray-100 hover:bg-gray-200'
                : 'bg-gray-50 text-gray-400 cursor-not-allowed'
            }`}
            aria-label="Trang tiếp theo"
          >
            <span className="mr-1">Tiếp</span>
            <ChevronRight size={16} />
          </button>
        </div>
      )}

      {/* Thông tin tổng số bài viết */}
      {pagination && (
        <div className="text-center text-gray-500 text-sm mb-8">
          Hiển thị {posts.length} trong tổng số {pagination.total} bài viết
        </div>
      )}
    </div>
  );
}