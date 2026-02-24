"use client";

import { useEffect, useRef } from "react";

interface TelegramEmbedProps {
  channel: string;
  messageId: string;
  width?: string;
  theme?: "light" | "dark";
}

const TelegramEmbed = ({ 
  channel, 
  messageId, 
  width = "100%", 
  theme = "light" 
}: TelegramEmbedProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    
    // Clear previous content
    containerRef.current.innerHTML = "";

    const script = document.createElement("script");
    script.src = "https://telegram.org/js/telegram-widget.js?22";
    script.setAttribute("data-telegram-post", `${channel}/${messageId}`);
    script.setAttribute("data-width", width);
    script.setAttribute("data-userpic", "true");
    script.setAttribute("data-color", "2AABEE");
    
    if (theme === "dark") {
      script.setAttribute("data-dark", "1");
    }

    script.async = true;
    containerRef.current.appendChild(script);

    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = "";
      }
    };
  }, [channel, messageId, width, theme]);

  return <div ref={containerRef} style={{ minHeight: "100px" }} />;
};

export default TelegramEmbed;
