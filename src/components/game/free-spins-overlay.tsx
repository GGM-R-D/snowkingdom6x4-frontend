'use client';

import { useEffect, useState } from 'react';

interface FreeSpinsOverlayProps {
  count: number;
  onClose: () => void;
  winAmount?: number;
  winningSymbols?: string[];
  isComplete?: boolean;
  totalWin?: number;
}

export function FreeSpinsOverlay({ count, onClose, winAmount, winningSymbols, isComplete = false, totalWin }: FreeSpinsOverlayProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const showT = setTimeout(() => setVisible(true), 50);
    return () => {
      clearTimeout(showT);
    };
  }, []);

  return (
    <div className={`fixed inset-0 z-50 transition-opacity duration-300 ${visible ? 'opacity-100' : 'opacity-0'} pointer-events-none`}>
      <div className="absolute inset-0 flex items-start justify-center p-4 pt-[25vh] sm:pt-[28vh] md:pt-[30vh]">
        <div className="bg-black/70 p-6 sm:p-8 md:p-10 rounded-2xl shadow-2xl border-2 border-accent max-w-[90%] sm:max-w-md text-center animate-fade-in-scale">
          {!isComplete ? (
            <>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-headline text-accent drop-shadow-lg">Free Spins Activated!</h2>
              <p className="mt-2 text-lg sm:text-xl text-foreground/90">You have {count} free spins.</p>
              {winAmount && winAmount > 0 && (
                <>
                  <div className="mt-4 p-3 bg-accent/20 rounded-lg border border-accent/50">
                    <p className="text-lg sm:text-xl text-accent font-bold">Winnings:</p>
                    <p className="text-2xl sm:text-3xl font-bold text-accent drop-shadow-lg">
                      R {winAmount.toFixed(2)}
                    </p>
                  </div>
                </>
              )}
              <p className="mt-3 text-base sm:text-lg text-accent font-bold">Press SPIN to start Free Spins</p>
            </>
          ) : (
            <>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-headline text-accent drop-shadow-lg">Free Spins Over!</h2>
              <p className="mt-2 text-lg sm:text-xl text-foreground/90">Your free spins have ended.</p>
              {totalWin !== undefined && totalWin > 0 && (
                <>
                  <div className="mt-4 p-3 bg-accent/20 rounded-lg border border-accent/50">
                    <p className="text-lg sm:text-xl text-accent font-bold">Total Winnings:</p>
                    <p className="text-2xl sm:text-3xl font-bold text-accent drop-shadow-lg">
                      R {totalWin.toFixed(2)}
                    </p>
                  </div>
                </>
              )}
              <p className="mt-3 text-base sm:text-lg text-accent font-bold">Press SPIN to continue to base game</p>
            </>
          )}
        </div>
      </div>
      <style jsx>{`
        @keyframes fade-in-scale {
          0% { opacity: 0; transform: scale(0.9); }
          100% { opacity: 1; transform: scale(1); }
        }
        .animate-fade-in-scale { animation: fade-in-scale 250ms ease both; }
      `}</style>
    </div>
  );
}


