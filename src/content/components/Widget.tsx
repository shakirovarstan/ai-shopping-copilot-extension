import { type PointerEventHandler } from "react";
import type { ThemePreference } from "../lib/constants";
import {
  AutoIcon,
  ChevronIcon,
  CloseIcon,
  GripIcon,
  MoonIcon,
  SparkleIcon,
  SunIcon,
} from "./icons";

interface WidgetProps {
  marketplaceLabel: string;
  themePreference: ThemePreference;
  collapsed: boolean;
  isDragging: boolean;
  onToggleTheme: () => void;
  onToggleCollapsed: () => void;
  onClose: () => void;
  dragHandleProps: { onPointerDown: PointerEventHandler };
}

function ThemeIcon({ preference }: { preference: ThemePreference }) {
  if (preference === "light") return <SunIcon />;
  if (preference === "dark") return <MoonIcon />;
  return <AutoIcon />;
}

export function Widget({
  marketplaceLabel,
  themePreference,
  collapsed,
  isDragging,
  onToggleTheme,
  onToggleCollapsed,
  onClose,
  dragHandleProps,
}: WidgetProps) {
  return (
    <div
      className={[
        "acp-glass overflow-hidden rounded-xl2 border border-black/5 text-slate-900",
        "shadow-widget dark:border-white/10 dark:text-slate-100 dark:shadow-widget-dark",
        "animate-widget-in select-none",
        isDragging ? "cursor-grabbing" : "",
      ].join(" ")}
      role="dialog"
      aria-label="AI Shopping Copilot"
    >
      {/* Header / drag handle */}
      <div
        {...dragHandleProps}
        className={[
          "flex items-center gap-2.5 px-3.5 py-3",
          isDragging ? "cursor-grabbing" : "cursor-grab",
        ].join(" ")}
      >
        <span className="text-slate-400 dark:text-slate-500">
          <GripIcon />
        </span>

        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-accent to-accent-soft text-white shadow-sm">
          <SparkleIcon width={15} height={15} />
        </span>

        <div className="min-w-0 flex-1 leading-tight">
          <div className="truncate text-[13px] font-semibold tracking-[-0.01em]">
            AI Shopping Copilot
          </div>
          <div className="truncate text-[11px] font-medium text-slate-500 dark:text-slate-400">
            {marketplaceLabel}
          </div>
        </div>

        <div className="flex items-center gap-1">
          <IconButton
            label="Toggle theme"
            onClick={onToggleTheme}
            title={`Theme: ${themePreference}`}
          >
            <ThemeIcon preference={themePreference} />
          </IconButton>
          <IconButton
            label={collapsed ? "Expand" : "Collapse"}
            onClick={onToggleCollapsed}
          >
            <ChevronIcon
              className={[
                "transition-transform duration-300 ease-out",
                collapsed ? "-rotate-90" : "rotate-0",
              ].join(" ")}
            />
          </IconButton>
          <IconButton label="Hide" onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </div>
      </div>

      {/* Collapsible body — animated via grid-template-rows */}
      <div
        className={[
          "grid transition-[grid-template-rows,opacity] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]",
          collapsed ? "grid-rows-[0fr] opacity-0" : "grid-rows-[1fr] opacity-100",
        ].join(" ")}
      >
        <div className="overflow-hidden">
          <div className="px-3.5 pb-4 pt-1">
            <LoadingState />
          </div>
        </div>
      </div>
    </div>
  );
}

function IconButton({
  children,
  label,
  onClick,
  title,
}: {
  children: React.ReactNode;
  label: string;
  onClick: () => void;
  title?: string;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={title ?? label}
      // Prevent the drag handler on the header from firing on button press.
      onPointerDown={(e) => e.stopPropagation()}
      onClick={onClick}
      className={[
        "flex h-7 w-7 items-center justify-center rounded-full text-slate-500",
        "transition-all duration-200 hover:bg-black/5 hover:text-slate-900 active:scale-90",
        "dark:text-slate-400 dark:hover:bg-white/10 dark:hover:text-white",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/60",
      ].join(" ")}
    >
      {children}
    </button>
  );
}

function LoadingState() {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2.5">
        <span className="relative flex h-2.5 w-2.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent/60" />
          <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-accent" />
        </span>
        <span className="text-[13px] font-medium text-slate-600 dark:text-slate-300">
          Loading product…
        </span>
      </div>

      {/* Skeleton shimmer lines */}
      <div className="flex flex-col gap-2">
        <div className="acp-shimmer h-3 w-full animate-shimmer rounded-full bg-black/5 dark:bg-white/10" />
        <div className="acp-shimmer h-3 w-4/5 animate-shimmer rounded-full bg-black/5 dark:bg-white/10" />
        <div className="acp-shimmer h-3 w-3/5 animate-shimmer rounded-full bg-black/5 dark:bg-white/10" />
      </div>
    </div>
  );
}
