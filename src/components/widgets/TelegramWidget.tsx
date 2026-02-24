"use client";

import { useEffect, useState } from "react";
import styles from "./TelegramWidget.module.css";
import { fetchTelegramPosts, TelegramPost } from "@/lib/api";
import TelegramEmbed from "../TelegramEmbed";

const TelegramWidget = () => {
  const [posts, setPosts] = useState<TelegramPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPosts = async () => {
      try {
        const data = await fetchTelegramPosts(5);
        setPosts(data);
      } catch (error) {
        console.error("Failed to load telegram posts", error);
      } finally {
        setLoading(false);
      }
    };
    loadPosts();
  }, []);

  if (loading) {
    return (
      <div className={styles.container} style={{ height: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#2AABEE]"></div>
      </div>
    );
  }

  if (posts.length === 0) return null;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.161c-.18 1.897-.962 6.502-1.361 8.627-.168.9-.5 1.201-.82 1.23-.697.064-1.226-.461-1.901-.903-1.056-.692-1.653-1.123-2.678-1.799-1.185-.781-.417-1.21.258-1.911.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.139-5.062 3.345-.479.329-.913.489-1.302.481-.428-.008-1.252-.241-1.865-.44-.751-.244-1.349-.374-1.297-.789.027-.216.324-.437.893-.663 3.498-1.524 5.831-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.477-1.635.099-.002.321.023.465.141.119.098.152.228.166.319.016.104.018.21.006.315z"/>
        </svg>
        Telegram News
      </div>
      <div className={styles.scrollArea}>
        {posts.map((post) => (
          <div key={post.id} className={styles.post}>
            <TelegramEmbed 
                channel={post.channel} 
                messageId={post.message_id}
                width="100%"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default TelegramWidget;
