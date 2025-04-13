import { Tag } from 'lucide-react';
import Link from 'next/link';

type PostTagsProps = {
  tags: string[];
};

export function PostTags({ tags }: PostTagsProps) {
  if (!tags || tags.length === 0) return null;
  
  return (
    <div className="mt-8 pt-6 border-t border-gray-100 px-6 lg:px-8">
      <h3 className="text-lg font-semibold mb-3">Chủ đề liên quan:</h3>
      <div className="flex flex-wrap gap-2">
        {tags.map((tag, index) => (
          <Link 
            key={index}
            href={`/tag/${encodeURIComponent(tag.toLowerCase())}`}
            className="inline-flex items-center px-3 py-1 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm transition-colors"
          >
            <Tag className="w-3 h-3 mr-2" />
            {tag}
          </Link>
        ))}
      </div>
    </div>
  );
}
