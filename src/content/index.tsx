import { StrictMode } from "react";
import { createRoot, type Root } from "react-dom/client";
import { App } from "./App";
import { detectMarketplace } from "./lib/marketplace";
import { WIDGET_HOST_ID } from "./lib/constants";
// Compiled Tailwind CSS imported as a string and injected into the Shadow DOM,
// so none of our styles ever leak into (or break) the marketplace page.
import styles from "./styles.css?inline";

let root: Root | null = null;
let hostEl: HTMLElement | null = null;

function mountWidget(marketplaceLabel: string): void {
  if (hostEl && document.documentElement.contains(hostEl)) return;

  hostEl = document.createElement("div");
  hostEl.id = WIDGET_HOST_ID;
  // Keep the host itself inert in the page layout.
  hostEl.style.cssText = "all: initial; position: static;";

  const shadow = hostEl.attachShadow({ mode: "open" });

  const styleEl = document.createElement("style");
  styleEl.textContent = styles;
  shadow.appendChild(styleEl);

  const container = document.createElement("div");
  shadow.appendChild(container);

  // Append to <html> rather than <body>: some SPAs replace <body> on
  // navigation, and this keeps the widget resilient to that.
  document.documentElement.appendChild(hostEl);

  root = createRoot(container);
  root.render(
    <StrictMode>
      <App marketplaceLabel={marketplaceLabel} />
    </StrictMode>,
  );
}

function unmountWidget(): void {
  if (root) {
    root.unmount();
    root = null;
  }
  if (hostEl) {
    hostEl.remove();
    hostEl = null;
  }
}

function evaluate(): void {
  const detection = detectMarketplace();
  if (detection?.isProductPage) {
    mountWidget(detection.label);
  } else {
    unmountWidget();
  }
}

/**
 * Marketplaces are single-page apps that swap products without full reloads.
 * Patch the History API and listen for popstate so we re-evaluate on every
 * client-side navigation.
 */
function installNavigationListeners(): void {
  const notify = () => window.dispatchEvent(new Event("acp:locationchange"));

  const origPush = history.pushState;
  history.pushState = function (
    this: History,
    ...args: Parameters<History["pushState"]>
  ) {
    const result = origPush.apply(this, args);
    notify();
    return result;
  };

  const origReplace = history.replaceState;
  history.replaceState = function (
    this: History,
    ...args: Parameters<History["replaceState"]>
  ) {
    const result = origReplace.apply(this, args);
    notify();
    return result;
  };

  window.addEventListener("popstate", notify);

  let lastUrl = window.location.href;
  let scheduled = false;
  const onLocationChange = () => {
    if (scheduled) return;
    scheduled = true;
    // Debounce bursts of navigation events into a single re-evaluation.
    window.setTimeout(() => {
      scheduled = false;
      if (window.location.href !== lastUrl) {
        lastUrl = window.location.href;
      }
      evaluate();
    }, 250);
  };

  window.addEventListener("acp:locationchange", onLocationChange);
}

installNavigationListeners();
evaluate();
