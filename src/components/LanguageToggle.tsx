import React from "react";

type Lang = "ja" | "en";
const labels: Record<Lang, { short: string; full: string; flag: string }> = {
  ja: { short: "JA", full: "日本語",  flag: "🇯🇵" },
  en: { short: "EN", full: "English", flag: "🇺🇸" },
};

export default function LanguageToggle(
  { value, onChange }: { value: Lang; onChange: (l: Lang) => void }
) {
  return (
    <div className="lang-toggle" role="group" aria-label="Language">
      {(["ja", "en"] as Lang[]).map((k) => {
        const active = value === k;
        const label = labels[k];
        return (
          <button
            key={k}
            type="button"
            className={active ? "lang-btn active" : "lang-btn"}
            aria-pressed={active}
            onClick={() => onChange(k)}
            title={label.full}
          >
            <span className="flag" aria-hidden="true">{label.flag}</span>
            <span className="full">{label.full}</span>
            <span className="short">{label.short}</span>
          </button>
        );
      })}
    </div>
  );
}

