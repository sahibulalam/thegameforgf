"use client";

import { useCallback, useState, useEffect } from "react";

interface TouchControlsProps {
  onControl: (action: string, pressed: boolean) => void;
}

export default function TouchControls({ onControl }: TouchControlsProps) {
  const [isTablet, setIsTablet] = useState(false);

  useEffect(() => {
    const checkDevice = () => {
      const width = window.innerWidth;
      setIsTablet(width >= 768);
    };
    checkDevice();
    window.addEventListener("resize", checkDevice);
    return () => window.removeEventListener("resize", checkDevice);
  }, []);

  const handlePointerDown = useCallback(
    (action: string) => () => {
      onControl(action, true);
    },
    [onControl]
  );

  const handlePointerUp = useCallback(
    (action: string) => () => {
      onControl(action, false);
    },
    [onControl]
  );

  // Larger buttons for tablet
  const btnSize = isTablet ? "w-16 h-16" : "w-14 h-14";
  const jumpSize = isTablet ? "w-20 h-20" : "w-16 h-16";
  const fontSize = isTablet ? "text-2xl" : "text-xl";
  const jumpFontSize = isTablet ? "text-sm" : "text-xs";

  return (
    <div
      className="fixed bottom-4 left-0 right-0 px-4 z-50 pointer-events-none"
      style={{ touchAction: "none" }}
    >
      <div className={`flex justify-between items-end ${isTablet ? "max-w-2xl" : "max-w-md"} mx-auto`}>
        {/* Left/Right buttons */}
        <div className={`flex ${isTablet ? "gap-4" : "gap-3"} pointer-events-auto`}>
          <button
            onPointerDown={handlePointerDown("left")}
            onPointerUp={handlePointerUp("left")}
            onPointerLeave={handlePointerUp("left")}
            onPointerCancel={handlePointerUp("left")}
            className={`${btnSize} rounded-full bg-white/20 border-2 border-white/40 flex items-center justify-center text-white/70 ${fontSize} select-none active:bg-white/50 active:scale-95 transition-transform`}
            style={{ touchAction: "none", WebkitTouchCallout: "none", WebkitUserSelect: "none" }}
          >
            ◀
          </button>
          <button
            onPointerDown={handlePointerDown("right")}
            onPointerUp={handlePointerUp("right")}
            onPointerLeave={handlePointerUp("right")}
            onPointerCancel={handlePointerUp("right")}
            className={`${btnSize} rounded-full bg-white/20 border-2 border-white/40 flex items-center justify-center text-white/70 ${fontSize} select-none active:bg-white/50 active:scale-95 transition-transform`}
            style={{ touchAction: "none", WebkitTouchCallout: "none", WebkitUserSelect: "none" }}
          >
            ▶
          </button>
        </div>

        {/* Jump button */}
        <button
          onPointerDown={handlePointerDown("jump")}
          onPointerUp={handlePointerUp("jump")}
          onPointerLeave={handlePointerUp("jump")}
          onPointerCancel={handlePointerUp("jump")}
          className={`${jumpSize} rounded-full bg-pink-500/30 border-2 border-pink-400/50 flex items-center justify-center text-pink-200 ${jumpFontSize} font-bold select-none active:bg-pink-500/60 active:scale-95 transition-transform pointer-events-auto`}
          style={{ touchAction: "none", WebkitTouchCallout: "none", WebkitUserSelect: "none" }}
        >
          JUMP
        </button>
      </div>
    </div>
  );
}
