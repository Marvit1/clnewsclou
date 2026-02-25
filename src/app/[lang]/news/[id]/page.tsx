import { fetchArticleBySlug } from "@/lib/api";
import { Metadata, ResolvingMetadata } from "next";
import NewsDetailClient from "./NewsDetailClient";
import { notFound } from "next/navigation";

interface Props {
    params: Promise<{ id: string; lang: string }>;
}

export async function generateMetadata(
    { params }: Props,
    parent: ResolvingMetadata
): Promise<Metadata> {
    const { id, lang } = await params;

    try {
        const article = await fetchArticleBySlug(id);

        if (!article) {
            return {
                title: "Article Not Found",
            };
        }

        const title = article.title[lang as keyof typeof article.title] || article.title["hy"];
        const description = article.excerpt[lang as keyof typeof article.excerpt] || article.excerpt["hy"];
        const image = article.imageUrl;
        const url = `https://datapols.com/${lang}/news/${id}`;

        return {
            title: title,
            description: description,
            alternates: {
                canonical: url,
            },
            openGraph: {
                title: title,
                description: description,
                url: url,
                siteName: "Data Politic",
                images: [
                    {
                        url: image,
                        width: 1200,
                        height: 630,
                        alt: title,
                    },
                ],
                locale: lang === "ru" ? "ru_RU" : lang === "en" ? "en_US" : "hy_AM",
                type: "article",
                publishedTime: article.publishedAt,
                authors: [article.author].filter(Boolean) as string[],
            },
            twitter: {
                card: "summary_large_image",
                title: title,
                description: description,
                images: [image],
            },
        };
    } catch (error) {
        console.error("Error fetching article for metadata:", error);
        return {
            title: "Data Politic",
        };
    }
}

export default async function NewsDetailPage({ params }: Props) {
    const { id, lang } = await params;

    try {
        const article = await fetchArticleBySlug(id);

        if (!article) {
            notFound();
        }

        return <NewsDetailClient initialItem={article} lang={lang} />;
    } catch (error) {
        console.error("Error loading article page:", error);
        notFound();
    }
}
