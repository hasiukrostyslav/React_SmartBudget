import { lazy, type ComponentType } from 'react';

const RELOADED_AT_KEY = 'page-chunk-reloaded-at';
// A second failure this soon after reloading is a real error, not a stale tab.
const RELOAD_WINDOW_MS = 10_000;

/**
 * Runs a page import. If it fails, the usual cause is a tab left open across a
 * deploy asking for chunk files that no longer exist, so the page reloads once
 * to pick up the new build. A failure again within the window is rethrown for
 * the error boundary, so a real outage can't cause a reload loop.
 */
export function importWithReload<T>(
  load: () => Promise<T>,
  reload: () => void = () => window.location.reload(),
): Promise<T> {
  return load().catch((error: unknown) => {
    if (!claimReload()) throw error;
    reload();
    // The page is being replaced; never settle, so nothing renders meanwhile.
    return new Promise<T>(() => {});
  });
}

function claimReload(): boolean {
  try {
    const last = Number(sessionStorage.getItem(RELOADED_AT_KEY));
    if (last && Date.now() - last < RELOAD_WINDOW_MS) return false;
    sessionStorage.setItem(RELOADED_AT_KEY, String(Date.now()));
    return true;
  } catch {
    // Without storage a reload can't be limited to once, so don't reload.
    return false;
  }
}

/** React.lazy for route pages, with one automatic reload on a failed import. */
export function lazyPage<P extends object>(
  load: () => Promise<{ default: ComponentType<P> }>,
) {
  return lazy(() => importWithReload(load));
}
