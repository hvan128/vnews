"use client"
import { useState, useEffect } from 'react';
import Image from 'next/image';

type PostContentProps = {
  content: string;
  images?: string[];
  title?: string;
};

export function PostContent({
  content,
  images = [],
  title
}: PostContentProps) {
  const [enhancedContent, setEnhancedContent] = useState(content);

  const GALLERY_THRESHOLD = 4;
  const showImageGallery = images.length >= GALLERY_THRESHOLD;
  function splitIntoParagraphsByLength(text: string, maxLength = 500) {
    const paragraphs = [];
    let current = '';
  
    const sentences = text.split(/(?<=[.!?])\s+/); // chia theo câu
  
    for (const sentence of sentences) {
      if ((current + sentence).length < maxLength) {
        current += sentence + ' ';
      } else {
        paragraphs.push(current.trim());
        current = sentence + ' ';
      }
    }
  
    if (current.trim()) {
      paragraphs.push(current.trim());
    }
  
    return paragraphs;
  }
  

  useEffect(() => {
    if (content) {
      let paragraphs = content.split('\n\n');
      if (paragraphs.length <= 1) {
        paragraphs = splitIntoParagraphsByLength(content, 500);
      }
      let result = '';

      const inlineImagesCount = showImageGallery
        ? Math.ceil(images.length * 0.7)
        : images.length;

      const paragraphsPerImage = Math.max(
        Math.floor(paragraphs.length / inlineImagesCount),
        2
      );

      const usedImageIndexes = new Set<number>();
      let imageIndex = 0;
      
      // Xác định vị trí giữa bài viết cho trường hợp có 1 ảnh
      const middleIndex = Math.floor(paragraphs.length / 2);
      let hasSingleImageInserted = false;

      paragraphs.forEach((paragraph, index) => {
        if (paragraph.trim()) {
          result += `<p>${paragraph.trim()}</p>`;
        }

        // Xử lý trường hợp đặc biệt: chỉ có 1 ảnh => chèn ở giữa bài
        if (images.length === 1 && !hasSingleImageInserted) {
          result += `<figure class="flex flex-col items-center my-6">
            <img src="${images[0]}" alt="${title || 'Article image'}" class="max-w-full mx-auto rounded-lg shadow-md" />
            <figcaption class="text-center text-gray-600 mt-2">${title || 'this article'}</figcaption>
          </figure>`;
          usedImageIndexes.add(0);
          hasSingleImageInserted = true;
          // Đảm bảo không xử lý ảnh này nữa trong các điều kiện khác
          imageIndex = 1;
        }

        // Trường hợp có nhiều ảnh và không phải trường hợp đặc biệt (1 ảnh)
        const shouldInsertImage =
          images.length > 1 &&
          index > 0 &&
          (index + 1) % paragraphsPerImage === 0 &&
          imageIndex < inlineImagesCount;

        if (shouldInsertImage) {
          if (
            imageIndex + 1 < inlineImagesCount &&
            (imageIndex + 1) < images.length &&
            imageIndex % 2 === 1
          ) {
            // 2 ảnh cạnh nhau
            result += `<div class="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
              <figure class="flex flex-col items-center">
                <img src="${images[imageIndex]}" alt="${title || 'Article image'}" class="max-w-full mx-auto rounded-lg shadow-md" />
              </figure>
              <figure class="flex flex-col items-center">
                <img src="${images[imageIndex + 1]}" alt="${title || 'Article image'}" class="max-w-full mx-auto rounded-lg shadow-md" />
              </figure>
            </div>`;
            usedImageIndexes.add(imageIndex);
            usedImageIndexes.add(imageIndex + 1);
            imageIndex += 2;
          } else {
            // Ảnh đơn
            result += `<figure class="flex flex-col items-center my-6">
              <img src="${images[imageIndex]}" alt="${title || 'Article image'}" class="max-w-full mx-auto rounded-lg shadow-md" />
              <figcaption class="text-center text-gray-600 mt-2">${title || 'this article'}</figcaption>
            </figure>`;
            usedImageIndexes.add(imageIndex);
            imageIndex += 1;
          }
        }
      });

      setEnhancedContent(result);
    }
  }, [content, images, title, showImageGallery]);

  const usedCount = showImageGallery ? Math.ceil(images.length * 0.7) : images.length;
  const galleryImages = showImageGallery ? images.slice(usedCount) : [];

  return (
    <article className="px-6 lg:px-8 my-8">
      <div
        className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-a:text-blue-600 prose-img:rounded-lg prose-img:mx-auto prose-h2:mt-8 prose-h3:mt-6 prose-img:shadow-md prose-strong:font-semibold"
        dangerouslySetInnerHTML={{ __html: enhancedContent }}
      />
      {galleryImages.length > 0 && (
        <div className="mt-12">
          <h3 className="text-2xl font-bold mb-6">Image Gallery</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {galleryImages.map((img, idx) => (
              <figure key={idx} className="flex flex-col items-center">
                <div className="relative w-full h-60 rounded-lg overflow-hidden">
                  <Image
                    src={img}
                    alt={`Gallery image ${idx + 1}`}
                    fill
                    className="object-cover hover:scale-105 transition-transform"
                  />
                </div>
                <figcaption className="text-center text-gray-600 mt-2">
                  Image {idx + 1 + usedCount}
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      )}
    </article>
  );
}