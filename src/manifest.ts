import { defineManifest } from "@crxjs/vite-plugin";
import pkg from "../package.json";

const MARKETPLACE_MATCHES = [
  "*://*.ozon.ru/*",
  "*://*.wildberries.ru/*",
  "*://*.aliexpress.com/*",
  "*://*.aliexpress.ru/*",
  "*://*.goldapple.ru/*",
];

export default defineManifest({
  manifest_version: 3,
  name: "AI Shopping Copilot",
  version: pkg.version,
  description:
    "AI Shopping Copilot — injects a floating assistant widget on marketplace product pages (Ozon, Wildberries, AliExpress, Golden Apple).",
  default_locale: "en",
  icons: {
    "16": "icons/icon-16.png",
    "32": "icons/icon-32.png",
    "48": "icons/icon-48.png",
    "128": "icons/icon-128.png",
  },
  action: {
    default_title: "AI Shopping Copilot",
    default_popup: "src/popup/index.html",
    default_icon: {
      "16": "icons/icon-16.png",
      "32": "icons/icon-32.png",
      "48": "icons/icon-48.png",
      "128": "icons/icon-128.png",
    },
  },
  background: {
    service_worker: "src/background/service-worker.ts",
    type: "module",
  },
  content_scripts: [
    {
      matches: MARKETPLACE_MATCHES,
      js: ["src/content/index.tsx"],
      run_at: "document_idle",
      all_frames: false,
    },
  ],
  permissions: ["storage"],
  host_permissions: MARKETPLACE_MATCHES,
});
