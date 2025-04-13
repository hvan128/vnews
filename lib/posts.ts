// D:\news-ai\lib\posts.ts
import slugify from 'slugify';
import mongoose, { SortOrder } from 'mongoose';
import { connectToDatabase } from './mongodb';

// Import Post model dynamically to avoid potential circular dependencies
let Post: mongoose.Model<any>;

// Try to get the model if it's already registered, or create it if not
try {
  Post = mongoose.model('Post');
} catch {
  // If the model doesn't exist yet, we'll import it
  // This is deferred to avoid circular dependencies
  const PostModel = require('../models/Post').default;
  Post = PostModel;
}

// Import the PostType interface properly
import type { PostType } from '../models/Post';

// Pagination interface
export interface PaginatedResult<T> {
  data: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

// Default pagination settings
const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;

/**
 * Normalize text to a URL-friendly slug
 */
function normalizeSlug(text: string) {
  return slugify(text, { lower: true, strict: true, locale: 'vi' });
}

/**
 * Map a MongoDB document to a PostType object with proper type conversions
 */
function mapPostDocument(post: any): PostType {
  return {
    _id: post._id.toString(),
    title: post.title,
    slug: post.slug,
    content: post.content,
    rewritten: post.rewritten,
    rewriteTitle: post.rewriteTitle,
    thumbnail: post.thumbnail,
    published: post.published,
    createdAt: new Date(post.createdAt),
    source: post.source || '',
    originalUrl: post.originalUrl || '',
    author: post.author || '',
    publishedAt: post.publishedAt ? new Date(post.publishedAt) : new Date(post.createdAt),
    mainCategory: post.mainCategory || '',
    subCategory: post.subCategory || '',
    tags: post.tags || [],
    readTime: post.readTime || 0,
    htmlContent: post.htmlContent || '',
    description: post.description || '',
    images: post.images || [],
    facebookPosted: post.facebookPosted || false,
    facebookPostId: post.facebookPostId || '',
    facebookPostTime: post.facebookPostTime,
  };
}

/**
 * Get all posts with pagination
 */
export async function getPosts(
  options: { 
    page?: number; 
    limit?: number; 
    publishedOnly?: boolean;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  } = {}
): Promise<PaginatedResult<PostType>> {
  try {
    await connectToDatabase();

    // Ensure Post model is available
    if (!Post) {
      try {
        Post = mongoose.model('Post');
      } catch {
        const PostModel = require('../models/Post').default;
        Post = PostModel;
      }
    }

    const { 
      page = DEFAULT_PAGE, 
      limit = DEFAULT_LIMIT,
      publishedOnly = false,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = options;

    // Build query filter
    const filter: Record<string, any> = {};
    if (publishedOnly) {
      filter.published = true;
    }

    // Build sort configuration
    const sort: { [key: string]: SortOrder } = {
      [sortBy]: sortOrder === 'asc' ? 1 : -1
    };
    
    // Get total count for pagination
    const total = await Post.countDocuments(filter);
    
    // Calculate pagination values
    const skip = (page - 1) * limit;
    const totalPages = Math.ceil(total / limit);
    
    // Execute paginated query
    const posts = await Post.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .lean();
    return {
      data: posts.map(mapPostDocument),
      pagination: {
        total,
        page,
        limit,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    };
  } catch (error) {
    console.error('❌ Error getting posts:', error);
    return {
      data: [],
      pagination: {
        total: 0,
        page: options.page || DEFAULT_PAGE,
        limit: options.limit || DEFAULT_LIMIT,
        totalPages: 0,
        hasNextPage: false,
        hasPrevPage: false
      }
    };
  }
}

/**
 * Get posts by main category with pagination
 */
export async function getPostsByMainCategorySlug(
  slug: string,
  options: {
    page?: number;
    limit?: number;
    publishedOnly?: boolean;
  } = {}
): Promise<PaginatedResult<PostType>> {
  try {
    await connectToDatabase();

    // Ensure Post model is available
    if (!Post) {
      try {
        Post = mongoose.model('Post');
      } catch {
        const PostModel = require('../models/Post').default;
        Post = PostModel;
      }
    }

    const { 
      page = DEFAULT_PAGE, 
      limit = DEFAULT_LIMIT,
      publishedOnly = false
    } = options;

    // Get all posts that match the category
    // Note: We could optimize this in the future with an index on normalized category names
    const filter: Record<string, any> = {};
    if (publishedOnly) {
      filter.published = true;
    }

    const allPosts = await Post.find(filter).lean();
    const matchedPosts = allPosts.filter(
      (post: any) => normalizeSlug(post.mainCategory || '') === slug
    );

    // Apply pagination
    const total = matchedPosts.length;
    const totalPages = Math.ceil(total / limit);
    const start = (page - 1) * limit;
    const end = start + limit;
    const paginatedPosts = matchedPosts.slice(start, end);

    return {
      data: paginatedPosts.map(mapPostDocument),
      pagination: {
        total,
        page,
        limit,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    };
  } catch (error) {
    console.error('❌ Error in getPostsByMainCategorySlug:', error);
    return {
      data: [],
      pagination: {
        total: 0,
        page: options.page || DEFAULT_PAGE,
        limit: options.limit || DEFAULT_LIMIT,
        totalPages: 0,
        hasNextPage: false,
        hasPrevPage: false
      }
    };
  }
}

/**
 * Get a single post by slug
 */
export async function getPostBySlug(slug: string): Promise<PostType | null> {
  try {
    await connectToDatabase();

    // Ensure Post model is available
    if (!Post) {
      try {
        Post = mongoose.model('Post');
      } catch {
        const PostModel = require('../models/Post').default;
        Post = PostModel;
      }
    }

    const post: any = await Post.findOne({ slug }).lean();
    if (!post) return null;

    return mapPostDocument(post);
  } catch (error) {
    console.error('❌ Error in getPostBySlug:', error);
    return null;
  }
}

/**
 * Get posts by sub-category with pagination
 */
export async function getPostsBySubCategorySlug(
  mainCategory: string, 
  subCategory: string,
  options: {
    page?: number;
    limit?: number;
    publishedOnly?: boolean;
  } = {}
): Promise<PaginatedResult<PostType>> {
  try {
    await connectToDatabase();

    // Ensure Post model is available
    if (!Post) {
      try {
        Post = mongoose.model('Post');
      } catch {
        const PostModel = require('../models/Post').default;
        Post = PostModel;
      }
    }

    const { 
      page = DEFAULT_PAGE, 
      limit = DEFAULT_LIMIT,
      publishedOnly = false
    } = options;

    // Build filter for initial query
    const filter: Record<string, any> = {};
    if (publishedOnly) {
      filter.published = true;
    }

    const allPosts = await Post.find(filter).lean();
    const matchedPosts = allPosts.filter(
      (post: any) => 
        normalizeSlug(post.subCategory || '') === subCategory && 
        normalizeSlug(post.mainCategory || '') === mainCategory
    );

    // Apply pagination
    const total = matchedPosts.length;
    const totalPages = Math.ceil(total / limit);
    const start = (page - 1) * limit;
    const end = start + limit;
    const paginatedPosts = matchedPosts.slice(start, end);

    return {
      data: paginatedPosts.map(mapPostDocument),
      pagination: {
        total,
        page,
        limit,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    };
  } catch (error) {
    console.error('❌ Error in getPostsBySubCategorySlug:', error);
    return {
      data: [],
      pagination: {
        total: 0,
        page: options.page || DEFAULT_PAGE,
        limit: options.limit || DEFAULT_LIMIT,
        totalPages: 0,
        hasNextPage: false,
        hasPrevPage: false
      }
    };
  }
}

/**
 * Search posts by query string with pagination
 */
export async function searchPosts(
  query: string,
  options: {
    page?: number;
    limit?: number;
    publishedOnly?: boolean;
  } = {}
): Promise<PaginatedResult<PostType>> {
  try {
    await connectToDatabase();

    // Ensure Post model is available
    if (!Post) {
      try {
        Post = mongoose.model('Post');
      } catch {
        const PostModel = require('../models/Post').default;
        Post = PostModel;
      }
    }

    const { 
      page = DEFAULT_PAGE, 
      limit = DEFAULT_LIMIT,
      publishedOnly = false
    } = options;

    const filter: Record<string, any> = {};
    
    // Add text search conditions
    if (query && query.trim() !== '') {
      const searchRegex = new RegExp(query, 'i');
      filter.$or = [
        { title: searchRegex },
        { content: searchRegex },
        { tags: searchRegex },
        { author: searchRegex },
        { mainCategory: searchRegex },
        { subCategory: searchRegex }
      ];
    }

    // Add published filter if needed
    if (publishedOnly) {
      filter.published = true;
    }

    // Get total count for pagination
    const total = await Post.countDocuments(filter);
    
    // Calculate pagination values
    const skip = (page - 1) * limit;
    const totalPages = Math.ceil(total / limit);

    // Execute paginated query
    const posts = await Post.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    return {
      data: posts.map(mapPostDocument),
      pagination: {
        total,
        page,
        limit,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    };
  } catch (error) {
    console.error('❌ Error in searchPosts:', error);
    return {
      data: [],
      pagination: {
        total: 0,
        page: options.page || DEFAULT_PAGE,
        limit: options.limit || DEFAULT_LIMIT,
        totalPages: 0,
        hasNextPage: false,
        hasPrevPage: false
      }
    };
  }
}

/**
 * Get related posts by tags or category
 */
export async function getRelatedPosts(
  postId: string,
  options: {
    limit?: number;
    publishedOnly?: boolean;
  } = {}
): Promise<PostType[]> {
  try {
    await connectToDatabase();

    // Ensure Post model is available
    if (!Post) {
      try {
        Post = mongoose.model('Post');
      } catch {
        const PostModel = require('../models/Post').default;
        Post = PostModel;
      }
    }

    const { 
      limit = 4,
      publishedOnly = true
    } = options;

    // Get the source post
    const sourcePost: any = await Post.findById(postId).lean();
    if (!sourcePost) return [];

    // Build filter for related posts
    const filter: Record<string, any> = {
      _id: { $ne: postId } // Exclude the source post
    };
    
    if (publishedOnly) {
      filter.published = true;
    }

    // First try to find by the same tags
    if (sourcePost.tags && sourcePost.tags.length > 0) {
      const byTags = await Post.find({
        ...filter,
        tags: { $in: sourcePost.tags }
      })
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();

      if (byTags.length >= limit) {
        return byTags.map(mapPostDocument);
      }
      
      // If we don't have enough by tags, get the remaining by category
      if (byTags.length > 0) {
        const remainingLimit = limit - byTags.length;
        const byCategory = await Post.find({
          ...filter,
          _id: { $nin: byTags.map(p => p._id) }, // Exclude posts we already have
          mainCategory: sourcePost.mainCategory
        })
        .sort({ createdAt: -1 })
        .limit(remainingLimit)
        .lean();
        
        return [...byTags, ...byCategory].map(mapPostDocument);
      }
    }

    // If no tags or not enough by tags, get by category
    const byCategory = await Post.find({
      ...filter,
      mainCategory: sourcePost.mainCategory
    })
    .sort({ createdAt: -1 })
    .limit(limit)
    .lean();

    if (byCategory.length >= limit) {
      return byCategory.map(mapPostDocument);
    }

    // If still not enough, get most recent posts
    const remaining = limit - byCategory.length;
    const recent = await Post.find(filter)
      .sort({ createdAt: -1 })
      .limit(remaining)
      .lean();

    return [...byCategory, ...recent].map(mapPostDocument);
  } catch (error) {
    console.error('❌ Error in getRelatedPosts:', error);
    return [];
  }
}

/**
 * Get popular or featured posts
 */
export async function getFeaturedPosts(
  options: {
    limit?: number;
  } = {}
): Promise<PostType[]> {
  try {
    await connectToDatabase();

    // Ensure Post model is available
    if (!Post) {
      try {
        Post = mongoose.model('Post');
      } catch {
        const PostModel = require('../models/Post').default;
        Post = PostModel;
      }
    }

    const { limit = 5 } = options;

    // Get published posts with thumbnails for featured section
    const posts = await Post.find({
      published: true,
      thumbnail: { $exists: true, $ne: "" }
    })
    .sort({ createdAt: -1 }) // Or use a 'featured' flag if you add one in the future
    .limit(limit)
    .lean();

    return posts.map(mapPostDocument);
  } catch (error) {
    console.error('❌ Error in getFeaturedPosts:', error);
    return [];
  }
}