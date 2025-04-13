// app/post/[mainCategory]/[subCategory]/page.tsx
import { Suspense } from 'react';
import { Metadata } from 'next';
import { getPostsByMainCategorySlug, getPostsBySubCategorySlug } from '../../../../lib/posts';
import NewsPostLayout from '../../../../components/NewsPostLayout';
import Header from '../../../../components/layouts/Header';

// Định nghĩa các tham số động cho metadata
export async function generateMetadata({ 
  params 
}: { 
  params: { mainCategory: string, subCategory?: string } 
}): Promise<Metadata> {
  const categoryName = decodeURIComponent(params.mainCategory)
    .split("-")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
  
  let title = categoryName;
  if (params.subCategory) {
    const subCategoryName = decodeURIComponent(params.subCategory)
      .split("-")
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
    title = `${subCategoryName} - ${categoryName}`;
  }
  
  return {
    title: `${title} - Bài viết`,
    description: `Danh sách các bài viết trong danh mục ${title}`
  };
}

export default async function Page({
  params,
  searchParams,
}: {
  params: { mainCategory: string, subCategory?: string };
  searchParams: { page?: string, limit?: string };
}) {
  // Lấy các thông số phân trang từ URL
  const page = searchParams.page ? parseInt(searchParams.page) : 1;
  const limit = searchParams.limit ? parseInt(searchParams.limit) : 12;
  
  // Lấy các bài viết dựa vào danh mục và danh mục phụ (nếu có)
  const result = params.subCategory
    ? await getPostsBySubCategorySlug(params.mainCategory, params.subCategory, {
        page,
        limit,
        publishedOnly: true
      })
    : await getPostsByMainCategorySlug(params.mainCategory, {
        page,
        limit,
        publishedOnly: true
      });

  // Trích xuất mảng bài viết từ kết quả phân trang
  const { data: posts, pagination } = result;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <Suspense fallback={<div className="text-center py-10">Đang tải...</div>}>
        <header>
          <Header />
        </header>
        
        <NewsPostLayout 
          posts={posts} 
          pagination={pagination}
          categorySlug={params.mainCategory}
          subCategorySlug={params.subCategory}
        />
      </Suspense>
    </div>
  );
}