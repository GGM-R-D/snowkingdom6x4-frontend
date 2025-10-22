'use client';

import { useEffect, useState } from 'react';

interface FreeSpinsOverlayProps {
  count: number;
  onClose: () => void;
}

export function FreeSpinsOverlay({ count, onClose }: FreeSpinsOverlayProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const showT = setTimeout(() => setVisible(true), 50);
    const hideT = setTimeout(() => {
      setVisible(false);
      setTimeout(onClose, 400);
    }, 3000);
    return () => {
      clearTimeout(showT);
      clearTimeout(hideT);
    };
  }, [onClose]);

  return (
    <div className={`fixed inset-0 z-50 transition-opacity duration-300 ${visible ? 'opacity-100' : 'opacity-0'} pointer-events-none`}>
      <div className="absolute inset-0 flex items-start justify-center p-4 pt-[15vh] sm:pt-[18vh] md:pt-[20vh]">
        <div className="bg-black/70 p-6 sm:p-8 md:p-10 rounded-2xl shadow-2xl border-2 border-accent max-w-[90%] sm:max-w-md text-center animate-fade-in-scale">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-headline text-accent drop-shadow-lg">Free Spins!</h2>
          <p className="mt-2 text-lg sm:text-xl text-foreground/90">You won {count} free spins</p>
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


