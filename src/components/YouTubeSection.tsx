"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { Play } from "lucide-react";
import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import styles from "./YouTubeSection.module.css";

import { useYouTubeVideosPage } from "@/hooks/useYouTubeVideos";

const VIDEOS_PER_PAGE = 8;

const YouTubeSection = () => {
  const { language, t } = useLanguage();
  const [page, setPage] = useState(1);
  const sectionRef = useRef<HTMLElement>(null);
  const { data, isLoading } = useYouTubeVideosPage(page, VIDEOS_PER_PAGE);
  const videos = data?.results || [];
  const totalPages = data ? Math.max(1, Math.ceil(data.count / VIDEOS_PER_PAGE)) : 1;

  const goToPage = (p: number) => {
    const nextPage = Math.min(Math.max(1, p), totalPages);
    setPage(nextPage);
    requestAnimationFrame(() => {
      sectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  };

  if (isLoading) {
    return (
      <section className={styles.section}>
        <div className={styles.container}>
          <div style={{ textAlign: "center", padding: "40px" }}>
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          </div>
        </div>
      </section>
    );
  }

  if (!videos || videos.length === 0) {
    return null; // Or show a default state
  }

  return (
    <section className={styles.section} ref={sectionRef}>
      <div className={styles.container}>
        <div className={styles.header}>
          <Link href={`/${language}/videos`} className={styles.headerLink}>
            <div className={styles.headerIcon}>
              <Play size={16} fill="white" className={styles.playIcon} />
            </div>
            <h2 className={styles.heading}>{t("home.videoNews")}</h2>
          </Link>
        </div>

        <div className={styles.grid}>
          {videos.map((video, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: i * 0.08 }}
              className={styles.card}
            >
              <Link href={`/${language}/videos/${video.id}`} style={{ textDecoration: "none" }}>
                <div className={styles.imageContainer}>
                  <img
                    src={video.thumbnail}
                    alt={video.title[language]}
                    className={styles.image}
                  />
                  <div className={styles.hoverOverlay}>
                    <div className={styles.playButton}>
                      <Play size={20} fill="white" className={styles.playButtonIcon} />
                    </div>
                  </div>

                </div>
                <div className={styles.content}>
                  <h3 className={styles.title}>{video.title[language]}</h3>
                  <div className={styles.metadata}>
                    <span className={styles.channel}>DataPolitic</span>
                    <span className={styles.date}>
                      {new Date(video.created_at).toLocaleString('en-US', {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: true
                      })}
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>


      </div>
    </section>
  );
};

export default YouTubeSection;