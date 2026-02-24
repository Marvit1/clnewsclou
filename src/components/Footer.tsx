"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import Link from "next/link";
import { Mail, Phone, MapPin, ArrowUp, ArrowDown } from "lucide-react";
import SocialIcons from "./SocialIcons";
import styles from "./Footer.module.css";

const Footer = () => {
  const { t, language } = useLanguage();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const scrollToBottom = () => {
    window.scrollTo({ top: document.documentElement.scrollHeight, behavior: "smooth" });
  };

  const categories = [
    { path: `/${language}/news/category/politics`, label: t("nav.politics") },
    { path: `/${language}/news/category/economy`, label: t("nav.economy") },
    { path: `/${language}/news/category/world`, label: t("nav.world") },
    { path: `/${language}/news/category/sports`, label: t("nav.sports") },
    { path: `/${language}/news/category/culture`, label: t("nav.culture") },
  ];

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.grid}>
          {/* About Section */}
          <div>
            <h3 className={styles.sectionTitle}>{t("footer.about")}</h3>
            <p className={styles.aboutText}>{t("footer.aboutText")}</p>
            <div className={styles.infoList}>
              <div className={styles.infoItem}>
                <Mail size={14} className={styles.infoIcon} />
                <span className={styles.infoText}>dpolitics755@gmail.com</span>
              </div>
              <div className={styles.infoItem}>
                <Phone size={14} className={styles.infoIcon} />
                <span className={styles.infoText}>+374 </span>
              </div>
              <div className={styles.infoItem}>
                <MapPin size={14} className={styles.infoIcon} />
                <span className={styles.infoText}>Yerevan, Armenia</span>
              </div>
            </div>
          </div>

          {/* Categories */}
          <div>
            <h3 className={styles.sectionTitle}>{t("footer.categories")}</h3>
            <ul className={styles.linksList}>
              {categories.map((link) => (
                <li key={link.path}>
                  <Link href={link.path} className={styles.link}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social Icons */}
          <div>
            <h3 className={styles.sectionTitle}>{t("footer.followUs")}</h3>
            <SocialIcons size={28} orientation="vertical" showLabels={true} />
          </div>

          {/* Quick Links */}
          <div>
            <h3 className={styles.sectionTitle}>{t("footer.quickLinks")}</h3>
            <ul className={styles.linksList}>
              {[
                { path: `/${language}`, label: t("nav.home") },
                { path: `/${language}/news`, label: t("nav.allNews") },
                { path: `/${language}/videos`, label: t("nav.videos") },
              ].map((link) => (
                <li key={link.path}>
                  <Link href={link.path} className={styles.link}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className={styles.bottomBar}>
          <p className={styles.copyright}>
            © {new Date().getFullYear()} Data Politic. {t("footer.rights")}
          </p>
          <div className={styles.mobileSocialFixed}>
            <SocialIcons size={20} orientation="vertical" />
          </div>
          <div className={styles.bottomActions}>
            <button
              onClick={scrollToTop}
              className={styles.actionButton}
              aria-label={t("footer.backToTop")}
            >
              <ArrowUp size={18} />
            </button>
            <button
              onClick={scrollToBottom}
              className={styles.actionButton}
              aria-label="Scroll to bottom"
            >
              <ArrowDown size={18} />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
