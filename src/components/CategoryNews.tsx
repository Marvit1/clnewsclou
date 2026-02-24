"use client";

import { useState, useMemo } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { NewsItem } from "@/data/newsData";
import { useArticlesByCategory } from "@/hooks/useArticles";
import NewsCard from "@/components/NewsCard";
import { ChevronLeft, ChevronRight } from "lucide-react";
import styles from "../app/[lang]/news/AllNews.module.css"; 

const ITEMS_PER_PAGE = 6;

interface CategoryNewsProps {
  categorySlug: string;
}

const CategoryNews = ({ categorySlug }: CategoryNewsProps) => {
  const { t, language } = useLanguage();
  const [page, setPage] = useState(1);
  const { data: articles, isLoading, error } = useArticlesByCategory(categorySlug);

  const allNews = (articles || []).filter((n: NewsItem) => {
    if (language === "hy") return true;
    const title = n.title?.[language];
    return !!title && title.trim().length > 0;
  });

  const filtered = useMemo(() => {
    // In this page, allNews are already filtered by category from the API
    return allNews;
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
        <p>Error loading news. Please make sure the backend is running and the category slug is valid.</p>
      </div>
    );
  }

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>
        {t(`category.${categorySlug}`, categorySlug.charAt(0).toUpperCase() + categorySlug.slice(1))}
      </h1>

      {/* News Grid */}
      <div className={styles.newsGrid}>
        {paginated.map((item: NewsItem, i: number) => (
          <NewsCard key={item.id} item={item} index={i} variant="featured" />
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className={styles.paginationContainer}>
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className={`${styles.paginationButton} ${styles.prevButton}`}
          >
            <ChevronLeft size={14} /> {t("news.previous")}
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => setPage(p)}
              className={`${styles.pageButton} ${p === page ? styles.pageButtonActive : styles.pageButtonInactive
                }`}
            >
              {p}
            </button>
          ))}

          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className={`${styles.paginationButton} ${styles.nextButton}`}
          >
            {t("news.next")} <ChevronRight size={14} />
          </button>
        </div>
      )}
    </div>
  );
};

export default CategoryNews;
