export const dynamic = 'force-dynamic'; // 👈 Thêm dòng này ở đầu file

import { NextResponse } from 'next/server';
import { crawlArticleContent } from '../../../lib/crawler';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const url = searchParams.get('url');

  if (!url) {
    return NextResponse.json({ error: 'Missing URL' }, { status: 400 });
  }

  try {
    const article = await crawlArticleContent(url);
    return NextResponse.json(article);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to crawl content' }, { status: 500 });
  }
}
