export const toFixedFloor = (value: number, maxDecimals = 8): string => {
  if (!isFinite(value)) return '0';
  const p = Math.max(0, Math.min(18, maxDecimals));
  const factor = Math.pow(10, p);
  const floored = Math.floor(value * factor) / factor;
  let s = floored.toFixed(p);
  if (s.includes('.')) s = s.replace(/\.?0+$/, '');
  return s;
};

