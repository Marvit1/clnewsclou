"use client";
export const runtime = 'edge';

import { useParams, useRouter } from "next/navigation";
import { ChevronLeft, ExternalLink, ArrowRight, Play } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useYouTubeVideo } from "@/hooks/useYouTubeVideo";
import { useYouTubeVideos } from "@/hooks/useYouTubeVideos";
import Aside from "@/components/Aside";
import Link from "next/link";
import styles from "./VideoDetail.module.css";

const hasTranslation = (value: string | undefined | null) =>
  !!value && value.trim().length > 0;

export default function VideoDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { language, t } = useLanguage();

  const rawId = params?.id;
  const youtubeId = typeof rawId === "string" ? rawId : "";

  const { data: video, isLoading, error } = useYouTubeVideo(youtubeId || null);
  const { data: allVideos } = useYouTubeVideos();

  // Pick 4 other videos (exclude current)
  const relatedVideos = (allVideos || [])
    .filter((v) => v.id !== youtubeId)
    .slice(0, 4);

  if (isLoading) {
    return (
      <div className={styles.mainWrapper}>
        <div className={styles.container}>
          <div className={styles.loadingBox}>
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p style={{ marginTop: 16 }}>Loading video...</p>
          </div>
        </div>
      </div>
    );
  }

  const missingSelectedTranslation =
    !!video && language !== "hy" && !hasTranslation(video.title?.[language]);

  if (error || !video || missingSelectedTranslation) {
    return (
      <div className={styles.mainWrapper}>
        <div className={styles.container}>
          <div className={styles.notFound}>
            <h2>{t("video.notFound")}</h2>
            <p>{t("video.movedOrDeleted")}</p>
            <button onClick={() => router.back()} className={styles.backButton}>
              <ChevronLeft size={16} /> {t("nav.back")}
            </button>
          </div>
        </div>
      </div>
    );
  }

  const title = video.title?.[language] || video.title?.hy || "";
  const ytId = video.id;

  return (
    <div className={styles.mainWrapper}>
      {/* Breadcrumb */}
      <div className={styles.breadcrumbBar}>
        <div className={styles.breadcrumbContainer}>
          <Link href={`/${language}`} className={styles.breadcrumbLink}>{t("nav.home")}</Link>
          <ArrowRight size={12} className={styles.breadcrumbSeparator} />
          <Link href={`/${language}/videos`} className={styles.breadcrumbLink}>{t("nav.videos")}</Link>
          <ArrowRight size={12} className={styles.breadcrumbSeparator} />
          <span className={styles.breadcrumbCurrent}>{title}</span>
        </div>
      </div>

      <div className={styles.container}>
        <div className={styles.layout}>
          {/* Main Content */}
          <main className={styles.main}>
            <button onClick={() => router.back()} className={styles.backButton}>
              <ChevronLeft size={16} /> {t("nav.back")}
            </button>

            <div className={styles.videoHeader}>
              <h1 className={styles.title}>{title}</h1>
              <div className={styles.metaInfo}>
                <span className={styles.channelBadge}>DataPolitic</span>
                <span className={styles.publishDate}>
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

            <div className={styles.videoWrapper}>
              <iframe
                src={`https://www.youtube.com/embed/${ytId}?rel=0`}
                title={title}
                className={styles.videoIframe}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>

            <a
              href={video.url}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.watchLink}
            >
              {t("video.watchOnYouTube")} <ExternalLink size={16} />
            </a>

            {/* You can also watch */}
            {relatedVideos.length > 0 && (
              <section className={styles.relatedSection}>
                <h2 className={styles.relatedTitle}>
                  <span className={styles.relatedTitleAccent}>▶</span>
                  {t("video.watchAlso")}
                </h2>
                <div className={styles.relatedGrid}>
                  {relatedVideos.map((v) => {
                    const vTitle = v.title?.[language] || v.title?.hy || "";
                    return (
                      <Link
                        key={v.id}
                        href={`/${language}/videos/${v.id}`}
                        className={styles.relatedCard}
                      >
                        <div className={styles.relatedThumb}>
                          {v.thumbnail ? (
                            <img
                              src={v.thumbnail}
                              alt={vTitle}
                              className={styles.relatedThumbImg}
                            />
                          ) : (
                            <div className={styles.relatedThumbPlaceholder}>
                              <Play size={28} />
                            </div>
                          )}
                          <div className={styles.relatedPlayOverlay}>
                            <Play size={20} fill="white" />
                          </div>
                        </div>
                        <div className={styles.relatedInfo}>
                          <p className={styles.relatedVideoTitle}>{vTitle}</p>
                          {v.channel && (
                            <span className={styles.relatedChannel}>DataPolitic</span>
                          )}
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </section>
            )}
          </main>

          {/* Sidebar */}
          <aside className={styles.sidebar}>
            <Aside />
          </aside>
        </div>
      </div>
    </div>
  );
}
