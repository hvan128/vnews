"use client";

import React from "react";
import Link from "next/link";
import Marquee from "react-fast-marquee";
import { PostType } from "../models/Post";

interface BreakingNewsTickerProps {
  posts: PostType[];
}

const BreakingNewsTicker: React.FC<BreakingNewsTickerProps> = ({ posts }) => {
  // Lấy 5 bài viết gần nhất để hiển thị trong ticker
  const recentPosts = posts
    .sort((a, b) => {
      const dateA = a.createdAt || a.publishedAt || new Date();
      const dateB = b.createdAt || b.publishedAt || new Date();
      return new Date(dateB).getTime() - new Date(dateA).getTime();
    })
    .slice(0, 5);

  if (recentPosts.length === 0) {
    return null;
  }

  return (
    <div className="bg-gradient-to-r from-red-600 to-red-500 text-white py-2.5 mb-8 rounded-md shadow-md border-l-4 border-red-800">
      <div className="flex items-center">
        <div className="flex items-center mr-1 border-r border-red-400 pr-4">
          <div className="animate-pulse bg-white rounded-full h-2 w-2 mx-1.5"></div>
          <span className="font-bold whitespace-nowrap text-sm md:text-base uppercase tracking-wider">TIN MỚI</span>
        </div>
        <Marquee
          speed={35}
          pauseOnHover={true}
          gradient={true}
          gradientWidth={20}
        >
          {recentPosts.map((post, index) => (
            <React.Fragment key={post._id || post.slug}>
              <Link 
                href={`/post/${post.slug}`}
                className="hover:underline hover:text-yellow-100 transition-colors duration-200 mx-6 font-medium text-sm md:text-base"
              >
                {post.title}
              </Link>
              {index < recentPosts.length - 1 && (
                <span className="text-red-300">•</span>
              )}
            </React.Fragment>
          ))}
        </Marquee>
      </div>
    </div>
  );
};

export default BreakingNewsTicker;