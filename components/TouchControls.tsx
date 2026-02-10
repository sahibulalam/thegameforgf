"use client";

import { useCallback } from "react";

interface TouchControlsProps {
  onControl: (action: string, pressed: boolean) => void;
}

export default function TouchControls({ onControl }: TouchControlsProps) {
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

  return (
    <div
      className="fixed bottom-2 left-0 right-0 px-3 z-50 pointer-events-none"
      style={{ touchAction: "none" }}
    >
      <div className="flex justify-between items-end max-w-md mx-auto">
        {/* Left/Right buttons - smaller and more transparent */}
        <div className="flex gap-2 pointer-events-auto">
          <button
            onPointerDown={handlePointerDown("left")}
            onPointerUp={handlePointerUp("left")}
            onPointerLeave={handlePointerUp("left")}
            onPointerCancel={handlePointerUp("left")}
            className="w-12 h-12 rounded-full bg-white/15 border border-white/30 flex items-center justify-center text-white/60 text-xl select-none active:bg-white/40"
            style={{ touchAction: "none", WebkitTouchCallout: "none", WebkitUserSelect: "none" }}
          >
            ◀
          </button>
          <button
            onPointerDown={handlePointerDown("right")}
            onPointerUp={handlePointerUp("right")}
            onPointerLeave={handlePointerUp("right")}
            onPointerCancel={handlePointerUp("right")}
            className="w-12 h-12 rounded-full bg-white/15 border border-white/30 flex items-center justify-center text-white/60 text-xl select-none active:bg-white/40"
            style={{ touchAction: "none", WebkitTouchCallout: "none", WebkitUserSelect: "none" }}
          >
            ▶
          </button>
        </div>

        {/* Jump button - smaller */}
        <button
          onPointerDown={handlePointerDown("jump")}
          onPointerUp={handlePointerUp("jump")}
          onPointerLeave={handlePointerUp("jump")}
          onPointerCancel={handlePointerUp("jump")}
          className="w-14 h-14 rounded-full bg-pink-500/20 border border-pink-400/40 flex items-center justify-center text-pink-300/70 text-xs font-bold select-none active:bg-pink-500/50 pointer-events-auto"
          style={{ touchAction: "none", WebkitTouchCallout: "none", WebkitUserSelect: "none" }}
        >
          JUMP
        </button>
      </div>
    </div>
  );
}
