"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { useParams, usePathname, useRouter } from "next/navigation";

export type Language = "en" | "hy" | "ru";

type Translations = Record<string, Record<Language, string>>;

const translations: Translations = {
  "nav.home": { en: "Home", hy: "Գլխավոր", ru: "Главная" },
  "nav.allNews": { en: "All News", hy: "Բոլոր նորությունները", ru: "Все новости" },
  "nav.videos": { en: "Videos", hy: "Տեսանյութեր", ru: "Видео" },
  "nav.politics": { en: "Politics", hy: "Քաղաքականություն", ru: "Политика" },
  "nav.economy": { en: "Economy", hy: "Տնտեսություն", ru: "Экономика" },
  "nav.world": { en: "World", hy: "Աշխարհ", ru: "Мир" },
  "nav.sports": { en: "Sports", hy: "Սպորտ", ru: "Спорт" },
  "nav.culture": { en: "Culture", hy: "Մշակույթ", ru: "Культура" },
  "nav.law": { en: "Law", hy: "Իրավունք", ru: "Право" },
  "hero.breaking": { en: "Breaking News", hy: "Հրատապ", ru: "Срочные новости" },
  "category.sports": { en: "Sports", hy: "Սպորտ", ru: "Спорт" },
  "category.economy": { en: "Economy", hy: "Տնտեսություն", ru: "Экономика" },
  "category.culture": { en: "Culture", hy: "Մշակույթ", ru: "Культура" },
  "category.politics": { en: "Politics", hy: "Քաղաքականություն", ru: "Политика" },
  "category.world": { en: "World", hy: "Աշխարհ", ru: "Мир" },
  "category.law": { en: "Law", hy: "Իրավունք", ru: "Право" },
  "hero.readMore": { en: "Read More", hy: "Կարդալ ավելին", ru: "Читать далее" },
  "news.title": { en: "All News", hy: "Ընդհանուր", ru: "Все новости" },
  "news.allTags": { en: "All", hy: "Բոլոր", ru: "Все" },
  "news.video": { en: "Video", hy: "Տեսանյութ", ru: "Видео" },
  "news.image": { en: "Photo", hy: "Նկար", ru: "Фото" },
  "news.previous": { en: "Previous", hy: "Հետ", ru: "Назад" },
  "news.next": { en: "Next", hy: "Առաջ", ru: "Далее" },
  "news.page": { en: "Page", hy: "Էջ", ru: "Стр." },
  "footer.contact": { en: "Contact Us", hy: "Կապ Մեզ Հետ", ru: "Связаться" },
  "footer.name": { en: "Your Name", hy: "Ձեր Անունը", ru: "Ваше имя" },
  "footer.email": { en: "Your Email", hy: "Ձեր փոստը", ru: "Ваш email" },
  "footer.message": { en: "Message", hy: "Նամակ", ru: "Сообщение" },

  "footer.send": { en: "Send Message", hy: "Ուղարկել Հաղորդագրությունը", ru: "Отправить" },
  "footer.location": { en: "Our Location", hy: "Մեր Հասցեն", ru: "Наш адрес" },
  "footer.rights": { en: "All rights reserved.", hy: "Բոլոր Իրավունքները Պաշտպանված են", ru: "Все права защищены." },
  "footer.quickLinks": { en: "Quick Links", hy: "Հղումներ", ru: "Ссылки" },
  "theme.light": { en: "Light", hy: "Առաջին կարգ", ru: "Светлая" },
  "theme.dark": { en: "Dark", hy: "Առաջին կարգ", ru: "Тёмная" },
  "site.name": { en: "DataPolitic", hy: "DataPolitic", ru: "DataPolitic" },
  "latest.news": { en: "Latest News", hy: "Վերջին Նորությունները", ru: "Последние новости" },
  "footer.about": { en: "About Us", hy: "Մեր Մասին", ru: "О нас" },
  "footer.aboutText": {
    en: "Data Politic provides the latest news and analysis from around the world. We are committed to accurate and timely reporting.",
    hy: "Data Politic-ը տրամադրում է վերջին նորություններն ու վերլուծությունները ամբողջ աշխարհից: Մենք հանձնառու ենք ճշգրիտ և ժամանակին տեղեկատվության տրամադրմանը:",
    ru: "Data Politic предоставляет последние новости и аналитику со всего мира. Мы стремимся к точной и своевременной отчетности."
  },
  "footer.categories": { en: "Categories", hy: "Բաժիններ", ru: "Категории" },
  "footer.backToTop": { en: "Back to Top", hy: "Վերև", ru: "Наверх" },
  "footer.followUs": { en: "Follow Us", hy: "Հետևեք Մեզ", ru: "Подписаться" },
  "news.share": { en: "Share this post", hy: "Կիսվել նյութով", ru: "Поделиться" },
  "news.related": { en: "Related Stories", hy: "Նմանատիպ նյութեր", ru: "Похожие новости" },
  "news.noRelated": { en: "No related stories available yet.", hy: "Նմանատիպ նյութեր դեռ չկան:", ru: "Похожих новостей пока нет." },
  "news.readingTime": { en: "DataPolitic", hy: "DataPolitic", ru: "DataPolitic" },
  "news.readMore": { en: "Read More", hy: "Կարդալ ավելին", ru: "Читать далее" },
  "news.comingSoon": { en: "Full article content is coming soon. Stay tuned for more updates on this story.", hy: "Ամբողջական նյութը շուտով հասանելի կլինի: Մնացեք մեզ հետ նորությունների համար:", ru: "Полный текст статьи скоро будет доступен. Следите за обновлениями." },
  "home.moreStories": { en: "More Stories", hy: "Այլ նորություններ", ru: "Другие новости" },
  "home.videoNews": { en: "Video News", hy: "Տեսանյութեր", ru: "Видео новости" },
  "home.uploadedVideos": { en: "Videos", hy: "Տեսահոլովակներ", ru: "Видео" },
  "video.watchAlso": { en: "You can also watch", hy: "Կարող եք նաև դիտել", ru: "Вы также можете посмотреть" },
  "nav.back": { en: "Back", hy: "Հետ", ru: "Назад" },
  "video.notFound": { en: "Video not found", hy: "Տեսանյութը չի գտնվել", ru: "Видео не найдено" },
  "video.movedOrDeleted": { en: "The video you are looking for might have been moved or deleted.", hy: "Տեսանյութը, որը փնտրում եք, հնարավոր է տեղափոխվել կամ ջնջվել է։", ru: "Видео, которое вы ищете, возможно, было перемещено или удалено." },
  "video.watchOnYouTube": { en: "Watch on YouTube", hy: "Դիտել YouTube-ում", ru: "Смотреть на YouTube" },
  "video.allVideos": { en: "All Videos", hy: "Բոլոր տեսանյութերը", ru: "Все видео" },
  "video.loading": { en: "Loading videos...", hy: "Տեսանյութերը բեռնվում են...", ru: "Загрузка видео..." },
  "video.none": { en: "No videos found.", hy: "Տեսանյութեր չեն գտնվել:", ru: "Видео не найдены." },
  "search.placeholder": { en: "Search news, tags...", hy: "Որոնել նորություններ...", ru: "Поиск новостей..." },
  "search.noResults": { en: "No results found for", hy: "Արդյունքներ չեն գտնվել", ru: "Результатов չկա" },
  "search.try": { en: "Try searching for:", hy: "Փորձեք որոնել՝", ru: "Попробуйте поискать:" },
  "search.loading": { en: "Searching...", hy: "Որոնում...", ru: "Поиск..." },
  "search.loadMore": { en: "Load More", hy: "Բեռնել ավելին", ru: "Загрузить ещё" },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, fallback?: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const params = useParams();
  const pathname = usePathname();
  const router = useRouter();

  // Initialize from params if available, otherwise default to hy
  const initialLang = (params?.lang as Language) || "hy";
  const [language, setLanguageState] = useState<Language>(initialLang);

  // Sync state with params when they change
  useEffect(() => {
    if (params?.lang && (params.lang === 'en' || params.lang === 'hy' || params.lang === 'ru')) {
      if (language !== params.lang) {
        setLanguageState(params.lang as Language);
      }
    }
  }, [params?.lang]); // Removed 'language' from dependency array to prevent potential cycles

  const setLanguage = (lang: Language) => {
    if (!pathname) return;

    const segments = pathname.split('/');
    // segments[0] is empty, segments[1] is the locale (e.g., 'en', 'hy')
    // Check if the first segment is a valid locale
    if (segments.length > 1 && ['en', 'hy', 'ru'].includes(segments[1])) {
      segments[1] = lang;
    } else {
      // If no locale in URL (shouldn't happen with middleware), prepend it
      segments.splice(1, 0, lang);
    }
    const newPath = segments.join('/');
    router.push(newPath);
  };

  const t = (key: string, fallback?: string): string => {
    return translations[key]?.[language] || fallback || key;
  };

  const value = React.useMemo(() => ({
    language,
    setLanguage,
    t
  }), [language, setLanguage, t]);

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error("useLanguage must be used within LanguageProvider");
  return context;
};
