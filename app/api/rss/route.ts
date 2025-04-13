// app/api/rss/route.ts
import { NextResponse } from 'next/server';
import { getRSSArticles } from '../../../lib/rss';

export async function GET() {
  const articles = await getRSSArticles('https://vnexpress.net/rss/tin-moi-nhat.rss');
  return NextResponse.json(articles);
}
