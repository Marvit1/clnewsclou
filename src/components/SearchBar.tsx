"use client";

import { useState, useEffect, useRef } from "react";
import { Search, X, ArrowRight, Loader2 } from "lucide-react";
import { fetchSearchArticles } from "@/lib/api";
import { NewsItem } from "@/data/newsData";
import { useLanguage } from "@/contexts/LanguageContext";
import Link from "next/link";
import styles from "./SearchBar.module.css";
import { motion, AnimatePresence } from "framer-motion";

const SearchBar = () => {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<NewsItem[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [totalCount, setTotalCount] = useState(0);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [isFocused, setIsFocused] = useState(false);
    const { language, t } = useLanguage();
    const searchRef = useRef<HTMLDivElement>(null);

    const ITEMS_PER_PAGE = 10;

    useEffect(() => {
        const handler = setTimeout(async () => {
            if (query.trim().length > 1) {
                setIsLoading(true);
                try {
                    const { results: searchResults, count } = await fetchSearchArticles(query, language, ITEMS_PER_PAGE, 0);
                    setResults(searchResults);
                    setTotalCount(count);
                } catch (error) {
                    console.error("Search error:", error);
                    setResults([]);
                    setTotalCount(0);
                } finally {
                    setIsLoading(false);
                }
            } else {
                setResults([]);
                setTotalCount(0);
                setIsLoading(false);
            }
        }, 400); // 400ms debounce

        return () => clearTimeout(handler);
    }, [query, language]);

    const handleLoadMore = async () => {
        if (isLoadingMore || results.length >= totalCount) return;

        setIsLoadingMore(true);
        try {
            const { results: newResults } = await fetchSearchArticles(query, language, ITEMS_PER_PAGE, results.length);
            setResults(prev => [...prev, ...newResults]);
        } catch (error) {
            console.error("Load more error:", error);
        } finally {
            setIsLoadingMore(false);
        }
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setIsFocused(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const inputRef = useRef<HTMLInputElement>(null);

    const handleSearchClick = () => {
        setIsFocused(true);
        setTimeout(() => {
            inputRef.current?.focus();
        }, 0);
    };

    return (
        <div className={styles.searchWrapper} ref={searchRef}>
            <div
                className={`${styles.searchBox} ${isFocused ? styles.focused : ""}`}
                onClick={handleSearchClick}
            >
                {isLoading ? (
                    <Loader2 size={18} className={`${styles.searchIcon} animate-spin`} />
                ) : (
                    <Search size={18} className={styles.searchIcon} />
                )}
                <input
                    ref={inputRef}
                    type="text"
                    placeholder={t("search.placeholder")}
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => setIsFocused(true)}
                    className={styles.searchInput}
                />
                {query && (
                    <button onClick={() => setQuery("")} className={styles.clearBtn}>
                        <X size={16} />
                    </button>
                )}
            </div>

            <AnimatePresence>
                {isFocused && (query.length > 1 || results.length > 0) && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.98, y: 4 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.98, y: 4 }}
                        className={styles.searchPanel}
                    >
                        <div className={styles.resultsArea}>
                            {results.length > 0 ? (
                                <>
                                    {results.map((item) => (
                                        <Link
                                            href={`/${language}/news/${item.slug || item.id}`}
                                            key={item.id}
                                            className={styles.resultItem}
                                            onClick={() => setIsFocused(false)}
                                        >
                                            <div className={styles.resultDetails}>
                                                <span className={styles.resultTag}>
                                                    {item.tag[language as keyof typeof item.tag] || item.tag['hy']}
                                                </span>
                                                <h4 className={styles.resultTitle}>
                                                    {item.title[language as keyof typeof item.title] || item.title['hy']}
                                                </h4>
                                            </div>
                                            <ArrowRight size={14} className={styles.resultArrow} />
                                        </Link>
                                    ))}

                                    {results.length < totalCount && (
                                        <button
                                            className={styles.loadMoreBtn}
                                            onClick={handleLoadMore}
                                            disabled={isLoadingMore}
                                        >
                                            {isLoadingMore ? (
                                                <Loader2 size={14} className="animate-spin" />
                                            ) : (
                                                t("search.loadMore")
                                            )}
                                        </button>
                                    )}
                                </>
                            ) : query.length > 1 && !isLoading ? (
                                <div className={styles.noResults}>
                                    {t("search.noResults")} "{query}"
                                </div>
                            ) : !isLoading && (
                                <div className={styles.popularSearches}>
                                    <p>{t("search.try")}</p>
                                    <div className={styles.suggestionChips}>
                                        {["Politics", "Economy", "World", "Sports"].map(tag => (
                                            <button
                                                key={tag}
                                                onClick={() => setQuery(tag)}
                                                className={styles.chip}
                                            >
                                                {tag}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                            {isLoading && query.length > 1 && results.length === 0 && (
                                <div className={styles.loadingState}>
                                    <p>{t("search.loading")}</p>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default SearchBar;
