import React from "react";
import { getLang, setLang } from "../i18n";

type Lang = "ja" | "en";
const labels: Record<Lang, { short: string; full: string; flag: string }> = {
  ja: { short: "JA", full: "日本語", flag: "🇯🇵" },
  en: { short: "EN", full: "English", flag: "🇺🇸" },
};

export default function LanguageToggle() {
  const [lang, setL] = React.useState<Lang>(getLang());

  const onChange = (next: Lang) => {
    setL(next);
    setLang(next);
  };

  return (
    <div className="lang-toggle" role="group" aria-label="Language">
      {(["ja", "en"] as Lang[]).map((k) => {
        const active = lang === k;
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

