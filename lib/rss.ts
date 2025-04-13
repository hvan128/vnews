import Parser from 'rss-parser';

const parser = new Parser({
  customFields: {
    item: ['media:content', 'enclosure'],
  },
});

export type RSSArticle = {
  title: string;
  link: string;
  slug: string;
  thumbnail?: string;
  contentSnippet: string;
  pubDate: string;
  isoDate?: string;
};

export async function getRSSArticles(feedUrl: string): Promise<RSSArticle[]> {
  const feed = await parser.parseURL(feedUrl);

  return feed.items.map(item => {
    const link = item.link ?? '';
    const slug = link.split('/').pop()?.replace('.html', '') ?? '';

    // Lấy ảnh từ enclosure hoặc media:content
    const enclosure = (item as any).enclosure?.url;
    const mediaContent = (item as any)['media:content']?.url;
    const thumbnail = enclosure || mediaContent;

    return {
      title: item.title ?? '',
      link,
      slug,
      thumbnail,
      contentSnippet: item.contentSnippet ?? '',
      pubDate: item.pubDate ?? '',
      isoDate: item.isoDate,
    };
  });
}
