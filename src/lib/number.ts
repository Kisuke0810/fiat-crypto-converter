export const toFixedFloor = (value: number, maxDecimals = 8): string => {
  if (!isFinite(value)) return '0';
  const p = Math.max(0, Math.min(18, maxDecimals));
  const factor = Math.pow(10, p);
  const floored = Math.floor(value * factor) / factor;
  let s = floored.toFixed(p);
  if (s.includes('.')) s = s.replace(/\.?0+$/, '');
  return s;
};

/**
 * 表示用フォーマッタ
 * - 小数は最大 max 桁に四捨五入
 * - 末尾の 0 と不要な小数点を削除（"1.230000"→"1.23", "10.000000"→"10"）
 */
export const formatCrypto = (value: number, max = 6): string => {
  if (!Number.isFinite(value)) return '-';
  const fixed = value.toFixed(Math.max(0, Math.min(18, max)));
  return fixed.replace(/\.?0+$/, '');
};
