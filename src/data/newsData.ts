export interface NewsItem {
  id: number;
  title: Record<string, string>;
  excerpt: Record<string, string>;
  content?: Record<string, string>;
  category: string;
  tag: Record<string, string>;
  mediaType: "image" | "video";
  imageUrl: string;
  date: string;
  author: string;
  isBreaking?: boolean;
  isHero?: boolean;
  slug?: string;
  image2?: string;
  image3?: string;
  image4?: string;
  image5?: string;
  videoUrl?: string;
  telegramEmbed?: string;
  facebookEmbed?: string;
  publishedAt?: string;
  relatedArticles?: NewsItem[];
}

// Client example data has been removed. Data is now fetched from the Django REST API.
export const newsData: NewsItem[] = [];
export const allTags: string[] = [];
export const categories: string[] = [];
