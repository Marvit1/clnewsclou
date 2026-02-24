"use client";

import { useParams } from "next/navigation";
import NewsCard from "@/components/NewsCard";
import { useLanguage } from "@/contexts/LanguageContext";
import styles from "../../AllNews.module.css";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

import { useArticles } from "@/hooks/useArticles";
import { NewsItem } from "@/data/newsData";

const TagNews = () => {
    const { tag } = useParams();
    const { t } = useLanguage();
    const { data: articles, isLoading } = useArticles();
    const decodedTag = typeof tag === 'string' ? decodeURIComponent(tag) : '';

    const filteredNews = articles ? articles.filter(
        (item: NewsItem) => Object.values(item.tag).some(
            val => val.toLowerCase() === decodedTag.toLowerCase()
        )
    ) : [];

    if (isLoading) {
        return (
            <div className={styles.container}>
                <div style={{ textAlign: "center", padding: "100px" }}>
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <Link href="/news" className={styles.backLink}>
                    <ChevronLeft size={16} /> {t("nav.allNews")}
                </Link>
                <h1 className={styles.title}>
                    Tag: {decodedTag}
                </h1>
            </div>

            {filteredNews.length > 0 ? (
                <div className={styles.newsGrid}>
                    {filteredNews.map((item: NewsItem, i: number) => (
                        <NewsCard key={item.id} item={item} index={i} variant="featured" />
                    ))}
                </div>
            ) : (
                <div className={styles.empty}>
                    <p>No news found for this tag.</p>
                </div>
            )}
        </div>
    );
};

export default TagNews;
