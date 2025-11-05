type Props = { text: string; ariaLabel?: string };

import { useRef, useState } from 'react';

export default function CopyButton({ text, ariaLabel = '結果をコピー' }: Props) {
  const [toast, setToast] = useState<null | 'ok' | 'ng'>(null);
  const timerRef = useRef<number | null>(null);

  const showToast = (kind: 'ok' | 'ng') => {
    setToast(kind);
    if (timerRef.current) window.clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(() => setToast(null), 1200);
  };

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      showToast('ok');
    } catch {
      showToast('ng');
    }
  };

  return (
    <>
      <button className="copy-btn" aria-label={ariaLabel} onClick={onCopy}>
        コピー
      </button>
      {toast && (
        <div
          className={`copy-toast ${toast === 'ok' ? 'copy-toast--ok' : 'copy-toast--ng'}`}
          role="status"
          aria-live="polite"
        >
          {toast === 'ok' ? 'コピーしました' : 'コピーに失敗しました'}
        </div>
      )}
    </>
  );
}
