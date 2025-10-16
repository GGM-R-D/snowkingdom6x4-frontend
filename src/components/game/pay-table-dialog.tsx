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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';

export function PayTableDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="secondary" className="font-headline tracking-wider text-sm sm:text-base">
          Pay Table
        </Button>
      </DialogTrigger>
      <DialogContent className="w-[95vw] max-w-4xl h-[90vh] max-h-[90vh] bg-background/95 backdrop-blur-sm p-0 flex flex-col overflow-hidden">
        <DialogHeader className="px-4 pt-4 sm:px-6 flex-shrink-0">
          <DialogTitle className="font-headline text-accent text-xl sm:text-3xl">Pay Table</DialogTitle>
          <DialogDescription className="text-xs sm:text-sm">Swipe left/right to view all payouts</DialogDescription>
        </DialogHeader>
        
        {/* Payouts Section */}
        <div className="px-4 pb-4 flex-1 flex flex-col overflow-hidden">
          <h3 className="font-headline text-lg sm:text-2xl text-accent mb-3 sm:mb-4">Payouts</h3>
          <div className="flex-1 overflow-auto -mx-4 px-4 -mr-4 pr-4">
            <div className="min-w-max w-full pb-4">
              <div className="overflow-visible">
                <Table className="min-w-[600px] w-full" style={{ WebkitOverflowScrolling: 'touch' }}>
                  <TableHeader>
                    <TableRow className="border-b border-muted-foreground/20">
                      <TableHead className="px-3 py-2 text-xs sm:text-sm font-medium text-muted-foreground text-left w-[150px] sm:w-[200px]">
                        Symbol
                      </TableHead>
                      <TableHead className="px-2 py-2 text-xs sm:text-sm font-medium text-muted-foreground text-center">
                        6x
                      </TableHead>
                      <TableHead className="px-2 py-2 text-xs sm:text-sm font-medium text-muted-foreground text-center">
                        5x
                      </TableHead>
                      <TableHead className="px-2 py-2 text-xs sm:text-sm font-medium text-muted-foreground text-center">
                        4x
                      </TableHead>
                      <TableHead className="px-2 py-2 text-xs sm:text-sm font-medium text-muted-foreground text-center">
                        3x
                      </TableHead>
                      <TableHead className="px-2 py-2 text-xs sm:text-sm font-medium text-muted-foreground text-center">
                        2x
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody className="divide-y divide-muted-foreground/10">
                    {Object.values(SYMBOLS).map((symbol) => (
                      <TableRow key={symbol.id} className="hover:bg-muted/20">
                        <TableCell className="px-3 py-3 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 sm:w-10 sm:h-10 flex-shrink-0">
                              <SymbolDisplay symbolId={symbol.id} />
                            </div>
                            <span className="text-sm font-medium">{symbol.name}</span>
                          </div>
                        </TableCell>
                        {[6, 5, 4, 3, 2].map((multiplier) => (
                          <TableCell 
                            key={`${symbol.id}-${multiplier}`}
                            className="px-2 py-3 text-sm text-center"
                          >
                            {symbol.payout[multiplier] || '-'}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>
        </div>

        {/* Paylines Section */}
        <div className="px-4 pb-6 pt-4 border-t border-muted-foreground/10 flex-1 flex flex-col overflow-hidden">
          <h3 className="font-headline text-lg sm:text-2xl text-accent mb-3 sm:mb-4">Paylines</h3>
          <p className="text-muted-foreground text-xs sm:text-sm mb-3 sm:mb-4">
            Wins are awarded for left-to-right matching symbols on 10 fixed paylines.
          </p>
          <div className="flex-1 overflow-y-auto -mx-2 px-2 -mr-4 pr-4">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-3 pb-4" style={{ WebkitOverflowScrolling: 'touch' }}>
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
