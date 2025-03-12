/**
 * Format duration time based on ms
 * @param ms milliseconds
 */
export function formateDuration(ms: number | undefined) {
  if(ms === undefined) return ms;

  if (ms < 1000) {
    return `${ms}ms`;
  }

  const s = Math.floor(ms / 1000);

  if (s < 60) {
    return `${s}s`;
  }

  const m = Math.floor(s / 60);

  if (m < 60) {
    return `${m}m${s % 60}s`;
  }

  const h = Math.floor(m / 60);

  return `${h}h${m % 60}m${s % 60}`;
}
