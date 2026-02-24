"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLanguage, Language } from "@/contexts/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";
import { Sun, Moon, Globe, Menu, X } from "lucide-react";
import SocialIcons from "./SocialIcons";
import SearchBar from "./SearchBar";
import { useState } from "react";
import { motion } from "framer-motion";
import styles from "./Header.module.css";

const langLabels: Record<Language, string> = { en: "EN", hy: "ՀՅ", ru: "РУ" };

const Header = () => {
  const { language, setLanguage, t } = useLanguage();
  const { isDark, toggleTheme } = useTheme();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  const navItems = [
    { path: `/${language}`, label: t("nav.home") },
    { path: `/${language}/news`, label: t("nav.allNews") },
    { path: `/${language}/news/category/sports`, label: t("nav.sports") },
    { path: `/${language}/news/category/economy`, label: t("nav.economy") },
    { path: `/${language}/news/category/culture`, label: t("nav.culture") },
    { path: `/${language}/news/category/politics`, label: t("nav.politics") },
    { path: `/${language}/news/category/world`, label: t("nav.world") },
    { path: `/${language}/news/category/law`, label: t("nav.law") },
    { path: `/${language}/videos`, label: t("nav.videos") },
  ];

  return (
    <header className={styles.header}>
      {/* Top Row */}
      <div className={styles.topRow}>
        <div className={styles.container}>
          {/* Left: Logo */}
          <div className={styles.headerLeft}>
            <Link href={`/${language}`} className={styles.logo}>
              <img
                src={isDark ? "/logospitak.svg" : "/logosev.svg"}
                alt="DataPolitics"
                width={160}
                height={48}
                className={`${styles.logoImage} ${isDark ? styles.logoDark : styles.logoLight}`}
              />
            </Link>
          </div>

          {/* Middle: Social Icons */}
          <div className={styles.desktopSocial}>
            <SocialIcons size={28} />
          </div>

          {/* Right: Actions */}
          <div className={styles.topActions}>
            <SearchBar />

            {/* Language Switcher */}
            <div className={styles.languageSwitcher}>
              {(["en", "hy", "ru"] as Language[]).map((lang) => (
                <button
                  key={lang}
                  onClick={() => setLanguage(lang)}
                  className={`${styles.langButton} ${language === lang ? styles.langButtonActive : styles.langButtonInactive
                    }`}
                >
                  {langLabels[lang]}
                </button>
              ))}
            </div>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className={styles.themeToggle}
              aria-label="Toggle theme"
            >
              {isDark ? <Sun size={16} /> : <Moon size={16} />}
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className={styles.mobileMenuToggle}
            >
              {menuOpen ? <X size={16} /> : <Menu size={16} />}
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Row - Desktop Only */}
      <div className={styles.bottomRow}>
        <div className={styles.container}>
          <nav className={styles.desktopNav}>
            {navItems.map((item) => {
              const isActive = pathname === item.path;
              return (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`${styles.navLink} ${isActive ? styles.navLinkActive : styles.navLinkInactive}`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="nav-pill"
                      className={styles.navPill}
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  <span className={styles.navLabel}>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Mobile Nav */}
      {menuOpen && (
        <nav className={styles.mobileNav}>
          {navItems.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              onClick={() => setMenuOpen(false)}
              className={`${styles.mobileNavLink} ${pathname === item.path ? styles.mobileNavLinkActive : ""}`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
};

export default Header;