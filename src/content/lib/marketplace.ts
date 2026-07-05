/**
 * Marketplace detection utilities.
 *
 * These helpers only decide *whether* the current URL is a product page and
 * *which* marketplace we are on. No product data is extracted here yet — that
 * belongs to the (future) business-logic layer.
 */

export type Marketplace =
  | "ozon"
  | "wildberries"
  | "aliexpress"
  | "goldapple";

interface MarketplaceMatcher {
  id: Marketplace;
  label: string;
  hostPattern: RegExp;
  productPattern: RegExp;
}

const MATCHERS: MarketplaceMatcher[] = [
  {
    id: "ozon",
    label: "Ozon",
    hostPattern: /(^|\.)ozon\.ru$/i,
    // https://www.ozon.ru/product/<slug>-<id>/
    productPattern: /\/product\//i,
  },
  {
    id: "wildberries",
    label: "Wildberries",
    hostPattern: /(^|\.)wildberries\.ru$/i,
    // https://www.wildberries.ru/catalog/<id>/detail.aspx
    productPattern: /\/catalog\/\d+\/detail\.aspx/i,
  },
  {
    id: "aliexpress",
    label: "AliExpress",
    hostPattern: /(^|\.)aliexpress\.(com|ru)$/i,
    // https://aliexpress.ru/item/<id>.html
    productPattern: /\/item\/\d+\.html/i,
  },
  {
    id: "goldapple",
    label: "Golden Apple",
    hostPattern: /(^|\.)goldapple\.ru$/i,
    // https://goldapple.ru/<id>-<slug>
    productPattern: /\/\d{8,}(?:-|$)/i,
  },
];

export interface DetectionResult {
  marketplace: Marketplace;
  label: string;
  isProductPage: boolean;
}

export function detectMarketplace(
  url: URL = new URL(window.location.href),
): DetectionResult | null {
  const matcher = MATCHERS.find((m) => m.hostPattern.test(url.hostname));
  if (!matcher) return null;

  return {
    marketplace: matcher.id,
    label: matcher.label,
    isProductPage: matcher.productPattern.test(url.pathname),
  };
}
