import React from 'react';

type Props = { text: string; ariaLabel?: string };

export default function CopyButton({ text, ariaLabel = '結果をコピー' }: Props) {
  const onCopy = async () => {
    try { await navigator.clipboard.writeText(text); } catch {}
  };
  return (
    <button className="copy-btn" aria-label={ariaLabel} onClick={onCopy}>
      コピー
    </button>
  );
}

