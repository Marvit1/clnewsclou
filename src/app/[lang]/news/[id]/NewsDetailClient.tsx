"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { NewsItem } from "@/data/newsData";
import { useLanguage } from "@/contexts/LanguageContext";
import { ChevronLeft, ChevronRight, Share2, Bookmark, ArrowRight, Play, Facebook, Send, X } from "lucide-react";
import Link from "next/link";
import Aside from "@/components/Aside";
import AdBanner from "@/components/AdBanner";
import SocialIcons from "@/components/SocialIcons";
import styles from "./NewsDetail.module.css";
import { motion } from "framer-motion";

const TelegramEmbed = ({ codeOrLink }: { codeOrLink: string }) => {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!containerRef.current) return;
        containerRef.current.innerHTML = "";

        // Detect if it's a link (e.g. https://t.me/corrupt_am/17498)
        let postPath = "";
        const linkMatch = codeOrLink.match(/t\.me\/([a-zA-Z0-9_]+\/\d+)/);
        if (linkMatch) {
            postPath = linkMatch[1];
        }

        if (postPath) {
            const script = document.createElement("script");
            script.src = "https://telegram.org/js/telegram-widget.js?22";
            script.async = true;
            script.setAttribute("data-telegram-post", postPath);
            script.setAttribute("data-width", "100%");
            containerRef.current.appendChild(script);
        } else {
            // If it's HTML/Script code, inject it and re-run scripts
            containerRef.current.innerHTML = codeOrLink;
            const scripts = containerRef.current.getElementsByTagName("script");
            for (let i = 0; i < scripts.length; i++) {
                const s = document.createElement("script");
                Array.from(scripts[i].attributes).forEach(attr => s.setAttribute(attr.name, attr.value));
                s.innerHTML = scripts[i].innerHTML;
                scripts[i].parentNode?.replaceChild(s, scripts[i]);
            }
        }
    }, [codeOrLink]);

    return <div ref={containerRef} className={styles.telegramContent} />;
};

const FacebookEmbed = ({ codeOrLink }: { codeOrLink: string }) => {
    if (codeOrLink.startsWith("http") && !codeOrLink.includes("<iframe")) {
        const encodedUrl = encodeURIComponent(codeOrLink);
        return (
            <iframe
                src={`https://www.facebook.com/plugins/post.php?href=${encodedUrl}&show_text=true&width=auto`}
                width="100%"
                height="500"
                style={{ border: 'none', overflow: 'hidden', minHeight: '500px' }}
                scrolling="no"
                frameBorder="0"
                allowFullScreen={true}
                allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
            />
        );
    }
    return <div dangerouslySetInnerHTML={{ __html: codeOrLink }} />;
};

interface NewsDetailClientProps {
    initialItem: NewsItem;
    lang: string;
}

const NewsDetailClient = ({ initialItem, lang }: NewsDetailClientProps) => {
    const { id: slug } = useParams();
    const router = useRouter();
    const { language, t } = useLanguage();
    // We use initialItem for the first render (SEO/SSR) 
    // but we could still use useArticle for client-side updates if needed
    const item = initialItem;
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isLightboxOpen, setIsLightboxOpen] = useState(false);

    const allImages = item ? [item.imageUrl, item.image2, item.image3, item.image4, item.image5].filter(Boolean) : [];

    const nextImage = (e: React.MouseEvent) => {
        e.stopPropagation();
        setCurrentImageIndex((prev) => (prev + 1) % allImages.length);
    };

    const prevImage = (e: React.MouseEvent) => {
        e.stopPropagation();
        setCurrentImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
    };

    useEffect(() => {
        setCurrentImageIndex(0);
    }, [slug]);

    if (!item) {
        return (
            <div className={styles.container}>
                <div className={styles.notFound}>
                    <h2>Article not found</h2>
                    <p style={{ marginBottom: "20px", color: "hsl(var(--muted-foreground))" }}>
                        The article you are looking for might have been moved or deleted.
                    </p>
                    <button onClick={() => router.back()} className={styles.backButton}>
                        <ChevronLeft size={16} /> Go Back
                    </button>
                </div>
            </div>
        );
    }

    const currentTitle = item.title[language as keyof typeof item.title] || item.title['hy'];
    const currentTag = item.tag[language as keyof typeof item.tag] || item.tag['hy'];
    const currentExcerpt = item.excerpt[language as keyof typeof item.excerpt] || item.excerpt['hy'];
    const currentContent = item.content?.[language as keyof typeof item.content] || item.content?.['hy'];

    return (
        <div className={styles.mainWrapper}>
            <div className={styles.breadcrumbBar}>
                <div className={styles.breadcrumbContainer}>
                    <Link href={`/${language}`} className={styles.breadcrumbLink}>{t("nav.home")}</Link>
                    <ArrowRight size={12} className={styles.breadcrumbSeparator} />
                    <Link href={`/${language}/news`} className={styles.breadcrumbLink}>{t("nav.allNews")}</Link>
                    <ArrowRight size={12} className={styles.breadcrumbSeparator} />
                    <span className={styles.breadcrumbCurrent}>{currentTag}</span>
                </div>
            </div>

            <div className={styles.container} style={{ paddingBottom: 0, paddingTop: '20px' }}>
                <AdBanner position="top" />
            </div>

            <div className={styles.container}>
                <div className={styles.layout}>
                    {/* Main Content */}
                    <motion.article
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className={styles.article}
                    >
                        <header className={styles.header}>
                            <div className={styles.metaTop}>
                                <span className={styles.tagBadge}>{currentTag}</span>
                            </div>

                            <h1 className={styles.title}>{currentTitle}</h1>

                            <div className={styles.metaBottom}>
                                <div className={styles.authorInfo}>
                                    <div className={styles.authorAvatar}>
                                        {item.author.charAt(0)}
                                    </div>
                                    <div className={styles.authorDetails}>
                                        <span className={styles.authorName}>{item.author}</span>
                                        <span className={styles.publishDate}>{item.date}</span>
                                    </div>
                                </div>
                            </div>
                        </header>

                        <div className={styles.featuredImageWrapper} onClick={() => setIsLightboxOpen(true)}>
                            <img
                                src={allImages[currentImageIndex]}
                                alt={currentTitle}
                                className={styles.mainImage}
                            />
                            {allImages.length > 1 && (
                                <>
                                    <button className={`${styles.navButton} ${styles.prevButton}`} onClick={prevImage}>
                                        <ChevronLeft size={24} />
                                    </button>
                                    <button className={`${styles.navButton} ${styles.nextButton}`} onClick={nextImage}>
                                        <ChevronRight size={24} />
                                    </button>
                                    <div className={styles.imageCounter}>
                                        {currentImageIndex + 1} / {allImages.length}
                                    </div>
                                </>
                            )}
                            {item.mediaType === "video" && (
                                <div className={styles.videoBadge}>VIDEO</div>
                            )}
                        </div>

                        <div className={styles.body}>
                            <p className={styles.excerpt}>{currentExcerpt}</p>

                            <div className={styles.content}>
                                {currentContent ? (
                                    <div dangerouslySetInnerHTML={{ __html: currentContent }} />
                                ) : (
                                    <p>{t("news.comingSoon")}</p>
                                )}
                            </div>

                            {allImages.length > 1 && (
                                <div className={styles.imageGallery}>
                                    {allImages.map((img, i) => (
                                        <div
                                            key={i}
                                            className={`${styles.galleryItem} ${currentImageIndex === i ? styles.activeGalleryItem : ""}`}
                                            onClick={() => setCurrentImageIndex(i)}
                                        >
                                            <img src={img} alt={`${currentTitle} gallery ${i + 1}`} />
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Embeds Section */}
                            <div className={styles.embedsSection}>
                                {item.facebookEmbed && (
                                    <div className={styles.embedWrapper}>
                                        <div className={styles.embedHeader}>
                                            <Facebook size={18} className={styles.embedIcon} />
                                            <span>Facebook</span>
                                        </div>
                                        <FacebookEmbed codeOrLink={item.facebookEmbed} />
                                    </div>
                                )}

                                {item.telegramEmbed && (
                                    <div className={styles.embedWrapper}>
                                        <div className={styles.embedHeader}>
                                            <Send size={18} className={styles.embedIcon} />
                                            <span>Telegram</span>
                                        </div>
                                        <TelegramEmbed codeOrLink={item.telegramEmbed} />
                                    </div>
                                )}

                                {item.videoUrl && (
                                    <div className={styles.embedWrapper}>
                                        <div className={styles.embedHeader}>
                                            <Play size={18} className={styles.embedIcon} />
                                            <span>Video</span>
                                        </div>
                                        <iframe
                                            src={`https://www.youtube.com/embed/${item.videoUrl.match(/(?:v=|\/)([0-9A-Za-z_-]{11})/)?.[1] || item.videoUrl}?rel=0`}
                                            title="YouTube video player"
                                            className={styles.youtubeIframe}
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                            allowFullScreen
                                        />
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className={styles.adSection}>
                            <AdBanner position="middle" variant="compact" />
                        </div>

                        {/* Social Share Below Content */}
                        <div className={styles.shareSection}>
                            <h3 className={styles.shareTitle}>{t("news.share")}</h3>
                            <SocialIcons size={24} />
                        </div>

                        {/* Related News in Footer of Article */}
                        <div className={styles.relatedSection}>
                            <h3 className={styles.relatedTitle}>{t("news.related")}</h3>
                            <div className={styles.relatedGrid}>
                                {item.relatedArticles && item.relatedArticles.length > 0 ? (
                                    item.relatedArticles.map((n) => (
                                        <Link href={`/${language}/news/${n.slug || n.id}`} key={n.id} className={styles.relatedCard}>
                                            <div className={styles.relatedImageContainer}>
                                                <img src={n.imageUrl} alt={n.title[language as keyof typeof n.title] || n.title['hy']} />
                                            </div>
                                            <div className={styles.relatedContent}>
                                                <h4>{n.title[language as keyof typeof n.title] || n.title['hy']}</h4>
                                                <span>{n.date}</span>
                                            </div>
                                        </Link>
                                    ))
                                ) : (
                                    <p>{t("news.noRelated")}</p>
                                )}
                            </div>
                        </div>
                    </motion.article>

                    {/* Sidebar */}
                    <aside className={styles.sidebar}>
                        <Aside />
                    </aside>
                </div>
            </div>

            {/* Lightbox */}
            {isLightboxOpen && (
                <div className={styles.lightboxOverlay} onClick={() => setIsLightboxOpen(false)}>
                    <button className={styles.lightboxClose} onClick={() => setIsLightboxOpen(false)}>
                        <X size={32} />
                    </button>

                    {allImages.length > 1 && (
                        <>
                            <button className={`${styles.lightboxNav} ${styles.lightboxPrev}`} onClick={prevImage}>
                                <ChevronLeft size={40} />
                            </button>
                            <button className={`${styles.lightboxNav} ${styles.lightboxNext}`} onClick={nextImage}>
                                <ChevronRight size={40} />
                            </button>
                        </>
                    )}

                    <div className={styles.lightboxContent} onClick={(e) => e.stopPropagation()}>
                        <img src={allImages[currentImageIndex]} alt={currentTitle} />
                    </div>
                </div>
            )}
        </div>
    );
};

export default NewsDetailClient;
