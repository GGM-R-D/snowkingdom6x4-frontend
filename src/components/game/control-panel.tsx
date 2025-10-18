import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PayTableDialog } from "./pay-table-dialog";
import { Coins, Plus, Minus, Redo ,RotateCw, RefreshCw } from "lucide-react";

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
}

const InfoDisplay = ({ label, value, isCurrency = true }: { label: string; value: number | string; isCurrency?: boolean }) => (
    <div className="flex flex-col items-center justify-center p-3 sm:p-4 rounded-lg bg-black/30 w-full text-center min-h-[80px]">
        <span className="text-xs sm:text-sm uppercase text-accent/80 font-bold tracking-widest drop-shadow-lg">{label}</span>
        <span className="text-xl sm:text-2xl md:text-3xl font-bold text-white font-headline drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
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
  isFreeSpinsMode
}: ControlPanelProps) {
  return (
    <Card className="w-full max-w-6xl p-2 md:p-4 bg-primary/30 border-2 border-primary/50 shadow-lg">
        <div className="grid grid-cols-5 gap-2 md:gap-4 items-center">
            
            {/* Balance - Left */}
            <div className="col-span-1 flex justify-center">
                <InfoDisplay label="Balance" value={balance.toFixed(2)} />
            </div>

            {/* Bet Amount - Left Center */}
            <div className="col-span-1 flex justify-center">
                {isFreeSpinsMode ? (
                    <InfoDisplay label="Free Spins" value={freeSpinsRemaining} isCurrency={false} />
                ) : (
                    <div className="flex flex-col items-center justify-center p-3 sm:p-4 rounded-lg bg-black/30 w-full text-center min-h-[80px]">
                        <span className="text-xs sm:text-sm uppercase text-accent/80 font-bold tracking-widest drop-shadow-lg">Bet</span>
                        <div className="flex items-center gap-2 sm:gap-3 justify-center w-full mt-1">
                            <Button variant="ghost" size="icon" className="h-6 w-6 sm:h-8 sm:w-8 text-accent hover:text-accent/80" onClick={onDecreaseBet} disabled={isSpinning}>
                                <Minus className="w-5 h-5 sm:w-6 sm:h-6" />
                            </Button>
                            <span className="text-xl sm:text-2xl md:text-3xl font-bold text-white font-headline drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] min-w-[60px]">
                                R {betAmount}
                            </span>
                            <Button variant="ghost" size="icon" className="h-6 w-6 sm:h-8 sm:w-8 text-accent hover:text-accent/80" onClick={onIncreaseBet} disabled={isSpinning}>
                                <Plus className="w-5 h-5 sm:w-6 sm:h-6" />
                            </Button>
                        </div>
                    </div>
                )}
            </div>

            {/* Spin Button - Absolute Center */}
            <div className="col-span-1 flex flex-col items-center justify-center">
                <Button
                    onClick={onSpin}
                    disabled={isSpinning || (balance < betAmount && !isFreeSpinsMode)}
                    className={`
                        relative w-28 h-28 text-4xl font-headline rounded-full
                        flex items-center justify-center
                        text-white transition-all duration-300 ease-in-out
                        shadow-xl transform active:scale-95
                        ${isSpinning 
                            ? 'bg-gray-600 cursor-not-allowed inset-shadow-blue' 
                            : 'btn-spin-blue-glow bg-gradient-to-br from-blue-500 to-blue-800 hover:from-blue-400 hover:to-blue-700'
                        }
                    `}
                >
                    <div className="absolute inset-0 rounded-full border-4 border-yellow-400 pointer-events-none opacity-80"></div>
                    <RotateCw className={`w-20 h-20 ${isSpinning ? 'animate-spin-slow' : ''}`} />
                </Button>
            </div>

            {/* Win Amount - Right Center */}
            <div className="col-span-1 flex justify-center">
                <InfoDisplay label="Win" value={lastWin.toFixed(2)} />
            </div>

            {/* Pay Table - Right - Same size as other components */}
            <div className="col-span-1 flex justify-center">
                <div className="flex flex-col items-center justify-center p-3 sm:p-4 rounded-lg bg-black/30 w-full text-center min-h-[80px]">
                    <PayTableDialog />
                </div>
            </div>
        </div>
    </Card>
  );
}