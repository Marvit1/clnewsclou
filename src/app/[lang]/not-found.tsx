"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import styles from "./NotFound.module.css";
import { useLanguage } from "@/contexts/LanguageContext";

const NotFound = () => {
    const pathname = usePathname();
    const { language, t } = useLanguage();

    useEffect(() => {
        console.error("404 Error: User attempted to access non-existent route:", pathname);
    }, [pathname]);

    return (
        <div className={styles.container}>
            <div className={styles.content}>
                <h1 className={styles.heading}>404</h1>
                <p className={styles.message}>{t("common.pageNotFound") || "Oops! Page not found"}</p>
                <Link
                    href={`/${language}`}
                    className={styles.link}
                >
                    {t("nav.home") || "Return to Home"}
                </Link>
            </div>
        </div>
    );
};

export default NotFound;