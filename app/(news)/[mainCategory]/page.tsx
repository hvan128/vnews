// app/(news)/[mainCategory]/page.tsx
import { Suspense } from 'react';
import { Metadata } from 'next';
import { getPostsByMainCategorySlug } from "../../../lib/posts";
import NewsPostLayout from '../../../components/NewsPostLayout';
import Header from '../../../components/layouts/Header';

// Định nghĩa các tham số động cho metadata
export async function generateMetadata({
  params,
}: {
  params: { mainCategory: string };
}): Promise<Metadata> {
  // Await toàn bộ đối tượng params
  const resolvedParams = await params;
  
  const categoryName = decodeURIComponent(resolvedParams.mainCategory)
    .split("-")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  return {
    title: `${categoryName} - Bài viết`,
    description: `Danh sách các bài viết trong danh mục ${categoryName}`
  };
}

export default async function Page({
  params,
  searchParams,
}: {
  params: { mainCategory: string };
  searchParams: { page?: string; limit?: string };
}) {
  // Await toàn bộ các đối tượng params và searchParams
  const [resolvedParams, resolvedSearchParams] = await Promise.all([
    params,
    searchParams
  ]);
  
  const page = resolvedSearchParams.page ? parseInt(resolvedSearchParams.page) : 1;
  const limit = resolvedSearchParams.limit ? parseInt(resolvedSearchParams.limit) : 12;

  const result = await getPostsByMainCategorySlug(resolvedParams.mainCategory, {
    page,
    limit,
    publishedOnly: true
  });

  const { data: posts, pagination } = result;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <header>
        <Header />
      </header>
      <Suspense fallback={<div className="text-center py-10">Đang tải...</div>}>
        <NewsPostLayout
          posts={posts}
          pagination={pagination}
          categorySlug={resolvedParams.mainCategory}
          subCategorySlug={undefined}
        />
      </Suspense>
    </div>
  );
}