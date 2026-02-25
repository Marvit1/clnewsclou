"use client";

import { useEffect, useState } from "react";

const CONSENT_KEY = "cookie_notice_accepted_v1";

export default function CookieNotice() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    try {
      const accepted = window.localStorage.getItem(CONSENT_KEY);
      if (!accepted) setIsVisible(true);
    } catch {
      setIsVisible(true);
    }
  }, []);

  const accept = () => {
    try {
      window.localStorage.setItem(CONSENT_KEY, "1");
    } catch {
      // ignore
    }
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div
      style={{
        position: "fixed",
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 50,
        background: "hsl(var(--background))",
        borderTop: "1px solid hsl(var(--border))",
      }}
      role="dialog"
      aria-live="polite"
      aria-label="Cookie notice"
    >
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "12px 16px",
          display: "flex",
          gap: 12,
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
        }}
      >
        <div style={{ color: "hsl(var(--foreground))", fontSize: 14, lineHeight: 1.35 }}>
          Այս կայքը օգտագործում է cookie-ներ՝ լեզվի ընտրությունը և ինտերֆեյսի կարգավորումները պահպանելու համար։ Շարունակելով՝ դուք համաձայնում եք դրանց օգտագործմանը։
        </div>

        <div style={{ display: "flex", gap: 8 }}>
          <button
            onClick={accept}
            style={{
              borderRadius: 8,
              padding: "8px 12px",
              fontSize: 14,
              fontWeight: 600,
              border: "1px solid hsl(var(--border))",
              background: "hsl(var(--foreground))",
              color: "hsl(var(--background))",
              cursor: "pointer",
            }}
          >
            Հասկացա
          </button>
        </div>
      </div>
    </div>
  );
}
