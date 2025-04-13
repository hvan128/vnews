'use client';

import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, ChevronDown, ChevronRight, X } from 'lucide-react';

interface SubCategory {
  name: string;
  slug: string;
}

interface Category {
  name: string;
  slug: string;
  subCategories: SubCategory[];
}

export default function CategoryMenu() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [visibleCategories, setVisibleCategories] = useState<Category[]>([]);
  const [hiddenCategories, setHiddenCategories] = useState<Category[]>([]);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const pathname = usePathname();
  const containerRef = useRef<HTMLDivElement>(null);
  const moreMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch('/api/categories')
      .then((res) => res.json())
      .then((data) => {
        setCategories(data);
        calculateVisibleCategories(data);
      })
      .catch((err) => console.error('❌ Error loading categories:', err));
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (moreMenuRef.current && !moreMenuRef.current.contains(event.target as Node)) {
        setShowMoreMenu(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      calculateVisibleCategories(categories);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [categories]);

  const calculateVisibleCategories = (allCategories: Category[]) => {
    if (!containerRef.current || allCategories.length === 0) return;

    const containerWidth = containerRef.current.clientWidth;
    const menuItemWidth = 140;
    const moreButtonWidth = 100;
    const maxItems = Math.floor((containerWidth - moreButtonWidth) / menuItemWidth + 3); // +3 for padding and margin

    if (allCategories.length <= maxItems) {
      setVisibleCategories(allCategories);
      setHiddenCategories([]);
    } else {
      setVisibleCategories(allCategories.slice(0, maxItems - 1));
      setHiddenCategories(allCategories.slice(maxItems - 1));
    }
  };

  const isCategoryActive = (categorySlug: string) => {
    return pathname.startsWith(`/${categorySlug}`);
  };

  return (
    <div className="sticky top-0 z-50 bg-white border-b shadow-sm">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between">
          {/* Desktop Menu */}
          <div ref={containerRef} className="hidden md:flex flex-1 justify-center items-center h-16">
            {visibleCategories.map((category) => (
              <CategoryMenuItem 
                key={category.slug}
                category={category}
                isActive={isCategoryActive(category.slug)}
                pathname={pathname}
              />
            ))}
            {hiddenCategories.length > 0 && (
              <div className="relative" ref={moreMenuRef}>
                <button
                  className="flex items-center space-x-1 px-4 py-2 text-gray-700 hover:text-blue-600 font-medium"
                  onClick={() => setShowMoreMenu(!showMoreMenu)}
                >
                  <span>Xem thêm</span>
                  <ChevronDown size={16} className={`transition-transform ${showMoreMenu ? 'rotate-180' : ''}`} />
                </button>

                {showMoreMenu && (
                  <div className="absolute top-full right-0 w-64 bg-white shadow-lg rounded-lg border mt-1 py-2 z-20">
                    {hiddenCategories.map((category) => (
                      <div key={category.slug} className="group relative">
                        <Link
                          href={`/${category.slug}`}
                          className={`block px-4 py-2 hover:bg-gray-50 ${
                            isCategoryActive(category.slug) ? 'text-blue-600 font-medium' : 'text-gray-700'
                          }`}
                        >
                          <div className="flex justify-between items-center">
                            <span>{category.name}</span>
                            {category.subCategories.length > 0 && (
                              <ChevronRight size={16} className="text-gray-400 group-hover:text-blue-600" />
                            )}
                          </div>
                        </Link>
                        {category.subCategories.length > 0 && (
                          <div className="hidden group-hover:block absolute left-full top-0 w-64 bg-white shadow-lg rounded-lg border">
                            <ul className="py-2">
                              {category.subCategories.map((sub) => (
                                <li key={sub.slug}>
                                  <Link
                                    href={`/${category.slug}/${sub.slug}`}
                                    className={`block px-4 py-2 hover:bg-gray-50 ${
                                      pathname === `/${category.slug}/${sub.slug}` ? 'text-blue-600 font-medium' : 'text-gray-700'
                                    }`}
                                  >
                                    {sub.name}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden flex items-center h-16">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-gray-800 hover:text-blue-600 focus:outline-none"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t">
          <div className="max-h-96 overflow-y-auto">
            {categories.map((category) => (
              <MobileCategoryItem 
                key={category.slug}
                category={category}
                pathname={pathname}
                closeMobileMenu={() => setMobileMenuOpen(false)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function CategoryMenuItem({ category, isActive, pathname }: { 
  category: Category, 
  isActive: boolean,
  pathname: string
}) {
  return (
    <div className="group relative h-full">
      <Link
        href={`/${category.slug}`}
        className={`flex items-center h-full px-4 text-sm font-medium 
          ${isActive ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-800 hover:text-blue-600'}`}
      >
        {category.name}
        {category.subCategories.length > 0 && (
          <ChevronDown size={14} className="ml-1" />
        )}
      </Link>
      {category.subCategories.length > 0 && (
        <div className="absolute top-full left-0 hidden group-hover:block pt-2 z-20">
          <div className="bg-white shadow-lg rounded-lg border min-w-52">
            <ul className="py-2">
              {category.subCategories.map((sub) => (
                <li key={sub.slug}>
                  <Link
                    href={`/${category.slug}/${sub.slug}`}
                    className={`block px-4 py-2 text-sm hover:bg-gray-50 
                      ${pathname === `/${category.slug}/${sub.slug}` ? 'text-blue-600 font-medium' : 'text-gray-700'}`}
                  >
                    {sub.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

function MobileCategoryItem({ category, pathname, closeMobileMenu }: { 
  category: Category,
  pathname: string,
  closeMobileMenu: () => void
}) {
  const [isOpen, setIsOpen] = useState(false);
  const isActive = pathname.startsWith(`/${category.slug}`);

  return (
    <div className="border-b last:border-b-0">
      <div className="flex items-center justify-between">
        <Link
          href={`/${category.slug}`}
          className={`flex-1 px-4 py-3 ${isActive ? 'text-blue-600 font-medium' : 'text-gray-800'}`}
          onClick={closeMobileMenu}
        >
          {category.name}
        </Link>
        {category.subCategories.length > 0 && (
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="px-4 py-3 text-gray-500"
          >
            <ChevronDown 
              size={18} 
              className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} 
            />
          </button>
        )}
      </div>
      {isOpen && category.subCategories.length > 0 && (
        <div className="bg-gray-50 pl-4">
          {category.subCategories.map((sub) => (
            <Link
              key={sub.slug}
              href={`/${category.slug}/${sub.slug}`}
              className={`block px-4 py-2 text-sm border-t 
                ${pathname === `/${category.slug}/${sub.slug}` ? 'text-blue-600 font-medium' : 'text-gray-700'}`}
              onClick={closeMobileMenu}
            >
              {sub.name}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
