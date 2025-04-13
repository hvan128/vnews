import { NextResponse } from 'next/server';
import { rewriteArticle } from '../../../lib/ai';
import Post from '../../../models/Post';
import { connectToDatabase } from '../../../lib/mongodb';

export async function POST(req: Request) {
    const body = await req.json();
    const {
        title,
        content,
        slug,
        thumbnail,
        htmlContent,
        images,
        description,
        author,
        publishedAt,
        source,
        mainCategory,
        subCategory,
        tags,
        readTime,
        url,
    } = body;
    

    try {
        // 1. Rewrite content using AI
        const rewrittenContent = await rewriteArticle({ title, content });

        // 2. Connect to DB
        await connectToDatabase();

        // 3. Save to MongoDB
        const newPost = new Post({
            title,
            rewriteTitle: rewrittenContent.rewriteTitle, // tiêu đề đã rewrite
            slug,
            content, // original content
            rewritten: rewrittenContent.rewritten,
            thumbnail,
            htmlContent,
            images,
            description,
            author,
            publishedAt: publishedAt ? new Date(publishedAt) : new Date(),
            source,
            mainCategory,
            subCategory,
            tags,  
            readTime,
            originalUrl: url,
            published: true,
            createdAt: new Date(),
        });

        await newPost.save();

        // 4. Return response
        return NextResponse.json({ success: true, post: newPost });
    } catch (err: any) {
        console.error('❌ Rewrite & Save Error:', err);
        return NextResponse.json(
            { error: 'Failed to rewrite and save', details: err.message },
            { status: 500 }
        );
    }
}
