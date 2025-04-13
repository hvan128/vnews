import React from "react";
import Link from "next/link";
import { Bell, Home, Search, User } from "lucide-react";
import CategoryMenu from "../CategoryMenu";

// Header with logo and navigation
const Header = () => {
  return (
    <header className="bg-white border-b sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo and home */}
          <div className="flex items-center space-x-4">
            <Link href="/" className="flex items-center space-x-2">
              <span className="text-blue-600 text-2xl">🤖</span>
              <span className="font-bold text-xl hidden sm:block">AI News</span>
            </Link>
          </div>

          {/* Desktop navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <Link href="/" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md font-medium text-sm flex items-center">
              <Home size={18} className="mr-1" />
              <span>Trang chủ</span>
            </Link>
            <Link href="/trending" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md font-medium text-sm">
              Xu hướng
            </Link>
            <Link href="/videos" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md font-medium text-sm">
              Videos
            </Link>
            <Link href="/podcast" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md font-medium text-sm">
              Podcast
            </Link>
          </div>

          {/* User and search */}
          <div className="flex items-center space-x-2">
            <button className="p-2 text-gray-700 hover:text-blue-600 rounded-full hover:bg-gray-100">
              <Search size={20} />
            </button>
            <button className="p-2 text-gray-700 hover:text-blue-600 rounded-full hover:bg-gray-100">
              <Bell size={20} />
            </button>
            <button className="p-2 text-gray-700 hover:text-blue-600 rounded-full hover:bg-gray-100">
              <User size={20} />
            </button>
          </div>
        </div>
      </div>
      <div className="bg-gray-50 border-b">
        <CategoryMenu />
      </div>
    </header>
  );
};

export default Header;