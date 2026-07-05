/**
 * Thin async wrapper around chrome.storage.local with an in-memory fallback so
 * the widget still works when rendered outside an extension context (e.g. tests
 * or a plain web preview).
 */

const memory = new Map<string, unknown>();

function hasChromeStorage(): boolean {
  return (
    typeof chrome !== "undefined" &&
    !!chrome.storage &&
    !!chrome.storage.local
  );
}

export async function getValue<T>(key: string, fallback: T): Promise<T> {
  if (!hasChromeStorage()) {
    return (memory.has(key) ? (memory.get(key) as T) : fallback);
  }
  try {
    const result = await chrome.storage.local.get(key);
    const value = result[key];
    return value === undefined ? fallback : (value as T);
  } catch {
    return fallback;
  }
}

export async function setValue<T>(key: string, value: T): Promise<void> {
  if (!hasChromeStorage()) {
    memory.set(key, value);
    return;
  }
  try {
    await chrome.storage.local.set({ [key]: value });
  } catch {
    memory.set(key, value);
  }
}
