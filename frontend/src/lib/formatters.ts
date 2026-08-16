export function formatRelativeTime(dateInput?: string | null): string {
  if (!dateInput) return 'Never';
  const date = new Date(dateInput);
  if (isNaN(date.getTime())) return 'Never';

  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 5) return 'just now';
  if (diffInSeconds < 60) return `${diffInSeconds}s ago`;

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}h ago`;

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 30) return `${diffInDays}d ago`;

  return date.toLocaleDateString();
}

export function formatLatency(latencyMs?: number | null): string {
  if (latencyMs === undefined || latencyMs === null || isNaN(Number(latencyMs))) return '—';
  const num = Number(latencyMs);
  if (num === 0) return '< 1 ms';
  return `${Math.round(num)} ms`;
}

export function formatStatusCode(statusCode?: number | null): string {
  if (!statusCode) return '—';
  return String(statusCode);
}

export function formatInterval(seconds?: number | null): string {
  if (!seconds) return '60s';
  if (seconds < 60) return `${seconds}s`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m`;
  return `${Math.floor(seconds / 3600)}h`;
}

export function formatDateTime(dateInput?: string | null): string {
  if (!dateInput) return '—';
  const date = new Date(dateInput);
  if (isNaN(date.getTime())) return '—';
  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
}
