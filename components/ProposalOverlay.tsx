"use client";

import { useState, useCallback, useEffect } from "react";

interface ProposalOverlayProps {
  onYes: () => void;
  showConfetti: boolean;
}

interface Particle {
  id: number;
  x: number;
  y: number;
  color: string;
  size: number;
  rotation: number;
}

const colors = ["#ff6b9d", "#ff8fab", "#ffc2d4", "#ffb3c6", "#fff0f3"];

export default function ProposalOverlay({ onYes, showConfetti }: ProposalOverlayProps) {
  const [accepted, setAccepted] = useState(false);
  const [noPosition, setNoPosition] = useState({ x: 0, y: 0 });
  const [particles, setParticles] = useState<Particle[]>([]);

  const handleYes = useCallback(() => {
    setAccepted(true);
    onYes();
  }, [onYes]);

  const handleNoHover = useCallback(() => {
    const maxX = 100;
    const maxY = 60;
    setNoPosition({
      x: (Math.random() - 0.5) * 2 * maxX,
      y: (Math.random() - 0.5) * 2 * maxY,
    });
  }, []);

  useEffect(() => {
    if (showConfetti) {
      const newParticles: Particle[] = [];
      for (let i = 0; i < 60; i++) {
        newParticles.push({
          id: i,
          x: Math.random() * 100,
          y: -5,
          color: colors[Math.floor(Math.random() * colors.length)],
          size: Math.random() * 8 + 4,
          rotation: Math.random() * 360,
        });
      }
      setParticles(newParticles);
    }
  }, [showConfetti]);

  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-sm flex items-center justify-center z-50">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute pointer-events-none"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            backgroundColor: p.color,
            borderRadius: Math.random() > 0.5 ? "50%" : "2px",
            transform: `rotate(${p.rotation}deg)`,
            animation: `fall ${3 + Math.random() * 2}s linear forwards`,
          }}
        />
      ))}

      <style jsx>{`
        @keyframes fall {
          to {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
          }
        }
      `}</style>

      {!accepted ? (
        <div className="text-center px-6">
          <h1 className="text-3xl md:text-5xl font-serif mb-10"
            style={{
              background: "linear-gradient(135deg, #ffc2d4 0%, #ff6b9d 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              textShadow: "0 0 30px rgba(255, 107, 157, 0.3)",
            }}
          >
            Will you stay till I die?
          </h1>

          <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
            <button
              onClick={handleYes}
              className="px-8 py-3 text-lg rounded-full bg-green-500/20 border-2 border-green-500 text-green-400 hover:bg-green-500/40 transition-all min-w-[120px]"
            >
              YES
            </button>

            <button
              onMouseEnter={handleNoHover}
              onTouchStart={handleNoHover}
              className="px-8 py-3 text-lg rounded-full bg-red-500/20 border-2 border-red-500 text-red-400 min-w-[120px] transition-transform duration-200"
              style={{
                transform: `translate(${noPosition.x}px, ${noPosition.y}px)`,
              }}
            >
              NO
            </button>
          </div>
        </div>
      ) : (
        <div className="text-center px-6">
          <div className="w-24 h-24 md:w-32 md:h-32 mx-auto mb-6 rounded-full border-4 border-pink-400 flex items-center justify-center animate-pulse">
            <span className="text-4xl md:text-5xl">💕</span>
          </div>

          <h1 className="text-3xl md:text-5xl font-serif"
            style={{
              background: "linear-gradient(135deg, #ffc2d4 0%, #ff6b9d 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              textShadow: "0 0 30px rgba(255, 107, 157, 0.3)",
            }}
          >
            Forever with you ❤️
          </h1>

          <p className="mt-4 text-pink-300/80 text-lg">Thank you, Debs</p>

          <div className="mt-6 flex justify-center gap-2">
            <span className="text-2xl animate-bounce" style={{ animationDelay: "0ms" }}>❤️</span>
            <span className="text-2xl animate-bounce" style={{ animationDelay: "100ms" }}>❤️</span>
            <span className="text-2xl animate-bounce" style={{ animationDelay: "200ms" }}>❤️</span>
          </div>
        </div>
      )}
    </div>
  );
}
