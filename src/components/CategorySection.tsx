import { useState } from "react";
import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";
import { NewsItem } from "@/data/newsData";
import { Play, ArrowRight } from "lucide-react";
import styles from "./CategorySection.module.css";

interface CategorySectionProps {
    title: string;
    articles: NewsItem[];
    color: string;
}

const CategorySection = ({ title, articles, color }: CategorySectionProps) => {
    const { language, t } = useLanguage();
    const [selectedIdx, setSelectedIdx] = useState(0);

    if (!articles || articles.length === 0) return null;

    const selectedArticle = articles[selectedIdx] || articles[0];

    return (
        <div className={styles.section} style={{ "--category-color": color } as any}>
            <div className={styles.header}>
                <h3 className={styles.title}>{title}</h3>
            </div>

            <div className={styles.container}>
                {/* Main Display Area */}
                <div className={styles.mainDisplay}>
                    <Link
                        href={`/${language}/news/${selectedArticle.slug || selectedArticle.id}`}
                        className={styles.articleLink}
                    >
                        <div className={styles.imageArea}>
                            <img src={selectedArticle.imageUrl} alt="" className={styles.mainImage} />
                        </div>
                        <div className={styles.contentArea}>
                            <h4 className={styles.articleTitle}>{selectedArticle.title[language]}</h4>
                        </div>
                    </Link>
                </div>

                {/* Sidebar List */}
                <div className={styles.sidebar}>
                    <div className={styles.scrollList}>
                        {articles.slice(0, 10).map((article, index) => (
                            <button
                                key={article.id}
                                onClick={() => setSelectedIdx(index)}
                                className={`${styles.listItem} ${selectedIdx === index ? styles.activeItem : ""}`}
                            >
                                <span className={styles.listNumber}>{index + 1}</span>
                                <span className={styles.listTitle}>{article.title[language]}</span>
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CategorySection;
