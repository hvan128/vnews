// src/components/post/PostThumbnail.tsx
"use client";
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { ExternalLink, ZoomIn, ZoomOut, X, Minimize, Maximize } from 'lucide-react';

type PostThumbnailProps = {
  src?: string;
  alt: string;
  height?: 'small' | 'medium' | 'large';
  source?: string;
  sourceUrl?: string;
};

export function PostThumbnail({ 
  src, 
  alt,
  height = 'medium',
  source,
  sourceUrl
}: PostThumbnailProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);
  
  if (!src) return null;
  
  // Define height classes based on the size prop
  const heightClasses = {
    small: 'h-48 sm:h-56 md:h-64',
    medium: 'h-56 sm:h-64 md:h-80 lg:h-96',
    large: 'h-64 sm:h-80 md:h-96 lg:h-screen lg:max-h-[60vh]'
  };

  const openLightbox = () => {
    setIsLightboxOpen(true);
    setIsZoomed(false);
    // Prevent scrolling when modal is open
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setIsLightboxOpen(false);
    setIsZoomed(false);
    // Re-enable scrolling
    document.body.style.overflow = 'auto';
  };

  const toggleZoom = () => {
    setIsZoomed(!isZoomed);
  };
  
  // Handle keyboard events for lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isLightboxOpen) return;
      
      if (e.key === 'Escape') {
        if (isZoomed) {
          setIsZoomed(false);
        } else {
          closeLightbox();
        }
      } else if (e.key === 'z' || e.key === 'Z') {
        toggleZoom();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    
    // Cleanup event listener
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isLightboxOpen, isZoomed]);
  
  return (
    <>
      <div 
        className={`relative w-full ${heightClasses[height]} bg-gray-100 overflow-hidden group cursor-pointer`}
        onClick={openLightbox}
        role="button"
        tabIndex={0}
        aria-label="Nhấn để xem ảnh lớn hơn"
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            openLightbox();
          }
        }}
      >
        {/* Loading placeholder */}
        {isLoading && (
          <div className="absolute inset-0 bg-gray-200 animate-pulse" />
        )}
        
        {/* Main image */}
        <Image 
          src={src} 
          alt={alt}
          fill
          className={`object-cover transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
          sizes="100vw"
          priority
          onLoadingComplete={() => setIsLoading(false)}
        />
        
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        
        {/* Zoom icon indicator */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-black/60 p-3 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <ZoomIn className="w-6 h-6" />
        </div>
        
        {/* Caption/Attribution (optional) */}
        {source && (
          <div 
            className="absolute bottom-3 right-3 px-2 py-1 bg-black/60 rounded text-xs text-white flex items-center"
            onClick={(e) => e.stopPropagation()} // Prevent opening lightbox when clicking attribution
          >
            <span>Ảnh: {source}</span>
            {sourceUrl && (
              <a 
                href={sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="ml-1 hover:text-blue-300 transition-colors"
                onClick={(e) => e.stopPropagation()}
              >
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>
        )}
      </div>

      {/* Lightbox modal */}
      {isLightboxOpen && (
        <div 
          className="fixed inset-0 bg-black/90 z-50 flex flex-col justify-center items-center p-4 md:p-8"
          onClick={isZoomed ? toggleZoom : closeLightbox}
        >
          {/* Controls group */}
          <div className="absolute top-4 right-4 flex space-x-2">
            {/* Zoom toggle button */}
            <button 
              onClick={(e) => {
                e.stopPropagation();
                toggleZoom();
              }}
              className="text-white p-2 rounded-full hover:bg-white/20 transition-colors focus:outline-none focus:ring-2 focus:ring-white/50"
              aria-label={isZoomed ? "Thu nhỏ" : "Phóng to"}
            >
              {isZoomed ? <ZoomOut className="w-6 h-6" /> : <ZoomIn className="w-6 h-6" />}
            </button>
            
            {/* Close button */}
            <button 
              onClick={(e) => {
                e.stopPropagation();
                closeLightbox();
              }}
              className="text-white p-2 rounded-full hover:bg-white/20 transition-colors focus:outline-none focus:ring-2 focus:ring-white/50"
              aria-label="Đóng ảnh"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          
          {/* Lightbox image container */}
          <div 
            className={`relative ${isZoomed ? 'w-full h-full overflow-auto cursor-zoom-out' : 'max-w-6xl max-h-[80vh] cursor-zoom-in'} flex items-center justify-center`}
            onClick={(e) => {
              e.stopPropagation();
              toggleZoom();
            }}
          >
            <Image
              src={src}
              alt={alt}
              className={isZoomed ? 'w-auto h-auto max-w-none' : 'object-contain max-h-full'}
              width={isZoomed ? 1920 : 1280}
              height={isZoomed ? 1080 : 720}
              style={{ 
                maxWidth: isZoomed ? 'none' : '100%', 
                maxHeight: isZoomed ? 'none' : '100%',
                objectFit: isZoomed ? 'none' : 'contain'
              }}
              priority
            />
          </div>
          
          {/* Caption in lightbox */}
          {source && (
            <div className="mt-4 px-3 py-2 bg-black/40 rounded text-sm text-white flex items-center">
              <span>Ảnh: {source}</span>
              {sourceUrl && (
                <a 
                  href={sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-2 hover:text-blue-300 transition-colors flex items-center"
                  onClick={(e) => e.stopPropagation()}
                >
                  Nguồn gốc <ExternalLink className="w-3 h-3 ml-1" />
                </a>
              )}
            </div>
          )}
          
          {/* Keyboard instructions */}
          <div className="absolute bottom-4 left-4 text-white/60 text-xs">
            Nhấn Z để {isZoomed ? 'thu nhỏ' : 'phóng to'} | ESC để {isZoomed ? 'thu nhỏ' : 'đóng'}
          </div>
        </div>
      )}
    </>
  );
}