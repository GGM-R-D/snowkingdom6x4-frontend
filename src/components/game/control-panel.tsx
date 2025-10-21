import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PayTableDialog } from "./pay-table-dialog";
import { Plus, Minus, RotateCw } from "lucide-react";
import { useMemo } from 'react'; // Make sure useMemo is imported

interface ControlPanelProps {
  betAmount: number;
  balance: number;
  lastWin: number;
  isSpinning: boolean;
  onSpin: () => void;
  onIncreaseBet: () => void;
  onDecreaseBet: () => void;
  freeSpinsRemaining: number;
  isFreeSpinsMode: boolean;
  freeSpinsActivated: boolean;
}

const InfoDisplay = ({ label, value, isCurrency = true }: { label: string; value: number | string; isCurrency?: boolean }) => (
    <div className="flex flex-col items-center justify-center p-1 rounded-lg bg-black/30 w-full text-center min-h-[48px] sm:min-h-[60px] md:min-h-[80px]">
        <span className="text-[9px] sm:text-[10px] md:text-xs uppercase text-accent/80 font-bold tracking-widest drop-shadow-lg">{label}</span>
        <span className="text-xs sm:text-base md:text-2xl font-bold text-white font-headline drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
            {isCurrency ? `R ${value}` : value}
        </span>
    </div>
);

export function ControlPanel({
  betAmount,
  balance,
  lastWin,
  isSpinning,
  onSpin,
  onIncreaseBet,
  onDecreaseBet,
  freeSpinsRemaining,
  isFreeSpinsMode,
  freeSpinsActivated,
}: ControlPanelProps) {

    const spinButtonText = useMemo(() => {
        if (isSpinning) return 'SPINNING';
        if (isFreeSpinsMode && !freeSpinsActivated) return 'START';
        if (isFreeSpinsMode) return 'FREE SPIN';
        return 'SPIN';
    }, [isSpinning, isFreeSpinsMode, freeSpinsActivated]);
   
    const spinButtonTextStyle = useMemo(() => {
        if (spinButtonText === 'FREE SPIN') {
            return 'text-sm sm:text-base md:text-lg'; // Smaller text
        }
        return 'text-lg sm:text-xl md:text-2xl'; // Original larger text
    }, [spinButtonText]);

  return (
    <Card className="w-full max-w-6xl p-1 md:p-2 bg-primary/30 border-2 border-primary/50 shadow-lg">
        <div className="grid grid-cols-3 sm:grid-cols-5 gap-1 sm:gap-2 items-center">
            
            <div className="col-span-1 flex justify-center">
                <InfoDisplay label="Balance" value={balance.toFixed(2)} />
            </div>

            <div className="col-span-1 flex justify-center">
                {isFreeSpinsMode ? (
                    <InfoDisplay label="Free Spins" value={freeSpinsRemaining} isCurrency={false} />
                ) : (
                    <div className="flex flex-col items-center justify-center p-1 rounded-lg bg-black/30 w-full text-center min-h-[48px] sm:min-h-[60px] md:min-h-[80px]">
                        <span className="text-[9px] sm:text-[10px] md:text-xs uppercase text-accent/80 font-bold tracking-widest drop-shadow-lg">Bet</span>
                        <div className="flex items-center gap-0.5 justify-center w-full mt-0.5">
                            <Button variant="ghost" size="icon" className="h-4 w-4 sm:h-6 sm:w-6 md:h-8 md:w-8 text-accent hover:text-accent/80" onClick={onDecreaseBet} disabled={isSpinning}>
                                <Minus className="h-3 w-3 sm:h-4 sm:w-4 md:h-6 md:w-6" />
                            </Button>
                            <span className="text-xs sm:text-base md:text-2xl font-bold text-white font-headline drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] px-1 text-center">
                                R {betAmount}
                            </span>
                            <Button variant="ghost" size="icon" className="h-4 w-4 sm:h-6 sm:w-6 md:h-8 md:w-8 text-accent hover:text-accent/80" onClick={onIncreaseBet} disabled={isSpinning}>
                                <Plus className="h-3 w-3 sm:h-4 sm:w-4 md:h-6 md:w-6" />
                            </Button>
                        </div>
                    </div>
                )}
            </div>

            <div className="col-span-1 flex flex-col items-center justify-center px-1 sm:px-0">
                <Button
                    onClick={onSpin}
                    disabled={isSpinning || (balance < betAmount && !isFreeSpinsMode)}
                    className={`
                        relative w-16 h-16 sm:w-20 sm:h-20 md:w-28 md:h-28 text-xl sm:text-2xl font-headline rounded-full
                        flex items-center justify-center
                        text-white transition-all duration-300 ease-in-out
                        shadow-xl transform active:scale-95
                        ${isSpinning 
                            ? 'bg-gray-600 cursor-not-allowed inset-shadow-blue' 
                            : 'btn-spin-blue-glow bg-gradient-to-br from-blue-500 to-blue-800 hover:from-blue-400 hover:to-blue-700'
                        }
                    `}
                >
                    <div className="absolute inset-0 rounded-full border-2 sm:border-4 border-yellow-400 pointer-events-none opacity-80"></div>
                    
                
                    {isSpinning ? (
                        <RotateCw className="w-8 h-8 sm:w-12 sm:h-12 md:w-16 md:h-16 animate-spin-slow" />
                    ) : (
                        <span className="font-bold text-base sm:text-lg md:text-xl">{spinButtonText}</span>
                    )}
                 
                </Button>
            </div>

            <div className="hidden sm:flex col-span-1 justify-center">
                <InfoDisplay label="Win" value={lastWin.toFixed(2)} />
            </div>

            <div className="hidden sm:flex col-span-1 justify-center">
                <div className="flex flex-col items-center justify-center p-1 rounded-lg bg-black/30 w-full text-center min-h-[50px] sm:min-h-[60px] md:min-h-[80px]">
                    <PayTableDialog />
                </div>
            </div>
        </div>

        <div className="grid grid-cols-2 sm:hidden gap-1 mt-1">
            <div className="col-span-1 flex justify-center">
                <InfoDisplay label="Win" value={lastWin.toFixed(2)} />
            </div>
            <div className="col-span-1 flex justify-center">
                <div className="flex flex-col items-center justify-center p-1 rounded-lg bg-black/30 w-full text-center min-h-[48px]">
                    <PayTableDialog />
                </div>
            </div>
        </div>
    </Card>
  );
}