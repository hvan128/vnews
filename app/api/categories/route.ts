
import { NextResponse } from 'next/server';
import slugify from 'slugify';
import { connectToDatabase } from '../../../lib/mongodb';
import Post from '../../../models/Post';

export async function GET() {
  await connectToDatabase();

  try {
    const posts = await Post.find({}).select('mainCategory subCategory').lean();

    const categoryMap: Record<string, Set<string>> = {};

    for (const post of posts) {
      const main = post.mainCategory || 'Khác';
      const sub = post.subCategory || 'Khác';

      if (!categoryMap[main]) categoryMap[main] = new Set();
      categoryMap[main].add(sub);
    }

    const categories = Object.entries(categoryMap).map(([mainCategory, subSet]) => ({
      name: mainCategory,
      slug: slugify(mainCategory, { lower: true, strict: true }),
      subCategories: Array.from(subSet).map(sub => ({
        name: sub,
        slug: slugify(sub, { lower: true, strict: true }),
      })),
    }));

    return NextResponse.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
