import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Info } from 'lucide-react';

export function InfoDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="secondary" className="rounded-full w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 p-1 bg-black/30 hover:bg-black/50 transition-colors">
          <Info className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-white" />
        </Button>
      </DialogTrigger>
      <DialogContent className="w-[95vw] max-w-4xl h-[90vh] max-h-[90vh] bg-background/95 backdrop-blur-sm p-0 flex flex-col overflow-hidden">
        <DialogHeader className="px-4 pt-4 sm:px-6 flex-shrink-0">
          <DialogTitle className="font-headline text-accent text-xl sm:text-3xl">Game Rules</DialogTitle>
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
          {/* Game Rules Section */}
          <div className="mb-6">
            <h3 className="font-headline text-lg sm:text-2xl text-accent mb-3 sm:mb-4">How to Play</h3>
            
            <div className="space-y-4 text-sm sm:text-base text-muted-foreground">
              <div className="p-4 bg-card/30 border border-muted-foreground/20 rounded-lg">
                <h4 className="font-bold text-white mb-2">Basic Gameplay</h4>
                <ul className="space-y-2 list-disc list-inside">
                  <li>Select your bet amount using the + and - buttons</li>
                  <li>Click the SPIN button to start the reels</li>
                  <li>Wins are awarded for matching symbols on active paylines</li>
                  <li>Symbols must appear from left to right on a payline</li>
                </ul>
              </div>

              <div className="p-4 bg-card/30 border border-muted-foreground/20 rounded-lg">
                <h4 className="font-bold text-white mb-2">Special Features</h4>
                <ul className="space-y-2 list-disc list-inside">
                  <li><strong>Wild Symbol:</strong> Substitutes for other symbols to create wins</li>
                  <li><strong>Scatter Symbol:</strong> Landing 3+ scatters anywhere awards 10 free spins</li>
                  <li><strong>Free Spins:</strong> Played at the same bet level as the triggering spin</li>
                </ul>
              </div>

              <div className="p-4 bg-card/30 border border-muted-foreground/20 rounded-lg">
                <h4 className="font-bold text-white mb-2">Auto Play</h4>
                <ul className="space-y-2 list-disc list-inside">
                  <li>Use AUTO SPIN for continuous gameplay</li>
                  <li>Set stop conditions: number of spins, win amount, or loss limit</li>
                  <li>Auto play stops when conditions are met or manually stopped</li>
                </ul>
              </div>

              <div className="p-4 bg-card/30 border border-muted-foreground/20 rounded-lg">
                <h4 className="font-bold text-white mb-2">Turbo Mode</h4>
                <ul className="space-y-2 list-disc list-inside">
                  <li>Enable TURBO for faster reel spinning</li>
                  <li>Reduces animation time for quicker gameplay</li>
                  <li>All game mechanics remain the same</li>
                </ul>
              </div>

              <div className="p-4 bg-card/30 border border-muted-foreground/20 rounded-lg">
                <h4 className="font-bold text-white mb-2">Paylines</h4>
                <ul className="space-y-2 list-disc list-inside">
                  <li>10 fixed paylines are always active</li>
                  <li>Paylines run from left to right across the reels</li>
                  <li>Wins are awarded for 3 or more matching symbols</li>
                  <li>Higher symbol counts award bigger payouts</li>
                </ul>
              </div>

              <div className="p-4 bg-card/30 border border-muted-foreground/20 rounded-lg">
                <h4 className="font-bold text-white mb-2">Responsible Gaming</h4>
                <ul className="space-y-2 list-disc list-inside">
                  <li>Set time and money limits before playing</li>
                  <li>Never chase losses</li>
                  <li>Take regular breaks from gaming</li>
                  <li>Gaming should be fun, not a way to make money</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
