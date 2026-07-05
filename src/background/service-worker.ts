/**
 * MV3 background service worker.
 *
 * This is intentionally minimal for now: it is the future home of all network
 * calls to the Copilot backend, auth/session handling and cross-tab caching.
 * No business logic is implemented yet.
 */

chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === "install") {
    console.info("[AI Shopping Copilot] Installed.");
  } else if (details.reason === "update") {
    console.info(
      `[AI Shopping Copilot] Updated to v${chrome.runtime.getManifest().version}.`,
    );
  }
});

// Placeholder message router. Content scripts will later request product
// analysis through here so that no secrets ever live in the page context.
chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message?.type === "ACP_PING") {
    sendResponse({ type: "ACP_PONG", ts: Date.now() });
  }
  return false;
});

export {};
