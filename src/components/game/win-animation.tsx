'use client';

import { useEffect, useState } from 'react';
import type { WinningFeedbackEnhancementOutput } from '@/app/actions';
import { Coins } from 'lucide-react';

interface WinAnimationProps {
  feedback: WinningFeedbackEnhancementOutput;
  onAnimationComplete: () => void;
  onCountComplete?: (amount: number) => void;
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

export function WinAnimation({ feedback, onAnimationComplete, onCountComplete }: WinAnimationProps) {
  const [coins, setCoins] = useState<number[]>([]);
  const [show, setShow] = useState(false);
  const [displayAmount, setDisplayAmount] = useState(0);

  useEffect(() => {
    const showTimer = setTimeout(() => setShow(true), 500);

    if (feedback.animationType.includes('coin')) {
      const newCoins = Array.from({ length: 50 }, (_, i) => i);
      setCoins(newCoins);
    }

    // Counter animation for win amount using requestAnimationFrame for smoothness
    const targetAmount = feedback.winAmount;
    const duration = 2500; // 2.5 seconds for counting
    const startTime = performance.now();
    let animationFrameId: number;

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Ease-out cubic for more natural counting
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      const currentAmount = targetAmount * easeProgress;
      
      setDisplayAmount(currentAmount);

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(animate);
      } else {
        setDisplayAmount(targetAmount);
        // Notify when counting is complete
        if (onCountComplete) {
          onCountComplete(targetAmount);
        }
      }
    };

    animationFrameId = requestAnimationFrame(animate);

    const animationTimer = setTimeout(() => {
        setShow(false);
        setTimeout(onAnimationComplete, 500);
    }, 5000);

    return () => {
      clearTimeout(showTimer);
      clearTimeout(animationTimer);
      cancelAnimationFrame(animationFrameId);
    }
  }, [feedback, onAnimationComplete, onCountComplete]);
  
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
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-headline text-accent drop-shadow-lg leading-tight mb-2">
                {feedback.feedbackText}
            </h2>
            <p className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-yellow-400 drop-shadow-lg">
                R {displayAmount.toFixed(2)}
            </p>
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
