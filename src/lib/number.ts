export const toFixedFloor = (value: number, maxDecimals = 8): string => {
  if (!Number.isFinite(value)) return '0';
  const p = Math.max(0, Math.min(18, maxDecimals));
  const factor = Math.pow(10, p);
  const floored = Math.floor(value * factor) / factor;
  let s = floored.toFixed(p);
  if (s.indexOf('.') >= 0) s = s.replace(/\.?0+$/, '');
  return s;
};

/** 3桁区切りのカンマ付与（整数部のみ） */
export const addThousands = (s: string): string =>
  s.replace(/^(\-?\d+)(\.\d+)?$/, (_m, int, dec) =>
    int.replace(/\B(?=(\d{3})+(?!\d))/g, ',') + (dec || '')
  );

/** カンマ等を除去して数値文字列に戻す */
export const stripThousands = (s: string): string =>
  s.replace(/,/g, '').trim();

/** JPY用：最大2桁。末尾.00 は落とす。必ず3桁区切り。 */
export const formatJPY = (n: number): string => {
  if (!Number.isFinite(n)) return '0';
  const fixed = n.toFixed(2).replace(/\.00$/, '');
  return addThousands(fixed);
};

/** フィアット汎用（今はJPY重視） */
export const formatFiat = (n: number, fiat: 'jpy' | 'usd' | 'eur'): string => {
  if (fiat === 'jpy') return formatJPY(n);
  const fixed = n.toFixed(2).replace(/\.00$/, '');
  return addThousands(fixed);
};
