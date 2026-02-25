const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://api.datapols.com/api";

export interface Category {
    id: number;
    name: Record<string, string>;
    description: Record<string, string>;
    slug: string;
}

export interface NewsArticleResponse {
    id: number;
    title: Record<string, string>;
    excerpt: Record<string, string>;
    content?: Record<string, string>;
    author: string;
    category: Category;
    image_url: string;
    image2?: string;
    image3?: string;
    image4?: string;
    image5?: string;
    media_type: "image" | "video";
    video_url?: string;
    telegram_embed?: string;
    facebook_embed?: string;
    is_breaking: boolean;
    is_featured: boolean;
    is_hero: boolean;
    is_trending: boolean;
    published_at: string;
    views: number;
    slug: string;
    related_articles?: NewsArticleResponse[];
}

import { NewsItem } from "@/data/newsData";

const normalizeLangRecord = (value: Record<string, unknown> | undefined | null): Record<string, string> => {
    const v = value || {};
    return {
        hy: typeof v.hy === "string" ? v.hy : "",
        en: typeof v.en === "string" ? v.en : "",
        ru: typeof v.ru === "string" ? v.ru : "",
    };
};

export const mapToNewsItem = (article: NewsArticleResponse): NewsItem => ({
    id: article.id,
    title: normalizeLangRecord(article.title),
    excerpt: normalizeLangRecord(article.excerpt),
    content: normalizeLangRecord(article.content),
    category: article.category?.slug || "uncategorized",
    tag: article.category ? normalizeLangRecord(article.category.name) : {
        hy: "Լուրեր",
        en: "News",
        ru: "Новости"
    },
    mediaType: article.media_type,
    imageUrl: article.image_url ? (article.image_url.startsWith('http') ? article.image_url : `${API_BASE_URL.replace('/api', '')}${article.image_url}`) : "/placeholder.svg",
    image2: article.image2,
    image3: article.image3,
    image4: article.image4,
    image5: article.image5,
    videoUrl: article.video_url,
    telegramEmbed: article.telegram_embed,
    facebookEmbed: article.facebook_embed,
    publishedAt: article.published_at,
    date: article.published_at
        ? new Date(article.published_at).toLocaleString([], {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        })
        : new Date().toLocaleString([], {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        }),
    author: article.author,
    isBreaking: article.is_breaking,
    isHero: article.is_hero,
    slug: article.slug,
    relatedArticles: article.related_articles ? article.related_articles.map(mapToNewsItem) : [],
});

export const fetchArticles = async () => {
    const response = await fetch(`${API_BASE_URL}/articles/`);
    if (!response.ok) throw new Error("Failed to fetch articles");
    const data = await response.json();
    return data.map(mapToNewsItem);
};

export const fetchFeaturedArticles = async () => {
    const response = await fetch(`${API_BASE_URL}/articles/featured/`);
    if (!response.ok) throw new Error("Failed to fetch featured articles");
    const data = await response.json();
    return data.map(mapToNewsItem);
};

export const fetchArticleBySlug = async (slug: string) => {
    // 1. Try generic endpoint
    let response = await fetch(`${API_BASE_URL}/articles/${encodeURIComponent(slug)}/`);

    // 2. If not found, try explicit category endpoints (common in this API structure)
    if (!response.ok) {
        const explicitCategories = ['economy', 'sports', 'culture', 'politics', 'world', 'law'];
        for (const cat of explicitCategories) {
            // Try both: /articles/[cat]/[slug]/ and /articles/category/[cat]/[slug]/
            const paths = [
                `${API_BASE_URL}/articles/${cat}/${encodeURIComponent(slug)}/`,
                `${API_BASE_URL}/articles/category/${cat}/${encodeURIComponent(slug)}/`
            ];

            for (const path of paths) {
                const catResponse = await fetch(path);
                if (catResponse.ok) {
                    response = catResponse;
                    break;
                }
            }
            if (response.ok) break;
        }
    }

    if (!response.ok) throw new Error("Failed to fetch article");
    const data = await response.json();
    return mapToNewsItem(data);
};

export const fetchArticlesByTag = async (tag: string) => {
    const response = await fetch(`${API_BASE_URL}/articles/?tag=${tag}`);
    if (!response.ok) throw new Error(`Failed to fetch articles for tag: ${tag}`);
    const data = await response.json();
    return data.results.map(mapToNewsItem);
};

export const fetchSearchArticles = async (query: string, language: string, limit = 10, offset = 0) => {
    if (query.length < 2) return { results: [], count: 0 };
    const response = await fetch(`${API_BASE_URL}/articles/search/?q=${encodeURIComponent(query)}&language=${language}&limit=${limit}&offset=${offset}`);
    if (!response.ok) throw new Error("Failed to search articles");
    const data = await response.json();

    // Handle both old array response and new paginated response
    const rawResults = Array.isArray(data) ? data : (data.results || []);
    const count = Array.isArray(data) ? rawResults.length : (data.count || rawResults.length);

    return {
        results: rawResults.map(mapToNewsItem),
        count
    };
};

export const fetchArticlesByCategory = async (categorySlug: string) => {
    // Check if category is one of the explicit routes
    const explicitCategories = ['economy', 'sports', 'culture', 'politics', 'world', 'law'];
    let url = `${API_BASE_URL}/articles/category/${categorySlug}/`;

    if (explicitCategories.includes(categorySlug.toLowerCase())) {
        url = `${API_BASE_URL}/articles/${categorySlug.toLowerCase()}/`;
    }

    const response = await fetch(url);
    if (!response.ok) throw new Error(`Failed to fetch articles for category: ${categorySlug}`);
    const data = await response.json();

    if (Array.isArray(data)) {
        return data.map(mapToNewsItem);
    } else if (data.results && Array.isArray(data.results)) {
        return data.results.map(mapToNewsItem);
    }

    return [];
};

export const fetchCategories = async () => {
    const response = await fetch(`${API_BASE_URL}/categories/`);
    if (!response.ok) throw new Error("Failed to fetch categories");
    return response.json();
};

export interface YouTubeVideo {
    id: string;
    title: Record<string, string>;
    channel: string;
    views: string;
    thumbnail: string;
    created_at: string;
}

export interface PaginatedYouTubeVideos {
    count: number;
    results: YouTubeVideo[];
}

export interface YouTubeVideoDetail extends YouTubeVideo {
    url: string;
    created_at: string;
}

export const fetchYouTubeVideos = async (): Promise<YouTubeVideo[]> => {
    const response = await fetch(`${API_BASE_URL}/youtube/`);
    if (!response.ok) throw new Error("Failed to fetch YouTube videos");
    return response.json();
};

export const fetchYouTubeVideosPage = async (limit = 8, offset = 0): Promise<PaginatedYouTubeVideos> => {
    const response = await fetch(`${API_BASE_URL}/youtube/?limit=${limit}&offset=${offset}`);
    if (!response.ok) throw new Error("Failed to fetch YouTube videos");
    return response.json();
};

export const fetchYouTubeVideoById = async (youtubeId: string): Promise<YouTubeVideoDetail> => {
    const response = await fetch(`${API_BASE_URL}/youtube/${youtubeId}/`);
    if (!response.ok) throw new Error("Failed to fetch YouTube video");
    return response.json();
};

export const fetchFeaturedYouTubeVideos = async (): Promise<YouTubeVideo[]> => {
    const response = await fetch(`${API_BASE_URL}/youtube/featured/`);
    if (!response.ok) throw new Error("Failed to fetch featured YouTube videos");
    return response.json();
};

export type AdPosition = "top" | "middle" | "aside" | "asideadds" | "popup" | "footer";

export interface AdData {
    id: number;
    position: AdPosition;
    label: string;
    media_type: "image" | "video";
    image_url?: string | null;
    video_url?: string | null;
    video_file_url?: string | null;
    link_url: string;
}

export const fetchAdByPosition = async (position: AdPosition): Promise<AdData | AdData[] | null> => {
    const response = await fetch(`${API_BASE_URL}/ads/position/${position}/`);
    if (response.status === 404) return null;
    if (!response.ok) throw new Error("Failed to fetch ad");

    const text = await response.text();
    return text ? JSON.parse(text) : null;
};

export const clickAd = async (id: number): Promise<number> => {
    const response = await fetch(`${API_BASE_URL}/ads/${id}/click/`, { method: "POST" });
    if (!response.ok) throw new Error("Failed to register click");
    const data = await response.json();
    return data.click_count as number;
};

export type SocialPlatform = "facebook" | "telegram";
export interface SocialLink {
    id: number;
    platform: SocialPlatform;
    url: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

export const fetchSocialLink = async (platform: SocialPlatform): Promise<SocialLink | null> => {
    const response = await fetch(`${API_BASE_URL}/social/platform/${platform}/`);
    if (response.status === 404) return null;
    if (!response.ok) throw new Error("Failed to fetch social link");

    const text = await response.text();
    return text ? JSON.parse(text) : null;
};

export interface TelegramPost {
    id: number;
    channel: string;
    message_id: string;
    text: string;
    image_url?: string | null;
    link_url?: string;
    published_at?: string;
    is_main?: boolean;
}

export const fetchTelegramPosts = async (limit = 3): Promise<TelegramPost[]> => {
    const response = await fetch(`${API_BASE_URL}/telegram/posts/?limit=${limit}`);
    if (!response.ok) throw new Error("Failed to fetch telegram posts");
    return response.json();
};

export const fetchMainTelegramPosts = async (limit = 4): Promise<TelegramPost[]> => {
    const response = await fetch(`${API_BASE_URL}/telegram/posts/?limit=${limit}`);
    if (!response.ok) throw new Error("Failed to fetch main telegram posts");
    return response.json();
};


export interface UploadedVideo {
    id: number;
    title: Record<string, string>;
    thumbnail_url?: string | null;
    video_url: string;
    created_at: string;
}

export const fetchUploadedVideos = async (limit = 4): Promise<UploadedVideo[]> => {
    const response = await fetch(`${API_BASE_URL}/uploaded-videos/?limit=${limit}`);
    if (!response.ok) throw new Error("Failed to fetch uploaded videos");
    return response.json();
};

export const fetchUploadedVideoById = async (id: number): Promise<UploadedVideo> => {
    const response = await fetch(`${API_BASE_URL}/uploaded-videos/${id}/`);
    if (!response.ok) throw new Error("Failed to fetch uploaded video");
    return response.json();
};
