'use client';

import { useEffect, useState } from 'react';
import type { WinningFeedbackEnhancementOutput } from '@/ai/flows/winning-feedback-enhancement';
import { Coins } from 'lucide-react';

interface WinAnimationProps {
  feedback: WinningFeedbackEnhancementOutput;
  onAnimationComplete: () => void;
}

const Coin = ({ id, onEnded }: { id: number; onEnded: (id: number) => void }) => {
  const [style, setStyle] = useState<React.CSSProperties>({});

  useEffect(() => {
    setStyle({
      left: `${Math.random() * 100}%`,
      animationDuration: `${Math.random() * 2 + 3}s`,
      animationDelay: `${Math.random() * 2}s`,
    });

    const timer = setTimeout(() => onEnded(id), 5000); // Duration + Delay
    return () => clearTimeout(timer);
  }, [id, onEnded]);

  return (
    <div
      style={style}
      className="absolute top-[-10%] text-accent animate-fall"
    >
      <Coins className="w-8 h-8 md:w-12 md:h-12 drop-shadow-lg" style={{ transform: `rotate(${Math.random() * 360}deg)`}}/>
    </div>
  );
};

export function WinAnimation({ feedback, onAnimationComplete }: WinAnimationProps) {
  const [coins, setCoins] = useState<number[]>([]);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const showTimer = setTimeout(() => setShow(true), 500);

    if (feedback.animationType.includes('coin')) {
      const newCoins = Array.from({ length: 50 }, (_, i) => i);
      setCoins(newCoins);
    }

    const animationTimer = setTimeout(() => {
        setShow(false);
        setTimeout(onAnimationComplete, 500);
    }, 5000);

    return () => {
      clearTimeout(showTimer);
      clearTimeout(animationTimer);
    }
  }, [feedback, onAnimationComplete]);
  
  const handleCoinEnd = (id: number) => {
    setCoins(prev => prev.filter(cId => cId !== id));
  };


  return (
    <div className={`fixed inset-0 z-50 transition-opacity duration-500 ${show ? 'opacity-100' : 'opacity-0'} pointer-events-none`}>
      <div className="absolute inset-0 overflow-hidden">
        {feedback.animationType.includes('coin') && coins.map(id => <Coin key={id} id={id} onEnded={handleCoinEnd} />)}
      </div>
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="bg-black/70 p-4 sm:p-6 md:p-8 rounded-xl sm:rounded-2xl shadow-2xl border-2 border-accent max-w-[90%] sm:max-w-md text-center animate-fade-in-scale">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-headline text-accent drop-shadow-lg leading-tight">
                {feedback.feedbackText}
            </h2>
        </div>
      </div>
       <style jsx>{`
        @keyframes fall {
          from {
            transform: translateY(-10vh) rotate(0deg);
            opacity: 1;
          }
          to {
            transform: translateY(110vh) rotate(720deg);
            opacity: 0;
          }
        }
        .animate-fall {
          animation-name: fall;
          animation-timing-function: linear;
        }
        @keyframes fade-in-scale {
            0% {
                opacity: 0;
                transform: scale(0.5);
            }
            100% {
                opacity: 1;
                transform: scale(1);
            }
        }
        .animate-fade-in-scale {
            animation: fade-in-scale 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) both;
        }
      `}</style>
    </div>
  );
}
