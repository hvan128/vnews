"use client"

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import NewsPostLayout from './NewsPostLayout';
import { PostType } from '../models/Post';

type Props = {
  initialPosts: PostType[];
  initialPagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
  categorySlug?: string;
  subCategorySlug?: string;
};

export default function ClientNewsPostLayout({
  initialPosts,
  initialPagination,
  categorySlug,
  subCategorySlug
}: Props) {
  const [posts, setPosts] = useState<PostType[]>(initialPosts);
  const [pagination, setPagination] = useState(initialPagination);
  const [isLoading, setIsLoading] = useState(false);
  
  const router = useRouter();
  const searchParams = useSearchParams();

  // Function to fetch posts for a specific page
  const fetchPosts = async (page: number) => {
    setIsLoading(true);
    
    try {
      // Fixed URL to match your API route
      let url = `/api/post?page=${page}&limit=${initialPagination.limit}&publishedOnly=true`;
      
      if (categorySlug) {
        url += `&categorySlug=${categorySlug}`;
        if (subCategorySlug) {
          url += `&subCategorySlug=${subCategorySlug}`;
        }
      }
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Fixed to use data.posts instead of data.data
      setPosts(data.posts);
      setPagination(data.pagination);
      
      // Update URL without full page reload
      const params = new URLSearchParams(searchParams.toString());
      params.set('page', page.toString());
      router.push(`?${params.toString()}`, { scroll: false });
      
      return {
        data: data.posts,
        pagination: data.pagination
      };
    } catch (error) {
      console.error('Error fetching posts:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <NewsPostLayout
      posts={posts}
      pagination={pagination}
      fetchPosts={fetchPosts}
      categorySlug={categorySlug}
      subCategorySlug={subCategorySlug}
    />
  );
}