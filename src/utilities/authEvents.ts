// authEvents.ts
let logoutCallback: (() => void) | null = null;

export function registerLogout(cb: () => void) {
  logoutCallback = cb;
}

export function triggerLogout() {
  if (logoutCallback) logoutCallback();
}
