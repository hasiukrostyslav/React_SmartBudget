import { lazy, type ComponentType } from 'react';

const RELOAD_ATTEMPTED_KEY = 'page-chunk-reload-attempted';

/**
 * Runs a page import. If it fails, the usual cause is a tab left open across a
 * deploy asking for chunk files that no longer exist, so the page reloads once
 * to pick up the new build. If the import fails again after that reload, a
 * reload can't fix it: the error is rethrown for the error boundary instead of
 * reloading again. The limit is one reload per failure, not a time window, so a
 * slow page load can't turn it into a loop. A successful import re-arms it.
 * Offline it doesn't reload at all: that would replace the app with the
 * browser's offline page.
 */
export function importWithReload<T>(
  load: () => Promise<T>,
  reload: () => void = () => window.location.reload(),
): Promise<T> {
  return load().then(
    (module) => {
      forgetReload();
      return module;
    },
    (error: unknown) => {
      if (isOffline() || !claimReload()) throw error;
      reload();
      // The page is being replaced; never settle, so nothing renders meanwhile.
      return new Promise<T>(() => {});
    },
  );
}

function isOffline() {
  return typeof navigator !== 'undefined' && navigator.onLine === false;
}

/** True if this failure may reload; false if the last reload didn't help. */
function claimReload(): boolean {
  try {
    if (sessionStorage.getItem(RELOAD_ATTEMPTED_KEY)) {
      sessionStorage.removeItem(RELOAD_ATTEMPTED_KEY);
      return false;
    }
    sessionStorage.setItem(RELOAD_ATTEMPTED_KEY, '1');
    return true;
  } catch {
    // Without storage a reload can't be limited to once, so don't reload.
    return false;
  }
}

function forgetReload() {
  try {
    sessionStorage.removeItem(RELOAD_ATTEMPTED_KEY);
  } catch {
    // No storage, so no attempt was recorded.
  }
}

/** React.lazy for route pages, with one automatic reload on a failed import. */
export function lazyPage<P extends object>(
  load: () => Promise<{ default: ComponentType<P> }>,
) {
  return lazy(() => importWithReload(load));
}
