//components/post/JsonLdSchema.tsx
type JsonLdSchemaProps = {
    title: string;
    description?: string;
    thumbnail?: string;
    publishedAt?: Date;
    author?: string;
    source?: string;
    slug: string;
};
export function JsonLdSchema({
    title,
    description,
    thumbnail,
    publishedAt,
    author,
    source,
    slug
}: JsonLdSchemaProps) {
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "NewsArticle",
        "headline": title,
        "description": description,
        "image": thumbnail ? [thumbnail] : [],
        "datePublished": publishedAt,
        "dateModified": publishedAt,
        "author": author ? {
            "@type": "Person",
            "name": author
        } : undefined,
        "publisher": {
            "@type": "Organization",
            "name": source || "News AI",
            "logo": {
                "@type": "ImageObject",
                "url": "https://example.com/logo.png"
            }
        },
        "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": `https://example.com/${slug}`
        }
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
    );
}