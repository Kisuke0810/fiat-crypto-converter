type Lang = 'ja' | 'en';
const dict = {
  ja: {
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
  },
  en: {
    title: 'Fiat ⇄ Crypto Quick Converter',
    modeFiatToCoin: 'Fiat → Quantity',
    modeCoinToFiat: 'Quantity → Fiat',
    fiat: 'Fiat',
    amount: 'Amount',
    coin: 'Crypto',
    quantity: 'Quantity',
    result: 'Result',
    errorFetch: 'Sorry! I couldn’t fetch the price. Please try again shortly.',
    unsupported: 'Seems this token is not supported right now.',
    note: 'Estimates only. Actual purchase rates/spreads/fees may differ. Some tokens may be unsupported.',
    lang: 'Lang',
  }
} as const;
let current: Lang = 'ja';
export const setLang = (l: Lang) => { current = l; };
export const getLang = () => current;
export const t = (k: keyof typeof dict['ja']) => dict[current][k];
