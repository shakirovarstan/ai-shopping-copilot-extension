import { useEffect, useRef, useState } from "react";
import { Widget } from "./components/Widget";
import { useDraggable } from "./hooks/useDraggable";
import { useTheme } from "./hooks/useTheme";
import { STORAGE_KEYS } from "./lib/constants";
import { getValue, setValue } from "./lib/storage";

interface AppProps {
  marketplaceLabel: string;
}

export function App({ marketplaceLabel }: AppProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const { position, isDragging, dragHandleProps } = useDraggable(rootRef);
  const { preference, effective, cycleTheme } = useTheme();

  const [collapsed, setCollapsed] = useState(false);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    let active = true;
    void getValue<boolean>(STORAGE_KEYS.collapsed, false).then((c) => {
      if (active) setCollapsed(c);
    });
    return () => {
      active = false;
    };
  }, []);

  const toggleCollapsed = () => {
    setCollapsed((prev) => {
      const next = !prev;
      void setValue(STORAGE_KEYS.collapsed, next);
      return next;
    });
  };

  if (hidden) return null;

  return (
    <div
      ref={rootRef}
      className={[
        "acp-root fixed z-[2147483647] w-[340px] max-w-[calc(100vw-16px)]",
        effective === "dark" ? "dark" : "",
      ].join(" ")}
      style={{
        top: `${position.top}px`,
        right: `${position.right}px`,
        transition: isDragging ? "none" : "top 0.18s ease, right 0.18s ease",
      }}
    >
      <Widget
        marketplaceLabel={marketplaceLabel}
        themePreference={preference}
        collapsed={collapsed}
        isDragging={isDragging}
        onToggleTheme={cycleTheme}
        onToggleCollapsed={toggleCollapsed}
        onClose={() => setHidden(true)}
        dragHandleProps={dragHandleProps}
      />
    </div>
  );
}
