"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import TouchControls from "./TouchControls";
import ProposalOverlay from "./ProposalOverlay";

export default function GameCanvas() {
  const gameRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [showProposal, setShowProposal] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  const handleProposalTrigger = useCallback(() => {
    setShowProposal(true);
  }, []);

  const handleYes = useCallback(() => {
    setShowConfetti(true);
    if (gameRef.current) {
      const proposalScene = gameRef.current.scene.getScene("ProposalScene");
      if (proposalScene && proposalScene.triggerCelebration) {
        proposalScene.triggerCelebration();
      }
    }
  }, []);

  useEffect(() => {
    const checkDevice = () => {
      // Show controls on touch devices or smaller screens
      const isTouchDevice = "ontouchstart" in window || navigator.maxTouchPoints > 0;
      const isSmallScreen = window.innerWidth <= 1200;
      setShowControls(isTouchDevice || isSmallScreen);
    };
    checkDevice();
    window.addEventListener("resize", checkDevice);
    return () => window.removeEventListener("resize", checkDevice);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined" || !containerRef.current) return;

    let game: any = null;

    const initGame = async () => {
      const Phaser = await import("phaser");
      const { PreloadScene } = await import("@/game/PreloadScene");
      const { DistanceScene } = await import("@/game/DistanceScene");
      const { JourneyScene } = await import("@/game/JourneyScene");
      const { ProposalScene } = await import("@/game/ProposalScene");

      if (!containerRef.current) return;

      const config: Phaser.Types.Core.GameConfig = {
        type: Phaser.AUTO,
        parent: containerRef.current,
        width: window.innerWidth,
        height: window.innerHeight,
        backgroundColor: "#0a0a0f",
        physics: {
          default: "arcade",
          arcade: {
            gravity: { x: 0, y: 600 },
            debug: false,
          },
        },
        scale: {
          mode: Phaser.Scale.RESIZE,
          autoCenter: Phaser.Scale.CENTER_BOTH,
        },
        scene: [PreloadScene, DistanceScene, JourneyScene, ProposalScene],
        input: {
          activePointers: 3,
        },
        render: {
          antialias: true,
          pixelArt: false,
        },
      };

      game = new Phaser.Game(config);
      gameRef.current = game;

      game.events.on("proposal-trigger", handleProposalTrigger);
      setIsLoading(false);
    };

    initGame();

    return () => {
      if (game) {
        game.events.off("proposal-trigger", handleProposalTrigger);
        game.destroy(true);
        gameRef.current = null;
      }
    };
  }, [handleProposalTrigger]);

  const handleControl = useCallback((action: string, pressed: boolean) => {
    if (!gameRef.current) return;

    try {
      const scenes = gameRef.current.scene.getScenes(true);
      for (const scene of scenes) {
        if (scene && typeof scene.handleInput === "function") {
          scene.handleInput(action, pressed);
        }
      }
    } catch (e) {
      // Ignore errors during scene transitions
    }
  }, []);

  return (
    <div className="relative w-full h-full overflow-hidden">
      {isLoading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#0a0a0f] z-20">
          <div className="text-pink-300 text-2xl mb-4">Loading...</div>
          <div className="text-pink-200/60 text-sm">A journey for you</div>
        </div>
      )}

      <div ref={containerRef} className="w-full h-full" />

      {showControls && !showProposal && !isLoading && (
        <TouchControls onControl={handleControl} />
      )}

      {showProposal && (
        <ProposalOverlay
          onYes={handleYes}
          showConfetti={showConfetti}
        />
      )}
    </div>
  );
}
