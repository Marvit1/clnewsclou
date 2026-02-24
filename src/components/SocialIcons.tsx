"use client";

import React from "react";
import styles from "./SocialIcons.module.css";

interface Social {
  name: string;
  href: string;
  iconPath: string;
  color: string;
  viewBox?: string;
  overlay?: string;
  overlayColor?: string;
}

const socials: Social[] = [
  {
    name: "Facebook",
    href: "https://www.facebook.com/profile.php?id=61555639689387",
    iconPath:
      "M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z",
    viewBox: "0 0 24 24",
    color: "#1877F2",
  },
  {
    name: "Telegram",
    href: "https://web.telegram.org/a/#-1002122414350",
    iconPath:
      "M22.2646 1.77604C22.0461 1.63751 21.7825 1.58986 21.5306 1.64253L2.2476 5.76056C1.65624 5.88703 1.2588 6.38883 1.29651 6.99326C1.33422 7.59769 1.7963 8.11326 2.39578 8.2325L7.33083 9.24434C7.65999 9.31191 8.0033 9.22736 8.26191 9.01467L17.797 1.34863L10.0279 10.4574C9.84597 10.6708 9.76949 10.9507 9.81896 11.2263L10.8753 17.1353C10.9785 17.7126 11.5372 18.0834 12.1158 17.9591C12.3559 17.9076 12.5735 17.7818 12.7383 17.6014L15.9392 14.0955L19.8661 16.5592C20.3702 16.8753 21.0315 16.7348 21.3653 16.2411C21.4925 16.0528 21.5543 15.8293 21.5427 15.6026L22.6565 2.53676C22.7058 1.96108 22.2646 1.77604 22.2646 1.77604Z",
    viewBox: "0 0 24 24",
    color: "#24A1DE",
  },
  {
    name: "TikTok",
    href: "https://www.tiktok.com/@datapoliticsnews",
    iconPath:
      "M21.3972 10.6078C20.4244 9.97567 19.7225 8.96387 19.5035 7.78513C19.4562 7.53052 19.4299 7.26823 19.4299 7H16.3251L16.3199 19.4018C16.268 20.7908 15.1211 21.9052 13.7151 21.9052C13.2782 21.9052 12.8667 21.7966 12.5044 21.6063C11.6735 21.1707 11.1048 20.3028 11.1048 19.3043C11.1048 17.8699 12.2759 16.7027 13.7148 16.7027C13.9836 16.7027 14.2411 16.7471 14.4847 16.8228V13.6638C14.2324 13.6292 13.9762 13.6083 13.7148 13.6083C10.5637 13.6083 8 16.1631 8 19.3043C8 21.2312 8.96578 22.9366 10.44 23.9676C11.368 24.6176 12.4974 25 13.7151 25C16.8665 25 19.4299 22.4448 19.4299 19.3043V13.0153C20.6477 13.8863 22.1398 14.3997 23.75 14.3997V11.3049C22.8827 11.3049 22.075 11.0482 21.3972 10.6078Z",
    viewBox: "5 5 22 22",
    color: "#000000",
  },
  {
    name: "YouTube",
    href: "https://youtube.com",
    iconPath:
      "M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814z",
    viewBox: "0 0 24 24",
    overlay: "9.75,15.02 15.5,12 9.75,8.98",
    color: "#FF0000",
    overlayColor: "#FFFFFF",
  },
];

interface SocialIconsProps {
  size?: number;
  className?: string;
  orientation?: "horizontal" | "vertical";
  showLabels?: boolean;
}

const SocialIcons: React.FC<SocialIconsProps> = ({
  size = 18,
  className = "",
  orientation = "horizontal",
  showLabels = false,
}) => {
  return (
    <div className={`${styles.container} ${orientation === "vertical" ? styles.vertical : ""} ${className}`}>
      {socials.map((s) => (
        <a
          key={s.name}
          href={s.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={s.name}
          className={styles.link}
        >
          <svg
            viewBox={s.viewBox || "0 0 24 24"}
            fill={s.color}
            width={size}
            height={size}
            className={`${styles.icon} ${s.name === 'TikTok' ? styles.tiktokIcon : ""}`}
            style={{ color: s.color }}
          >
            <path d={s.iconPath} />
            {s.overlay && (
              <polygon fill={s.overlayColor || "hsl(var(--card))"} points={s.overlay} />
            )}
          </svg>
          {showLabels && <span style={{ marginLeft: "8px", fontSize: "14px" }}>{s.name}</span>}
        </a>
      ))}
    </div>
  );
};

export default SocialIcons;
