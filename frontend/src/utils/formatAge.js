/**
 * Formats ticket age in minutes for display.
 * < 60 → "45m" | < 1440 → "3h 12m" | else → "2d 4h"
 */
export function formatAge(minutes) {
  if (minutes == null || Number.isNaN(minutes)) return '—';

  const total = Math.max(0, Math.floor(minutes));

  if (total < 60) return `${total}m`;

  if (total < 1440) {
    const h = Math.floor(total / 60);
    const m = total % 60;
    return m > 0 ? `${h}h ${m}m` : `${h}h`;
  }

  const d = Math.floor(total / 1440);
  const h = Math.floor((total % 1440) / 60);
  return h > 0 ? `${d}d ${h}h` : `${d}d`;
}
