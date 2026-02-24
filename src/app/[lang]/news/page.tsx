"use client";

import { useState, useMemo } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { NewsItem } from "@/data/newsData";
import { useArticles } from "@/hooks/useArticles";
import NewsCard from "@/components/NewsCard";
import CustomPagination from "@/components/CustomPagination";
import styles from "./AllNews.module.css";

const ITEMS_PER_PAGE = 6;

const AllNews = () => {
  const { t, language } = useLanguage();
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const { data: articles, isLoading, error } = useArticles();

  const allNews = (articles || []).filter((n: NewsItem) => {
    if (language === "hy") return true;
    const title = n.title?.[language];
    return !!title && title.trim().length > 0;
  });

  const filtered = useMemo(() => {
    if (!activeTag) return allNews;
    return allNews.filter((n: NewsItem) => n.category === activeTag);
  }, [activeTag, allNews]);

  const tagsList = useMemo(() => {
    const categoriesMap = new Map<string, Record<string, string>>();
    allNews.forEach((n: NewsItem) => {
      if (n.category && !categoriesMap.has(n.category)) {
        categoriesMap.set(n.category, n.tag);
      }
    });
    return Array.from(categoriesMap.entries()).map(([slug, tag]) => ({ slug, tag }));
  }, [allNews]);

  if (isLoading) {
    return (
      <div className={styles.container} style={{ textAlign: "center", padding: "100px" }}>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
        <p style={{ marginTop: "20px" }}>Loading news...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container} style={{ textAlign: "center", padding: "100px", color: "red" }}>
        <p>Error loading news. Please make sure the backend is running.</p>
      </div>
    );
  }

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const handleTagClick = (tag: string | null) => {
    setActiveTag(tag);
    setPage(1);
  };

  return (
    <div className={styles.container}>
      

      {/* Tags */}
      <div className={styles.tagsContainer}>
        <button
          onClick={() => handleTagClick(null)}
          className={`${styles.tagButton} ${activeTag === null ? styles.tagButtonActive : styles.tagButtonInactive
            }`}
        >
          {t("news.allTags")}
        </button>
        {tagsList.map(({ slug, tag }) => (
          <button
            key={slug}
            onClick={() => handleTagClick(slug)}
            className={`${styles.tagButton} ${activeTag === slug ? styles.tagButtonActive : styles.tagButtonInactive
              }`}
          >
            {tag[language]}
          </button>
        ))}
      </div>

      {/* News Grid */}
      <div className={styles.newsGrid}>
        {paginated.map((item: NewsItem, i: number) => (
          <NewsCard key={item.id} item={item} index={i} variant="featured" />
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <CustomPagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={setPage}
          previousLabel={t("news.previous")}
          nextLabel={t("news.next")}
          styles={styles}
        />
      )}
    </div>
  );
};

export default AllNews;