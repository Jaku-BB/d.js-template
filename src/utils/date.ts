export const getRelativeTime = (date: Date) => {
  const difference = Math.round((date.getTime() - Date.now()) / 1000);

  const thresholds = [60, 3600, 86400, Infinity];
  const units = ['second', 'minute', 'hour', 'day'] as const;

  const unitIndex = thresholds.findIndex((threshold) => {
    return threshold > (difference < 0 ? -difference : difference);
  });

  return new Intl.RelativeTimeFormat('en-US', { numeric: 'auto' }).format(
    Math.floor(difference / (thresholds[unitIndex - 1] || 1)),
    units[unitIndex],
  );
};
