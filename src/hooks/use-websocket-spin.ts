'use client';

import { useEffect } from 'react';
import { getWebSocketService } from '@/lib/websocket-service';

interface UseWebSocketSpinProps {
  onSpin: () => void;
  isSpinning: boolean;
}

export const useWebSocketSpin = ({ onSpin, isSpinning }: UseWebSocketSpinProps) => {
  useEffect(() => {
    const wsService = getWebSocketService();
    
    // Set up the spin handler
    wsService.setSpinButtonPressedHandler(() => {
      // Only trigger spin if not already spinning
      if (!isSpinning) {
        console.log('WebSocket triggered spin');
        onSpin();
      } else {
        console.log('Spin already in progress, ignoring WebSocket trigger');
      }
    });

    // Cleanup on unmount
    return () => {
      wsService.setSpinButtonPressedHandler(() => {});
    };
  }, [onSpin, isSpinning]);
};
