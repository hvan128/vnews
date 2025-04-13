// Remove 'use client' from this file - make it a server component
import { notFound } from 'next/navigation';
import { getPostBySlug } from '../../../lib/posts';
import { ExternalLink } from 'lucide-react';
import { JsonLdSchema } from '../../../components/post/JsonLdSchema';
import { PostThumbnail } from '../../../components/post/PostThumbnail';
import { PostHeader } from '../../../components/post/PostHeader';
import { PostEngagement } from '../../../components/post/PostEngagement';
import { PostShare } from '../../../components/post/PostShare';
import { TableOfContents } from '../../../components/post/TableOfContents';
import { PostContent } from '../../../components/post/PostContent';
import { AuthorInfo } from '../../../components/post/AuthorInfo';
import { PostTags } from '../../../components/post/PostTags';
import { LikeCommentSection } from '../../../components/post/LikeCommentSection';
import { RelatedArticles } from '../../../components/post/RelatedArticles';
import { PostNavigation } from '../../../components/post/PostNavigation';

// Import our components
export default async function PostPage({ params }: { params: { slug: string } }) {
  // Đảm bảo params đã sẵn sàng trước khi sử dụng
  const resolvedParams = await Promise.resolve(params);
  const slug = resolvedParams.slug;
  
  const post = await getPostBySlug(slug);
  if (!post) return notFound();
  
  // Chọn nội dung hiển thị (ưu tiên rewritten nếu có)
  const displayContent = post.rewritten || post.content;
  const displayTitle = post.rewriteTitle || post.title;
  
  return (
    <>
      {/* Add JSON-LD to head */}
      <JsonLdSchema
        title={displayTitle}
        description={post.description}
        thumbnail={post.thumbnail}
        publishedAt={post.publishedAt}
        author={post.author}
        source={post.source}
        slug={slug}
      />
      
      <div className="bg-gray-50 min-h-screen pb-16">
        {/* Hero section với ảnh thumbnail */}
        <PostThumbnail
          src={post.thumbnail}
          alt={displayTitle}
          height="large"
          source={post.source}
          sourceUrl={post.originalUrl}
        />
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Main content */}
          <div className={`bg-white rounded-lg shadow-lg overflow-hidden pb-8 ${post.thumbnail ? '-mt-20 relative z-10' : 'mt-8'}`}>
            <PostHeader
              title={displayTitle}
              description={post.description}
              publishedAt={post.publishedAt}
              readTime={post.readTime}
              author={post.author}
              source={post.source}
              originalUrl={post.originalUrl}
              mainCategory={post.mainCategory}
              subCategory={post.subCategory}
            />
            
            <PostEngagement />
            <PostShare />
            <TableOfContents content={displayContent} />
            
            <PostContent
              content={displayContent}
              images={post.images}
              title={post.title}
            />
            
            <AuthorInfo
              author={post.author}
              source={post.source}
            />
            
            <PostTags tags={post.tags} />
            <LikeCommentSection />
            <RelatedArticles /> {/* Make sure to pass the post ID if needed */}
          </div>
          
          <PostNavigation />
        </div>
      </div>
    </>
  );
}