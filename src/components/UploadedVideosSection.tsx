"use client";

import Link from "next/link";
import { Play } from "lucide-react";
import { useUploadedVideos } from "@/hooks/useUploadedVideos";
import { useLanguage } from "@/contexts/LanguageContext";
import styles from "./UploadedVideosSection.module.css";

const formatDate = (iso: string) => {
  try {
    return new Date(iso).toLocaleDateString();
  } catch {
    return "";
  }
};

export default function UploadedVideosSection() {
  const { language, t } = useLanguage();
  const { data, isLoading } = useUploadedVideos(4);

  if (isLoading) return null;

  const videos = data || [];
  if (videos.length === 0) return null;

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.heading}>
            {t("home.uploadedVideos")} <Play size={18} style={{ marginLeft: 8, verticalAlign: "-3px" }} />
          </h2>
        </div>

        <div className={styles.grid}>
          {videos.map((v) => (
            <Link key={v.id} href={`/${language}/uploaded-videos/${v.id}`} className={styles.card}>
              <div className={styles.imageContainer}>
                <img
                  src={v.thumbnail_url || "/placeholder.svg"}
                  alt={v.title?.[language] || v.title?.hy || "Video"}
                  className={styles.image}
                />
              </div>
              <div className={styles.content}>
                <div className={styles.title}>{v.title?.[language] || v.title?.hy || ""}</div>
                <div className={styles.meta}>{formatDate(v.created_at)}</div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
