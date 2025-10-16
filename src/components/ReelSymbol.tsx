import React from 'react';
import { SymbolId } from '@/lib/symbols';

interface ReelSymbolProps {
  symbolId: SymbolId;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const sizeClasses = {
  sm: 'w-12 h-12 md:w-16 md:h-16',
  md: 'w-16 h-16 md:w-20 md:h-20',
  lg: 'w-20 h-20 md:w-24 md:h-24',
};

export const ReelSymbol: React.FC<ReelSymbolProps> = ({ 
  symbolId, 
  className = '',
  size = 'md'
}) => {
  const getImagePath = (id: string) => {
    try {
      // Convert ID to lowercase and replace any special characters
      const imageName = id.toLowerCase().replace('_', '');
      return `/images/symbols/${imageName}.png`;
    } catch (e) {
      console.error(`Error loading image for symbol ${id}:`, e);
      return '';
    }
  };

  const imagePath = getImagePath(symbolId);
  const sizeClass = sizeClasses[size] || sizeClasses.md;

  return (
    <div className={`reel-symbol ${sizeClass} ${className} flex items-center justify-center`}>
      {imagePath ? (
        <img 
          src={imagePath}
          alt={symbolId}
          className="w-full h-full object-contain"
          onError={(e) => {
            // Handle missing images
            const target = e.target as HTMLImageElement;
            target.onerror = null;
            target.src = '';
            target.alt = `Missing: ${symbolId}`;
            target.className = 'bg-gray-800 rounded flex items-center justify-center text-xs text-white p-1 text-center';
            target.textContent = symbolId;
          }}
        />
      ) : (
        <div className="w-full h-full bg-gray-800 rounded flex items-center justify-center text-xs text-white p-1 text-center">
          {symbolId}
        </div>
      )}
    </div>
  );
};

export default ReelSymbol;
