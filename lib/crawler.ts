import axios from 'axios';
import * as cheerio from 'cheerio';
import { uploadImage } from './cloudinary';

/**
 * Crawls article content from various Vietnamese news sources
 * with improved error handling and flexible selectors
 */
export async function crawlArticleContent(url: string): Promise<{
  title: string;
  slug: string;
  content: string;
  htmlContent: string;
  thumbnail?: string;
  images: string[];
  description: string;
  author?: string;
  publishedAt?: string;
  source: string;
  mainCategory?: string;
  subCategory?: string;
  tags: string[];
  readTime?: number;
}> {
  try {
    // Fetch the HTML content with timeout and retries
    const { data: html } = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36',
      },
      timeout: 10000, // 10 second timeout
    });

    const $ = cheerio.load(html);

    // Determine the source based on URL
    const source = determineSource(url);
    
    // Get title with multiple selectors based on source patterns
    const title = extractTitle($, source);
    
    // Generate slug from URL or title if needed
    const slug = url.split('/').pop()?.replace('.html', '') || 
                slugify(title) || 
                `article-${Date.now()}`;

    // Extract description with fallbacks
    const description = $('meta[name="description"]').attr('content') || 
                        $('meta[property="og:description"]').attr('content') ||
                        $('.article-summary, .article-sapo, .sapo, .description').first().text().trim() ||
                        '';

    // Extract author with cleanup
    let author = extractAuthor($, source);

    // Publication date with multiple formats
    const publishedAt = extractPublishedDate($);

    // Tags with multiple sources
    const tags = extractTags($);

    // Categories from breadcrumbs or metadata
    const { mainCategory, subCategory } = extractCategories($);

    // Article content extraction with multiple container selectors
    const { htmlContent, content } = extractContent($, source);

    // Handle thumbnail with multiple sources
    const thumbnail = await extractAndUploadThumbnail($);

    // Extract and upload all content images
    const images = await extractAndUploadImages($);

    // Calculate read time
    const wordCount = content.split(/\s+/).length;
    const readTime = Math.ceil(wordCount / 200); // Assuming 200 words per minute reading speed

    // Log successful crawl
    console.log(`✅ Successfully crawled: ${title} (${source})`);

    return {
      title,
      slug,
      content,
      htmlContent,
      thumbnail,
      images,
      description,
      author,
      publishedAt,
      source,
      mainCategory,
      subCategory,
      tags,
      readTime,
    };
  } catch (error) {
    console.error(`❌ Error crawling ${url}:`, error);
    throw new Error(`Failed to crawl article: ${error instanceof Error ? error.message : String(error)}`);
  }
}

/**
 * Determine source based on URL
 */
function determineSource(url: string): string {
  if (url.includes('vnexpress.net')) return 'VnExpress';
  if (url.includes('dantri.com.vn')) return 'Dân Trí';
  if (url.includes('tuoitre.vn')) return 'Tuổi Trẻ';
  if (url.includes('thanhnien.vn')) return 'Thanh Niên';
  if (url.includes('vietnamnet.vn')) return 'VietnamNet';
  return 'Unknown';
}

/**
 * Extract title with source-specific selectors
 */
function extractTitle($: cheerio.CheerioAPI, source: string): string {
  // Try source-specific selectors first
  if (source === 'VnExpress') {
    const title = $('h1.title-detail, h1.title, h1.title_news_detail, h1.article-title').first().text().trim();
    if (title) return title;
  }

  // Try most common selectors in Vietnamese news sites
  return $('h1.title-detail, h1.title, h1.article-title, h1.st-name, h1.dt-news__title, h1.news-title, h1.article__title')
    .first().text().trim() || 
    $('meta[property="og:title"]').attr('content') ||
    $('title').text().trim() ||
    $('h1').first().text().trim() ||
    '';
}

/**
 * Extract author with source-specific patterns
 */
function extractAuthor($: cheerio.CheerioAPI, source: string): string {
  let author = '';

  if (source === 'VnExpress') {
    author = $('.author_mail, .author, .author_top').first().text().trim();
  } else {
    author = $('.author, .author-name, .article-author, .bio__info').first().text().trim();
  }

  // Clean up common prefixes
  return author.replace(/^(Bởi|Tác giả|Author|By)\s*/i, '').trim();
}

/**
 * Extract publication date from multiple possible metadata fields
 */
function extractPublishedDate($: cheerio.CheerioAPI): string {
  return $('meta[property="article:published_time"]').attr('content') || 
         $('meta[itemprop="datePublished"]').attr('content') ||
         $('time[itemprop="datePublished"]').attr('datetime') ||
         $('.date, .time-update, .time, .article-date, .article__date').first().text().trim() ||
         '';
}

/**
 * Extract tags from multiple sources
 */
function extractTags($: cheerio.CheerioAPI): string[] {
  // Try keywords meta
  const keywordsMeta = $('meta[name="keywords"]').attr('content');
  if (keywordsMeta) {
    return keywordsMeta.split(',').map(t => t.trim()).filter(Boolean);
  }

  // Try actual tag elements
  const tagElements: string[] = [];
  $('.tags a, .article-tags a, .tag-item, .keyword-tags a').each((_, el) => {
    const tag = $(el).text().trim();
    if (tag) tagElements.push(tag);
  });

  return tagElements;
}

/**
 * Extract categories from breadcrumbs or other sources
 */
function extractCategories($: cheerio.CheerioAPI): { mainCategory?: string, subCategory?: string } {
  // Try breadcrumbs first
  const breadcrumbs = $('.breadcrumb li a, .breadcrumbs a, .bread-crumbs a, .navigation a').toArray();
  
  if (breadcrumbs.length >= 2) {
    return {
      mainCategory: $(breadcrumbs[0]).text().trim(),
      subCategory: $(breadcrumbs[breadcrumbs.length - 1]).text().trim()
    };
  }

  // Try section metadata
  return {
    mainCategory: $('meta[property="article:section"]').attr('content'),
    subCategory: undefined
  };
}

/**
 * Extract article content with multiple possible containers
 */
function extractContent($: cheerio.CheerioAPI, source: string): { htmlContent: string, content: string } {
  // Identify content container based on source
  let contentSelector = '.fck_detail, .article-content, .dt-news__content, .content-detail, .detail-content, .article-body';
  
  if (source === 'VnExpress') {
    contentSelector = '.fck_detail, .article-content, .normal';
  }

  // Extract HTML content
  const rawHtml = $(contentSelector).html();
  const htmlContent = rawHtml?.trim() ?? '';

  // Extract plain text paragraphs
  const paragraphs: string[] = [];
  $(`${contentSelector} p`).each((_, el) => {
    const text = $(el).text().trim();
    if (text.length > 0) paragraphs.push(text);
  });
  
  // If no paragraphs found with specific selectors, try direct content extraction
  if (paragraphs.length === 0) {
    const text = $(contentSelector).text().trim();
    if (text) paragraphs.push(text);
  }
  
  const content = paragraphs.join('\n\n');

  return { htmlContent, content };
}

/**
 * Extract and upload thumbnail with error handling
 */
async function extractAndUploadThumbnail($: cheerio.CheerioAPI): Promise<string | undefined> {
  try {
    const ogImage = $('meta[property="og:image"]').attr('content');
    const twitterImage = $('meta[name="twitter:image"]').attr('content');
    const articleImage = $('.article-avatar img, .dt-news__avatar img, .main-img img').first().attr('src');
    
    const rawThumbnail = ogImage || twitterImage || articleImage || '';
    
    // Fix relative image URLs
    const fixedThumbnailUrl = fixImageUrl(rawThumbnail);
    
    if (fixedThumbnailUrl) {
      return await uploadImage(fixedThumbnailUrl);
    }
    return undefined;
  } catch (error) {
    console.warn('⚠️ Error uploading thumbnail:', error);
    return undefined;
  }
}

/**
 * Extract and upload all content images with error handling
 */
async function extractAndUploadImages($: cheerio.CheerioAPI): Promise<string[]> {
  const images: string[] = [];
  const imageUrls = new Set<string>();
  
  // Look for images in content with multiple possible attributes
  $('.fck_detail img, .article-content img, .dt-news__content img, .content-detail img, .article-body img').each((_, el) => {
    const src = $(el).attr('data-src') || 
                $(el).attr('src') || 
                $(el).attr('data-original') ||
                $(el).attr('data-lazy-src');
    
    if (src) imageUrls.add(fixImageUrl(src));
  });

  // Process images in parallel with a concurrency limit
  const uploadPromises = Array.from(imageUrls).map(async (src) => {
    try {
      if (!src || src.includes('spacer.gif') || src.includes('blank.gif')) {
        return null;
      }
      return await uploadImage(src);
    } catch (error) {
      console.warn('⚠️ Error uploading image:', src, error);
      return null;
    }
  });

  const uploadedImages = await Promise.all(uploadPromises);
  
  return uploadedImages.filter((url): url is string => url !== null);
}

/**
 * Fix relative image URLs
 */
function fixImageUrl(url?: string): string {
  if (!url) return '';
  
  // Already absolute URL
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  
  // Fix relative URLs (this is a simplified version - might need to be expanded)
  if (url.startsWith('/')) {
    // Assuming most common domain, should be enhanced to use the actual article domain
    return `https://vnexpress.net${url}`;
  }
  
  return url;
}

/**
 * Convert string to URL-friendly slug
 */
function slugify(text: string): string {
  const vietnameseMap: Record<string, string> = {
    'à': 'a', 'á': 'a', 'ạ': 'a', 'ả': 'a', 'ã': 'a', 'â': 'a', 'ầ': 'a', 'ấ': 'a', 'ậ': 'a', 'ẩ': 'a', 'ẫ': 'a', 'ă': 'a', 'ằ': 'a', 'ắ': 'a', 'ặ': 'a', 'ẳ': 'a', 'ẵ': 'a',
    'è': 'e', 'é': 'e', 'ẹ': 'e', 'ẻ': 'e', 'ẽ': 'e', 'ê': 'e', 'ề': 'e', 'ế': 'e', 'ệ': 'e', 'ể': 'e', 'ễ': 'e',
    'ì': 'i', 'í': 'i', 'ị': 'i', 'ỉ': 'i', 'ĩ': 'i',
    'ò': 'o', 'ó': 'o', 'ọ': 'o', 'ỏ': 'o', 'õ': 'o', 'ô': 'o', 'ồ': 'o', 'ố': 'o', 'ộ': 'o', 'ổ': 'o', 'ỗ': 'o', 'ơ': 'o', 'ờ': 'o', 'ớ': 'o', 'ợ': 'o', 'ở': 'o', 'ỡ': 'o',
    'ù': 'u', 'ú': 'u', 'ụ': 'u', 'ủ': 'u', 'ũ': 'u', 'ư': 'u', 'ừ': 'u', 'ứ': 'u', 'ự': 'u', 'ử': 'u', 'ữ': 'u',
    'ỳ': 'y', 'ý': 'y', 'ỵ': 'y', 'ỷ': 'y', 'ỹ': 'y',
    'đ': 'd'
  };

  return text.toLowerCase()
    .split('')
    .map(char => vietnameseMap[char] || char)
    .join('')
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}