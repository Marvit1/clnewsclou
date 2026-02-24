"use client";
export const runtime = 'edge';

import { useMemo, useState } from "react";
import Link from "next/link";
import { Play } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useYouTubeVideosPage } from "@/hooks/useYouTubeVideos";
import CustomPagination from "@/components/CustomPagination";
import styles from "./AllVideo.module.css";

const VIDEOS_PER_PAGE = 8;

const AllVideoPage = () => {
  const { language, t } = useLanguage();
  const [page, setPage] = useState(1);

  const { data, isLoading, error } = useYouTubeVideosPage(page, VIDEOS_PER_PAGE);
  const videos = data?.results || [];
  const totalPages = data ? Math.max(1, Math.ceil(data.count / VIDEOS_PER_PAGE)) : 1;

  const safeVideos = useMemo(() => {
    return videos.filter((v) => {
      if (language === "hy") return true;
      const title = v.title?.[language];
      return !!title && title.trim().length > 0;
    });
  }, [videos, language]);

  if (isLoading) {
    return (
      <div className={styles.container} style={{ textAlign: "center", padding: "100px" }}>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
        <p style={{ marginTop: "20px" }}>{t("video.loading")}</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container} style={{ textAlign: "center", padding: "100px", color: "red" }}>
        <p>Error loading videos. Please make sure the backend is running.</p>
      </div>
    );
  }

  if (!safeVideos || safeVideos.length === 0) {
    return (
      <div className={styles.container}>
        <h1 className={styles.title}>{t("video.allVideos")}</h1>
        <p style={{ color: "hsl(var(--muted-foreground))" }}>{t("video.none")}</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>
        {t("video.allVideos")} <Play size={18} style={{ marginLeft: 8, verticalAlign: "-3px" }} />
      </h1>

      <div className={styles.grid}>
        {safeVideos.map((video, i) => (
          <Link key={`${video.id}-${i}`} href={`/${language}/videos/${video.id}`} className={styles.card}>
            <div className={styles.imageContainer}>
              <img src={video.thumbnail} alt={video.title?.[language] || "Video"} className={styles.image} />
              <div className={styles.overlay}>
                <div className={styles.playButton}>
                  <Play size={22} fill="white" />
                </div>
              </div>
            </div>
            <div className={styles.content}>
              <div className={styles.videoTitle}>{video.title?.[language] || ""}</div>
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
        ))}
      </div>

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

export default AllVideoPage;
