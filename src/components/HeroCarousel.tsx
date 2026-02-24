"use client";

import { useState, useEffect, useCallback } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { ChevronLeft, ChevronRight, Play } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useArticles } from "@/hooks/useArticles";
import { useFeaturedYouTubeVideos } from "@/hooks/useYouTubeVideos";
import Link from "next/link";
import styles from "./HeroCarousel.module.css";


const HeroCarousel = () => {
  const { language, t } = useLanguage();
  const { data: articles, isLoading: articlesLoading } = useArticles();
  const { data: heroVideos, isLoading: videosLoading } = useFeaturedYouTubeVideos();

  const hasTranslation = (value: string | undefined) => !!value && value.trim().length > 0;

  const visibleArticles = articles
    ? articles.filter((n: any) => language === "hy" || hasTranslation(n.title?.[language]))
    : [];

  const heroNews = visibleArticles.filter((n: any) => n.isHero).slice(0, 5);
  const latestNews = visibleArticles.slice(0, 50);
  const heroVideos_top = heroVideos ? heroVideos.slice(0, 10) : [];
  const heroVideos_limited = heroVideos ? heroVideos.slice(0, 5) : [];

  const [current, setCurrent] = useState(0);
  const [vidCurrent, setVidCurrent] = useState(0);

  const next = useCallback(() => {
    if (heroNews.length > 0) {
      setCurrent((c) => (c + 1) % heroNews.length);
    }
  }, [heroNews.length]);

  const prev = () => {
    if (heroNews.length > 0) {
      setCurrent((c) => (c - 1 + heroNews.length) % heroNews.length);
    }
  };

  const vidNext = useCallback(() => {
    if (heroVideos_limited && heroVideos_limited.length > 0) {
      setVidCurrent((c) => (c + 1) % heroVideos_limited.length);
    }
  }, [heroVideos_limited]);

  const vidPrev = () => {
    if (heroVideos_limited && heroVideos_limited.length > 0) {
      setVidCurrent((c) => (c - 1 + heroVideos_limited.length) % heroVideos_limited.length);
    }
  };

  useEffect(() => {
    if (heroNews.length > 0) {
      const interval = setInterval(next, 5000);
      return () => clearInterval(interval);
    }
  }, [next, heroNews.length]);

  useEffect(() => {
    if (heroVideos_limited && heroVideos_limited.length > 0) {
      const interval = setInterval(vidNext, 8000);
      return () => clearInterval(interval);
    }
  }, [vidNext, heroVideos_limited]);

  if (articlesLoading || videosLoading) {
    return (
      <section className={styles.section}>
        <div className={styles.container}>
          <div style={{ height: "400px", display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.05)", borderRadius: "var(--radius-lg)" }}>
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </div>
      </section>
    );
  }

  if (heroNews.length === 0) {
    return null;
  }

  const item = heroNews[current];
  const video = heroVideos_limited && heroVideos_limited.length > 0 ? heroVideos_limited[vidCurrent] : null;

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div
          className={styles.gridLayout}
          data-has-video={!!(heroVideos_limited && heroVideos_limited.length > 0)}
        >
          {/* Left — Latest posts list */}
          <aside className={styles.heroAside}>
            <div className={styles.heroAsideHeader}>
              <h3 className={styles.heroAsideTitle}>{t("latest.news")}</h3>
            </div>
            <div className={styles.heroAsideList}>
              {latestNews.map((n: any) => (
                <Link
                  key={n.id}
                  href={`/${language}/news/${n.slug || n.id}`}
                  className={styles.heroAsideItem}
                >
                  <span className={styles.heroAsideItemTitle}>{n.title[language]}</span>
                  <span className={styles.heroAsideItemMeta}>{n.date}</span>
                </Link>
              ))}
            </div>
          </aside>

          {/* Center — Photo News Carousel */}
          <div className={styles.carouselMain}>
            <motion.div
              className={styles.dragWrapper}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.2}
              onDragEnd={(_, info) => {
                const swipeThreshold = 50;
                if (info.offset.x > swipeThreshold) {
                  prev();
                } else if (info.offset.x < -swipeThreshold) {
                  next();
                }
              }}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={current}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  className={styles.imageWrapper}
                >
                  <img
                    src={item.imageUrl}
                    alt={item.title[language]}
                    className={styles.image}
                    draggable={false}
                  />
                  <div className={styles.imageOverlay} />
                </motion.div>
              </AnimatePresence>

              {/* Clickable overlay link covering the whole card */}
              <Link
                href={`/${language}/news/${item.slug || item.id}`}
                className={styles.cardLink}
                aria-label={item.title[language]}
                onClick={(e) => {
                  // Prevent link click if the user was dragging
                  if (Math.abs(window.getSelection()?.toString().length || 0) > 0) {
                    e.preventDefault();
                  }
                }}
              />

              {/* Content overlay */}
              <div className={styles.contentOverlay}>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={current}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.4, delay: 0.1 }}
                    className={styles.contentBox}
                  >
                    {/* Tags and text wrapped in Link for full clickability */}
                    <Link
                      href={`/${language}/news/${item.slug || item.id}`}
                      className={styles.contentLink}
                    >
                      <div className={styles.tagsContainer}>
                        {item.isBreaking && (
                          <span className={styles.breakingTag}>
                            {t("hero.breaking")}
                          </span>
                        )}
                        {item.mediaType === "video" && (
                          <span className={styles.videoTag}>
                            <Play size={12} fill="white" /> {t("news.video")}
                          </span>
                        )}
                        <span className={styles.categoryTag}>
                          {item.tag[language]}
                        </span>
                      </div>
                      <h1 className={styles.headline}>
                        {item.title[language]}
                      </h1>
                      <p className={styles.excerpt}>
                        {item.excerpt[language]}
                      </p>
                      <div className={styles.metadata}>
                        <span>{item.author}</span>
                        <span>•</span>
                        <span>{item.date}</span>
                      </div>
                    </Link>
                  </motion.div>
                </AnimatePresence>

                {/* Dots & arrows — outside the link so they still work */}
                <div className={styles.controls}>
                  <button
                    onClick={(e) => { e.stopPropagation(); prev(); }}
                    className={styles.arrowButton}
                  >
                    <ChevronLeft size={18} />
                  </button>
                  <div className={styles.dotsContainer}>
                    {heroNews.map((_: any, i: number) => (
                      <button
                        key={i}
                        onClick={(e) => { e.stopPropagation(); setCurrent(i); }}
                        className={`${styles.dot} ${i === current ? styles.dotActive : styles.dotInactive}`}
                      />
                    ))}
                  </div>
                  <button
                    onClick={(e) => { e.stopPropagation(); next(); }}
                    className={styles.arrowButton}
                  >
                    <ChevronRight size={18} />
                  </button>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right — YouTube Video Panel */}
          {heroVideos_limited && heroVideos_limited.length > 0 && video && (
            <div className={styles.carouselVideo}>

              {/* TOP: iframe player */}
              <div className={styles.videoTopPanel}>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={vidCurrent}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4 }}
                    className={styles.iframeWrapper}
                  >
                    <iframe
                      src={`https://www.youtube.com/embed/${video.id}?rel=0&modestbranding=1`}
                      title={video.title[language]}
                      className={styles.iframe}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </motion.div>
                </AnimatePresence>

                {/* Current video title bar */}
                <div className={styles.videoTitleBar}>
                  <span className={styles.liveTag}>
                    <Play size={5} fill="currentColor" />
                  </span>
                  <AnimatePresence mode="wait">
                    <motion.h3
                      key={vidCurrent}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: 0.3 }}
                      className={styles.videoTitle}
                    >
                      {video.title[language]}
                    </motion.h3>
                  </AnimatePresence>
                </div>
              </div>

              {/* Divider */}
              <div className={styles.videoPanelDivider} />

              {/* BOTTOM: list of all featured videos */}
              <div className={styles.videoBottomPanel}>
                <div className={styles.videoListHeader}>
                  <span className={styles.heroAsideDot} />
                  <span className={styles.videoListTitle}>Featured Videos</span>
                </div>
                <div className={styles.videoList}>
                  {heroVideos_top.map((v: any, i: number) => {
                    const vTitle = v.title?.[language] || v.title?.hy || "";
                    const isActive = v.id === video.id;
                    return (
                      <button
                        key={v.id}
                        onClick={() => setVidCurrent(i % heroVideos_limited.length)}
                        className={`${styles.videoListItem} ${isActive ? styles.videoListItemActive : ""}`}
                      >
                        <span className={styles.videoListNum}>{i + 1}</span>
                        <span className={styles.videoListItemTitle}>{vTitle}</span>
                        {isActive && <Play size={10} fill="currentColor" className={styles.videoListPlayIcon} />}
                      </button>
                    );
                  })}
                </div>
              </div>

            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default HeroCarousel;