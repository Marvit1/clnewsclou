"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import HeroCarousel from "@/components/HeroCarousel";
import AdBanner from "@/components/AdBanner";
import NewsCard from "@/components/NewsCard";

import YouTubeSection from "@/components/YouTubeSection";
import UploadedVideosSection from "@/components/UploadedVideosSection";
import Aside from "@/components/Aside";
import CategorySection from "@/components/CategorySection";
import { NewsItem } from "@/data/newsData";
import { useLanguage } from "@/contexts/LanguageContext";
import { useArticles, useArticlesByCategory } from "@/hooks/useArticles";

import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowRight, Newspaper } from "lucide-react";
import styles from "./index.module.css";

const MAIN_COUNT = 4;
const MORE_STORIES_PER_PAGE = 7;

const Index = () => {
    const { t, language } = useLanguage();
    const { data: articles, isLoading, error } = useArticles();

    const router = useRouter();
    const searchParams = useSearchParams();
    const moreStoriesRef = useRef<HTMLDivElement>(null);

    const initialStoriesPage = useMemo(() => {
        const raw = searchParams.get("storiesPage");
        const parsed = raw ? Number(raw) : 1;
        return Number.isFinite(parsed) && parsed > 0 ? parsed : 1;
    }, [searchParams]);

    const [storiesPage, setStoriesPage] = useState<number>(initialStoriesPage);

    useEffect(() => {
        setStoriesPage(initialStoriesPage);
    }, [initialStoriesPage]);

    if (isLoading) {
        return (
            <div className={styles.mainSection} style={{ textAlign: "center", padding: "100px" }}>
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                <p style={{ marginTop: "20px" }}>Loading latest news...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className={styles.mainSection} style={{ textAlign: "center", padding: "100px", color: "red" }}>
                <p>Error loading news. Please make sure the backend is running.</p>
            </div>
        );
    }

    const newsItems = (articles || []).filter((n: NewsItem) => {
        if (language === "hy") return true;
        const title = n.title?.[language];
        return !!title && title.trim().length > 0;
    });

    const latestNews = newsItems.slice(0, MAIN_COUNT);
    const remainingNews = newsItems.slice(MAIN_COUNT);

    const totalStoriesPages = Math.max(1, Math.ceil(remainingNews.length / MORE_STORIES_PER_PAGE));
    const safeStoriesPage = Math.min(storiesPage, totalStoriesPages);

    const sideNews = remainingNews.slice(
        (safeStoriesPage - 1) * MORE_STORIES_PER_PAGE,
        safeStoriesPage * MORE_STORIES_PER_PAGE
    );

    const goToStoriesPage = (page: number) => {
        const nextPage = Math.min(Math.max(1, page), totalStoriesPages);
        const params = new URLSearchParams(searchParams.toString());
        params.set("storiesPage", String(nextPage));
        router.replace(`/${language}/?${params.toString()}`, { scroll: false });
        setStoriesPage(nextPage);
        requestAnimationFrame(() => {
            moreStoriesRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
        });
    };

    return (
        <>
            <AdBanner position="top" />
            <HeroCarousel />
            <div className={styles.mainSection} style={{ paddingTop: 0, paddingBottom: 0 }}>
                <AdBanner position="middle" />
            </div>



            {/* Main content with aside */}
            <section className={styles.mainSection}>
                <div className={styles.headerContainer}>
                    <div className={styles.headerTitle}>
                        <Newspaper size={20} style={{ color: "hsl(var(--accent))" }} />
                        <h2 className={styles.heading}>
                            {t("latest.news")}
                        </h2>
                    </div>
                    <Link
                        href={`/${language}/news`}
                        className={styles.viewAllLink}
                    >
                        {t("nav.allNews")} <ArrowRight size={14} />
                    </Link>
                </div>

                <div className={styles.gridLayout}>
                    {/* Main news */}
                    <div>
                        <div className={styles.newsGrid}>
                            {latestNews.map((item: NewsItem, i: number) => (
                                <NewsCard key={item.id} item={item} index={i} variant="featured" />
                            ))}
                        </div>

                        {/* List news below */}
                        <div className={styles.moreStoriesBox} ref={moreStoriesRef}>
                            <h3 className={styles.moreStoriesTitle}>
                                {t("home.moreStories")}
                            </h3>
                            {sideNews.map((item: NewsItem, i: number) => (
                                <NewsCard key={item.id} item={item} index={i} />
                            ))}


                        </div>
                    </div>

                    {/* Aside */}
                    <Aside />
                </div>
            </section>

            {/* YouTube Section */}
            <YouTubeSection />

            {/* Categorized Sections Grid */}
            <section className={styles.mainSection} style={{ marginTop: '40px' }}>
                <CategoryGrid />
            </section>

            {/* Uploaded Videos Section */}
            <UploadedVideosSection />
        </>
    );
};

const CategoryGrid = () => {
    const { t } = useLanguage();
    const { data: politics } = useArticlesByCategory("politics");
    const { data: economy } = useArticlesByCategory("economy");
    const { data: world } = useArticlesByCategory("world");
    const { data: sports } = useArticlesByCategory("sports");
    const { data: law } = useArticlesByCategory("law");
    const { data: culture } = useArticlesByCategory("culture");

    const categories = [
        // Row 1: Red
        { id: "politics", title: t("nav.politics"), color: "#a81a1a", data: politics },
        { id: "law", title: t("nav.law"), color: "#a81a1a", data: law },
        // Row 2: Blue
        { id: "economy", title: t("nav.economy"), color: "#003eb3", data: economy },
        { id: "sports", title: t("nav.sports"), color: "#003eb3", data: sports },
        // Row 3: Orange
        { id: "world", title: t("nav.world"), color: "#e67a00", data: world },
        { id: "culture", title: t("nav.culture"), color: "#e67a00", data: culture },
    ];

    return (
        <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '12px'
        }}>
            {categories.map(cat => (
                <CategorySection
                    key={cat.id}
                    title={cat.title}
                    color={cat.color}
                    articles={cat.data || []}
                />
            ))}
            <style jsx>{`
                @media (max-width: 1100px) {
                    div {
                        grid-template-columns: 1fr !important;
                    }
                }
            `}</style>
        </div>
    );
};

export default Index;