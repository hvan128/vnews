// app/(news)/page.tsx
import React from "react";
import Link from "next/link";
import CategoryMenu from "../../components/CategoryMenu";
import NewsPostLayout from "../../components/NewsPostLayout";
import { getPosts, getFeaturedPosts } from "../../lib/posts";
import { Home, Search, Bell, User } from "lucide-react";
import Header from "../../components/layouts/Header";
import Footer from "../../components/layouts/Footer";
import BreakingNewsTicker from "../../components/BraeakingNewsTicker";
import ClientNewsPostLayout from "../../components/ClientNewsPostLayout";
import CategorySection from "../../components/CategorySection";
import { Brain, Network } from 'lucide-react';


// Banner quảng cáo component
const AdBanner = () => (
  <div className="w-full bg-gray-100 rounded-lg p-4 text-center my-8">
    <p className="text-gray-500 text-sm">Quảng cáo</p>
    <div className="text-gray-700 font-medium py-4">Không gian quảng cáo</div>
  </div>
);

// Newsletter subscription component
const NewsletterSignup = () => (
  <div className="bg-blue-50 rounded-lg p-6 my-8">
    <h3 className="text-xl font-semibold mb-3">Đăng ký nhận tin</h3>
    <p className="text-gray-600 mb-4">Nhận các tin tức AI mới nhất vào hộp thư của bạn</p>
    <div className="flex gap-2">
      <input
        type="email"
        placeholder="Email của bạn"
        className="flex-1 px-4 py-2 border rounded-lg focus:ring focus:ring-blue-200 focus:outline-none"
      />
      <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors">
        Đăng ký
      </button>
    </div>
  </div>
);

// This is the new way to fetch data on the server in App Router
async function fetchData(page: number) {
  // Get paginated posts
  const postsResult = await getPosts({
    publishedOnly: true,
    limit: 12,
    page
  });

  // Get featured posts for the sidebar
  const featuredPosts = await getFeaturedPosts({ limit: 5 });

  // Get category-specific posts
  const mlPostsResult = await getPosts({
    publishedOnly: true,
    limit: 3,
    page: 1,
    // Add category filter here when available
  });

  const dlPostsResult = await getPosts({
    publishedOnly: true,
    limit: 3,
    page: 1,
    // Add category filter here when available
  });

  return {
    initialPosts: postsResult.data,
    initialPagination: postsResult.pagination,
    featuredPosts,
    mlPosts: mlPostsResult.data,
    dlPosts: dlPostsResult.data,
  };
}

// This is now a Server Component by default
export default async function HomePage({ searchParams }: { searchParams: { page?: string } }) {
  // Đảm bảo rằng searchParams đã sẵn sàng trước khi sử dụng
  const params = await Promise.resolve(searchParams);
  
  // Get page number from URL query parameters
  const currentPage = params.page ? parseInt(params.page) : 1;

  // Fetch data server-side
  const { initialPosts, initialPagination, featuredPosts, mlPosts, dlPosts } = await fetchData(currentPage);

  return (
    <>
      <Header />

      <main className="max-w-6xl mx-auto px-4 py-6">
        <BreakingNewsTicker posts={initialPosts} />

        <div className="mb-8">
          <h2 className="text-2xl font-bold border-b pb-2 mb-4">
            <span className="border-b-2 border-blue-600 pb-2">Tin mới nhất</span>
          </h2>

          {/* We'll create a client component wrapper for NewsPostLayout */}
          <ClientNewsPostLayout
            initialPosts={initialPosts}
            initialPagination={initialPagination}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3">
            {/* Tin tức theo chuyên mục */}
            <CategorySection
              title="Machine Learning"
              posts={mlPosts}
              categorySlug="machine-learning"
              accentColor="blue-600"
              icon={<Brain size={24} />}
            />

            <AdBanner />

            <CategorySection
              title="Deep Learning"
              posts={dlPosts}
              categorySlug="deep-learning"
              accentColor="red-600"
              icon={<Network size={24} />}
            />
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              {/* Trending Posts */}
              <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
                <h3 className="font-bold text-lg mb-4 pb-2 border-b">Bài viết nổi bật</h3>
                <div className="space-y-4">
                  {featuredPosts.map((post, idx) => (
                    <Link href={`/post/${post.slug}`} key={post._id} className="flex items-start group">
                      <span className="font-bold text-xl text-gray-300 mr-2">{idx + 1}</span>
                      <p className="text-sm font-medium group-hover:text-blue-600">
                        {post.rewriteTitle || post.title}
                      </p>
                    </Link>
                  ))}
                </div>
              </div>

              <NewsletterSignup />

              {/* Tags cloud */}
              <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
                <h3 className="font-bold text-lg mb-4 pb-2 border-b">Tags phổ biến</h3>
                <div className="flex flex-wrap gap-2">
                  {['AI', 'Deep Learning', 'GPT', 'Neural Networks', 'Machine Learning', 'Computer Vision', 'NLP', 'Robotics', 'Reinforcement Learning', 'AI Ethics'].map(tag => (
                    <Link
                      key={tag}
                      href={`/tag/${tag.toLowerCase().replace(' ', '-')}`}
                      className="px-3 py-1 bg-gray-100 text-sm rounded-full hover:bg-blue-100 hover:text-blue-700"
                    >
                      {tag}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}