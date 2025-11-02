// 日本語固定の簡易i18n（互換API）
const JA = {
  title: '法定通貨 ⇄ 暗号資産 かんたん換算',
  modeFiatToCoin: '金額 → 枚数',
  modeCoinToFiat: '枚数 → 金額',
  fiat: '法定通貨',
  amount: '金額',
  coin: '暗号資産',
  quantity: '数量',
  result: '結果',
  errorFetch: 'ごめんね、今は価格を取れなかったよ。少し待ってもう一度お試しください。',
  unsupported: 'この銘柄の価格は今は取得できないみたい。',
  note: '参考計算です。実際の購入レートやスプレッド・手数料により差が出ます。一部の銘柄は未対応の場合があります。',
  lang: '言語',
} as const;
export function t(k: keyof typeof JA): string { return JA[k]; }
export function getLang(): 'ja' { return 'ja'; }
export function setLang(_: 'ja' | 'en'): void { /* no-op */ }
