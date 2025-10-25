'use client';

import { useEffect, useRef } from 'react';

interface WebSocketMessage {
  event: string;
  data?: any;
}

export class WebSocketService {
  private ws: WebSocket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;
  private onSpinButtonPressed: (() => void) | null = null;

  constructor() {
    this.connect();
  }

  private connect() {
    try {
      this.ws = new WebSocket('ws://127.0.0.1:5000');
      
      this.ws.onopen = () => {
        console.log('WebSocket connected to server');
        this.reconnectAttempts = 0;
      };

      this.ws.onmessage = (event) => {
        try {
          const message: WebSocketMessage = JSON.parse(event.data);
          this.handleMessage(message);
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };

      this.ws.onclose = () => {
        console.log('WebSocket connection closed');
        this.attemptReconnect();
      };

      this.ws.onerror = (error) => {
        console.error('WebSocket error:', error);
      };
    } catch (error) {
      console.error('Failed to create WebSocket connection:', error);
      this.attemptReconnect();
    }
  }

  private handleMessage(message: WebSocketMessage) {
    switch (message.event) {
      case 'SpinButtonPressed':
        console.log('Received SpinButtonPressed event from server');
        if (this.onSpinButtonPressed) {
          this.onSpinButtonPressed();
        }
        break;
      default:
        console.log('Unknown WebSocket event:', message.event);
    }
  }

  private attemptReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      console.log(`Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})...`);
      
      setTimeout(() => {
        this.connect();
      }, this.reconnectDelay * this.reconnectAttempts);
    } else {
      console.error('Max reconnection attempts reached. WebSocket connection failed.');
    }
  }

  public setSpinButtonPressedHandler(handler: () => void) {
    this.onSpinButtonPressed = handler;
  }

  public disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }

  public isConnected(): boolean {
    return this.ws?.readyState === WebSocket.OPEN;
  }
}

// Singleton instance
let websocketService: WebSocketService | null = null;

export const getWebSocketService = (): WebSocketService => {
  if (!websocketService) {
    websocketService = new WebSocketService();
  }
  return websocketService;
};
