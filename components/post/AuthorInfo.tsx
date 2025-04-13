import { User } from 'lucide-react';

type AuthorInfoProps = {
  author: string;
  source?: string;
};

export function AuthorInfo({ author, source }: AuthorInfoProps) {
  if (!author) return null;
  
  return (
    <div className="mt-12 pt-6 border-t border-gray-200 px-6 lg:px-8">
      <div className="flex items-center space-x-4">
        <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
          <User className="w-6 h-6" />
        </div>
        <div>
          <p className="font-medium text-gray-900">{author}</p>
          <p className="text-sm text-gray-500">Biên tập viên {source || ''}</p>
        </div>
      </div>
    </div>
  );
}