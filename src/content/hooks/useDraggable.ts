import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
  type RefObject,
} from "react";
import {
  DEFAULT_POSITION,
  STORAGE_KEYS,
  type WidgetPosition,
} from "../lib/constants";
import { getValue, setValue } from "../lib/storage";

const EDGE_MARGIN = 8;

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

function clampToViewport(
  pos: WidgetPosition,
  el: HTMLElement | null,
): WidgetPosition {
  const width = el?.offsetWidth ?? 340;
  const height = el?.offsetHeight ?? 120;
  const maxRight = Math.max(EDGE_MARGIN, window.innerWidth - width - EDGE_MARGIN);
  const maxTop = Math.max(EDGE_MARGIN, window.innerHeight - height - EDGE_MARGIN);
  return {
    right: clamp(pos.right, EDGE_MARGIN, maxRight),
    top: clamp(pos.top, EDGE_MARGIN, maxTop),
  };
}

interface DragState {
  pointerId: number;
  startX: number;
  startY: number;
  startRight: number;
  startTop: number;
}

export function useDraggable(elementRef: RefObject<HTMLElement | null>) {
  const [position, setPosition] = useState<WidgetPosition>(DEFAULT_POSITION);
  const [isDragging, setIsDragging] = useState(false);
  const dragRef = useRef<DragState | null>(null);
  const positionRef = useRef<WidgetPosition>(DEFAULT_POSITION);

  positionRef.current = position;

  const onPointerMove = useCallback(
    (event: PointerEvent) => {
      const drag = dragRef.current;
      if (!drag || event.pointerId !== drag.pointerId) return;
      const dx = event.clientX - drag.startX;
      const dy = event.clientY - drag.startY;
      setPosition(
        clampToViewport(
          { right: drag.startRight - dx, top: drag.startTop + dy },
          elementRef.current,
        ),
      );
    },
    [elementRef],
  );

  const endDrag = useCallback(
    (event: PointerEvent) => {
      const drag = dragRef.current;
      if (!drag || event.pointerId !== drag.pointerId) return;
      dragRef.current = null;
      setIsDragging(false);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", endDrag);
      window.removeEventListener("pointercancel", endDrag);
      void setValue(STORAGE_KEYS.position, positionRef.current);
    },
    [onPointerMove],
  );

  const onPointerDown = useCallback(
    (event: ReactPointerEvent) => {
      if (event.button !== 0) return;
      dragRef.current = {
        pointerId: event.pointerId,
        startX: event.clientX,
        startY: event.clientY,
        startRight: positionRef.current.right,
        startTop: positionRef.current.top,
      };
      setIsDragging(true);
      window.addEventListener("pointermove", onPointerMove);
      window.addEventListener("pointerup", endDrag);
      window.addEventListener("pointercancel", endDrag);
      event.preventDefault();
    },
    [onPointerMove, endDrag],
  );

  useEffect(() => {
    let active = true;
    void getValue<WidgetPosition>(STORAGE_KEYS.position, DEFAULT_POSITION).then(
      (p) => {
        if (active) setPosition(clampToViewport(p, elementRef.current));
      },
    );
    return () => {
      active = false;
    };
  }, [elementRef]);

  // Keep the widget on-screen when the window is resized.
  useEffect(() => {
    const onResize = () =>
      setPosition((prev) => clampToViewport(prev, elementRef.current));
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [elementRef]);

  useEffect(() => {
    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", endDrag);
      window.removeEventListener("pointercancel", endDrag);
    };
  }, [onPointerMove, endDrag]);

  return { position, isDragging, dragHandleProps: { onPointerDown } };
}
