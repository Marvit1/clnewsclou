"use client";

import { useEffect, useState, useCallback } from "react";
import { X } from "lucide-react";
import styles from "./AdBanner.module.css";
import { motion, AnimatePresence } from "framer-motion";
import { AdData, AdPosition, fetchAdByPosition, clickAd } from "@/lib/api";

interface AdBannerProps {
    position: AdPosition;
    label?: string;
    variant?: "default" | "compact";
}

const AdBanner = ({ position, label, variant = "default" }: AdBannerProps) => {
    const [isVisible, setIsVisible] = useState(true);
    const [ads, setAds] = useState<AdData[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let mounted = true;
        setLoading(true);
        fetchAdByPosition(position)
            .then((data) => {
                if (!mounted) return;
                if (Array.isArray(data)) {
                    setAds(data);
                } else if (data) {
                    setAds([data]);
                } else {
                    setAds([]);
                }
            })
            .finally(() => {
                if (mounted) setLoading(false);
            });
        return () => {
            mounted = false;
        };
    }, [position]);

    // Carousel logic
    useEffect(() => {
        if (ads.length <= 1 || (position !== "top" && position !== "middle" && position !== "footer")) return;

        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % ads.length);
        }, 6000); // 6 seconds per ad

        return () => clearInterval(interval);
    }, [ads, position]);

    const activeAd = ads[currentIndex];

    const handleClick = useCallback(() => {
        if (activeAd) {
            clickAd(activeAd.id).catch(() => { });
        }
    }, [activeAd]);

    return (
        <AnimatePresence>
            {isVisible && ads.length > 0 && (
                <motion.div
                    initial={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                    className={`${styles.adContainer} ${styles[position]} ${variant === "compact" ? styles.compact : ""}`}
                    style={{ overflow: "hidden" }}
                >
                    <div className={styles.adWrapper}>
                        <button
                            onClick={() => setIsVisible(false)}
                            className={styles.closeButton}
                            aria-label="Close advertisement"
                        >
                            <X size={14} />
                        </button>

                        <div className={styles.adContent}>
                            <AnimatePresence mode="popLayout" initial={false}>
                                <motion.div
                                    key={activeAd?.id || 'loading'}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ duration: 0.6, ease: "easeInOut" }}
                                >
                                    {activeAd && (
                                        <a href={activeAd.link_url} target="_blank" rel="noopener noreferrer" onClick={handleClick}>
                                            {activeAd.media_type === "image" && activeAd.image_url ? (
                                                <div className={(position === "aside" || position === "asideadds") ? styles.asideAd : styles.horizontalAd}>
                                                    <img src={activeAd.image_url} alt={activeAd.label} />
                                                </div>
                                            ) : (
                                                <div className={(position === "aside" || position === "asideadds") ? styles.asideAd : styles.horizontalAd}>
                                                    {activeAd.video_url ? (
                                                        <iframe
                                                            src={activeAd.video_url.includes("youtube.com") || activeAd.video_url.includes("youtu.be")
                                                                ? `https://www.youtube.com/embed/${activeAd.video_url.match(/(?:v=|\/)([0-9A-Za-z_-]{11})/)?.[1] || ""}?rel=0`
                                                                : activeAd.video_url}
                                                            title="Ad video"
                                                            style={{ width: "100%", height: (position === "aside" || position === "asideadds") ? 200 : 250, border: "none" }}
                                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                            allowFullScreen
                                                        />
                                                    ) : activeAd.video_file_url ? (
                                                        <video src={activeAd.video_file_url} controls style={{ width: "100%", height: "auto" }} />
                                                    ) : null}
                                                </div>
                                            )}
                                        </a>
                                    )}
                                </motion.div>
                            </AnimatePresence>

                            {ads.length > 1 && (position === "top" || position === "middle" || position === "footer") && (
                                <div className={styles.dots}>
                                    {ads.map((_, i) => (
                                        <div
                                            key={i}
                                            className={`${styles.dot} ${i === currentIndex ? styles.dotActive : ''}`}
                                            onClick={() => setCurrentIndex(i)}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default AdBanner;
