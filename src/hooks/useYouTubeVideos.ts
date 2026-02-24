import { useQuery } from "@tanstack/react-query";
import { fetchYouTubeVideos, fetchFeaturedYouTubeVideos, fetchYouTubeVideosPage } from "@/lib/api";

export const useYouTubeVideos = () => {
    return useQuery({
        queryKey: ["youtube-videos"],
        queryFn: fetchYouTubeVideos,
    });
};

export const useYouTubeVideosPage = (page: number, pageSize = 8) => {
    const safePage = Math.max(1, page);
    const offset = (safePage - 1) * pageSize;
    return useQuery({
        queryKey: ["youtube-videos", "page", safePage, pageSize],
        queryFn: () => fetchYouTubeVideosPage(pageSize, offset),
    });
};

export const useFeaturedYouTubeVideos = () => {
    return useQuery({
        queryKey: ["featured-youtube-videos"],
        queryFn: fetchFeaturedYouTubeVideos,
    });
};
