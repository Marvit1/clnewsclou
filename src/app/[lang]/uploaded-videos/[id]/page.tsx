"use client";
export const runtime = 'edge';

import { useParams, useRouter } from "next/navigation";
import { ChevronLeft, ArrowRight } from "lucide-react";
import { useUploadedVideo } from "@/hooks/useUploadedVideos";
import { useLanguage } from "@/contexts/LanguageContext";
import Aside from "@/components/Aside";
import Link from "next/link";
import styles from "./UploadedVideoDetail.module.css";

const hasTranslation = (value: string | undefined | null) =>
  !!value && value.trim().length > 0;

export default function UploadedVideoDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { language, t } = useLanguage();

  const rawId = params?.id;
  const parsedId = typeof rawId === "string" ? Number(rawId) : NaN;

  const { data: video, isLoading, error } = useUploadedVideo(
    Number.isFinite(parsedId) ? parsedId : null
  );

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
            <h2>Video not found</h2>
            <p>The video you are looking for might have been moved or deleted.</p>
            <button onClick={() => router.back()} className={styles.backButton}>
              <ChevronLeft size={16} /> Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  const title = video.title?.[language] || video.title?.hy || "";

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
              <ChevronLeft size={16} /> Back
            </button>

            <h1 className={styles.title}>{title}</h1>

            <div className={styles.videoWrapper}>
              <video
                src={video.video_url}
                controls
                className={styles.videoPlayer}
              />
            </div>
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
