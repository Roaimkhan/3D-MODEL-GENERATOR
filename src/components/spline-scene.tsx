"use client";

import { useEffect, useRef } from "react";
import Spline from "@splinetool/react-spline";

type SplineSceneProps = {
  scene: string;
  className?: string;
};

export default function SplineScene({ scene, className }: SplineSceneProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const lastFrameRef = useRef<number | null>(null);

  useEffect(() => {
    const forwardPointer = (event: PointerEvent) => {
      if (lastFrameRef.current !== null) {
        cancelAnimationFrame(lastFrameRef.current);
      }

      lastFrameRef.current = requestAnimationFrame(() => {
        const canvas = containerRef.current?.querySelector("canvas");
        if (!canvas) return;

        const pointerEvent = new PointerEvent("pointermove", {
          bubbles: true,
          clientX: event.clientX,
          clientY: event.clientY,
          pointerId: event.pointerId,
          pointerType: event.pointerType,
          isPrimary: event.isPrimary,
        });

        const mouseEvent = new MouseEvent("mousemove", {
          bubbles: true,
          clientX: event.clientX,
          clientY: event.clientY,
        });

        canvas.dispatchEvent(pointerEvent);
        canvas.dispatchEvent(mouseEvent);
      });
    };

    window.addEventListener("pointermove", forwardPointer, { passive: true });

    return () => {
      window.removeEventListener("pointermove", forwardPointer);
      if (lastFrameRef.current !== null) {
        cancelAnimationFrame(lastFrameRef.current);
      }
    };
  }, []);

  return (
    <div ref={containerRef} className={className} style={{ contain: "layout style paint" }}>
      <Spline scene={scene} style={{ width: "100%", height: "100%", display: "block" }} />
    </div>
  );
}
