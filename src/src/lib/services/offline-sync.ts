/** Offline sync service for driver PWA
 * Uses localStorage as a simple queue (IndexedDB would be used in production)
 */

const QUEUE_KEY = "elo_offline_queue";

export interface OfflineMutation {
  id: string;
  timestamp: number;
  method: "POST" | "PUT" | "PATCH";
  url: string;
  body: unknown;
  retries: number;
}

/** Check if the browser is online */
export function isOnline(): boolean {
  return typeof navigator !== "undefined" ? navigator.onLine : true;
}

/** Add a mutation to the offline queue */
export function queueMutation(method: "POST" | "PUT" | "PATCH", url: string, body: unknown): void {
  const queue = getQueue();
  queue.push({
    id: crypto.randomUUID(),
    timestamp: Date.now(),
    method,
    url,
    body,
    retries: 0,
  });
  saveQueue(queue);
}

/** Get all queued mutations */
export function getQueue(): OfflineMutation[] {
  if (typeof window === "undefined") return [];
  try {
    const data = localStorage.getItem(QUEUE_KEY);
    return data ? (JSON.parse(data) as OfflineMutation[]) : [];
  } catch {
    return [];
  }
}

/** Save queue to storage */
function saveQueue(queue: OfflineMutation[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(QUEUE_KEY, JSON.stringify(queue));
}

/** Replay all queued mutations (called when back online) */
export async function replayQueue(): Promise<{ success: number; failed: number }> {
  const queue = getQueue();
  let success = 0;
  let failed = 0;
  const remaining: OfflineMutation[] = [];

  for (const mutation of queue) {
    try {
      const response = await fetch(mutation.url, {
        method: mutation.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(mutation.body),
      });

      if (response.ok) {
        success++;
      } else if (mutation.retries < 3) {
        remaining.push({ ...mutation, retries: mutation.retries + 1 });
        failed++;
      } else {
        failed++; // Drop after 3 retries
      }
    } catch {
      if (mutation.retries < 3) {
        remaining.push({ ...mutation, retries: mutation.retries + 1 });
      }
      failed++;
    }
  }

  saveQueue(remaining);
  return { success, failed };
}

/** Clear the offline queue */
export function clearQueue(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(QUEUE_KEY);
}

/** Get queue count */
export function getQueueCount(): number {
  return getQueue().length;
}

/** Register online/offline listeners for auto-replay */
export function registerSyncListeners(onSync?: (result: { success: number; failed: number }) => void): void {
  if (typeof window === "undefined") return;

  window.addEventListener("online", async () => {
    const queue = getQueue();
    if (queue.length > 0) {
      const result = await replayQueue();
      onSync?.(result);
    }
  });
}
