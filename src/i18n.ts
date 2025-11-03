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
    note: '※参考計算です。実際の購入レートやスプレッド・手数料により差が出ます。', 
    lang: '言語'
  },
  en: {} as any
} as const;

// 日本語固定：setLangは無視、tは常に日本語を返す
export const setLang = (_l: Lang) => {};
export const t = (k: keyof typeof dict['ja']) => dict.ja[k];
export const getLang = () => 'ja';
