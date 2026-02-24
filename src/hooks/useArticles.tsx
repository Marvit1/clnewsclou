import { useQuery } from "@tanstack/react-query";
import { fetchArticles, fetchFeaturedArticles, fetchArticleBySlug, fetchArticlesByCategory } from "@/lib/api";

export const useArticles = () => {
    return useQuery({
        queryKey: ["articles"],
        queryFn: fetchArticles,
    });
};

export const useArticlesByCategory = (categorySlug: string) => {
    return useQuery({
        queryKey: ["articles", categorySlug],
        queryFn: () => fetchArticlesByCategory(categorySlug),
        enabled: !!categorySlug,
    });
};

export const useFeaturedArticles = () => {
    return useQuery({
        queryKey: ["featuredArticles"],
        queryFn: fetchFeaturedArticles,
    });
};

export const useArticle = (slug: string) => {
    return useQuery({
        queryKey: ["article", slug],
        queryFn: () => fetchArticleBySlug(slug),
        enabled: !!slug,
    });
};
