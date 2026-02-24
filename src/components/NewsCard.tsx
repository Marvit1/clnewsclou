"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import { NewsItem } from "@/data/newsData";
import { Play, ImageIcon } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import styles from "./NewsCard.module.css";

interface NewsCardProps {
  item: NewsItem;
  index?: number;
  variant?: "default" | "featured";
}

const NewsCard = ({ item, index = 0, variant = "default" }: NewsCardProps) => {
  const { language } = useLanguage();

  if (variant === "featured") {
    return (
      <Link href={`/${language}/news/${item.slug || item.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
        <motion.article
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: index * 0.05 }}
          className={styles.featuredCard}
        >
          <div className={styles.featuredImageContainer}>
            <img
              src={item.imageUrl}
              alt={item.title[language]}
              className={styles.featuredImage}
            />
            <div className={styles.imageOverlay} />
            <div className={styles.featuredTags}>
              <span className={styles.tagBadge}>
                {item.tag[language]}
              </span>
              {item.mediaType === "video" && (
                <span className={styles.videoBadge}>
                  <Play size={10} fill="white" /> Video
                </span>
              )}
            </div>
          </div>
          <div className={styles.featuredContent}>
            <h3 className={styles.featuredTitle}>
              {item.title[language]}
            </h3>
            <p className={styles.excerpt}>
              {item.excerpt[language]}
            </p>
            <div className={styles.metadata}>
              <span>{item.author}</span>
              <span>•</span>
              <span>{item.date}</span>
            </div>
          </div>
        </motion.article>
      </Link>
    );
  }

  return (
    <Link href={`/${language}/news/${item.slug || item.id}`} style={{ textDecoration: 'none', color: 'inherit', width: '100%' }}>
      <motion.article
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: index * 0.04 }}
        className={styles.defaultCard}
      >
        <div className={styles.defaultImageContainer}>
          <img
            src={item.imageUrl}
            alt={item.title[language]}
            className={styles.defaultImage}
          />
          {item.mediaType === "video" ? (
            <div className={styles.mediaIcon}>
              <Play size={8} fill="white" />
            </div>
          ) : (
            <div className={styles.mediaIcon}>
              <ImageIcon size={8} />
            </div>
          )}
        </div>
        <div className={styles.defaultContent}>
          <div className={styles.defaultTagContainer}>
            <span className={styles.defaultTag}>
              {item.tag[language]}
            </span>
          </div>
          <h4 className={styles.defaultTitle}>
            {item.title[language]}
          </h4>
          <div className={styles.defaultMetadata}>
            <span>{item.author}</span>
            <span>•</span>
            <span>{item.date}</span>
          </div>
        </div>
      </motion.article>
    </Link>
  );
};

export default NewsCard;