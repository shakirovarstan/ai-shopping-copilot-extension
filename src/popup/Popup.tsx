import { SparkleIcon } from "../content/components/icons";

const MARKETPLACES = ["Ozon", "Wildberries", "AliExpress", "Golden Apple"];

export function Popup() {
  return (
    <div className="bg-white p-5 text-slate-900 dark:bg-[#1c1c1e] dark:text-slate-100">
      <div className="flex items-center gap-3">
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-accent to-accent-soft text-white shadow-sm">
          <SparkleIcon width={18} height={18} />
        </span>
        <div className="leading-tight">
          <div className="text-[15px] font-semibold tracking-[-0.01em]">
            AI Shopping Copilot
          </div>
          <div className="text-[12px] text-slate-500 dark:text-slate-400">
            Your shopping assistant
          </div>
        </div>
      </div>

      <p className="mt-4 text-[13px] leading-relaxed text-slate-600 dark:text-slate-300">
        Open a product page on a supported marketplace and the Copilot widget
        will appear on the right side of the page.
      </p>

      <div className="mt-4">
        <div className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
          Supported marketplaces
        </div>
        <div className="flex flex-wrap gap-2">
          {MARKETPLACES.map((m) => (
            <span
              key={m}
              className="rounded-full bg-black/5 px-2.5 py-1 text-[12px] font-medium text-slate-700 dark:bg-white/10 dark:text-slate-200"
            >
              {m}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-5 border-t border-black/5 pt-3 text-center text-[11px] text-slate-400 dark:border-white/10">
        v{chrome.runtime?.getManifest?.().version ?? "0.1.0"}
      </div>
    </div>
  );
}
