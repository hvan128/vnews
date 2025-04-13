'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { PostType } from '../models/Post';

type Props = {
  categories: string[];
  posts: PostType[];
};

export default function ClientTabs({ categories, posts }: Props) {
  const [activeTab, setActiveTab] = useState('Tất cả');

  const filteredPosts =
    activeTab === 'Tất cả' ? posts : posts.filter(post => post.mainCategory === activeTab);

  return (
    <>
      <div className="flex space-x-4 mb-6 overflow-x-auto scrollbar-hide">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveTab(cat)}
            className={`px-4 py-2 rounded-full border whitespace-nowrap ${
              activeTab === cat ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {filteredPosts.map(post => (
          <Link
            key={post._id}
            href={`/post/${post.slug}`}
            className="block border rounded-md hover:shadow-md transition bg-white"
          >
            {post.thumbnail && (
              <div className="relative h-48 w-full mb-3 rounded overflow-hidden">
                <Image
                  src={post.thumbnail}
                  alt={post.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover rounded"
                />
              </div>
            )}

            <div className="px-4 pb-4">
              <h2 className="text-lg font-semibold mb-1 text-blue-700 line-clamp-2">
                {post.rewriteTitle ?? post.title}
              </h2>

              <p className="text-sm text-gray-500 mb-1">
                🕒 {post.readTime} phút đọc • 📅 {new Date(post.publishedAt || post.createdAt).toLocaleDateString()}
              </p>

              <p className="text-xs text-gray-400 uppercase">{post.mainCategory}</p>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}
