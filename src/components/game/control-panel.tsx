import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PayTableDialog } from "./pay-table-dialog";
import { Plus, Minus, RotateCw, BookOpen } from "lucide-react";
import { useMemo } from 'react';
import {cn} from '@/lib/utils';

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
<<<<<<< Updated upstream
=======
  isAutoSpin: boolean;
  onToggleAutoSpin: () => void;
>>>>>>> Stashed changes
}

const InfoDisplay = ({ label, value, isCurrency = true }: { label: string; value: number | string; isCurrency?: boolean }) => (
    // Applied info-display-bg class for the new background, border, and shadows
    <div className="flex flex-col items-center justify-center p-1 rounded-md w-full text-center min-h-[48px] sm:min-h-[60px] md:min-h-[80px] info-display-bg">
        {/* Applied subtle-cyan-text for the new label styling */}
        <span className="text-[9px] sm:text-[10px] md:text-xs uppercase font-mono tracking-widest subtle-cyan-text">{label}</span>
        {/* Applied cyan-text-glow for the new value styling */}
        <span className="text-base sm:text-xl md:text-3xl font-bold font-mono cyan-text-glow">
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
<<<<<<< Updated upstream
=======
  isAutoSpin,
  onToggleAutoSpin,
>>>>>>> Stashed changes
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

  // This variable determines if the button should be disabled, both functionally and visually.
  const isButtonDisabled = isSpinning || (balance < betAmount && !isFreeSpinsMode);

  return (
    // Applied control-panel-card class for the main card styling
    <Card className="w-full max-w-6xl p-2 md:p-4 shadow-2xl control-panel-card">
        <div className="flex justify-between items-center gap-2 sm:gap-4">
            
            {/* Balance and Bet Section */}
            <div className="flex flex-col gap-1 flex-1">
                <InfoDisplay label="Balance" value={balance.toFixed(2)} />
                {!isFreeSpinsMode && (
                    <div className="flex flex-col items-center justify-center p-1 rounded-md w-full text-center min-h-[48px] sm:min-h-[60px] md:min-h-[80px] info-display-bg">
                        <span className="text-[9px] sm:text-[10px] md:text-xs uppercase font-mono tracking-widest subtle-cyan-text">Bet</span>
                        <div className="flex items-center gap-0.5 justify-center w-full mt-0.5">
                            <Button variant="ghost" size="icon" className="h-4 w-4 sm:h-6 sm:w-6 md:h-8 md:w-8 hover:text-cyan-200 bet-button-icon" onClick={onDecreaseBet} disabled={isSpinning}>
                                <Minus className="h-3 w-3 sm:h-4 sm:w-4 md:h-6 md:w-6" />
                            </Button>
                            <span className="text-base sm:text-xl md:text-3xl font-bold font-mono px-1 cyan-text-glow">
                                R {betAmount}
                            </span>
                            <Button variant="ghost" size="icon" className="h-4 w-4 sm:h-6 sm:w-6 md:h-8 md:w-8 hover:text-cyan-200 bet-button-icon" onClick={onIncreaseBet} disabled={isSpinning}>
                                <Plus className="h-3 w-3 sm:h-4 sm:w-4 md:h-6 md:w-6" />
                            </Button>
                        </div>
                    </div>
                )}
                {isFreeSpinsMode && (
                    <InfoDisplay label="Free Spins" value={freeSpinsRemaining} isCurrency={false} />
                )}
            </div>

<<<<<<< Updated upstream
            {/* SPIN Button - Centered */}
            <div className="flex flex-col items-center justify-center px-2">
                <Button
                    onClick={onSpin}
                    disabled={isButtonDisabled}
                    className={`
                        relative w-16 h-16 sm:w-20 sm:h-20 md:w-28 md:h-28 text-xl sm:text-2xl font-headline rounded-full
                        flex items-center justify-center
                        text-white transition-all duration-300 ease-in-out
                        shadow-xl transform active:scale-95
                        ${isButtonDisabled 
                            ? 'spin-button-disabled' 
                            : 'spin-button-glow'
                        }
                    `}
                >
                    {isSpinning ? (
                        <RotateCw className="w-8 h-8 sm:w-12 sm:h-12 md:w-16 md:h-16 animate-spin-slow text-white" />
                    ) : (
                        <span className={`${spinButtonTextStyle} font-bold`}>{spinButtonText}</span>
                    )}
                </Button>
=======
            {/* SPIN and AUTO SPIN Buttons - Centered */}
            <div className="flex flex-col items-center justify-center px-2">
                <div className="flex items-center gap-2">
                    {/* SPIN Button */}
                    <Button
                        onClick={onSpin}
                        disabled={isButtonDisabled}
                        className={`
                            relative w-16 h-16 sm:w-20 sm:h-20 md:w-28 md:h-28 text-xl sm:text-2xl font-headline rounded-full
                            flex items-center justify-center
                            text-white transition-all duration-300 ease-in-out
                            shadow-xl transform active:scale-95
                            ${isButtonDisabled 
                                ? 'spin-button-disabled' 
                                : 'spin-button-glow'
                            }
                        `}
                    >
                        {isSpinning ? (
                            <RotateCw className="w-8 h-8 sm:w-12 sm:h-12 md:w-16 md:h-16 animate-spin-slow text-white" />
                        ) : (
                            <span className={`${spinButtonTextStyle} font-bold`}>{spinButtonText}</span>
                        )}
                    </Button>
                    
                    {/* AUTO SPIN Button */}
                    <Button
                        onClick={onToggleAutoSpin}
                        className={`
                            relative w-12 h-12 sm:w-14 sm:h-14 md:w-20 md:h-20 text-sm sm:text-base md:text-lg font-headline rounded-full
                            flex items-center justify-center
                            text-white transition-all duration-300 ease-in-out
                            shadow-xl transform active:scale-95
                            ${isAutoSpin 
                                ? 'spin-button-glow' 
                                : 'auto-spin-disabled'
                            }
                        `}
                    >
                        <span className="font-bold">AUTO</span>
                    </Button>
                </div>
>>>>>>> Stashed changes
            </div>

            {/* Win and Pay Table Section */}
            <div className="flex flex-col gap-1 flex-1">
                <InfoDisplay label="Win" value={lastWin.toFixed(2)} />
                <div className="flex flex-col items-center justify-center p-1 rounded-md w-full text-center min-h-[48px] sm:min-h-[60px] md:min-h-[80px] info-display-bg">
                    <PayTableDialog />
                </div>
            </div>
        </div>

        {/* Mobile layout - hidden on larger screens */}
        <div className="grid grid-cols-2 sm:hidden gap-1 mt-1">
            <div className="col-span-1 flex justify-center">
                <InfoDisplay label="Win" value={lastWin.toFixed(2)} />
            </div>
            <div className="col-span-1 flex justify-center">
                <div className="flex flex-col items-center justify-center p-1 rounded-md w-full text-center min-h-[48px] info-display-bg">
                    <PayTableDialog />
                </div>
            </div>
        </div>
    </Card>
  );
}