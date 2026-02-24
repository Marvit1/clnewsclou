import { useQuery } from "@tanstack/react-query";
import { fetchUploadedVideoById, fetchUploadedVideos } from "@/lib/api";

export const useUploadedVideos = (limit = 4) => {
  return useQuery({
    queryKey: ["uploadedVideos", limit],
    queryFn: () => fetchUploadedVideos(limit),
  });
};

export const useUploadedVideo = (id: number | null) => {
  return useQuery({
    queryKey: ["uploadedVideo", id],
    queryFn: () => fetchUploadedVideoById(id as number),
    enabled: typeof id === "number" && Number.isFinite(id),
  });
};
