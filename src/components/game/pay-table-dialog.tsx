import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { PAYLINES, SYMBOLS, type SymbolId } from '@/lib/slot-config';
import { SymbolDisplay } from './symbol-display';
import { Menu } from 'lucide-react';

interface PayTableDialogProps {
  betAmount?: number;
}

export function PayTableDialog({ betAmount = 1 }: PayTableDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="secondary" className="rounded-full w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 p-1 bg-black/30 hover:bg-black/50 transition-colors">
          <Menu className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-white" />
        </Button>
      </DialogTrigger>
      <DialogContent className="w-[95vw] max-w-4xl h-[90vh] max-h-[90vh] bg-background/95 backdrop-blur-sm p-0 flex flex-col overflow-hidden">
        <DialogHeader className="px-4 pt-4 sm:px-6 flex-shrink-0">
          <DialogTitle className="font-headline text-accent text-xl sm:text-3xl">Pay Table</DialogTitle>
        </DialogHeader>
        
        {/* Game Information Section */}
        <div className="px-4 pb-4 border-b border-muted-foreground/10">
          <h2 className="font-headline text-white text-2xl sm:text-3xl mb-3">Frosty Fortunes</h2>
          <div className="space-y-1 text-sm sm:text-base text-white">
            <p>Frosty Fortunes is a 6x4 slot game with 10 paylines.</p>
            <p>The RTP-rate (return-to-player) is 96.00%.</p>
            <p>Minimum bet: R 1.00</p>
            <p>Maximum bet: R 5.00</p>
          </div>
        </div>
        
        {/* Combined Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-4 pb-6" style={{ WebkitOverflowScrolling: 'touch' }}>
          {/* Payouts Section */}
          <div className="mb-6">
            <h3 className="font-headline text-lg sm:text-2xl text-accent mb-3 sm:mb-4">Payouts</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
              {Object.values(SYMBOLS).map((symbol) => (
                <div key={symbol.id} className="bg-card/50 border border-muted-foreground/20 rounded-lg p-3 hover:bg-card/70 transition-colors">
                  {/* Symbol Image */}
                  <div className="flex justify-center mb-3">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 flex-shrink-0">
                      <SymbolDisplay symbolId={symbol.id} />
                    </div>
                  </div>
                  
                  {/* Symbol Name */}
                  <h4 className="text-center text-xs sm:text-sm font-medium text-muted-foreground mb-3">
                    {symbol.name}
                  </h4>
                  
                  {/* Payouts */}
                  <div className="space-y-1">
                    {[3, 4, 5, 6].map((multiplier) => {
                      const basePayout = symbol.payout[multiplier];
                      const actualPayout = basePayout ? basePayout * betAmount : 0;
                      
                      return (
                        <div key={multiplier} className="flex justify-between items-center text-xs sm:text-sm">
                          <span className="text-muted-foreground">{multiplier}x</span>
                          <span className="font-bold text-accent">
                            {actualPayout > 0 ? `R ${actualPayout.toFixed(2)}` : '-'}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Special Symbols Section */}
          <div className="border-t border-muted-foreground/10 pt-6 mb-6">
            <h3 className="font-headline text-lg sm:text-2xl text-accent mb-3 sm:mb-4">Special Symbols</h3>
            
            {/* Wild Symbol */}
            <div className="mb-6 p-4 bg-card/30 border border-muted-foreground/20 rounded-lg">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 sm:w-20 sm:h-20">
                    <SymbolDisplay symbolId="WILD" />
                  </div>
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-white text-lg mb-3">WILD</h4>
                  <p className="text-sm text-muted-foreground">
                    This symbol is a wild and can substitute for any non-scatter symbol to make a win.
                  </p>
                </div>
              </div>
            </div>

            {/* Scatter Symbol */}
            <div className="p-4 bg-card/30 border border-muted-foreground/20 rounded-lg">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 sm:w-20 sm:h-20">
                    <SymbolDisplay symbolId="SCATTER" />
                  </div>
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-white text-lg mb-2">SCATTER</h4>
                  <div className="mb-3">
                    <div className="text-sm text-accent font-bold">
                      3+ Scatters = 10 Free Spins
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Landing 3 or more scatter symbols anywhere on the reels awards 10 free spins.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Paylines Section */}
          <div className="border-t border-muted-foreground/10 pt-6">
            <h3 className="font-headline text-lg sm:text-2xl text-accent mb-3 sm:mb-4">Paylines</h3>
            <p className="text-muted-foreground text-xs sm:text-sm mb-3 sm:mb-4">
              Wins are awarded for left-to-right matching symbols on 10 fixed paylines.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-3">
              {PAYLINES.map((line, index) => (
                <div key={index} className="p-2 border rounded-lg bg-card/50">
                  <p className="text-center font-bold text-accent text-xs sm:text-sm mb-1.5 sm:mb-2">
                    Line {index + 1}
                  </p>
                  <div className="grid grid-cols-6 gap-1">
                    {Array.from({ length: 4 }).map((_, rowIndex) =>
                      Array.from({ length: 6 }).map((_, colIndex) => {
                        const isPayline = line[colIndex] === rowIndex;
                        return (
                          <div
                            key={`${rowIndex}-${colIndex}`}
                            className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full ${
                              isPayline ? 'bg-accent' : 'bg-muted/30'
                            }`}
                          />
                        );
                      })
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
