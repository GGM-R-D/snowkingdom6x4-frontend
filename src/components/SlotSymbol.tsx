import React from 'react';
import { SymbolId } from '@/lib/slot-config';

interface SlotSymbolProps {
  symbolId: SymbolId;
  className?: string;
}

export const SlotSymbol: React.FC<SlotSymbolProps> = ({ symbolId, className = '' }) => {
  const getImagePath = (id: SymbolId) => {
    try {
      // Try to import the image
      return require(`../../public/images/symbols/${id.toLowerCase()}.png`);
    } catch (e) {
      // Fallback to a default image or error state
      console.error(`Image not found for symbol: ${id}`);
      return '';
    }
  };

  return (
    <div className={`slot-symbol ${className}`}>
      <img 
        src={getImagePath(symbolId)} 
        alt={symbolId} 
        className="w-full h-full object-contain"
        onError={(e) => {
          // Handle missing images
          const target = e.target as HTMLImageElement;
          target.onerror = null;
          target.src = '';
          target.alt = `Missing: ${symbolId}`;
          target.className = 'bg-gray-200 flex items-center justify-center text-xs text-gray-500';
          target.textContent = symbolId;
        }}
      />
    </div>
  );
};

export default SlotSymbol;
