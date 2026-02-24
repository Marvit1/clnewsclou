"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import { X } from "lucide-react";
import { AdData, fetchAdByPosition, clickAd } from "@/lib/api";

const SESSION_KEY = "popup_ad_closed_v1";

export default function PopupAd() {
  const [ad, setAd] = useState<AdData | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [showClose, setShowClose] = useState(false);
  const [countdown, setCountdown] = useState(6);

  const canShow = useMemo(() => {
    try {
      return !window.sessionStorage.getItem(SESSION_KEY);
    } catch {
      return true;
    }
  }, []);

  useEffect(() => {
    if (!canShow) return;

    let mounted = true;
    fetchAdByPosition("popup")
      .then((data) => {
        if (!mounted) return;
        if (data) {
          setAd(data);
          setIsVisible(true);
        }
      })
      .catch(() => {
        // ignore
      });

    return () => {
      mounted = false;
    };
  }, [canShow]);

  const close = useCallback(() => {
    try {
      window.sessionStorage.setItem(SESSION_KEY, "1");
    } catch {
      // ignore
    }
    setIsVisible(false);
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    const showCloseTimer = window.setTimeout(() => setShowClose(true), 2000);

    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          close();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      window.clearTimeout(showCloseTimer);
      clearInterval(interval);
    };
  }, [isVisible, close]);

  const handleAdClick = useCallback(() => {
    if (ad) clickAd(ad.id).catch(() => { });
  }, [ad]);

  if (!isVisible || !ad) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 60,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "rgba(0,0,0,0.75)",
        backdropFilter: "blur(6px)",
        padding: 20,
      }}
      aria-modal="true"
      role="dialog"
      aria-label="Popup advertisement"
    >
      {/* Countdown Timer Outside */}
      <div style={{
        marginBottom: 20,
        width: 50,
        height: 50,
        borderRadius: "50%",
        border: "3px solid #e11d48",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "white",
        boxShadow: "0 0 20px rgba(225, 29, 72, 0.4)",
        animation: "pulse 1.5s infinite"
      }}>
        <span style={{ fontSize: 20, fontWeight: "bold", color: "#e11d48" }}>{countdown}</span>
      </div>

      <div
        style={{
          position: "relative",
          width: "min(800px, 100%)",
          background: "transparent",
          borderRadius: 16,
          overflow: "hidden",
          boxShadow: "0 40px 100px rgba(0,0,0,0.6)",
        }}
      >
        {showClose && (
          <button
            onClick={close}
            aria-label="Close"
            style={{
              position: "absolute",
              top: 15,
              right: 15,
              zIndex: 10,
              height: 40,
              width: 40,
              borderRadius: 12,
              border: "none",
              background: "rgba(0,0,0,0.5)",
              color: "white",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              transition: "all 0.2s",
              backdropFilter: "blur(4px)"
            }}
          >
            <X size={22} />
          </button>
        )}

        <a href={ad.link_url} target="_blank" rel="noopener noreferrer" onClick={handleAdClick} style={{ display: "block" }}>
          {ad.media_type === "image" && ad.image_url ? (
            <img
              src={ad.image_url}
              alt={ad.label}
              style={{ width: "100%", height: "auto", display: "block", borderRadius: 16 }}
            />
          ) : (
            <div style={{ width: "100%", aspectRatio: "16 / 9", background: "black", borderRadius: 16 }}>
              {ad.video_url ? (
                <iframe
                  src={
                    ad.video_url.includes("youtube.com") || ad.video_url.includes("youtu.be")
                      ? `https://www.youtube.com/embed/${ad.video_url.match(/(?:v=|\/)([0-9A-Za-z_-]{11})/)?.[1] || ""}?rel=0&autoplay=1`
                      : ad.video_url
                  }
                  title="Ad video"
                  style={{ width: "100%", height: "100%", border: "none" }}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : ad.video_file_url ? (
                <video src={ad.video_file_url} autoPlay controls style={{ width: "100%", height: "100%" }} />
              ) : null}
            </div>
          )}
        </a>
      </div>

      <style jsx>{`
        @keyframes pulse {
          0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(225, 29, 72, 0.4); }
          70% { transform: scale(1.05); box-shadow: 0 0 0 10px rgba(225, 29, 72, 0); }
          100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(225, 29, 72, 0); }
        }
      `}</style>
    </div>
  );
}
