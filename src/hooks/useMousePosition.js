import { useEffect } from "react";

export function useMousePosition(
  ref,
  callback
) {
  useEffect(() => {
    const handleMouseMove = (event) => {
      const { clientX, clientY } = event;
      const { top, left } = ref.current?.getBoundingClientRect() || {
        top: 0,
        left: 0,
      };

      callback({ x: clientX - left, y: clientY - top });
    };

    const handleTouchMove = (event) => {
      const { clientX, clientY } = event.touches[0];
      const { top, left } = ref.current?.getBoundingClientRect() || {
        top: 0,
        left: 0,
      };

      callback({ x: clientX - left, y: clientY - top });
    };

    const nodeRef = ref.current;

    nodeRef?.addEventListener("mousemove", handleMouseMove);
    nodeRef?.addEventListener("touchmove", handleTouchMove);

    return () => {
      nodeRef?.removeEventListener("mousemove", handleMouseMove);
      nodeRef?.removeEventListener("touchmove", handleTouchMove);
    };
  }, [ref, callback]);
}
