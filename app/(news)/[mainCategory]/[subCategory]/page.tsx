// app/(news)/[mainCategory]/[subCategory]/page.tsx
import { Suspense } from 'react';
import { Metadata } from 'next';
import { getPostsByMainCategorySlug, getPostsBySubCategorySlug } from '../../../../lib/posts';
import NewsPostLayout from '../../../../components/NewsPostLayout';
import Header from '../../../../components/layouts/Header';

// Metadata động theo params
export async function generateMetadata({
  params,
}: {
  params: { mainCategory: string; subCategory: string };
}): Promise<Metadata> {
  // Await toàn bộ đối tượng params
  const resolvedParams = await params;
  
  const categoryName = decodeURIComponent(resolvedParams.mainCategory)
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  let title = categoryName;

  if (resolvedParams.subCategory) {
    const subCategoryName = decodeURIComponent(resolvedParams.subCategory)
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
    title = `${subCategoryName} - ${categoryName}`;
  }

  return {
    title: `${title} - Bài viết`,
    description: `Danh sách các bài viết trong danh mục ${title}`,
  };
}

// Page component
export default async function Page({
  params,
  searchParams,
}: {
  params: { mainCategory: string; subCategory: string };
  searchParams: { page?: string; limit?: string };
}) {
  // Await toàn bộ các đối tượng params và searchParams
  const [resolvedParams, resolvedSearchParams] = await Promise.all([
    params,
    searchParams
  ]);
  
  const page = resolvedSearchParams.page ? parseInt(resolvedSearchParams.page) : 1;
  const limit = resolvedSearchParams.limit ? parseInt(resolvedSearchParams.limit) : 12;

  const result = resolvedParams.subCategory
    ? await getPostsBySubCategorySlug(resolvedParams.mainCategory, resolvedParams.subCategory, {
        page,
        limit,
        publishedOnly: true,
      })
    : await getPostsByMainCategorySlug(resolvedParams.mainCategory, {
        page,
        limit,
        publishedOnly: true,
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
          subCategorySlug={resolvedParams.subCategory}
        />
      </Suspense>
    </div>
  );
}