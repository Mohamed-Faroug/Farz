export function formatBytes(bytes: number): string {
  if (bytes <= 0) return "~0 MB";

  const units = ["B", "KB", "MB", "GB", "TB"];
  let value = bytes;
  let unitIndex = 0;

  while (value >= 1024 && unitIndex < units.length - 1) {
    value /= 1024;
    unitIndex += 1;
  }

  const formatted =
    unitIndex === 0
      ? String(Math.round(value))
      : value >= 10
        ? Math.round(value).toString()
        : value.toFixed(1);

  return `~${formatted} ${units[unitIndex]}`;
}
