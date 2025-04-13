import { NextResponse } from 'next/server';
import { connectToDatabase } from '../../../../lib/mongodb';
import Post from '../../../../models/Post';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const title = searchParams.get('title');

  if (!title) return NextResponse.json({ exists: false });

  await connectToDatabase();
  const exists = await Post.exists({ title });

  return NextResponse.json({ exists: !!exists });
}
