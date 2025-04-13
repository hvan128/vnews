//D:\news-ai\app\api\post\route.ts
import { NextRequest, NextResponse } from 'next/server'; 
import { connectToDatabase } from '../../../lib/mongodb'; 
import { getPosts, getPostBySlug, searchPosts } from '../../../lib/posts';

/**
 * GET handler for posts with pagination and filtering
 */
export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();
    
    // Get URL parameters
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const publishedOnly = searchParams.get('publishedOnly') !== 'false'; // Default to true
    const query = searchParams.get('query') || '';
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = searchParams.get('sortOrder') || 'desc';
    const slug = searchParams.get('slug') || '';
    
    // Input validation
    if (isNaN(page) || page < 1) {
      return NextResponse.json(
        { success: false, error: 'Invalid page parameter' }, 
        { status: 400 }
      );
    }
    
    if (isNaN(limit) || limit < 1 || limit > 100) {
      return NextResponse.json(
        { success: false, error: 'Invalid limit parameter (must be between 1 and 100)' }, 
        { status: 400 }
      );
    }
    
    // Handle different request types
    let result;
    
    // Get single post by slug
    if (slug) {
      const post = await getPostBySlug(slug);
      if (!post) {
        return NextResponse.json(
          { success: false, error: 'Post not found' }, 
          { status: 404 }
        );
      }
      return NextResponse.json({ success: true, post });
    }
    
    // Search for posts
    if (query) {
      result = await searchPosts(query, {
        page,
        limit,
        publishedOnly
      });
    } 
    // Get paginated posts
    else {
      result = await getPosts({
        page,
        limit,
        publishedOnly,
        sortBy: sortBy as string,
        sortOrder: sortOrder as 'asc' | 'desc'
      });
    }
    
    return NextResponse.json({
      success: true,
      posts: result.data,
      pagination: result.pagination
    });
  } catch (error: any) {
    console.error('❌ API Error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' }, 
      { status: 500 }
    );
  }
}

/**
 * POST handler for creating new posts
 * Note: This would typically be protected by authentication
 */
export async function POST(request: NextRequest) {
  try {
    // Functionality for creating posts would go here
    // This would typically be protected by authentication middleware
    
    return NextResponse.json(
      { success: false, error: 'Not implemented' }, 
      { status: 501 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' }, 
      { status: 500 }
    );
  }
}