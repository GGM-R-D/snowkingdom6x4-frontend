import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PayTableDialog } from "./pay-table-dialog";
import { Coins, Plus, Minus } from "lucide-react";

interface ControlPanelProps {
  betAmount: number;
  balance: number;
  lastWin: number;
  isSpinning: boolean;
  onSpin: () => void;
  onIncreaseBet: () => void;
  freeSpinsRemaining: number;
  isFreeSpinsMode: boolean;
}

const InfoDisplay = ({ label, value, isCurrency = true }: { label: string; value: number | string; isCurrency?: boolean }) => (
    <div className="flex flex-col items-center justify-center p-1 sm:p-2 rounded-lg bg-black/30 h-full text-center">
        <span className="text-[10px] sm:text-xs uppercase text-accent/70 font-bold tracking-widest">{label}</span>
        <span className="text-base sm:text-lg md:text-xl font-bold text-white font-headline">
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
  freeSpinsRemaining,
  isFreeSpinsMode
}: ControlPanelProps) {
  return (
    <Card className="w-full max-w-6xl p-2 md:p-4 bg-primary/30 border-2 border-primary/50 shadow-lg">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-2 md:gap-4 items-center">
            
            <div className="md:hidden flex justify-center">
                <PayTableDialog />
            </div>

            <div className="grid grid-cols-3 gap-2 md:col-span-3">
                <InfoDisplay label="Balance" value={balance.toFixed(2)} />
                {isFreeSpinsMode ? (
                     <InfoDisplay label="Free Spins" value={freeSpinsRemaining} isCurrency={false} />
                ) : (
                    <div className="flex flex-col items-center justify-center p-1 sm:p-2 rounded-lg bg-black/30 h-full text-center">
                        <span className="text-[10px] sm:text-xs uppercase text-accent/70 font-bold tracking-widest">Bet</span>
                        <div className="flex items-center gap-1 sm:gap-2">
                            <Button variant="ghost" size="icon" className="h-5 w-5 sm:h-6 sm:w-6 text-accent" onClick={onIncreaseBet} disabled={isSpinning}>
                                <Plus className="w-4 h-4 sm:w-auto sm:h-auto" />
                            </Button>
                            <span className="text-base sm:text-lg md:text-xl font-bold text-white font-headline">R {betAmount}</span>
                        </div>
                    </div>
                )}
                <InfoDisplay label="Win" value={lastWin.toFixed(2)} />
            </div>

            <div className="flex flex-col items-center justify-center gap-2 md:col-span-1">
                 <Button
                    onClick={onSpin}
                    disabled={isSpinning || (balance < betAmount && !isFreeSpinsMode)}
                    className="w-full h-12 md:h-24 text-xl sm:text-2xl md:text-3xl font-headline rounded-lg bg-primary hover:bg-primary/80 text-primary-foreground shadow-xl border-2 border-primary/50 transition-all duration-300 transform active:scale-95 disabled:bg-muted disabled:cursor-not-allowed"
                >
                    {isSpinning ? "Spinning..." : (isFreeSpinsMode && freeSpinsRemaining > 0 ? "FREE SPIN" : "SPIN")}
                </Button>
            </div>
             <div className="hidden md:flex md:col-span-1 items-center justify-center">
                <PayTableDialog />
            </div>
        </div>
    </Card>
  );
}
