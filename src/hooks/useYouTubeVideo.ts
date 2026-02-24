import { useQuery } from "@tanstack/react-query";
import { fetchYouTubeVideoById } from "@/lib/api";

export const useYouTubeVideo = (youtubeId: string | null) => {
  return useQuery({
    queryKey: ["youtube-video", youtubeId],
    queryFn: () => fetchYouTubeVideoById(youtubeId as string),
    enabled: typeof youtubeId === "string" && youtubeId.trim().length > 0,
  });
};
