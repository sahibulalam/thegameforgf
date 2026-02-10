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
      className="fixed bottom-0 left-0 right-0 p-6 z-50"
      style={{ touchAction: "none" }}
    >
      <div className="flex justify-between items-end max-w-xl mx-auto">
        {/* Left/Right buttons */}
        <div className="flex gap-3">
          <button
            onPointerDown={handlePointerDown("left")}
            onPointerUp={handlePointerUp("left")}
            onPointerLeave={handlePointerUp("left")}
            onPointerCancel={handlePointerUp("left")}
            className="w-[72px] h-[72px] rounded-full bg-white/25 border-2 border-white/50 flex items-center justify-center text-white text-3xl select-none active:bg-white/50"
            style={{ touchAction: "none", WebkitTouchCallout: "none", WebkitUserSelect: "none" }}
          >
            ◀
          </button>
          <button
            onPointerDown={handlePointerDown("right")}
            onPointerUp={handlePointerUp("right")}
            onPointerLeave={handlePointerUp("right")}
            onPointerCancel={handlePointerUp("right")}
            className="w-[72px] h-[72px] rounded-full bg-white/25 border-2 border-white/50 flex items-center justify-center text-white text-3xl select-none active:bg-white/50"
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
          className="w-[88px] h-[88px] rounded-full bg-pink-500/40 border-2 border-pink-400/70 flex items-center justify-center text-white text-3xl select-none active:bg-pink-500/70"
          style={{ touchAction: "none", WebkitTouchCallout: "none", WebkitUserSelect: "none" }}
        >
          JUMP
        </button>
      </div>
    </div>
  );
}
